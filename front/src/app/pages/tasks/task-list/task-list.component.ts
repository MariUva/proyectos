import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { LoadingService } from '../../../shared/loading.service';

import { Task } from '../../../models/task.model';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  projectId!: number;
  project!: Project;
  tasks: Task[] = [];
  newTask: Task = {
    title: '',
    description: '',
    state: 'PENDIENTE',
    completed: false,
    projectId: 0
  };

  taskStates: string[] = ['PENDIENTE', 'EN_CURSO', 'CANCELADO', 'TERMINADO'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private projectService: ProjectService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.newTask.projectId = this.projectId;
    this.loadProject();
  }

  loadProject(): void {
    this.loadingService.show('Cargando proyecto...');
    this.projectService.getById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loadingService.close();
        this.loadTasks();
      },
      error: () => {
        this.loadingService.close();
        Swal.fire('Error', 'No se pudo cargar el proyecto', 'error');
      }
    });
  }

  loadTasks(): void {
    this.loadingService.show('Cargando tareas...');
    this.taskService.getByProject(this.projectId).subscribe({
      next: (data) => {
        this.tasks = data;
        this.loadingService.close();
      },
      error: () => {
        this.loadingService.close();
        Swal.fire('Error', 'No se pudieron cargar las tareas.', 'error');
      }
    });
  }

  getTasksByState(state: string): Task[] {
    return this.tasks.filter(t => t.state === state);
  }

  canCreateTask(): boolean {
    return this.project.state !== 'CANCELADO' && this.project.state !== 'TERMINADO';
  }

  canEditTask(): boolean {
    return this.project.state === 'PENDIENTE' || this.project.state === 'EN_CURSO';
  }

  saveTask(): void {
    if (!this.canCreateTask()) {
      Swal.fire('Prohibido', 'No se pueden crear tareas en un proyecto cerrado o cancelado.', 'warning');
      return;
    }

    if (!this.newTask.id && this.project.state === 'PENDIENTE') {
      this.newTask.state = 'PENDIENTE';
    }

    if (this.newTask.id && this.project.state === 'PENDIENTE' && this.newTask.state !== 'PENDIENTE') {
      Swal.fire('Prohibido', 'No se puede cambiar el estado de una tarea en un proyecto pendiente.', 'warning');
      return;
    }

    this.loadingService.show(this.newTask.id ? 'Actualizando...' : 'Creando...');
    const task$ = this.newTask.id
      ? this.taskService.update(this.newTask.id, this.newTask)
      : this.taskService.create(this.newTask);

    task$.subscribe({
      next: () => {
        this.loadingService.close();
        Swal.fire('✅', 'Tarea guardada con éxito', 'success');
        this.resetForm();
        this.loadTasks();
      },
      error: () => {
        this.loadingService.close();
        Swal.fire('Error', 'No se pudo guardar la tarea', 'error');
      }
    });
  }

  editTask(task: Task): void {
    this.newTask = { ...task };
  }

  deleteTask(id: number): void {
    Swal.fire({
      title: '¿Eliminar tarea?',
      text: 'No se podrá recuperar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show('Eliminando...');
        this.taskService.delete(id).subscribe({
          next: () => {
            this.loadingService.close();
            Swal.fire('Eliminada', 'La tarea fue eliminada.', 'success');
            this.loadTasks();
          },
          error: () => {
            this.loadingService.close();
            Swal.fire('Error', 'No se pudo eliminar', 'error');
          },
        });
      }
    });
  }

  onChangeTaskState(task: Task, newState: string): void {
    if (!this.canEditTask() || this.project.state === 'PENDIENTE') {
      Swal.fire('Prohibido', 'No puedes modificar el estado en este proyecto.', 'warning');
      return;
    }

    const updatedTask: Task = { ...task, state: newState as any };

    this.loadingService.show('Actualizando estado...');
    this.taskService.update(task.id!, updatedTask).subscribe({
      next: () => {
        this.loadingService.close();
        Swal.fire('Actualizado', 'El estado de la tarea fue actualizado.', 'success');
        this.loadTasks();
      },
      error: () => {
        this.loadingService.close();
        Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
      }
    });
  }

  resetForm(): void {
    this.newTask = {
      title: '',
      description: '',
      state: 'PENDIENTE',
      completed: false,
      projectId: this.projectId
    };
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
