import bcrypt from "bcryptjs";
import status from "http-status";

import { prisma } from "../config/Connectdb";
import { DriverInput } from "../interfaces";
import { AppError, ServiceError } from "../utils/Errors";
import httpStatus from "http-status";
import { excludeFields } from "../utils/helper";

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
      const existingFields = [];
      if (existingDriver) {
        if (existingDriver.email === details.email) {
          existingFields.push("Email");
        }
        if (existingDriver.vehicleLicense === details.vehicleLicense) {
          existingFields.push("Vehicle License");
        }
        if (existingDriver.driverLicense === details.driverLicense) {
          existingFields.push("Driver License");
        }
        if (existingDriver.driverSSN === details.driverSSN) {
          existingFields.push("Driver SSN");
        }
        const errorMessage = `Driver with these details already exists. Change fields: ${existingFields.join(
          ", "
        )}`;
        throw new ServiceError("User Exists", errorMessage, status.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(details.password, 10);

      const last5SSNnumbers = details.driverSSN.substring(
        details.driverSSN.length - 5
      );

      const driver = await prisma.driver.create({
        data: {
          driverID: last5SSNnumbers,
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

      if (!driver) {
        throw new ServiceError(
          "Failed to create",
          "Not able to create Driver",
          status.INTERNAL_SERVER_ERROR
        );
      }

      return driver;
    } catch (error) {
      throw error;
    }
  }

  async getEmail(email: string) {
    try {
      const emailUser = await prisma.driver.findUnique({
        where: {
          email,
        },
      });
      if (!emailUser) {
        throw new ServiceError(
          "Email Not found",
          "User not present in db",
          status.UNAUTHORIZED
        );
      }
      return emailUser;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedRides(driverId: string) {
    //driver checking his website after getting message
    try {
      const rides = await prisma.rides.findMany({
        where: {
          Driver_ID: driverId,
          Ride_Status: "ASSIGNED",
        },
      });

      return rides;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedRides(driverId: string) {
    try {
      const rides = await prisma.completedRides.findMany({
        where: {
          Driver_ID: driverId,
          Ride_Status: "COMPLETED",
        },
        select: {
          RideID: true,
          Ride_Status: true,
          Ride_Date: true,
          Customer_FirstName: true,
          Customer_LastName: true,
          Phone_Number: true,
          Transportation_Type: true,
          Pick_Up_Time: true,
          Arrival_Time: true,
          Estimated_Distance: true,
          Pickup_Address: true,
          Dropoff_Address: true,
          Pickup_Directions: true,
          Cost: true,
        },
      });
      return rides;
    } catch (error) {}
  }

  async checkPayments(driverId: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          driverID: driverId,
        },
      });

      return payments;
    } catch (error) {
      throw error;
    }
  }

  async getDetails(driverId: string) {
    try {
      const driver = await prisma.driver.findUnique({
        where: {
          driverID: driverId,
        },
      });
      //@ts-ignore
      const updateDetails = excludeFields(driver, ["createdAt", "updatedAt"]);
      return updateDetails;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(emailId: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await prisma.driver.update({
        where: {
          email: emailId,
        },
        data: {
          password: hashedPassword,
        },
      });
      if (!existingUser) {
        throw new AppError(
          "Admin Not Exits",
          "User with EmailId do not exits",
          httpStatus.INTERNAL_SERVER_ERROR
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedUserRides(driverId: string) {
    try {
      const data = await prisma.userRide.findMany({
        where: {
          driverId: driverId,
          rideStatus: "ASSIGNED",
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedUserRides(driverId: string) {
    try {
      const data = await prisma.userRide.findMany({
        where: {
          driverId: driverId,
          rideStatus: "COMPLETED",
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
