import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isSigninMode: boolean = false;
  Login: string = "Login";
  Signin: string = "Signin";
 
  // For error handling
  showError: boolean = false;
  errorMessage: string = '';
  errorFields: { [key: string]: string } = {};
  isLoading: boolean = false;
  
  // Expose Object to template
  ObjectKeys = Object.keys;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

  signin() {
    this.router.navigate(['/signin']);
  }

  login(data: NgForm) {
    // Reset errors
    this.showError = false;
    this.errorMessage = '';
    this.errorFields = {};
    this.isLoading = true;
     
    // Validate form
    const { email, password, role } = data.value;

    // Validation checks
    if (!email) {
      this.errorFields['email'] = 'Email is required';
    } else if (!this.isValidEmail(email)) {
      this.errorFields['email'] = 'Please enter a valid email';
    }

    if (!password) {
      this.errorFields['password'] = 'Password is required';
    } else if (password.length < 8) {
      this.errorFields['password'] = 'Password must be at least 8 characters';
    }

    if (!role) {
      this.errorFields['role'] = 'Please select a role';
    }

    // If validation failed, show errors
    if (Object.keys(this.errorFields).length > 0) {
      this.showError = true;
      this.errorMessage = 'Please correct the following errors:';
      this.isLoading = false;
      return;
    }

    // If validation passed, make login request
    this.auth.postLogin({ email, password, role }).subscribe(
      {
        next: (res) => {
          console.log('Login successful - Full Response:', res);
          console.log('Response keys:', Object.keys(res));
          
          // Extract user from response
          const userFromResponse = res.user || res;
          console.log('User from response:', userFromResponse);
          console.log('User role:', userFromResponse.role);
          
          // Store user and token
          const userObj = {
            id: userFromResponse.id,
            name: userFromResponse.name || userFromResponse.email,
            email: userFromResponse.email,
            role: userFromResponse.role,
            permissions: userFromResponse.permissions
          };
          
          console.log('Storing user object:', userObj);
          this.auth.setUser(userObj);
          
          // Verify it was stored correctly
          const storedUser = this.auth.getUser();
          console.log('Verified stored user:', storedUser);
          
          localStorage.setItem('token', res.accessToken ?? '');

          this.isLoading = false;
          this.showError = false;

          console.log('User role:', userFromResponse.role);
          console.log('User permissions:', userFromResponse.permissions);

          // Redirect based on role
          if (userFromResponse.role === 'Admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (userFromResponse.role === 'Employee') {
            this.router.navigate(['/employee-dashboard']);
          } else {
            // Fallback navigation
            this.router.navigate(['/admin-dashboard']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log('Login error:', err);

          // Parse error response
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else if (err.status === 401) {
            this.errorMessage = 'Invalid credentials or role mismatch. Please check your email, password, and selected role.';
          } else if (err.status === 400) {
            this.errorMessage = 'Invalid input. Please fill in all fields correctly.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }

          // Mark all fields as error if credentials are wrong
          if (err.status === 401) {
            this.errorFields['email'] = 'Invalid credentials';
            this.errorFields['password'] = 'Invalid credentials';
            this.errorFields['role'] = 'Invalid credentials';
          }

          this.showError = true;
        },
        complete: () => {
          console.log("Login request completed");
        }
      }
    );
  }

  // Email validation helper
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Close error message
  closeError() {
    this.showError = false;
    this.errorMessage = '';
    this.errorFields = {};
  }
}

