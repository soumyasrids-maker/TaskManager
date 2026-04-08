import { Component, OnInit } from '@angular/core';
import { TasksService } from './tasks.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: any[] = [];
  employees: any[] = [];
  showForm: boolean = false;
  editingTaskId: number | null = null;
  currentUser: any;
  isAdmin: boolean = false;
  isEmployee: boolean = false;
  
  newTask = {
    title: '',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: '',
    startDate: '',
    dueDate: '',
    progress: 0,
    description: '',
    assignedBy: ''
  };

  constructor(
    private tasksService: TasksService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.isAdmin = this.currentUser?.role?.toLowerCase() === 'admin';
    this.isEmployee = this.currentUser?.role?.toLowerCase() === 'employee';
    
    // Load employees for assignment dropdown if admin
    if (this.isAdmin) {
      this.getEmployees();
    }
    
    this.getTasks();
  }

  getTasks(): void {
    if (this.isEmployee && this.currentUser?.email) {
      // For employees, show only tasks assigned to them
      this.tasksService.getTasksByAssignee(this.currentUser.email).subscribe(
        (data) => this.tasks = data,
        (error) => console.error('Error fetching tasks', error)
      );
    } else if (this.isAdmin && this.currentUser?.email) {
      // For admins, show all tasks they created
      this.tasksService.getTasks().subscribe(
        (data) => this.tasks = data,
        (error) => console.error('Error fetching tasks', error)
      );
    } else {
      // Fallback: show all tasks
      this.tasksService.getTasks().subscribe(
        (data) => this.tasks = data,
        (error) => console.error('Error fetching tasks', error)
      );
    }
  }

  getEmployees(): void {
    this.tasksService.getEmployees().subscribe(
      (data) => {
        this.employees = data;
        console.log('Employees loaded:', data);
      },
      (error) => console.error('Error fetching employees', error)
    );
  }

  openForm(): void {
    this.showForm = true;
    this.editingTaskId = null;
    this.resetForm();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTaskId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newTask = {
      title: '',
      priority: 'Medium',
      status: 'Pending',
      assignedTo: '',
      startDate: '',
      dueDate: '',
      progress: 0,
      description: '',
      assignedBy: this.currentUser?.email || ''
    };
  }

  submitForm(): void {
    if (!this.newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (this.isAdmin && !this.newTask.assignedTo) {
      alert('Please select an employee to assign the task to');
      return;
    }

    if (!this.newTask.progress && this.newTask.progress !== 0) {
      this.newTask.progress = 0;
    }

    // Ensure assignedBy is set
    if (!this.newTask.assignedBy) {
      this.newTask.assignedBy = this.currentUser?.email || '';
    }

    if (this.editingTaskId !== null) {
      this.updateTask(this.editingTaskId, this.newTask);
    } else {
      this.addTask(this.newTask);
    }
  }

  addTask(task: any): void {
    this.tasksService.createTask(task).subscribe(
      (newTask) => {
        this.tasks.push(newTask);
        this.closeForm();
        alert('Task created successfully');
      },
      (error) => {
        console.error('Error adding task', error);
        alert('Error adding task: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    );
  }

  editTask(id: number): void {
    const taskToEdit = this.tasks.find(t => t.id === id);
    if (taskToEdit) {
      this.editingTaskId = id;
      this.newTask = { ...taskToEdit };
      this.showForm = true;
    }
  }

  updateTask(id: number, task: any): void {
    this.tasksService.updateTask(id, task).subscribe(
      (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.closeForm();
        alert('Task updated successfully');
      },
      (error) => console.error('Error updating task', error)
    );
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasksService.deleteTask(id).subscribe(
        () => {
          this.tasks = this.tasks.filter(t => t.id !== id);
          alert('Task deleted successfully');
        },
        (error) => console.error('Error deleting task', error)
      );
    }
  }

  // Get employee email or name for display
  getEmployeeName(email: string): string {
    const employee = this.employees.find(e => e.email === email);
    return employee ? employee.name || email : email;
  }
}
