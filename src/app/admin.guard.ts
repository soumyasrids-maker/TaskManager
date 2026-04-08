import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    try {
      const user = this.auth.getUser();
      
      console.log('AdminGuard - User:', user);
      console.log('AdminGuard - User Role:', user?.role);

      if (!user) {
        // No user logged in, redirect to login
        this.router.navigate(['/login']);
        return false;
      }

      if (user.role === 'Admin') {
        // User is admin, allow access
        return true;
      } else if (user.role === 'Employee') {
        // User is employee, redirect to employee dashboard
        this.router.navigate(['/employee-dashboard']);
        return false;
      } else {
        // Role is undefined or unknown
        console.warn('Unknown role:', user.role);
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Error in AdminGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
