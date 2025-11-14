import https from 'https';
import logger from '../utils/logger.js';

/**
 * Utility script to help users whitelist their IP address in MongoDB Atlas
 * This script fetches your current public IP and provides instructions
 */
const getPublicIP = () => {
  return new Promise((resolve, reject) => {
    https
      .get('https://api.ipify.org?format=json', res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result.ip);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
};

const main = async () => {
  try {
    logger.info('🔍 Fetching your current public IP address...');
    const publicIP = await getPublicIP();
    
    logger.info('');
    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('📋 MongoDB Atlas IP Whitelist Instructions');
    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('');
    logger.info(`Your current public IP address: ${publicIP}`);
    logger.info('');
    logger.info('To whitelist this IP in MongoDB Atlas:');
    logger.info('');
    logger.info('1. Go to MongoDB Atlas Dashboard:');
    logger.info('   https://cloud.mongodb.com/');
    logger.info('');
    logger.info('2. Navigate to: Network Access → Add IP Address');
    logger.info('');
    logger.info('3. Add your IP address:');
    logger.info(`   ${publicIP}`);
    logger.info('');
    logger.info('   OR allow all IPs (for development only):');
    logger.info('   0.0.0.0/0 (⚠️  NOT recommended for production)');
    logger.info('');
    logger.info('4. Click "Confirm" and wait 1-2 minutes for changes to propagate');
    logger.info('');
    logger.info('5. Restart your backend server');
    logger.info('');
    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('');
    logger.info('💡 Tip: If your IP changes frequently, consider:');
    logger.info('   - Using 0.0.0.0/0 for development (less secure)');
    logger.info('   - Setting up a VPN with a static IP');
    logger.info('   - Using MongoDB Atlas VPC peering for production');
    logger.info('');
    
    // Also provide a direct link format (though it might not work directly)
    logger.info('🔗 Quick link to Network Access:');
    logger.info('   https://cloud.mongodb.com/v2#/security/network/whitelist');
    logger.info('');
    
  } catch (error) {
    logger.error('Failed to fetch public IP address:', error.message);
    logger.error('');
    logger.error('You can manually find your IP by visiting:');
    logger.error('   https://www.whatismyip.com/');
    logger.error('   or');
    logger.error('   https://api.ipify.org');
    logger.error('');
    logger.error('Then add it to MongoDB Atlas Network Access settings.');
    process.exit(1);
  }
};

main();

