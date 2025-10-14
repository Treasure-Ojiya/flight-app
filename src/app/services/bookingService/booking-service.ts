import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponseModel } from '../../model/interface-flight.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getAllCustomer(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      'https://freeapi.miniprojectideas.com/api/FlightBooking/GetAllCustomer'
    );
  }

  bookticket(bookingData: any): Observable<any> {
    return this.http.post<any>(
      'https://freeapi.miniprojectideas.com/api/FlightBooking/BookTicket',
      bookingData
    );
  }
}
