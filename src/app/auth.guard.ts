import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.auth.getUser();

    if (user) {
      // User already logged in
      if (user.role === 'Admin') {
        this.router.navigate(['/admin-dashboard']);
      } else if (user.role === 'Employee') {
        this.router.navigate(['/employee-dashboard']);
      }
      return false;
    }

    // No user, allow access to login
    return true;
  }
}
