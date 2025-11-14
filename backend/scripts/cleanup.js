import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, '..');

console.log('\n🧹 Backend Cleanup Script\n');
console.log('='.repeat(60));

// Files to delete
const filesToDelete = [
  // Documentation
  'AUTHENTICATION_CAUSES.md',
  'CONNECTION_STRING_FIX.md',
  'FINAL_FIX.md',
  'FIX_AUTHENTICATION.md',
  'QUICK_FIX_CONNECTION.md',
  'QUICK_START.md',
  'SETUP_GUIDE.md',
  'STEPS_CHECKLIST.md',
  'CLEANUP_GUIDE.md',
  
  // Diagnostic scripts (keep seed.js)
  'scripts/auto-fix-connection.js',
  'scripts/check-connection.js',
  'scripts/check-env.js',
  'scripts/diagnose-auth.js',
  'scripts/fix-connection-string.js',
  'scripts/kill-port.js',
  'scripts/test-connection.js',
  'scripts/verify-setup.js',
];

// Directories to delete
const dirsToDelete = [
  'tests',
  'docs',
  'logs',
  'validators',
];

let deletedCount = 0;
let errorCount = 0;

console.log('\n📋 Files to delete:\n');
filesToDelete.forEach(file => {
  const filePath = path.join(backendDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  - ${file}`);
  }
});

console.log('\n📁 Directories to delete:\n');
dirsToDelete.forEach(dir => {
  const dirPath = path.join(backendDir, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  - ${dir}/`);
  }
});

console.log('\n⚠️  This will permanently delete the files above.');
console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

await new Promise(resolve => setTimeout(resolve, 3000));

console.log('\n🗑️  Deleting files...\n');

// Delete files
filesToDelete.forEach(file => {
  const filePath = path.join(backendDir, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${file}`);
      deletedCount++;
    }
  } catch (error) {
    console.log(`❌ Error deleting ${file}: ${error.message}`);
    errorCount++;
  }
});

// Delete directories
dirsToDelete.forEach(dir => {
  const dirPath = path.join(backendDir, dir);
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Deleted: ${dir}/`);
      deletedCount++;
    }
  } catch (error) {
    console.log(`❌ Error deleting ${dir}/: ${error.message}`);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Cleanup complete!`);
console.log(`   Deleted: ${deletedCount} items`);
if (errorCount > 0) {
  console.log(`   Errors: ${errorCount}`);
}
console.log('\n💡 Next step: Update package.json to remove unused scripts\n');


