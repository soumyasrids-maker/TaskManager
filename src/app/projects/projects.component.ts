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
        this.errorMessage = 'Failed to load projects from backend. Make sure the backend server is running on http://localhost:8080';
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
        
        // Check if error is 409 Conflict (duplicate project)
        if (error.status === 409) {
          this.errorMessage = 'Project already Exists';
        } 
        // Check if error response contains a message
        else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        }
        // Default error message
        else {
          this.errorMessage = 'Failed to create project';
        }
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
        
        // Check if error is 404 Not Found
        if (error.status === 404) {
          this.errorMessage = 'Project not found';
        }
        // Check if error response contains a message
        else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        }
        // Default error message
        else {
          this.errorMessage = 'Failed to update project';
        }
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
          
          // Check if error is 404 Not Found
          if (error.status === 404) {
            this.errorMessage = 'Project not found';
          }
          // Check if error response contains a message
          else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          }
          // Default error message
          else {
            this.errorMessage = 'Failed to delete project';
          }
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
