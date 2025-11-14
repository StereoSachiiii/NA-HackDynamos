import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UPLOAD_DIR } from '../config/constants.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureUploadDir = () => {
  const dirPath = path.resolve(__dirname, '..', UPLOAD_DIR);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
};

const persistPhotoPlaceholder = async base64 => {
  if (!base64) return null;

  const dirPath = ensureUploadDir();
  const fileName = `meal-${Date.now()}.txt`;
  const fullPath = path.join(dirPath, fileName);
  await fs.promises.writeFile(fullPath, base64);
  logger.info(`Photo placeholder stored at ${fullPath}`);
  return `/storage/${fileName}`;
};

const processPhotoAsync = async () => {
  // Placeholder for ML processing; return canned result
  return {
    status: 'processed',
    detectedItems: ['rice', 'dhal', 'mallung']
  };
};

export { persistPhotoPlaceholder, processPhotoAsync };


