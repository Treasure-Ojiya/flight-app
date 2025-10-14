import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Booking } from './pages/booking/booking';
import { Flights } from './pages/flights/flights';
import { Vendors } from './pages/vendors/vendors';
import { Customers } from './pages/customers/customers';
import { Airports } from './pages/airports/airports';
import { Authentication } from './pages/authentication/authentication';
import { AuthGuard } from './services/authGuard/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home }, // ← Add guard
  { path: 'authentication', component: Authentication },
  { path: 'flights', component: Flights, canActivate: [AuthGuard] },
  { path: 'booking/:flightId', component: Booking, canActivate: [AuthGuard] },
  { path: 'customers', component: Customers, canActivate: [AuthGuard] },
  { path: 'vendor', component: Vendors, canActivate: [AuthGuard] },
  { path: 'airports', component: Airports, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }, // ← Optional: wildcard route
];
