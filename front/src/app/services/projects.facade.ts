import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectService } from './project.service';

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public readonly projects$: Observable<Project[]> = this.projectsSubject.asObservable();

  constructor(private projectService: ProjectService) {}

  loadProjects(): void {
    this.projectService.getAll().subscribe(data => this.projectsSubject.next(data));
  }

  create(project: Project): void {
    this.projectService.create(project).subscribe(() => this.loadProjects());
  }

  update(id: number, project: Project): void {
    this.projectService.update(id, project).subscribe(() => this.loadProjects());
  }

  delete(id: number): void {
    this.projectService.delete(id).subscribe(() => this.loadProjects());
  }
}
