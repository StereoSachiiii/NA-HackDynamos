# PowerShell script to start the backend dev server with OpenSSL fix
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm run dev

