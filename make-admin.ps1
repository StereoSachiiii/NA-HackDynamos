# Register user and make admin
$API_BASE = "http://localhost:5000/api/v1"

# Step 1: Register user
Write-Host "Registering user chin1234..." -ForegroundColor Yellow
$registerBody = @{
    name = "chin1234"
    email = "chin1234@example.com"
    password = "chin1234"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_BASE/users/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "✓ User registered!" -ForegroundColor Green
    $userId = $registerResponse.user.id
    $currentRole = $registerResponse.user.role
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        Write-Host "User already exists. Getting user info..." -ForegroundColor Yellow
        $loginBody = @{email="chin1234@example.com";password="chin1234"} | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$API_BASE/users/login" -Method POST -ContentType "application/json" -Body $loginBody
        $userId = $loginResponse.user.id
        $currentRole = $loginResponse.user.role
        Write-Host "✓ User found! ID: $userId, Role: $currentRole" -ForegroundColor Green
    } else {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "User ID: $userId" -ForegroundColor Cyan
Write-Host "Current Role: $currentRole" -ForegroundColor Cyan

# Step 2: Check if already admin
if ($currentRole -eq "admin") {
    Write-Host ""
    Write-Host "✓ User is already an admin!" -ForegroundColor Green
    exit 0
}

# Step 3: Try to make admin - first check if we can use ADMIN_EMAILS
Write-Host ""
Write-Host "Attempting to make user admin..." -ForegroundColor Yellow
Write-Host "Note: You need an existing admin account or add email to ADMIN_EMAILS in .env" -ForegroundColor Gray

# Check backend/.env for ADMIN_EMAILS
$envFile = "backend\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "ADMIN_EMAILS") {
        Write-Host "Found ADMIN_EMAILS in .env file" -ForegroundColor Cyan
        if ($envContent -match "chin1234@example.com") {
            Write-Host "✓ Email already in ADMIN_EMAILS! User should be admin on next registration." -ForegroundColor Green
            Write-Host "If user was just created, you may need to update via admin endpoint." -ForegroundColor Yellow
        } else {
            Write-Host "Adding email to ADMIN_EMAILS..." -ForegroundColor Yellow
            if ($envContent -match "ADMIN_EMAILS=(.+)") {
                $existing = $matches[1].Trim()
                if ($existing) {
                    $newValue = "$existing,chin1234@example.com"
                } else {
                    $newValue = "chin1234@example.com"
                }
                $envContent = $envContent -replace "ADMIN_EMAILS=(.+)", "ADMIN_EMAILS=$newValue"
            } else {
                $envContent += "`nADMIN_EMAILS=chin1234@example.com`n"
            }
            Set-Content -Path $envFile -Value $envContent
            Write-Host "✓ Added to ADMIN_EMAILS. Restart backend server for it to take effect." -ForegroundColor Green
            Write-Host "Or update user via admin endpoint if you have admin access." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Adding ADMIN_EMAILS to .env..." -ForegroundColor Yellow
        Add-Content -Path $envFile -Value "`nADMIN_EMAILS=chin1234@example.com`n"
        Write-Host "✓ Added ADMIN_EMAILS. Restart backend server." -ForegroundColor Green
    }
} else {
    Write-Host ".env file not found. Creating it..." -ForegroundColor Yellow
    "ADMIN_EMAILS=chin1234@example.com" | Out-File -FilePath $envFile
    Write-Host "✓ Created .env with ADMIN_EMAILS. Restart backend server." -ForegroundColor Green
}

Write-Host ""
Write-Host "To make user admin immediately (if you have admin access):" -ForegroundColor Yellow
Write-Host "curl -X PUT $API_BASE/admin/users/$userId -H 'Content-Type: application/json' -H 'Authorization: Bearer ADMIN_TOKEN' -d '{`"role`":`"admin`"}'" -ForegroundColor Cyan

