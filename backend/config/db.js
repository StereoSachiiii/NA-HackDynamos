import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { MONGO_URI } from './constants.js';

let isConnected = false;

// Disable Mongoose buffering to fail fast when not connected
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (!MONGO_URI) {
    logger.warn(
      'MONGO_URI missing. Provide a valid connection string in your environment to enable database features.'
    );
    return false;
  }

  // Validate connection string format
  if (MONGO_URI.includes('<username>') || MONGO_URI.includes('<password>')) {
    logger.error(
      'MONGO_URI contains placeholder values. Please replace <username> and <password> with actual credentials.'
    );
    process.exit(1);
  }

  // Helper function to encode credentials in connection string
  const encodeConnectionString = uri => {
    // Extract and encode username/password if they contain special characters
    const match = uri.match(/^(mongodb\+?srv?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (match) {
      const [, protocol, username, password, rest] = match;
      const encodedUsername = encodeURIComponent(username);
      const encodedPassword = encodeURIComponent(password);
      return `${protocol}${encodedUsername}:${encodedPassword}@${rest}`;
    }
    return uri;
  };

  // Convert standard mongodb:// to mongodb+srv:// if needed (for Atlas)
  let connectionUri = MONGO_URI;
  if (MONGO_URI.startsWith('mongodb://') && MONGO_URI.includes('mongodb.net')) {
    logger.warn(
      'Using mongodb:// format. For MongoDB Atlas, mongodb+srv:// is recommended.'
    );
    logger.warn(
      'To convert: Replace mongodb:// with mongodb+srv:// and remove port numbers.'
    );
    
    // Try to convert to SRV format
    try {
      const uriMatch = MONGO_URI.match(/^mongodb:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)$/);
      if (uriMatch) {
        const [, username, password, hosts, dbAndParams] = uriMatch;
        // Extract cluster base from shard addresses (e.g., ac-itqbcsa-shard-00-00.ect09ic.mongodb.net -> ect09ic.mongodb.net)
        const firstHost = hosts.split(',')[0]; // Get first shard
        const clusterMatch = firstHost.match(/\.([^.]+\.mongodb\.net)/);
        if (clusterMatch) {
          // Try different cluster name patterns
          const baseDomain = clusterMatch[1]; // e.g., "ect09ic.mongodb.net"
          const possibleNames = [
            `cluster0.${baseDomain}`, // Standard pattern
            baseDomain.replace(/^[^.]+\./, 'cluster0.'), // Alternative
            `ac-itqbcsa.${baseDomain}` // Based on shard prefix
          ];
          
          const encodedUser = encodeURIComponent(username);
          const encodedPass = encodeURIComponent(password);
          
          // Try the most likely one first
          connectionUri = `mongodb+srv://${encodedUser}:${encodedPass}@${possibleNames[0]}/${dbAndParams}`;
          logger.info(`Attempting SRV format with cluster: ${possibleNames[0]}`);
        } else {
          // If pattern doesn't match, use original with encoding
          connectionUri = encodeConnectionString(MONGO_URI);
        }
      } else {
        connectionUri = encodeConnectionString(MONGO_URI);
      }
    } catch (err) {
      // If conversion fails, use original with encoding
      connectionUri = encodeConnectionString(MONGO_URI);
      logger.warn('SRV conversion failed, using original format with encoding');
    }
  } else {
    // Encode credentials for SRV format too
    connectionUri = encodeConnectionString(MONGO_URI);
    
    // Check if database name is missing (common issue with Atlas connection strings)
    // Atlas gives: mongodb+srv://user:pass@cluster.net/?appName=Cluster0
    // But we need: mongodb+srv://user:pass@cluster.net/nutrition?retryWrites=true&w=majority
    if (connectionUri.includes('mongodb+srv://') && connectionUri.match(/@[^/]+\/\?/)) {
      logger.warn('Database name missing in connection string. Adding /nutrition...');
      connectionUri = connectionUri.replace(/\/(\?|$)/, '/nutrition?');
      // Also update query params to recommended format
      if (connectionUri.includes('appName=')) {
        connectionUri = connectionUri.replace(/\?.*$/, '?retryWrites=true&w=majority');
      } else if (!connectionUri.includes('retryWrites')) {
        connectionUri = connectionUri.replace(/\?/, '?retryWrites=true&w=majority&');
      }
      logger.info('Updated connection string with database name');
    }
  }

  // Try connection with fallback
  let connection;
  let lastError;
  
  try {
    connection = await mongoose.connect(connectionUri, {
      maxPoolSize: 10,
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000 // 45 seconds socket timeout
    });

    logger.info(
      `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
    );
    isConnected = true;
    // Set up connection event handlers
    setupConnectionHandlers();
    return true;
  } catch (error) {
    lastError = error;
    
    // If SRV format failed and we converted it, try original format as fallback
    if (connectionUri !== MONGO_URI && (error.code === 'ENOTFOUND' || error.message?.includes('querySrv'))) {
      logger.warn('SRV format failed, trying original connection string format...');
      try {
        const originalEncoded = encodeConnectionString(MONGO_URI);
        connection = await mongoose.connect(originalEncoded, {
          maxPoolSize: 10,
          autoIndex: true,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000
        });
        logger.info(
          `MongoDB connected (using standard format): ${connection.connection.host}/${connection.connection.name}`
        );
        isConnected = true;
        // Set up connection event handlers
        setupConnectionHandlers();
        return true; // Success with fallback
      } catch (fallbackError) {
        lastError = fallbackError;
        logger.error('Both SRV and standard formats failed');
      }
    }
    
    // If we get here, all connection attempts failed
    const finalError = lastError;
    logger.error('MongoDB connection failed');
    
    // Check for IP whitelist error specifically
    const isIPWhitelistError = 
      (finalError.message?.includes('IP') && finalError.message?.includes('whitelist')) ||
      finalError.message?.includes('not allowed to connect');
    
    if (isIPWhitelistError) {
      logger.error('');
      logger.error('🚫 IP ADDRESS NOT WHITELISTED');
      logger.error('');
      logger.error('Your current IP address is not allowed to connect to MongoDB Atlas.');
      logger.error('');
      logger.error('To fix this:');
      logger.error('1. Run: npm run check-ip');
      logger.error('2. Copy your IP address from the output');
      logger.error('3. Go to MongoDB Atlas → Network Access → Add IP Address');
      logger.error('4. Add your IP and wait 1-2 minutes');
      logger.error('5. Restart the server');
      logger.error('');
    }
    
    // Provide helpful error messages
    if (finalError.code === 'ENOTFOUND') {
      logger.error(
        'DNS lookup failed. Check your MONGO_URI connection string format.'
      );
      logger.error(
        'Expected format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database?retryWrites=true&w=majority'
      );
      logger.error('Verify your cluster name matches in MongoDB Atlas.');
    } else if (finalError.code === 'EAUTH' || finalError.message?.includes('bad auth') || finalError.message?.includes('Authentication failed')) {
      logger.error('❌ Authentication failed!');
      logger.error('');
      logger.error('Possible issues:');
      logger.error('1. Username or password is incorrect');
      logger.error('2. Password contains special characters that need URL encoding');
      logger.error('3. Database user was deleted or password was changed');
      logger.error('');
      logger.error('To fix:');
      logger.error('1. Go to MongoDB Atlas → Database Access');
      logger.error('2. Verify your username and password');
      logger.error('3. If password has special characters, use URL encoding in connection string');
      logger.error('4. Or reset the password and update your .env file');
      logger.error('');
      logger.error(`Attempted connection string (credentials hidden): ${connectionUri.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@')}`);
    } else {
      logger.error(`Error details: ${finalError.message}`);
      if (finalError.stack && process.env.NODE_ENV === 'development') {
        logger.error(`Stack: ${finalError.stack}`);
      }
    }
    
    logger.error('Make sure:');
    logger.error('1. Your MongoDB cluster is running in Atlas');
    logger.error('2. Your IP address is whitelisted in Network Access');
    logger.error('3. Your database user credentials are correct');
    logger.error('4. Your connection string format is correct');
    logger.warn('');
    logger.warn('💡 Quick fix: Run "npm run check-ip" to get your IP and whitelist instructions');
    logger.warn('');
    logger.warn('⚠️  Server will start without database connection.');
    logger.warn('   Database-dependent endpoints will not work until MongoDB is connected.');
    logger.warn('   Fix your credentials and restart the server to enable database features.');
    
    isConnected = false;
    // Set up connection event handlers even on failure for future reconnection attempts
    setupConnectionHandlers();
    return false;
  }
};

const setupConnectionHandlers = () => {
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection lost. Attempting to reconnect...');
  });

  mongoose.connection.on('error', err => {
    logger.error('MongoDB connection error:', err);
    isConnected = false;
  });

  mongoose.connection.on('connected', () => {
    isConnected = true;
  });
};

const getConnectionStatus = () => isConnected;

export default connectDB;
export { getConnectionStatus };

