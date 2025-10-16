import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { APIResponseModel } from '../../model/interface-flight.model';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpClient) {}

  private airportUrl = '/api/Airports';
  private addAirportUrl =
    'https://freeapi.miniprojectideas.com/api/FlightBooking/AddUpdateBulkAirports';

  getAllAirports(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.airportUrl}/GetAllAirports`);
  }

  addAirports(airports: any[]): Observable<any> {
    return this.http.post<any>(this.addAirportUrl, airports);
  }
}
