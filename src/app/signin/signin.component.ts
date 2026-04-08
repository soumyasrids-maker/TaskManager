import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private httpClient:HttpClient, private router:Router, private auth:AuthService) { }

  ngOnInit(): void {
  }

  signin(data:NgForm) {
    this.auth.postSignIn(data.value).subscribe(
      {
        next:(res)=>{
          console.log('Registration successful:', res);
          
          // Extract user from response
          const userFromResponse = res.user || res;
          
          // Store user and token
          this.auth.setUser({
            id: userFromResponse.id,
            name: userFromResponse.name || userFromResponse.email,
            email: userFromResponse.email,
            role: userFromResponse.role,
            permissions: userFromResponse.permissions
          });
          localStorage.setItem('token', res.accessToken ?? '');
          
          console.log('User role:', userFromResponse.role);
          alert('Registration successful! Please log in to continue.');
          // Redirect to login after successful registration
          this.router.navigate(['/login']);
        },
        error:(err)=>{
          console.log('Registration error:', err);
          alert('Registration failed: ' + (err.error?.message || 'Unknown error'));
        },
        complete:()=>{
          console.log("Signin request completed");
        }
      }
    );
  }
  login() {
    this.router.navigate(['/login']);
  }
}

