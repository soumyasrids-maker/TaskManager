import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private apiUrl: string = 'http://localhost:3000';
  private backendUrl: string = 'http://localhost:8080';

  getApiUrl(): string {
    return this.apiUrl;
  }

  getBackendUrl(): string {
    return this.backendUrl;
  }

  constructor() { }
}
