import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponseModel } from '../../model/interface-flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor(private http: HttpClient) {}

  private flightUrl = '/.netlify/functions/flightService';

  getAllFlights(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(this.flightUrl);
  }
}
