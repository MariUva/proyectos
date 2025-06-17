import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" *ngIf="visible">
      <div class="spinner"></div>
      <p>{{ text }}</p>
    </div>
  `,
  styleUrls: ['./loading-overlay.component.css']
})
export class LoadingOverlayComponent implements OnInit, OnDestroy {
  visible = false;
  text = 'Cargando...';
  private sub!: Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.sub = this.loadingService.loading$.subscribe(event => {
      if (event.action === 'show') {
        this.text = event.text ?? 'Cargando...';
        this.visible = true;
      } else {
        this.visible = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
