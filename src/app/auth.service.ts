import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.Model';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl!: string;
  constructor(private httpClient:HttpClient, private config:ConfigurationService) { 
    this.baseUrl=this.config.getApiUrl();
  }

  postSignIn(data:User){
    return this.httpClient.post<User>(`${this.baseUrl}/register`,data);
  }

  postLogin(data:User){
    return this.httpClient.post<User>(`${this.baseUrl}/login`,data);
  }

  // Store user data in localStorage
  setUser(user:any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user data from localStorage
  getUser(){
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get user role
  getUserRole(){
    const user = this.getUser();
    return user ? user.role : null;
  }

  // Check if user has permission
  hasPermission(permission: string): boolean {
    const user = this.getUser();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }

  // Logout
  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

