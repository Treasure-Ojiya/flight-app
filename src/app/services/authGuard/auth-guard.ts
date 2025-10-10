import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const user = localStorage.getItem('user');

    if (user) {
      return true; // User is authenticated
    } else {
      this.router.navigate(['/authentication']); // redirect to login
      return false;
    }
  }
}
