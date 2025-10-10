import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  LoginModel,
  RegistrationModel,
} from '../../model/interface-flight.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private regUrl =
    'https://freeapi.miniprojectideas.com/api/FlightBooking/Register';
  private loginUrl =
    'https://freeapi.miniprojectideas.com/api/FlightBooking/Login';

  isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  // --- Register User ---
  registerUser(user: RegistrationModel): Observable<any> {
    return this.http.post<any>(this.regUrl, user);
  }

  // --- Login User ---
  loginUser(user: LoginModel): Observable<any> {
    return this.http.post<any>(this.loginUrl, user);
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
