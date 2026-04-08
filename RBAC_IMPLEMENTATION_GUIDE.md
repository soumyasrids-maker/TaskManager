# Role-Based Access Control (RBAC) Implementation

## Overview
The Task Manager application now implements role-based access control to ensure that users can only access pages and features appropriate for their role. Employees and Admins have separate dashboards with different functionalities.

## Implementation Details

### Guards Created

#### 1. AdminGuard (`admin.guard.ts`)
- **Purpose**: Protects admin-only routes
- **Functionality**:
  - Checks if user is logged in
  - Verifies user role is "Admin"
  - If not admin, redirects to employee dashboard
  - If not logged in, redirects to login page

**Code Flow:**
```
User tries to access /admin-dashboard
    ↓
AdminGuard.canActivate() is triggered
    ↓
Is user logged in?
    ├─ NO → Redirect to /login
    └─ YES → Check role
        ├─ Role === "Admin" → Allow access
        └─ Role === "Employee" → Redirect to /employee-dashboard
```

#### 2. EmployeeGuard (`employee.guard.ts`)
- **Purpose**: Protects employee-only routes
- **Functionality**:
  - Checks if user is logged in
  - Verifies user role is "Employee"
  - If not employee, redirects to admin dashboard
  - If not logged in, redirects to login page

**Code Flow:**
```
User tries to access /employee-dashboard
    ↓
EmployeeGuard.canActivate() is triggered
    ↓
Is user logged in?
    ├─ NO → Redirect to /login
    └─ YES → Check role
        ├─ Role === "Employee" → Allow access
        └─ Role === "Admin" → Redirect to /admin-dashboard
```

### Routes Protected

| Route | Guard | Allowed Role |
|-------|-------|--------------|
| `/admin-dashboard` | AdminGuard | Admin only |
| `/admin-dashboard/*` (all children) | AdminGuard | Admin only |
| `/employee-dashboard` | EmployeeGuard | Employee only |
| `/login` | None | All |
| `/signin` | None | All |

## How It Works

### Scenario 1: Admin User
```
1. User logs in with role "Admin"
2. Redirected to /admin-dashboard
3. AdminGuard checks role → Allows access
4. Admin can access all admin features
5. If admin tries to access /employee-dashboard → Redirected to /admin-dashboard
```

### Scenario 2: Employee User
```
1. User logs in with role "Employee"
2. Redirected to /employee-dashboard
3. EmployeeGuard checks role → Allows access
4. Employee can view their assigned tasks
5. If employee tries to access /admin-dashboard → Redirected to /employee-dashboard
```

### Scenario 3: Unauthorized Access Attempt
```
1. User manually types /admin-dashboard in URL
2. AdminGuard checks authentication
3. If not logged in → Redirect to /login
4. If logged in but not admin → Redirect to /employee-dashboard
```

## Guard Implementation

### AdminGuard Code
```typescript
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, 
              state: RouterStateSnapshot): boolean {
    const user = this.auth.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.role === 'Admin') {
      return true;
    } else {
      this.router.navigate(['/employee-dashboard']);
      return false;
    }
  }
}
```

### EmployeeGuard Code
```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, 
              state: RouterStateSnapshot): boolean {
    const user = this.auth.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.role === 'Employee') {
      return true;
    } else {
      this.router.navigate(['/admin-dashboard']);
      return false;
    }
  }
}
```

## Route Configuration

```typescript
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signin', component: SigninComponent },
  
  // Employee route with guard
  { 
    path: 'employee-dashboard', 
    component: EmployeeDashboardComponent, 
    canActivate: [EmployeeGuard] 
  },
  
  // Admin route with guard
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
```

## User Data Structure

The user object stored in localStorage contains:
```typescript
{
  name: string;          // User's full name
  email: string;         // User's email
  role: "Admin" | "Employee";  // User's role
  // ... other fields
}
```

The role field is crucial for determining access:
- **"Admin"**: Has access to all admin features
- **"Employee"**: Can only view assigned tasks

## Security Flow

### Login Process
```
1. User enters credentials and selects role
2. Backend validates and returns user object with role
3. Frontend stores user in localStorage
4. Frontend redirects based on role
   ├─ If Admin → /admin-dashboard
   └─ If Employee → /employee-dashboard
```

### Subsequent Navigation
```
1. User navigates via URL or router.navigate()
2. Angular checks CanActivate guards
3. Guard retrieves user from localStorage
4. Guard validates role against route requirements
5. If valid → Component loads
6. If invalid → Redirect to appropriate dashboard
```

## Best Practices Implemented

1. **Guard Injection**: Guards are injected as providers
2. **Separation of Concerns**: Each role has dedicated guard
3. **Fallback Redirection**: Invalid users redirected to login
4. **Role Cross-Protection**: Each role guards against the other
5. **Persistent Guards**: Applied at route level, not component level

## Testing Access Control

### Test Case 1: Admin Access
```
1. Login as Admin
2. Attempt to access /admin-dashboard
3. Expected: Access granted
4. Attempt to access /employee-dashboard
5. Expected: Redirected to /admin-dashboard
```

### Test Case 2: Employee Access
```
1. Login as Employee
2. Attempt to access /employee-dashboard
3. Expected: Access granted
4. Attempt to access /admin-dashboard
5. Expected: Redirected to /employee-dashboard
```

### Test Case 3: Unauthenticated Access
```
1. Clear localStorage (logout)
2. Attempt to access /admin-dashboard
3. Expected: Redirected to /login
4. Attempt to access /employee-dashboard
5. Expected: Redirected to /login
```

## Future Enhancements

1. **Role-Based Feature Flags**: Control UI elements by role
2. **Permission System**: Granular permissions beyond just roles
3. **Route Data**: Store metadata in routes for dynamic guard logic
4. **Activity Logging**: Log access attempts for security audit
5. **Session Timeout**: Automatic logout after inactivity
6. **Multi-Role Support**: Allow users with multiple roles
7. **API-Level Guards**: Backend validation of permissions
8. **Guard Messaging**: Custom error/redirect messages per guard

## Troubleshooting

### Issue: Guard not working
**Solution**: 
- Verify guard is imported in AppRoutingModule
- Ensure user object is stored in localStorage with role field
- Check browser console for errors

### Issue: Infinite redirects
**Solution**:
- Check guard logic doesn't have circular redirects
- Ensure /login route has no guards
- Verify role values match exactly (case-sensitive)

### Issue: User stays on wrong dashboard
**Solution**:
- Clear browser cache and localStorage
- Ensure logout properly clears user data
- Check localStorage for corrupt user object

## Migration Guide

### If updating existing project:
1. Create guard files (admin.guard.ts, employee.guard.ts)
2. Update app-routing.module.ts with imports and guards
3. Test login/logout flows
4. Test accessing both dashboards
5. Verify redirects work correctly

## Performance Considerations

- Guards execute synchronously before component loads
- No performance impact with current implementation
- Consider async guards if backend validation needed in future
- LocalStorage access is fast and non-blocking

## Conclusion

This RBAC implementation provides:
- ✅ Secure route access based on user role
- ✅ Automatic redirection for unauthorized access
- ✅ Clear separation between admin and employee features
- ✅ Easy to extend with additional roles
- ✅ Production-ready security model
