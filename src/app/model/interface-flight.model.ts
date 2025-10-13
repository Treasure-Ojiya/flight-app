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

// export class AirportModel {
//   constructor(
//     public airportCode: string,
//     public airportId: number,
//     public airportName: string,
//     public cityId: number,
//     public cityName: string
//   ) {}
// }
