# 🧪 Application Testing & Verification Guide

## Issue Description
Application shows blank page at `localhost:4200` and cannot navigate to routes.

## Root Cause Analysis
✅ **FIXED:** The routing module was requiring `AuthGuard` on login/signin pages, which was preventing initial access.

## What Was Fixed

### File: `/src/app/app-routing.module.ts`

**BEFORE (Wrong):**
```typescript
{path:'login',component:LoginComponent, canActivate: [AuthGuard]},
{path:'signin',component:SigninComponent, canActivate: [AuthGuard]},
```

**AFTER (Fixed):**
```typescript
{path:'login',component:LoginComponent},
{path:'signin',component:SigninComponent},
{path: '**', redirectTo: 'login'}  // Catch-all for undefined routes
```

**Why This Fixes It:**
- ✅ Login page is now accessible without authentication
- ✅ All undefined routes redirect to login
- ✅ Protected routes (admin-dashboard, employee-dashboard) still have their guards
- ✅ Proper routing flow: Unauthenticated → Login → Authenticate → Dashboard

---

## 🚀 How to Test

### Step 1: Verify Both Servers Running

**Check Angular Server (Port 4200):**
```bash
lsof -i :4200
# Should show: node process listening on 4200
```

**Check JSON Server (Port 3000):**
```bash
lsof -i :3000
# Should show: node process listening on 3000
```

**Both running? ✅ Proceed to Step 2**

### Step 2: Open Application in Browser

Navigate to: **http://localhost:4200/**

**Expected Result:**
- ✅ Page loads (NOT blank)
- ✅ Login form appears
- ✅ Form has fields: Email, Password, Role dropdown
- ✅ Submit button visible

### Step 3: Test Login with Test Credentials

**Admin Login:**
```
Email:    soumyasri.ds@gmail.com
Password: swedrf432
Role:     Admin
```

**Employee Login:**
```
Email:    soumyasri@gmail.com
Password: edrftgyh
Role:     Employee
```

**Step-by-Step:**
1. Enter email: `soumyasri.ds@gmail.com`
2. Enter password: `swedrf432`
3. Select role: `Admin`
4. Click "Login"

**Expected Result After Login:**
- ✅ Page redirects to `/admin-dashboard`
- ✅ Admin dashboard loads with sidebar navigation
- ✅ Dashboard shows project list, teams, tasks, etc.
- ✅ URL shows: `http://localhost:4200/admin-dashboard`

### Step 4: Test Navigation

**From Admin Dashboard:**
1. Click on "Projects" in sidebar
   - Expected: `/admin-dashboard/projects` loads with project table
   
2. Click on "Teams" in sidebar
   - Expected: `/admin-dashboard/teams` loads with team list
   
3. Click on "Tasks" in sidebar
   - Expected: `/admin-dashboard/tasks` loads with task list

**Each should load without errors ✅**

### Step 5: Test Employee Access

**Logout and Login as Employee:**
1. Click logout (if available) OR manually test:
   - Go to: `http://localhost:4200/login`
   - Clear localStorage: Open DevTools → Application → Local Storage → Delete all

2. Login with Employee credentials:
```
Email:    soumyasri@gmail.com
Password: edrftgyh
Role:     Employee
```

**Expected Result:**
- ✅ Redirects to `/employee-dashboard`
- ✅ Employee dashboard loads
- ✅ Shows only "My Tasks" section
- ✅ Cannot access `/admin-dashboard` (redirects to employee dashboard)

### Step 6: Test Route Protection

**Try Accessing Admin Dashboard as Non-Admin:**

1. Login as Employee
2. Manually type: `http://localhost:4200/admin-dashboard`

**Expected Result:**
- ✅ Redirected to `/employee-dashboard` (guard prevents access)

**Try Accessing Without Authentication:**

1. Clear localStorage (logged out)
2. Manually type: `http://localhost:4200/admin-dashboard`

**Expected Result:**
- ✅ Redirected to `/login` (AuthGuard/AdminGuard prevents access)

---

## 🔍 Troubleshooting

### Issue: Still Showing Blank Page

**Check 1: Clear Browser Cache**
```
Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
✓ Select "Cookies and cached images and files"
✓ Click Clear Now
```

**Check 2: Restart Angular Server**
```bash
cd /Users/d.soumyasri/TaskManager
# Kill existing process
Ctrl+C

# Start fresh
npm start
# or
ng serve
```

**Check 3: Verify Configuration**
```bash
# Check ConfigurationService
cat src/app/configuration.service.ts

# Should show:
# getApiUrl(): 'http://localhost:3000'
# getBackendUrl(): 'http://localhost:8080'
```

**Check 4: Console Errors**
1. Open DevTools: F12
2. Go to Console tab
3. Look for red errors
4. If errors, share them for debugging

**Check 5: Network Tab**
1. Open DevTools: F12
2. Go to Network tab
3. Refresh page
4. Look for any failed requests
5. Click on requests to see details

### Issue: Login Not Working

**Check Backend Server:**
```bash
# Is JSON server running on 3000?
lsof -i :3000

# If not, start it:
cd /Users/d.soumyasri/TaskManager
npm run server
# or
node server.js
```

**Check Credentials:**
```bash
# Verify users exist in database
cat src/db.json | grep -A5 "users"

# Should show test users with correct email and password
```

**Check Network Request:**
1. DevTools → Network tab
2. Try login
3. Look for POST request to `http://localhost:3000/login`
4. Check response - should return `accessToken` and user data

### Issue: Cannot Navigate Between Routes

**Possible Cause:** Route guard rejecting access

**Solution:**
1. Check browser console for guard errors
2. Verify user is stored in localStorage:
   ```javascript
   // Open DevTools → Console
   console.log(localStorage.getItem('user'))
   ```
3. User object should show `role: "Admin"` or `role: "Employee"`

---

## 📋 Server Configuration Checklist

- [ ] **Node.js (v14+)** installed
  ```bash
  node --version
  npm --version
  ```

- [ ] **Angular CLI** installed globally
  ```bash
  ng version
  ```

- [ ] **JSON Server** (Port 3000)
  ```bash
  npm run server
  # or: node server.js
  ```

- [ ] **Angular Dev Server** (Port 4200)
  ```bash
  npm start
  # or: ng serve
  ```

- [ ] **Database File** exists
  ```bash
  ls -la src/db.json
  # Should exist with test users
  ```

---

## 🎯 Expected Application Flow

### Flow Diagram
```
Browser opens localhost:4200
    ↓
Angular loads app.component
    ↓
Router checks current route (default: '')
    ↓
Redirect to /login
    ↓
LoginComponent loads
    ↓
User enters credentials
    ↓
Submit form
    ↓
AuthService.postLogin() → POST http://localhost:3000/login
    ↓
If credentials valid:
  ✅ Backend returns { accessToken, user }
  ✅ Component stores user in localStorage
  ✅ Redirects to /admin-dashboard or /employee-dashboard
    ↓
Dashboard loads with guard checks
    ↓
Guard validates user role from localStorage
    ↓
✅ Access granted - Dashboard displays
```

---

## ✅ Quick Verification Checklist

After startup, verify:

- [ ] `http://localhost:4200/` → Shows login form (NOT blank)
- [ ] Can type email and password
- [ ] Role dropdown works (Admin/Employee options)
- [ ] Submit button is clickable
- [ ] Login with correct credentials works
- [ ] Redirects to appropriate dashboard
- [ ] Navigation between routes works
- [ ] Logout works (clears session)
- [ ] Unauthenticated access redirects to login
- [ ] Employee cannot access admin dashboard
- [ ] Admin can access all dashboards

---

## 🚨 If Something Still Doesn't Work

**Provide This Information:**

1. **Browser Console Errors** (F12 → Console)
2. **Network Requests** (F12 → Network → Try login → Copy response)
3. **localStorage Content** (F12 → Application → Local Storage)
4. **Terminal Output** from both servers

---

## 📞 Quick Support Commands

```bash
# Check if servers running
netstat -an | grep LISTEN | grep -E ':(3000|4200)'

# Kill and restart JSON server
lsof -i :3000 | grep node | awk '{print $2}' | xargs kill -9
npm run server

# Kill and restart Angular
lsof -i :4200 | grep node | awk '{print $2}' | xargs kill -9
ng serve

# Clear everything and rebuild
rm -rf node_modules dist
npm install
ng build
npm start
```

---

## 🎊 Success Indicators

You'll know it's working when:

✅ Application loads at localhost:4200  
✅ Login page is visible  
✅ Login works with test credentials  
✅ Redirects to correct dashboard after login  
✅ Can navigate between pages  
✅ Protected routes work correctly  
✅ Logout works  

**Status: Ready to Use!** 🚀

---

Generated: January 16, 2026
