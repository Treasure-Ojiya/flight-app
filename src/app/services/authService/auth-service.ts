import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import {
  LoginModel,
  RegistrationModel,
} from '../../model/interface-flight.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private regUrl = '/api/FlightBooking';
  private loginUrl = '/api/FlightBooking';

  isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  // --- Register User ---
  registerUser(user: RegistrationModel): Observable<any> {
    return this.http.post<any>(`${this.regUrl}/Register`, user);
  }

  // --- Login User ---
  loginUser(user: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/Login`, user).pipe(
      tap((response) => {
        if (response.message && response.data) {
          this.saveUser(response.data);
        }
      })
    );
  }

  // --- Save user data (the `data` field) ---
  saveUser(userData: any): void {
    localStorage.setItem('user', JSON.stringify(userData));
    this.isLoggedIn$.next(true);
  }

  // --- Get user data ---
  getUser(): any {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user?.customerId || user?.userId || null;
  }

  // --- Check login status ---
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  // --- Logout ---
  logout(): void {
    localStorage.removeItem('user');
    this.isLoggedIn$.next(false);
  }
}
