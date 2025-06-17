import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { LoadingService } from '../../../shared/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit {
  project: Project = {
    name: '',
    description: '',
    state: 'PENDIENTE',
  };

  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadingService.show('Cargando proyecto...');
      this.projectService.getAll().subscribe({
        next: (projects) => {
          const found = projects.find((p) => p.id === +id);
          if (found) {
            this.project = found;
          } else {
            Swal.fire('Error', 'Proyecto no encontrado', 'error');
            this.router.navigate(['/projects']);
          }
          this.loadingService.close();
        },
        error: () => {
          this.loadingService.close();
          Swal.fire('Error', 'No se pudo cargar el proyecto', 'error');
          this.router.navigate(['/projects']);
        },
      });
    }
  }

  save(): void {
    this.loadingService.show(this.isEditMode ? 'Actualizando proyecto...' : 'Creando proyecto...');

    const action$ = this.isEditMode && this.project.id
      ? this.projectService.update(this.project.id, this.project)
      : this.projectService.create(this.project);

    action$.subscribe({
      next: () => {
        this.loadingService.close();
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Proyecto actualizado' : 'Proyecto creado',
          confirmButtonText: 'Aceptar'
        }).then(() => this.router.navigate(['/projects']));
      },
      error: () => {
        this.loadingService.close();
        Swal.fire('Error', 'Ocurrió un error al guardar el proyecto', 'error');
      }
    });
  }

  cancel(): void {
    Swal.fire({
      title: '¿Deseas salir sin guardar?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/projects']);
      }
    });
  }
}
