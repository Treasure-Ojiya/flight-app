import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponseModel } from '../../model/interface-flight.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  private bookingUrl = '/.netlify/functions/bookingService';

  getAllCustomer() {
    return this.http.get<APIResponseModel>(this.bookingUrl);
  }

  bookticket(data: any) {
    return this.http.post<any>(this.bookingUrl, data);
  }
}
