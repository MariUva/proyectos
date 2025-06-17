import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../../shared/loading.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loadingService.show('Cargando proyectos...');
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.loadingService.close();
      },
      error: (err) => {
        this.loadingService.close();
        Swal.fire('Error', 'No se pudieron cargar los proyectos.', 'error');
        console.error('Error al cargar proyectos', err);
      },
    });
  }

  deleteProject(id: number): void {
    Swal.fire({
      title: '¿Eliminar proyecto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show('Eliminando proyecto...');
        this.projectService.delete(id).subscribe({
          next: () => {
            this.loadingService.close();
            Swal.fire('Eliminado', 'El proyecto fue eliminado.', 'success');
            this.loadProjects();
          },
          error: () => {
            this.loadingService.close();
            Swal.fire('Error', 'No se pudo eliminar el proyecto.', 'error');
          },
        });
      }
    });
  }
}
