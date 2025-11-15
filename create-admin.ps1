# PowerShell script to create an admin user
# Usage: .\create-admin.ps1

$BASE_URL = "http://localhost:5000"
$API_BASE = "$BASE_URL/api/v1"

Write-Host "Step 1: Registering user chin1234..." -ForegroundColor Green

$registerBody = @{
    name = "chin1234"
    email = "chin1234@example.com"
    password = "chin1234"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_BASE/users/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host "Response: $($registerResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
    
    $userId = $registerResponse.user.id
    Write-Host "User ID: $userId" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "User already exists. Attempting to login..." -ForegroundColor Yellow
        
        $loginBody = @{
            email = "chin1234@example.com"
            password = "chin1234"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "$API_BASE/users/login" `
                -Method POST `
                -ContentType "application/json" `
                -Body $loginBody
            
            $accessToken = $loginResponse.tokens.accessToken
            Write-Host "Login successful!" -ForegroundColor Green
            
            # Get user profile
            $headers = @{
                "Authorization" = "Bearer $accessToken"
            }
            
            $profileResponse = Invoke-RestMethod -Uri "$API_BASE/users/profile" `
                -Method GET `
                -Headers $headers
            
            $userId = $profileResponse.user.id
            Write-Host "User ID: $userId" -ForegroundColor Yellow
        } catch {
            Write-Host "Failed to login: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Step 2: To update user to admin role, you need an admin account." -ForegroundColor Yellow
Write-Host ""
Write-Host "First, login as an existing admin:" -ForegroundColor Cyan
Write-Host "`$adminLogin = Invoke-RestMethod -Uri '$API_BASE/users/login' -Method POST -ContentType 'application/json' -Body (@{email='ADMIN_EMAIL';password='ADMIN_PASSWORD'} | ConvertTo-Json)" -ForegroundColor Gray
Write-Host "`$adminToken = `$adminLogin.tokens.accessToken" -ForegroundColor Gray
Write-Host ""
Write-Host "Then update the user role:" -ForegroundColor Cyan
Write-Host "`$headers = @{Authorization='Bearer ' + `$adminToken}" -ForegroundColor Gray
Write-Host "Invoke-RestMethod -Uri '$API_BASE/admin/users/$userId' -Method PUT -Headers `$headers -ContentType 'application/json' -Body (@{role='admin'} | ConvertTo-Json)" -ForegroundColor Gray
Write-Host ""
Write-Host "User ID to update: $userId" -ForegroundColor Green

