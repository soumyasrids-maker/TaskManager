import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { TeamsComponent } from './teams/teams.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotificationsComponent } from './notifications/notifications.component';
const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'signin',component:SigninComponent},
  {
    path:'admin-dashboard', 
    component:AdminDashboardComponent,
    children: [
      {path:'dashboard', component:DashboardComponent},
      {path:'projects', component:ProjectsComponent},
      {path:'teams', component:TeamsComponent},
      {path:'tasks', component:TasksComponent},
      {path:'notifications', component:NotificationsComponent},
      {path:'', redirectTo:'dashboard', pathMatch:'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
