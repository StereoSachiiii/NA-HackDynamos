#!/bin/bash

# API Testing Script using curl
# Tests all major endpoints of the Nutrition Advisor API

BASE_URL="http://localhost:5000"
API_BASE="${BASE_URL}/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "═══════════════════════════════════════════════════════════"
echo "🧪 Testing Nutrition Advisor API Endpoints with curl"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $body" | jq '.' 2>/dev/null || echo "Response: $body"
else
    echo -e "${RED}❌ Health check failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 2: API Base
echo "2️⃣  Testing API Base Endpoint..."
response=$(curl -s -w "\n%{http_code}" "${API_BASE}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ API base check passed${NC}"
    echo "Response: $body" | jq '.' 2>/dev/null || echo "Response: $body"
else
    echo -e "${RED}❌ API base check failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 3: User Registration
echo "3️⃣  Testing User Registration..."
timestamp=$(date +%s)
email="test${timestamp}@example.com"
register_response=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/users/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test User\",\"email\":\"${email}\",\"password\":\"Test123!@#\"}")
register_http_code=$(echo "$register_response" | tail -n1)
register_body=$(echo "$register_response" | sed '$d')

if [ "$register_http_code" -eq 201 ]; then
    echo -e "${GREEN}✅ Registration successful${NC}"
    access_token=$(echo "$register_body" | jq -r '.tokens.accessToken' 2>/dev/null)
    refresh_token=$(echo "$register_body" | jq -r '.tokens.refreshToken' 2>/dev/null)
    user_id=$(echo "$register_body" | jq -r '.user.id' 2>/dev/null)
    echo "User ID: $user_id"
    echo "Email: $email"
else
    echo -e "${RED}❌ Registration failed (HTTP $register_http_code)${NC}"
    echo "Response: $register_body" | jq '.' 2>/dev/null || echo "Response: $register_body"
    echo -e "${YELLOW}⚠️  Trying login with existing user...${NC}"
    # Try login
    login_response=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/users/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"test@example.com\",\"password\":\"Test123!@#\"}")
    login_http_code=$(echo "$login_response" | tail -n1)
    login_body=$(echo "$login_response" | sed '$d')
    if [ "$login_http_code" -eq 200 ]; then
        access_token=$(echo "$login_body" | jq -r '.tokens.accessToken' 2>/dev/null)
        refresh_token=$(echo "$login_body" | jq -r '.tokens.refreshToken' 2>/dev/null)
        echo -e "${GREEN}✅ Login successful${NC}"
    else
        echo -e "${RED}❌ Login also failed${NC}"
        exit 1
    fi
fi
echo ""

if [ -z "$access_token" ]; then
    echo -e "${RED}❌ No access token available. Cannot test protected endpoints.${NC}"
    exit 1
fi

# Test 4: Get Profile (Protected)
echo "4️⃣  Testing Get Profile (Protected)..."
response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE}/users/profile" \
    -H "Authorization: Bearer ${access_token}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Get profile successful${NC}"
    echo "User: $(echo "$body" | jq -r '.user.name' 2>/dev/null)"
else
    echo -e "${RED}❌ Get profile failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 5: Daily Summary (Protected)
echo "5️⃣  Testing Daily Summary (Protected)..."
response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE}/logs/daily-summary" \
    -H "Authorization: Bearer ${access_token}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Daily summary successful${NC}"
    echo "Summary: $(echo "$body" | jq -r '.summary.totals' 2>/dev/null || echo 'No data')"
else
    echo -e "${RED}❌ Daily summary failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 6: Insights (Protected)
echo "6️⃣  Testing Insights (Protected)..."
response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE}/logs/insights" \
    -H "Authorization: Bearer ${access_token}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Insights successful${NC}"
    count=$(echo "$body" | jq '.data | length' 2>/dev/null || echo "0")
    echo "Insights count: $count"
else
    echo -e "${RED}❌ Insights failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 7: Reminders (Protected)
echo "7️⃣  Testing Reminders (Protected)..."
response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE}/logs/reminders" \
    -H "Authorization: Bearer ${access_token}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Reminders successful${NC}"
    count=$(echo "$body" | jq '.data | length' 2>/dev/null || echo "0")
    echo "Reminders count: $count"
else
    echo -e "${RED}❌ Reminders failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 8: Goals (Protected)
echo "8️⃣  Testing Goals (Protected)..."
response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE}/goals" \
    -H "Authorization: Bearer ${access_token}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Goals successful${NC}"
    count=$(echo "$body" | jq '.count' 2>/dev/null || echo "0")
    echo "Goals count: $count"
else
    echo -e "${RED}❌ Goals failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 9: Tips (Protected)
echo "9️⃣  Testing Tips (Protected)..."
response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE}/tips" \
    -H "Authorization: Bearer ${access_token}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Tips successful${NC}"
    count=$(echo "$body" | jq '.count' 2>/dev/null || echo "0")
    echo "Tips count: $count"
else
    echo -e "${RED}❌ Tips failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 10: Foods Search (Public/Protected)
echo "🔟 Testing Foods Search..."
response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE}/foods?search=rice&limit=5" \
    -H "Authorization: Bearer ${access_token}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Foods search successful${NC}"
    count=$(echo "$body" | jq '.data | length' 2>/dev/null || echo "0")
    echo "Foods found: $count"
else
    echo -e "${RED}❌ Foods search failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 11: Meal Plans (Protected)
echo "1️⃣1️⃣  Testing Meal Plans..."
response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE}/meal-plans" \
    -H "Authorization: Bearer ${access_token}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Meal plans successful${NC}"
    count=$(echo "$body" | jq '.data | length' 2>/dev/null || echo "0")
    echo "Meal plans count: $count"
else
    echo -e "${RED}❌ Meal plans failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 12: Refresh Token
if [ ! -z "$refresh_token" ]; then
    echo "1️⃣2️⃣  Testing Refresh Token..."
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/users/refresh" \
        -H "Content-Type: application/json" \
        -d "{\"refreshToken\":\"${refresh_token}\"}")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Refresh token successful${NC}"
        new_access_token=$(echo "$body" | jq -r '.tokens.accessToken' 2>/dev/null)
        echo "New access token obtained"
    else
        echo -e "${RED}❌ Refresh token failed (HTTP $http_code)${NC}"
    fi
    echo ""
fi

echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ API Testing Complete${NC}"
echo "═══════════════════════════════════════════════════════════"

