import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TasksService } from '../tasks/tasks.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  currentUser: any;
  assignedTasks: any[] = [];
  filteredTasks: any[] = [];
  isLoading: boolean = false;
  statusFilter: string = 'All';
  searchQuery: string = '';

  // Statistics properties
  completedTasksCount: number = 0;
  inProgressTasksCount: number = 0;
  pendingTasksCount: number = 0;

  constructor(
    private auth: AuthService,
    private tasksService: TasksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAssignedTasks();
  }

  loadAssignedTasks(): void {
    this.isLoading = true;
    this.tasksService.getTasks().subscribe(
      (data) => {
        // Filter tasks assigned to the current user
        this.assignedTasks = data.filter((task: any) => 
          task.assignedTo && task.assignedTo.toLowerCase() === this.currentUser.name.toLowerCase()
        );
        this.filteredTasks = [...this.assignedTasks];
        this.updateStatistics();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading tasks', error);
        this.isLoading = false;
      }
    );
  }

  updateStatistics(): void {
    this.completedTasksCount = this.assignedTasks.filter(t => t.status === 'Completed').length;
    this.inProgressTasksCount = this.assignedTasks.filter(t => t.status === 'In Progress').length;
    this.pendingTasksCount = this.assignedTasks.filter(t => t.status === 'Pending').length;
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  searchTasks(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTasks = this.assignedTasks.filter((task: any) => {
      const statusMatch = this.statusFilter === 'All' || task.status === this.statusFilter;
      const searchMatch = task.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
    this.updateStatistics();
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'Completed':
        return 'bg-success';
      case 'In Progress':
        return 'bg-primary';
      case 'Pending':
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch(priority) {
      case 'High':
        return 'bg-danger';
      case 'Medium':
        return 'bg-warning';
      case 'Low':
        return 'bg-success';
      default:
        return 'bg-light';
    }
  }

  markAsComplete(taskId: number): void {
    const task = this.assignedTasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'Completed';
      task.progress = 100;
      this.tasksService.updateTask(taskId, task).subscribe(
        (updatedTask) => {
          const index = this.filteredTasks.findIndex(t => t.id === taskId);
          if (index !== -1) {
            this.filteredTasks[index] = updatedTask;
          }
        },
        (error) => console.error('Error updating task', error)
      );
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
