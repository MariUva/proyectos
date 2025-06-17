// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard'; 

export const appRoutes: Routes = [
  // Página pública opcional
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },

  // Registro
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },

  // Panel del usuario: lista de proyectos
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard] // ✅
  },

  // Tareas de un proyecto específico
  {
    path: 'projects/:id/tasks',
    loadComponent: () =>
      import('./pages/tasks/tasks.component').then((m) => m.TasksComponent),
    canActivate: [authGuard] // ✅
  },

  // Fallback: redirige cualquier otra ruta a la principal
  {
    path: '**',
    redirectTo: ''
  }
];
