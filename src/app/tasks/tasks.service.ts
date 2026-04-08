import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private jsonServerUrl = 'http://localhost:3000/tasks';
  private backendUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  // Get all tasks from JSON server
  getTasks(): Observable<any> {
    return this.http.get<any[]>(this.jsonServerUrl);
  }

  // Get tasks assigned to a specific user
  getTasksByAssignee(assigneeEmail: string): Observable<any[]> {
    return this.getTasks().pipe(
      map((tasks: any[]) => tasks.filter((task: any) => task.assignedTo && task.assignedTo.toLowerCase() === assigneeEmail.toLowerCase()))
    );
  }

  // Get all tasks assigned by a specific user (for admin view)
  getTasksByAssignedBy(assignerEmail: string): Observable<any[]> {
    return this.getTasks().pipe(
      map((tasks: any[]) => tasks.filter((task: any) => task.assignedBy && task.assignedBy.toLowerCase() === assignerEmail.toLowerCase()))
    );
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.jsonServerUrl}/${id}`);
  }

  createTask(task: any): Observable<any> {
    // Add auto-increment ID and timestamp
    return this.getTasks().pipe(
      map((tasks: any[]) => {
        const maxId = tasks.length > 0 ? Math.max(...tasks.map((t: any) => t.id)) : 0;
        return {
          ...task,
          id: maxId + 1,
          createdAt: new Date().toISOString().split('T')[0]
        };
      }),
      switchMap(taskWithId => this.http.post(this.jsonServerUrl, taskWithId))
    );
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.jsonServerUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.jsonServerUrl}/${id}`);
  }

  // Get list of employees for assignment dropdown
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/users').pipe(
      map(users => users.filter(user => user.role && user.role.toLowerCase() === 'employee'))
    );
  }
}