import bcrypt from "bcryptjs";
import status from "http-status";

import { prisma } from "../config/Connectdb";
import { DriverInput } from "../intrefaces";
import { AppError, ServiceError } from "../utils/Errors";

export default class DriverRepository {
  async createDriver(details: DriverInput) {
    try {
      const existingDriver = await prisma.driver.findFirst({
        where: {
          OR: [
            { email: details.email },
            { vehicleLicense: details.vehicleLicense },
            { driverLicense: details.driverLicense },
            { driverSSN: details.driverSSN },
          ],
        },
      });

      if(existingDriver){
        throw new ServiceError("User Exists","Driver with these details already exists",status.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(details.password, 10);

      const driver = await prisma.driver.create({
        data: {
          driverFirstName: details.driverFirstName,
          driverLastName: details.driverLastName,
          email: details.email,
          password: hashedPassword,
          driverAddress: details.driverAddress,
          driverPhoneNumber1: details.driverPhoneNumber1,
          driverPhoneNumber2: details.driverPhoneNumber2,
          driverLicense: details.driverLicense,
          driverSSN: details.driverSSN,
          vehicleColor: details.vehicleColor,
          vehicleLicense: details.vehicleLicense,
          vehicleMake: details.vehicleMake,
          vehicleModel: details.vehicleModel,
          payments: {
            connect: [],
          },
        },
        include: {
          payments: true,
        },
      });

      if(!driver){
        throw new ServiceError("Failed to create","Not able to create Driver",status.INTERNAL_SERVER_ERROR);
      }

      return driver;
    } catch (error) {
       throw error;
    }
  }

  async getEmail(email:string){
    try {
      const emailUser=await prisma.driver.findUnique({
        where:{
          email
        }
      })

      return emailUser;
    } catch (error) {
      throw error
    }


  }

  async getAssignedRides(driverId:string){ //driver checking his website after getting message
    try {
      const rides=await prisma.rides.findMany({
        where:{
          Driver_ID:driverId,
          Ride_Status:'ASSIGNED'
        }
      })

      return rides
    } catch (error) {
      throw error      
    }
  }

  async getCompletedRides(driverId:string){
    try {
      const rides=await prisma.completedRides.findMany({
        where:{
            Driver_ID:driverId,
            Ride_Status:'COMPLETED'
        },
        select:{
          RideID:true,
          Ride_Status:true,
          Ride_Date:true,
          Customer_FirstName:true,
          Customer_LastName:true,
          Phone_Number:true,
          Transportation_Type:true,
          Pick_Up_Time:true,
          Arrival_Time:true,
          Estimated_Distance:true,
          Pickup_Address:true,
          Dropoff_Address:true,
          Pickup_Directions:true,
          Cost:true
        }
      })
      return rides;
    } catch (error) {
      
    }
  }
}
