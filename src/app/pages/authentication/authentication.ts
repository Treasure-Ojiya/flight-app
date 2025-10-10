import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/authService/auth-service';
import {
  LoginModel,
  RegistrationModel,
} from '../../model/interface-flight.model';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authentication.html',
  styleUrls: ['./authentication.css'],
})
export class Authentication {
  isLogin = true;
  loader = false;

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  // --- Login Form ---
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // --- Register Form ---
  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    mobileNo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    address: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // --- Switch Tabs ---
  showLoginForm() {
    this.isLogin = true;
  }
  showRegisterForm() {
    this.isLogin = false;
  }

  // --- LOGIN LOGIC ---
  onLogin() {
    console.log('onLogin() called');
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loader = true;
    const loginData = this.loginForm.value as LoginModel;

    this.authService.loginUser(loginData).subscribe({
      next: (res: any) => {
        this.loader = false;
        console.log('Response from backend:', res);

        if (res.result) {
          localStorage.setItem('user', JSON.stringify(res.data));
          console.log('User saved in localStorage:', res.data);

          this.router.navigate(['/home']);
        } else {
          console.log(' Login failed:', res.message);
        }
      },
      error: (error) => {
        this.loader = false;
        console.error('Login API error:', error);
      },
    });
  }

  // --- REGISTER LOGIC ---
  onRegister() {
    console.log('Register button clicked');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loader = true;
    const registerData = this.registerForm.value as RegistrationModel;

    this.authService.registerUser(registerData).subscribe({
      next: (res: any) => {
        this.loader = false;
        console.log('Register API response:', res);

        if (res.result) {
          localStorage.setItem('user', JSON.stringify(res.data));
          console.log('User registered and saved:', res.data);

          this.router.navigate(['/home']);
        } else {
          console.log('Registration failed:', res.message);
        }
      },
      error: (error) => {
        this.loader = false;
        console.error('Registration API error:', error);
      },
    });
  }
}
