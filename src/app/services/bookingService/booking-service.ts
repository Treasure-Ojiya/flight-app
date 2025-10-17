import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponseModel } from '../../model/interface-flight.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  private bookingUrl = '/api/FlightBooking';

  private customerUrl = '/api/FlightBooking';

  getAllCustomer() {
    return this.http.get<APIResponseModel>(
      `${this.customerUrl}/GetAllCustomer`
    );
  }

  bookticket(data: any) {
    return this.http.post<any>(`${this.bookingUrl}/BookTicket`, data);
  }
}
