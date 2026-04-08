import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { TeamsComponent } from './teams/teams.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AdminGuard } from './admin.guard';
import { EmployeeGuard } from './employee.guard';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'signin',component:SigninComponent},
  {path:'employee-dashboard', component:EmployeeDashboardComponent, canActivate: [EmployeeGuard]},
  {
    path:'admin-dashboard', 
    component:AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {path:'dashboard', component:DashboardComponent},
      {path:'projects', component:ProjectsComponent},
      {path:'teams', component:TeamsComponent},
      {path:'tasks', component:TasksComponent},
      {path:'notifications', component:NotificationsComponent},
      {path:'', redirectTo:'dashboard', pathMatch:'full'}
    ]
  },
  {path: '**', redirectTo: 'login'}  // Catch-all for undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
