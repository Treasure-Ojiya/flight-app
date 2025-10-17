import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { APIResponseModel } from '../../model/interface-flight.model';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpClient) {}

  private airportUrl = '/api/FlightBooking';

  getAllAirports(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.airportUrl}/GetAllAirport`);
  }
}
