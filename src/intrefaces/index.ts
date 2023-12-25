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

export interface Rides{
  RideID:string,
  Ride_Date:string,
  Customer_FirstName:string,
  Customer_LastName:string,
  Phone_Number:string,
  Scheduled_Pickup_Time:string,
  Estimated_Arrival_Time:string,
  Estimated_Distance:string,
  Dropoff_Directions:string
  Pickup_Address:string,
  Dropoff_Address:string
}

export interface RidesAssignedUpdate{
  Ride_Status?:string,
  Driver_ID?:string
}

export interface DriverUpdateInput{
  driverFirstName?:string,
  driverLastName?:string,
  email?:string,
  driverAddress?:string,
  driverPhoneNumber1?:string,
  driverPhoneNumber2?:string,
  vehicleColor?:string,
  vehicleMake?:string,
  vehicleModel?:string,
  vehicleLicense?:string,
  driverSSN?:string,
  driverLicense?:string
}
