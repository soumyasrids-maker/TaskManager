import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project.Model';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {
    this.apiUrl = this.configService.getBackendUrl() + '/api/projects';
  }

  // CREATE - Add a new project
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  // READ - Get all projects
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // READ - Get a project by ID
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  // UPDATE - Update an existing project
  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  // DELETE - Delete a project
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
