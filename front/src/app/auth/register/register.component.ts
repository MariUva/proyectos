import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../auth.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../shared/loading.service';
import { LoadingOverlayComponent } from '../../shared/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingOverlayComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      role: ['USER']
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const data: RegisterRequest = this.form.value;
    this.loadingService.show('Registrando cuenta...');

    this.auth.register(data).subscribe({
      next: res => {
        this.loadingService.close();
        Swal.fire({
          icon: 'success',
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente',
          confirmButtonText: 'Ir al login'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: err => {
        this.loadingService.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Ocurrió un error al registrarse',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
