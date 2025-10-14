export class RegistrationModel {
  constructor(
    public name: string,
    public mobileNo: string,
    public email: string,
    public city: string,
    public address: string,
    public password: string
  ) {}
}

export class LoginModel {
  constructor(public email = '', public password = '') {}
}

export class AddAirportModel {
  constructor(
    public airportId: number,
    public airportCode: string,
    public airportName: string,
    public cityId: number
  ) {}
}

export interface AirportList {
  airportCode: string;
  airportId: number;
  airportName: string;
  cityId: number;
  cityName: string;
}

export interface APIResponseModel {
  message: string;
  result: boolean;
  data: any;
}

export interface FlightList {
  flightId: number;
  flightNumber: string;
  arrivalTime: string;
  departureTime: string;
  price: 44450;
  totalSeats: 5;
  arrivalAirportName: string;
  arrivalAirportCode: string;
  departureAirportName: string;
  departureAirportCode: string;
  vendorName: string;
  vendorLogoUrl: string;
  travelDate: string;
}

export class BookingModel {
  constructor(
    public flightId: number,
    public customerId: number,
    public bookingDate: '2025-10-13T09:28:06.931Z',
    public totalAmount: number,
    public FlightBookingTravelers: [
      {
        travelerName: string;
        contactNo: string;
        aadharNo: string;
        seatNo: number;
      }
    ]
  ) {}
}

// export class AirportModel {
//   constructor(
//     public airportCode: string,
//     public airportId: number,
//     public airportName: string,
//     public cityId: number,
//     public cityName: string
//   ) {}
// }
