# PowerShell script to create admin user chin1234
# This script registers the user and provides instructions to make them admin

$BASE_URL = "http://localhost:5000"
$API_BASE = "$BASE_URL/api/v1"

Write-Host "========================================" -ForegroundColor Green
Write-Host "Creating Admin User: chin1234" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Register the user
Write-Host "Step 1: Registering user..." -ForegroundColor Yellow
$registerJson = '{"name":"chin1234","email":"chin1234@example.com","password":"chin1234"}'

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_BASE/users/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerJson
    
    Write-Host "✓ User registered successfully!" -ForegroundColor Green
    $userId = $registerResponse.user.id
    Write-Host "  User ID: $userId" -ForegroundColor Cyan
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        Write-Host "⚠ User already exists. Getting user info..." -ForegroundColor Yellow
        
        # Login to get user info
        $loginJson = '{"email":"chin1234@example.com","password":"chin1234"}'
        try {
            $loginResponse = Invoke-RestMethod -Uri "$API_BASE/users/login" `
                -Method POST `
                -ContentType "application/json" `
                -Body $loginJson
            
            $userId = $loginResponse.user.id
            Write-Host "✓ User found. User ID: $userId" -ForegroundColor Green
        } catch {
            Write-Host "✗ Failed to login: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Step 2: Make User Admin" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To make this user an admin, you need an existing admin account." -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Using PowerShell (if you have admin credentials):" -ForegroundColor Cyan
Write-Host ""
Write-Host '# Login as admin' -ForegroundColor Gray
Write-Host "`$adminLogin = Invoke-RestMethod -Uri '$API_BASE/users/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"YOUR_ADMIN_EMAIL\",\"password\":\"YOUR_ADMIN_PASSWORD\"}'" -ForegroundColor White
Write-Host "`$adminToken = `$adminLogin.tokens.accessToken" -ForegroundColor White
Write-Host ""
Write-Host '# Update user to admin' -ForegroundColor Gray
Write-Host "`$headers = @{Authorization='Bearer ' + `$adminToken; 'Content-Type'='application/json'}" -ForegroundColor White
Write-Host "Invoke-RestMethod -Uri '$API_BASE/admin/users/$userId' -Method PUT -Headers `$headers -Body '{\"role\":\"admin\"}'" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Using curl:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# First, login as admin and get token:" -ForegroundColor Gray
Write-Host "curl -X POST $API_BASE/users/login -H 'Content-Type: application/json' -d '{\"email\":\"YOUR_ADMIN_EMAIL\",\"password\":\"YOUR_ADMIN_PASSWORD\"}'" -ForegroundColor White
Write-Host ""
Write-Host "# Then update the user (replace ADMIN_TOKEN with token from above):" -ForegroundColor Gray
Write-Host "curl -X PUT $API_BASE/admin/users/$userId -H 'Content-Type: application/json' -H 'Authorization: Bearer ADMIN_TOKEN' -d '{\"role\":\"admin\"}'" -ForegroundColor White
Write-Host ""
Write-Host "User ID to update: $userId" -ForegroundColor Green

