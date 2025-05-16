import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogInForm } from '../../interfaces/form-control.interface';
import { NgClass } from '@angular/common';
import { AuthService } from '../../data-access/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  hide = true;
  errorMessage: null | string = null;

  formBuilder = inject(FormBuilder);

  formLogIn: FormGroup<LogInForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    })
  })

  get email() {
    return this.formLogIn.controls.email;
  }

  get password() {
    return this.formLogIn.controls.password;
  }

  private authService = inject(AuthService);
  private _router = inject(Router);

  async logIn(): Promise<void> {
    if (this.formLogIn.invalid) return;

    const credential = {
      email: this.formLogIn.value.email || '',
      password: this.formLogIn.value.password || '',
    }

    try {
      await this.authService.logInWithEmailAndPassword(credential);
      this._router.navigateByUrl('/');
    } catch (error: any) {
      console.error(error.code);
      if (error.code === 'auth/invalid-credential') { this.errorMessage = 'El correo o la contraseña son incorrectos, intente nuevamente.'}
    }
  }
}
