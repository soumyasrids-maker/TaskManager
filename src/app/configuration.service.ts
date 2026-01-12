import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private apiUrl: string = 'http://localhost:3000';

  getApiUrl(): string {
    return this.apiUrl;
  }
  constructor() { }
}
