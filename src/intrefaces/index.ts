export interface AdminInput {
    name: string;
    email: string;
    password: string;
  }

export interface LoginInput{
  email:string;
  password:string;
}

export interface DriverInput{
  driverFirstName:string,
  driverLastName:string,
  email:string,
  password:string,
  driverAddress:string,
  driverPhoneNumber1:string,
  driverPhoneNumber2:string,
  vehicleColor:string,
  vehicleMake:string,
  vehicleModel:string,
  vehicleLicense:string,
  driverSSN:string,
  driverLicense:string
}