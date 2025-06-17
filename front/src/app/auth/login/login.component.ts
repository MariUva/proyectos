import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, AuthRequest } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoadingService } from '../../shared/loading.service';
import { LoadingOverlayComponent } from '../../shared/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingOverlayComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const data: AuthRequest = this.form.value;
    this.loadingService.show('Validando credenciales...');

    this.auth.login(data).subscribe({
      next: res => {
        this.loadingService.close();
        this.auth.saveToken(res.token);
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Inicio de sesión exitoso',
          confirmButtonText: 'Continuar'
        }).then(() => {
          const role = this.auth.getUserRole();
          this.router.navigate(['/projects']);
        });
      },
      error: err => {
        this.loadingService.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Credenciales incorrectas',
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
