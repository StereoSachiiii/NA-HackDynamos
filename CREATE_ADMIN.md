# Create Admin User: chin1234

## Step 1: Register the User

```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"chin1234","email":"chin1234@example.com","password":"chin1234"}'
```

## Step 2: Login to Get User ID (if registration fails because user exists)

```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"chin1234@example.com","password":"chin1234"}'
```

Save the `id` from the response.

## Step 3: Make User Admin

**First, login as an existing admin to get an admin token:**

```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_ADMIN_EMAIL","password":"YOUR_ADMIN_PASSWORD"}'
```

**Copy the `accessToken` from the response, then update the user:**

```bash
curl -X PUT http://localhost:5000/api/v1/admin/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"role":"admin"}'
```

Replace:
- `USER_ID` with the user ID from Step 1 or 2
- `YOUR_ADMIN_TOKEN` with the access token from admin login

## PowerShell Alternative

If you prefer PowerShell, here are the equivalent commands:

```powershell
# Step 1: Register
$body = @{name="chin1234";email="chin1234@example.com";password="chin1234"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/register" -Method POST -ContentType "application/json" -Body $body

# Step 2: Login as admin (replace with your admin credentials)
$adminBody = @{email="YOUR_ADMIN_EMAIL";password="YOUR_ADMIN_PASSWORD"} | ConvertTo-Json
$adminLogin = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users/login" -Method POST -ContentType "application/json" -Body $adminBody
$adminToken = $adminLogin.tokens.accessToken

# Step 3: Update user to admin (replace USER_ID)
$headers = @{Authorization="Bearer $adminToken"; "Content-Type"="application/json"}
$updateBody = @{role="admin"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/users/USER_ID" -Method PUT -Headers $headers -Body $updateBody
```

