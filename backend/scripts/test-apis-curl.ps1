# PowerShell script to test API endpoints using curl (Invoke-WebRequest)
# Tests all major endpoints of the Nutrition Advisor API

$BASE_URL = "http://localhost:5000"
$API_BASE = "$BASE_URL/api/v1"

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🧪 Testing Nutrition Advisor API Endpoints with curl" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$accessToken = $null
$refreshToken = $null

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/health" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check passed" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: API Base
Write-Host "2. Testing API Base Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_BASE" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API base check passed" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
} catch {
    Write-Host "❌ API base check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: User Registration
Write-Host "3. Testing User Registration..." -ForegroundColor Yellow
$timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
$email = "test$timestamp@example.com"
$body = @{
    name = "Test User"
    email = $email
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_BASE/users/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    if ($response.StatusCode -eq 201) {
        Write-Host "✅ Registration successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        $accessToken = $data.tokens.accessToken
        $refreshToken = $data.tokens.refreshToken
        Write-Host "User ID: $($data.user.id)"
        Write-Host "Email: $email"
    }
} catch {
    Write-Host "❌ Registration failed, trying login..." -ForegroundColor Yellow
    # Try login
    $loginBody = @{
        email = "test@example.com"
        password = "Test123!@#"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-WebRequest -Uri "$API_BASE/users/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
        if ($loginResponse.StatusCode -eq 200) {
            $loginData = $loginResponse.Content | ConvertFrom-Json
            $accessToken = $loginData.tokens.accessToken
            $refreshToken = $loginData.tokens.refreshToken
            Write-Host "✅ Login successful" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Login also failed: $_" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

if (-not $accessToken) {
    Write-Host "❌ No access token available. Cannot test protected endpoints." -ForegroundColor Red
    exit 1
}

# Test 4: Get Profile (Protected)
Write-Host "4. Testing Get Profile (Protected)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$API_BASE/users/profile" -Method GET -Headers $headers -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Get profile successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "User: $($data.user.name)"
    }
} catch {
    Write-Host "❌ Get profile failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Daily Summary (Protected)
Write-Host "5. Testing Daily Summary (Protected)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$API_BASE/logs/daily-summary" -Method GET -Headers $headers -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Daily summary successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Summary: $($data.summary.totals | ConvertTo-Json -Compress)"
    }
} catch {
    Write-Host "❌ Daily summary failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Insights (Protected)
Write-Host "6. Testing Insights (Protected)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$API_BASE/logs/insights" -Method GET -Headers $headers -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Insights successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Insights count: $($data.data.Count)"
    }
} catch {
    Write-Host "❌ Insights failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 7: Reminders (Protected)
Write-Host "7. Testing Reminders (Protected)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$API_BASE/logs/reminders" -Method GET -Headers $headers -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Reminders successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Reminders count: $($data.data.Count)"
    }
} catch {
    Write-Host "❌ Reminders failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 8: Goals (Protected)
Write-Host "8. Testing Goals (Protected)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$API_BASE/goals" -Method GET -Headers $headers -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Goals successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Goals count: $($data.count)"
    }
} catch {
    Write-Host "❌ Goals failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 9: Tips (Protected)
Write-Host "9. Testing Tips (Protected)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$API_BASE/tips" -Method GET -Headers $headers -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Tips successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Tips count: $($data.count)"
    }
} catch {
    Write-Host "❌ Tips failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 10: Foods Search (Protected)
Write-Host "10. Testing Foods Search..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$API_BASE/foods?search=rice`&limit=5" -Method GET -Headers $headers -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Foods search successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Foods found: $($data.data.Count)"
    }
} catch {
    Write-Host "❌ Foods search failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 11: Meal Plans (Protected)
Write-Host "11. Testing Meal Plans..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$API_BASE/meal-plans" -Method GET -Headers $headers -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Meal plans successful" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Meal plans count: $($data.data.Count)"
    }
} catch {
    Write-Host "❌ Meal plans failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 12: Refresh Token
if ($refreshToken) {
    Write-Host "12. Testing Refresh Token..." -ForegroundColor Yellow
    $refreshBody = @{
        refreshToken = $refreshToken
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$API_BASE/users/refresh" -Method POST -Body $refreshBody -ContentType "application/json" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Refresh token successful" -ForegroundColor Green
            $data = $response.Content | ConvertFrom-Json
            Write-Host "New access token obtained"
        }
    } catch {
        Write-Host "❌ Refresh token failed: $_" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ API Testing Complete" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

