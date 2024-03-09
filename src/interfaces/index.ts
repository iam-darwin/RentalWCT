import { string } from "zod";

export interface AdminInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface DriverInput {
  driverFirstName: string;
  driverLastName: string;
  email: string;
  password: string;
  driverAddress: string;
  driverPhoneNumber1: string;
  driverPhoneNumber2: string;
  vehicleColor: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleLicense: string;
  driverSSN: string;
  driverLicense: string;
}

export interface Rides {
  RideID: string;
  Ride_Date: string;
  Customer_FirstName: string;
  Customer_LastName: string;
  Phone_Number: string;
  Scheduled_Pickup_Time: string;
  Estimated_Arrival_Time: string;
  Estimated_Distance: string;
  Dropoff_Directions: string;
  Pickup_Address: string;
  Dropoff_Address: string;
  Cost: string;
}

export interface UserRideTypeSMS {
  rideId: number;
  firstName: string;
  lastName: string;
  rideDate: string;
  pickUpAddress: string;
  dropOffAddress: string;
  phoneNumber: string;
  pickUpTime: string;
  instructions: string;
}

export interface RidesAssignedUpdate {
  rideId: string;
  Driver_ID: string;
}

export interface RideUpdateData {
  driverId: string;
  rideId: string;
}

export interface DriverUpdateInput {
  driverFirstName?: string;
  driverLastName?: string;
  email?: string;
  driverAddress?: string;
  driverPhoneNumber1?: string;
  driverPhoneNumber2?: string;
  vehicleColor?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleLicense?: string;
  driverSSN?: string;
  driverLicense?: string;
  password?: string;
}

export interface AdminUpdateInput {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}
