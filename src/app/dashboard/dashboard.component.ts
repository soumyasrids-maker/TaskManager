import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Dashboard Statistics
  totalProjects: number = 12;
  activeProjects: number = 8;
  totalTeams: number = 5;
  totalTasks: number = 45;
  completedTasks: number = 28;
  pendingTasks: number = 17;
  newNotifications: number = 3;

  // Projects Section Data
  projects: any[] = [
    { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 65, dueDate: '2025-02-15' },
    { id: 2, name: 'Mobile App Development', status: 'In Progress', progress: 45, dueDate: '2025-03-20' },
    { id: 3, name: 'API Integration', status: 'Pending', progress: 20, dueDate: '2025-02-28' },
    { id: 4, name: 'Database Migration', status: 'On Hold', progress: 30, dueDate: '2025-04-10' }
  ];

  // Teams Section Data
  teams: any[] = [
    { id: 1, name: 'Frontend Team', members: 5, lead: 'John Doe' },
    { id: 2, name: 'Backend Team', members: 4, lead: 'Jane Smith' },
    { id: 3, name: 'Design Team', members: 3, lead: 'Mike Johnson' },
    { id: 4, name: 'QA Team', members: 3, lead: 'Sarah Williams' }
  ];

  // Tasks Section Data
  tasks: any[] = [
    { id: 1, title: 'Fix login bug', priority: 'High', status: 'In Progress', assignee: 'John' },
    { id: 2, title: 'Update documentation', priority: 'Medium', status: 'Pending', assignee: 'Jane' },
    { id: 3, title: 'Code review', priority: 'High', status: 'In Progress', assignee: 'Mike' },
    { id: 4, title: 'Performance optimization', priority: 'Medium', status: 'Pending', assignee: 'Sarah' },
    { id: 5, title: 'UI improvements', priority: 'Low', status: 'Pending', assignee: 'John' }
  ];

  // Notifications Section Data
  notifications: any[] = [
    { id: 1, message: 'Project "Website Redesign" updated', timestamp: '2 hours ago', type: 'info' },
    { id: 2, message: 'Task assigned: Fix login bug', timestamp: '4 hours ago', type: 'warning' },
    { id: 3, message: 'Team member added to Backend Team', timestamp: '1 day ago', type: 'info' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Get Bootstrap badge class based on status
   */
  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'on hold':
        return 'secondary';
      case 'completed':
        return 'success';
      default:
        return 'info';
    }
  }

  /**
   * Get Bootstrap badge class based on priority
   */
  getPriorityBadgeClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  }

}
