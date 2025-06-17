// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { RoleGuard } from './auth/role.guard';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { ProjectFormComponent } from './pages/projects/project-form/project-form.component';
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'projects',
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: ProjectListComponent },
      { path: 'new', component: ProjectFormComponent },
      { path: 'edit/:id', component: ProjectFormComponent },
    ],
  },
  {
  path: 'projects/:id/tasks',
  loadComponent: () =>
    import('./pages/tasks/task-list/task-list.component').then(m => m.TaskListComponent),
}
];
