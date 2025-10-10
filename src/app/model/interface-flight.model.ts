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
  employeeId: number;
  employeeName: string;
  deptId: number;
  deptName: string;
  contactNo: string;
  emailId: string;
  role: string;
  password: string;
  gender: string;
}

export interface APIResponseModel {
  message: string;
  result: boolean;
  data: string;
}
