#!/bin/bash

# Script to create an admin user
# Usage: ./create-admin.sh

BASE_URL="http://localhost:5000"
API_BASE="${BASE_URL}/api/v1"

echo "Step 1: Registering user chin1234..."
REGISTER_RESPONSE=$(curl -s -X POST "${API_BASE}/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "chin1234",
    "email": "chin1234@example.com",
    "password": "chin1234"
  }')

echo "Registration Response: $REGISTER_RESPONSE"

# Extract user ID from response (you may need to adjust based on actual response format)
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
  echo "Failed to register user or user already exists"
  echo "Trying to login to get user info..."
  
  # Try to login to get tokens
  LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE}/users/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "chin1234@example.com",
      "password": "chin1234"
    }')
  
  echo "Login Response: $LOGIN_RESPONSE"
  ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  
  if [ -z "$ACCESS_TOKEN" ]; then
    echo "Failed to login. Please check if user exists."
    exit 1
  fi
  
  # Get user profile to get user ID
  PROFILE_RESPONSE=$(curl -s -X GET "${API_BASE}/users/profile" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")
  
  echo "Profile Response: $PROFILE_RESPONSE"
  USER_ID=$(echo $PROFILE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
fi

echo ""
echo "Step 2: Updating user to admin role..."
echo "Note: You need an existing admin account to do this."
echo ""
echo "If you have an admin account, login first:"
echo "curl -X POST ${API_BASE}/users/login -H 'Content-Type: application/json' -d '{\"email\":\"YOUR_ADMIN_EMAIL\",\"password\":\"YOUR_ADMIN_PASSWORD\"}'"
echo ""
echo "Then use the accessToken to update the user:"
echo "curl -X PUT ${API_BASE}/admin/users/${USER_ID} -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_ADMIN_TOKEN' -d '{\"role\":\"admin\"}'"

