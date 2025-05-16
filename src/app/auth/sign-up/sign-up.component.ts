import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {SignUpForm} from '../..//interfaces/form-control.interface'
import { AuthService } from '../../data-access/auth.service';
import { Credential } from '../../interfaces/credentials.interface';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  hide = true;
  errorMessage: string | null = null;

  formBuilder = inject(FormBuilder);

  form: FormGroup<SignUpForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
    storeName: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    })
  })

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get storeName() {
    return this.form.controls.storeName;
  }

  private authService = inject(AuthService);
  private _router = inject(Router);

  async signUp(): Promise<void> {
    if (this.form.invalid) return;

    const credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
      storeName: this.form.value.storeName || ''
    }

    try {
      await this.authService.signUpWithEmailAndPassWord(credential);
      this.errorMessage = null;
      this._router.navigateByUrl('/');
    } catch (error: any) {
      console.error(error);
      this.errorMessage = "Ocurrior un error al registrarse.";

      if(error.code === 'auth/email-already-in-use') {this.errorMessage = "El email ingresado ya esta en uso."}
    }
  }
}
