# Complete Code Implementation Reference

## 📁 File Structure

```
TaskManager/
├── /Applications/TaskManager/                    [BACKEND - Spring Boot]
│   └── src/main/java/com/pack/capstone/
│       ├── Controller/
│       │   └── ProjectController.java            [NEW - REST API Endpoints]
│       ├── Entity/
│       │   └── Projects.java                     [EXISTING]
│       └── repository/
│           └── ProjectRepo.java                  [EXISTING]
│
└── /Users/d.soumyasri/TaskManager/              [FRONTEND - Angular]
    ├── src/app/
    │   ├── project.Model.ts                      [NEW - Project Interface]
    │   ├── project.service.ts                    [MODIFIED - CRUD Methods]
    │   ├── configuration.service.ts              [MODIFIED - Backend URL]
    │   └── projects/
    │       ├── projects.component.ts             [MODIFIED - Component Logic]
    │       ├── projects.component.html           [MODIFIED - UI Template]
    │       └── projects.component.css            [UNCHANGED]
    │
    ├── PROJECT_CRUD_GUIDE.md                     [NEW - Detailed Guide]
    ├── PROJECT_CRUD_QUICKSTART.md                [NEW - Quick Reference]
    ├── CRUD_IMPLEMENTATION_SUMMARY.md            [NEW - This Summary]
    └── API_TESTING_COMMANDS.sh                   [NEW - Testing Script]
```

---

## 🔍 Complete Code Reference

### 1. Project Model (Frontend)

**File:** `src/app/project.Model.ts`

```typescript
export class Project {
    id?: number;
    projectname?: string;
    status?: string;
    progress?: number;
    teamlead?: string;
}
```

---

### 2. Project Service (Frontend)

**File:** `src/app/project.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project.Model';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl: string = '';

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
```

---

### 3. Configuration Service (Frontend)

**File:** `src/app/configuration.service.ts`

```typescript
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
```

---

### 4. Projects Component (TypeScript)

**File:** `src/app/projects/projects.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from '../project.Model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  newProject: Project = {};
  selectedProject: Project = {};
  showForm: boolean = false;
  isEditMode: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  // Load all projects from backend
  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.errorMessage = 'Failed to load projects from backend';
      }
    });
  }

  // Open form to create a new project
  openCreateForm(): void {
    this.newProject = {};
    this.isEditMode = false;
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Open form to edit an existing project
  openEditForm(project: Project): void {
    this.selectedProject = { ...project };
    this.newProject = { ...project };
    this.isEditMode = true;
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Create a new project
  createProject(): void {
    if (!this.newProject.projectname || !this.newProject.status) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.projectService.createProject(this.newProject).subscribe({
      next: (data: Project) => {
        this.projects.push(data);
        this.showForm = false;
        this.newProject = {};
        this.successMessage = 'Project created successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.errorMessage = 'Failed to create project';
      }
    });
  }

  // Update an existing project
  updateProject(): void {
    if (!this.newProject.id) {
      this.errorMessage = 'Project ID is missing';
      return;
    }

    if (!this.newProject.projectname || !this.newProject.status) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.projectService.updateProject(this.newProject.id, this.newProject).subscribe({
      next: (data: Project) => {
        const index = this.projects.findIndex(p => p.id === data.id);
        if (index > -1) {
          this.projects[index] = data;
        }
        this.showForm = false;
        this.newProject = {};
        this.successMessage = 'Project updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.errorMessage = 'Failed to update project';
      }
    });
  }

  // Delete a project
  deleteProject(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Project ID is missing';
      return;
    }

    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== id);
          this.successMessage = 'Project deleted successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.errorMessage = 'Failed to delete project';
        }
      });
    }
  }

  // Cancel form
  cancelForm(): void {
    this.showForm = false;
    this.newProject = {};
    this.selectedProject = {};
    this.isEditMode = false;
    this.errorMessage = '';
  }

  // Submit form (create or update)
  submitForm(): void {
    if (this.isEditMode) {
      this.updateProject();
    } else {
      this.createProject();
    }
  }
}
```

---

### 5. Project Controller (Backend)

**File:** `src/main/java/com/pack/capstone/Controller/ProjectController.java`

```java
package com.pack.capstone.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pack.capstone.Entity.Projects;
import com.pack.capstone.repository.ProjectRepo;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {

    @Autowired
    private ProjectRepo projectRepo;

    // CREATE - Add a new project
    @PostMapping
    public ResponseEntity<Projects> createProject(@RequestBody Projects project) {
        Projects savedProject = projectRepo.save(project);
        return ResponseEntity.status(201).body(savedProject);
    }

    // READ - Get all projects
    @GetMapping
    public ResponseEntity<List<Projects>> getAllProjects() {
        List<Projects> projects = projectRepo.findAll();
        return ResponseEntity.ok(projects);
    }

    // READ - Get a project by ID
    @GetMapping("/{id}")
    public ResponseEntity<Projects> getProjectById(@PathVariable Long id) {
        Optional<Projects> project = projectRepo.findById(id);
        if (project.isPresent()) {
            return ResponseEntity.ok(project.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE - Update an existing project
    @PutMapping("/{id}")
    public ResponseEntity<Projects> updateProject(
            @PathVariable Long id,
            @RequestBody Projects projectDetails) {
        Optional<Projects> project = projectRepo.findById(id);
        if (project.isPresent()) {
            Projects existingProject = project.get();
            if (projectDetails.getProjectname() != null) {
                existingProject.setProjectname(projectDetails.getProjectname());
            }
            if (projectDetails.getStatus() != null) {
                existingProject.setStatus(projectDetails.getStatus());
            }
            if (projectDetails.getProgress() != null) {
                existingProject.setProgress(projectDetails.getProgress());
            }
            if (projectDetails.getTeamlead() != null) {
                existingProject.setTeamlead(projectDetails.getTeamlead());
            }
            Projects updatedProject = projectRepo.save(existingProject);
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Delete a project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        Optional<Projects> project = projectRepo.findById(id);
        if (project.isPresent()) {
            projectRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
```

---

### 6. Projects Component Template

**File:** `src/app/projects/projects.component.html`

```html
<div class="container-fluid py-5">
  <div class="row mb-4">
    <div class="col-12">
      <h1 class="display-4 fw-bold mb-2">Projects</h1>
      <p class="text-muted">Manage and track all your projects in one place.</p>
    </div>
  </div>

  <!-- Messages -->
  <div class="row mb-4" *ngIf="successMessage">
    <div class="col-12">
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ successMessage }}
        <button type="button" class="btn-close" (click)="successMessage = ''"></button>
      </div>
    </div>
  </div>

  <div class="row mb-4" *ngIf="errorMessage">
    <div class="col-12">
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="row mb-4">
    <div class="col-12">
      <button class="btn btn-primary me-2" (click)="openCreateForm()" *ngIf="!showForm">
        <span>➕</span> New Project
      </button>
    </div>
  </div>

  <!-- Create/Edit Form -->
  <div class="row mb-4" *ngIf="showForm">
    <div class="col-12">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-light border-bottom">
          <h5 class="mb-0">{{ isEditMode ? 'Edit Project' : 'Create New Project' }}</h5>
        </div>
        <div class="card-body">
          <form (ngSubmit)="submitForm()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="projectName" class="form-label">Project Name *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="projectName" 
                  [(ngModel)]="newProject.projectname"
                  name="projectname"
                  placeholder="Enter project name"
                  required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="teamLead" class="form-label">Team Lead *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="teamLead" 
                  [(ngModel)]="newProject.teamlead"
                  name="teamlead"
                  placeholder="Enter team lead name"
                  required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="status" class="form-label">Status *</label>
                <select 
                  class="form-select" 
                  id="status" 
                  [(ngModel)]="newProject.status"
                  name="status"
                  required>
                  <option value="">-- Select Status --</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="progress" class="form-label">Progress (%)</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="progress" 
                  [(ngModel)]="newProject.progress"
                  name="progress"
                  min="0"
                  max="100"
                  placeholder="0-100">
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary">
                {{ isEditMode ? 'Update Project' : 'Create Project' }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Projects Table/Cards -->
  <div class="row">
    <div class="col-12">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-light border-bottom">
          <h5 class="mb-0">All Projects ({{ projects.length }})</h5>
        </div>
        <div class="card-body p-0" *ngIf="projects.length > 0">
          <!-- Responsive Table -->
          <div class="table-responsive d-none d-md-block">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Team Lead</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let project of projects">
                  <td><strong>{{ project.projectname }}</strong></td>
                  <td>
                    <span class="badge" 
                      [ngClass]="project.status === 'Completed' ? 'bg-success' : 
                                 project.status === 'In Progress' ? 'bg-primary' : 
                                 project.status === 'On Hold' ? 'bg-warning' : 'bg-secondary'">
                      {{ project.status }}
                    </span>
                  </td>
                  <td>
                    <div class="progress" style="height: 20px;">
                      <div class="progress-bar" [style.width.%]="project.progress || 0">
                        {{ project.progress || 0 }}%
                      </div>
                    </div>
                  </td>
                  <td>{{ project.teamlead }}</td>
                  <td>
                    <button class="btn btn-sm btn-info me-2" (click)="openEditForm(project)">Edit</button>
                    <button class="btn btn-sm btn-danger" (click)="deleteProject(project.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Mobile Card View -->
          <div class="d-md-none p-3">
            <div class="card mb-3 border" *ngFor="let project of projects">
              <div class="card-body">
                <h6 class="card-title">{{ project.projectname }}</h6>
                <p class="card-text">
                  <span class="badge" 
                    [ngClass]="project.status === 'Completed' ? 'bg-success' : 
                               project.status === 'In Progress' ? 'bg-primary' : 
                               project.status === 'On Hold' ? 'bg-warning' : 'bg-secondary'">
                    {{ project.status }}
                  </span>
                </p>
                <p class="card-text">
                  <small class="text-muted">Team Lead: {{ project.teamlead }}</small>
                </p>
                <div class="progress mb-2" style="height: 20px;">
                  <div class="progress-bar" [style.width.%]="project.progress || 0">
                    {{ project.progress || 0 }}%
                  </div>
                </div>
                <div class="mt-2">
                  <button class="btn btn-sm btn-info me-2" (click)="openEditForm(project)">Edit</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteProject(project.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="card-body text-center py-5" *ngIf="projects.length === 0">
          <p class="text-muted mb-3">No projects found.</p>
          <button class="btn btn-primary" (click)="openCreateForm()">
            <span>➕</span> Create Your First Project
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 📊 Entity Classes (Backend)

### Projects Entity

**File:** `src/main/java/com/pack/capstone/Entity/Projects.java`

```java
package com.pack.capstone.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Projects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_name", nullable = false)
    private String projectname;

    @Column(name = "status")
    private String status;

    @Column(name = "progress")
    private Integer progress;

    @Column(name = "team_lead")
    private String teamlead;
}
```

---

### Project Repository

**File:** `src/main/java/com/pack/capstone/repository/ProjectRepo.java`

```java
package com.pack.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pack.capstone.Entity.Projects;

public interface ProjectRepo extends JpaRepository<Projects,Long>{

}
```

---

## 🔗 Module Imports

### app.module.ts

Ensure these imports are present:

```typescript
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// In imports array:
imports: [
  BrowserModule,
  AppRoutingModule,
  HttpClientModule,
  FormsModule,
  // ... other imports
]
```

---

## ✅ Verification Checklist

After implementation, verify:

- [x] `project.Model.ts` exists and exports Project class
- [x] `project.service.ts` has all 5 CRUD methods
- [x] `configuration.service.ts` has `getBackendUrl()` method
- [x] `ProjectController.java` exists with all 5 endpoints
- [x] `projects.component.ts` has all methods and properties
- [x] `projects.component.html` renders correctly
- [x] Backend server runs on `http://localhost:8080`
- [x] Frontend server runs on `http://localhost:4200`
- [x] Database connection works
- [x] CORS is configured for frontend origin

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Status:** ✅ Complete
