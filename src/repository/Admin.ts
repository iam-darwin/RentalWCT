import bcrypt from "bcryptjs";
import status from "http-status";
import fs from "fs";
import * as csv from "fast-csv";
import { prisma } from "../config/Connectdb";
import {
  AdminInput,
  AdminUpdateInput,
  DriverUpdateInput,
  RideUpdateData,
} from "../interfaces/index";
import { AppError, ServiceError } from "../utils/Errors/index";
import { calculateCost, excludeFields } from "../utils/helper";
import httpStatus from "http-status";
import {
  UserRideType,
  updateBodyPayment,
  updateUserRide,
} from "../config/validations";

export default class AdminRepository {
  async createAdmin(details: AdminInput) {
    try {
      const existingUser = await prisma.admin.findUnique({
        where: {
          email: details.email,
        },
      });
      if (existingUser) {
        throw new AppError(
          "Admin exists",
          "Admin already exists with the email",
          httpStatus.CONFLICT
        );
      }
      const hashedPassword = await bcrypt.hash(details.password, 10);
      const user = await prisma.admin.create({
        data: { ...details, password: hashedPassword },
      });

      return user;
    } catch (error) {
      //@ts-ignore
      throw error;
    }
  }

  async getAdminByEmail(email: string) {
    try {
      const user = await prisma.admin.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new ServiceError(
          "NOT_FOUND",
          "User with email not found",
          httpStatus.NOT_FOUND
        );
      }
      return user;
    } catch (error) {
      //@ts-ignore
      throw error;
    }
  }

  async getActiveDrivers() {
    try {
      const active = await prisma.driver.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          driverID: true,
          driverFirstName: true,
        },
      });
      return active;
    } catch (error) {
      throw error;
    }
  }

  async getAllDriverDetails() {
    try {
      const drivers = await prisma.driver.findMany({
        include: {
          payments: {
            select: {
              paymentID: true,
            },
          },
        },
      });
      return drivers;
    } catch (error) {
      throw error;
    }
  }

  async getDriver(id: string) {
    try {
      const driver = await prisma.driver.findUnique({
        where: {
          driverID: id,
        },
        select: {
          driverID: true,
          driverFirstName: true,
          driverAddress: true,
          driverPhoneNumber1: true,
          driverSSN: true,
          payments: true,
          driverLicense: true,
          lastPaymentDate: true,
        },
      });

      if (!driver) {
        throw new ServiceError(
          "DriverId undefined",
          "Driver with this Id is not present in the database",
          status.NOT_FOUND
        );
      }
      return driver;
    } catch (error) {
      throw error;
    }
  }

  async uploadCsvFile(filePath: string) {
    try {
      const stream = fs
        .createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on("data", async (ride) => {
          const present = await prisma.rides_Kaizen.findUnique({
            where: {
              RideID: ride["Ride ID"],
            },
          });

          if (!present) {
            await prisma.rides_Kaizen.create({
              data: {
                RideID: ride["Ride ID"],
                Ride_Status: ride["Status"],
                Ride_Date: ride["Ride Date"],
                Customer_FirstName: ride["First Name"],
                Customer_LastName: ride["Last Name"],
                Phone_Number: ride["Phone"],
                Transportation_Type: ride["Transportation Type"],
                Cancel_Reason: ride["Cancel Reason"],
                Cost: ride["Cost"],
                Pick_Up_Time: ride["Pick Up Time"],
                Arrival_Time: ride["Arrival Time"],
                Estimated_Arrival_Time: ride["Estimated Arrival Time"],
                Scheduled_Pickup_Time: ride["Scheduled Pickup Time"],
                Estimated_Distance: ride["Estimated Distance"],
                Pickup_Address: ride["Pickup Address"],
                Pickup_Lat: ride["Pickup Lat"],
                Pickup_Lng: ride["Pickup Lng"],
                Pickup_Directions: ride["Pickup Directions"],
                Dropoff_Address: ride["Dropoff Address"],
                Dropoff_Lat: ride["Dropoff Lat"],
                Dropoff_Lng: ride["Dropoff Lng"],
                Dropoff_Directions: ride["Dropoff Directions"],
                Driver_FirstName: ride["Driver First Name"],
                Driver_Photo_Url: ride["Driver Photo Url"],
                Driver_Phone: ride["Driver Phone"],
                Vehicle_Color: ride["Vehicle Color"],
                Vehicle_Make: ride["Vehicle Make"],
                Vehicle_Model: ride["Vehicle Model"],
                Vehicle_License: ride["Vehicle License"],
                Vehicle_Photo_Url: ride["Vehicle Photo Url"],
                Provider_Name: ride["Provider Name"],
                Provider_Trip_Id: ride["Provider Trip Id"],
                Rider_Patient_ID: ride["Rider/Patient ID"],
                Member_ID: ride["Member ID"],
              },
            });

            await prisma.rides.create({
              data: {
                RideID: ride["Ride ID"],
                Ride_Status: ride["Status"],
                Ride_Date: ride["Ride Date"],
                Customer_FirstName: ride["First Name"],
                Customer_LastName: ride["Last Name"],
                Phone_Number: ride["Phone"],
                Transportation_Type: ride["Transportation Type"],
                Cancel_Reason: ride["Cancel Reason"],
                Cost: ride["Cost"],
                Pick_Up_Time: ride["Pick Up Time"],
                Arrival_Time: ride["Arrival Time"],
                Estimated_Arrival_Time: ride["Estimated Arrival Time"],
                Scheduled_Pickup_Time: ride["Scheduled Pickup Time"],
                Estimated_Distance: ride["Estimated Distance"],
                Pickup_Address: ride["Pickup Address"],
                Pickup_Lat: ride["Pickup Lat"],
                Pickup_Lng: ride["Pickup Lng"],
                Pickup_Directions: ride["Pickup Directions"],
                Dropoff_Address: ride["Dropoff Address"],
                Dropoff_Lat: ride["Dropoff Lat"],
                Dropoff_Lng: ride["Dropoff Lng"],
                Dropoff_Directions: ride["Dropoff Directions"],
                Provider_Trip_Id: ride["Provider Trip Id"],
                Rider_Patient_ID: ride["Rider/Patient ID"],
                Driver_ID: "NULL",
              },
            });
          } else {
            await prisma.rides_Kaizen.update({
              where: {
                RideID: ride["Ride ID"],
              },
              data: {
                RideID: ride["Ride ID"],
                Ride_Status: ride["Status"],
                Ride_Date: ride["Ride Date"],
                Customer_FirstName: ride["First Name"],
                Customer_LastName: ride["Last Name"],
                Phone_Number: ride["Phone"],
                Transportation_Type: ride["Transportation Type"],
                Cancel_Reason: ride["Cancel Reason"],
                Cost: ride["Cost"],
                Pick_Up_Time: ride["Pick Up Time"],
                Arrival_Time: ride["Arrival Time"],
                Estimated_Arrival_Time: ride["Estimated Arrival Time"],
                Scheduled_Pickup_Time: ride["Scheduled Pickup Time"],
                Estimated_Distance: ride["Estimated Distance"],
                Pickup_Address: ride["Pickup Address"],
                Pickup_Lat: ride["Pickup Lat"],
                Pickup_Lng: ride["Pickup Lng"],
                Pickup_Directions: ride["Pickup Directions"],
                Dropoff_Address: ride["Dropoff Address"],
                Dropoff_Lat: ride["Dropoff Lat"],
                Dropoff_Lng: ride["Dropoff Lng"],
                Dropoff_Directions: ride["Dropoff Directions"],
                Driver_FirstName: ride["Driver First Name"],
                Driver_Photo_Url: ride["Driver Photo Url"],
                Driver_Phone: ride["Driver Phone"],
                Vehicle_Color: ride["Vehicle Color"],
                Vehicle_Make: ride["Vehicle Make"],
                Vehicle_Model: ride["Vehicle Model"],
                Vehicle_License: ride["Vehicle License"],
                Vehicle_Photo_Url: ride["Vehicle Photo Url"],
                Provider_Name: ride["Provider Name"],
                Provider_Trip_Id: ride["Provider Trip Id"],
                Rider_Patient_ID: ride["Rider/Patient ID"],
                Member_ID: ride["Member ID"],
              },
            });

            await prisma.rides.update({
              where: {
                RideID: ride["Ride ID"],
              },
              data: {
                RideID: ride["Ride ID"],
                Ride_Status: ride["Status"],
                Ride_Date: ride["Ride Date"],
                Customer_FirstName: ride["First Name"],
                Customer_LastName: ride["Last Name"],
                Phone_Number: ride["Phone"],
                Transportation_Type: ride["Transportation Type"],
                Cancel_Reason: ride["Cancel Reason"],
                Cost: ride["Cost"],
                Pick_Up_Time: ride["Pick Up Time"],
                Arrival_Time: ride["Arrival Time"],
                Estimated_Arrival_Time: ride["Estimated Arrival Time"],
                Scheduled_Pickup_Time: ride["Scheduled Pickup Time"],
                Estimated_Distance: ride["Estimated Distance"],
                Pickup_Address: ride["Pickup Address"],
                Pickup_Lat: ride["Pickup Lat"],
                Pickup_Lng: ride["Pickup Lng"],
                Pickup_Directions: ride["Pickup Directions"],
                Dropoff_Address: ride["Dropoff Address"],
                Dropoff_Lat: ride["Dropoff Lat"],
                Dropoff_Lng: ride["Dropoff Lng"],
                Dropoff_Directions: ride["Dropoff Directions"],
                Provider_Trip_Id: ride["Provider Trip Id"],
                Rider_Patient_ID: ride["Rider/Patient ID"],
                Driver_ID: "NULL",
              },
            });
          }
        })
        .on("end", async () => {
          fs.unlinkSync(filePath);
        });
      stream.on("error", (error) => {
        console.error(error);
        throw new ServiceError(
          "Something went wrong",
          "Not able to upload file to database",
          status.INTERNAL_SERVER_ERROR
        );
      });
      return "Successfully Uploaded";
    } catch (error) {
      throw error;
    }
  }

  async getUnAssignedRides() {
    try {
      const details = await prisma.rides.findMany({
        where: {
          Ride_Status: {
            in: ["UPCOMING", "PENDING_UPDATE"],
          },
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
        },
      });
      return details;
    } catch (error) {
      throw error;
    }
  }

  async assignRideToDriver(rideID: string, driverId: string) {
    try {
      //update as ASSIGNED in the database

      const updated = await prisma.rides.findUnique({
        where: {
          RideID: rideID,
        },
      });

      if (!updated) {
        throw new ServiceError(
          "Ride Not Available",
          "Not able to assign unavailable ride,rideId not present in the DB",
          status.NOT_FOUND
        );
      }

      const driver = await prisma.driver.findUnique({
        where: {
          driverID: driverId,
        },
      });
      if (!driver) {
        throw new ServiceError(
          "Driver Not Available",
          "Not able to assign ride to someone who's not present in db",
          status.NOT_FOUND
        );
      }

      const rideCost = calculateCost(updated.Estimated_Distance);

      const ride = await prisma.rides.update({
        where: {
          RideID: rideID,
        },
        data: {
          Ride_Status: "ASSIGNED",
          Driver_ID: driverId,
          Cost: rideCost,
        },
      });
      return ride;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedRides() {
    try {
      const details = await prisma.rides.findMany({
        where: {
          Ride_Status: {
            in: ["ASSIGNED"],
          },
        },
        select: {
          RideID: true,
          Ride_Date: true,
          Ride_Status: true,
          Customer_FirstName: true,
          Customer_LastName: true,
          Phone_Number: true,
          Transportation_Type: true,
          Pick_Up_Time: true,
          Arrival_Time: true,
          Estimated_Distance: true,
          Driver_ID: true,
          Cost: true,
        },
      });
      return details;
    } catch (error) {
      throw error;
    }
  }

  async updateDriverDetails(id: string, updateFields: DriverUpdateInput) {
    try {
      // Check if the user with the provided ID exists
      const user = await prisma.driver.findUnique({
        where: {
          driverID: id,
        },
      });

      // Check if the email is already taken
      if (updateFields.email) {
        const userEmail = await prisma.driver.findUnique({
          where: {
            email: updateFields.email,
          },
        });

        if (userEmail && userEmail.driverID !== id) {
          throw new AppError(
            "Email already taken",
            "A user with this email already exists",
            httpStatus.CONFLICT
          );
        }
      }

      // If the user does not exist, throw an error
      if (!user) {
        throw new ServiceError(
          "User Not Found",
          "Not able to update driver details",
          status.NOT_FOUND
        );
      }

      // Update driver details
      const updateDetails = await prisma.driver.update({
        where: {
          driverID: id,
        },
        data: updateFields,
      });

      // Check if the update was successful
      if (!updateDetails) {
        throw new ServiceError(
          "Driver Not updated",
          "Details not updated",
          status.INTERNAL_SERVER_ERROR
        );
      }

      return updateDetails;
    } catch (error) {
      // Handle errors appropriately, e.g., log them or rethrow
      console.error("Error updating driver details:", error);
      throw error;
    }
  }

  async updateRideAsCompleted(rideId: string) {
    try {
      const rideFound = await prisma.completedRides.findUnique({
        where: {
          RideID: rideId,
        },
      });

      if (rideFound) {
        throw new AppError(
          "Ride Already Completed",
          "You can't mark again as completed because the ride is already completed",
          httpStatus.CONFLICT
        );
      }

      const completedRides = await prisma.$transaction(async (prismaClient) => {
        const updateRide = await prismaClient.rides.update({
          where: {
            RideID: rideId,
          },
          data: {
            Ride_Status: "COMPLETED",
          },
        });

        const updateDetails = excludeFields(updateRide, [
          "createdAt",
          "updatedAt",
        ]);

        const completedRidesResult = await prismaClient.completedRides.create({
          //@ts-ignore
          data: updateDetails,
        });

        return completedRidesResult;
      });

      return completedRides;
    } catch (error) {
      throw error;
    }
  }

  async updateAssignedRides(rideData: RideUpdateData) {
    try {
      const updated = await prisma.rides.findUnique({
        where: {
          RideID: rideData.rideId,
        },
      });

      if (!updated) {
        throw new ServiceError(
          "Ride Not Available",
          "Not able to assign unavailable ride,rideId not present in the DB",
          status.NOT_FOUND
        );
      }

      const driver = await prisma.driver.findUnique({
        where: {
          driverID: rideData.driverId,
        },
      });
      if (!driver) {
        throw new ServiceError(
          "Driver Not Available",
          "Not able to assign ride to someone who's not present in db",
          status.NOT_FOUND
        );
      }

      const rideUpdate = await prisma.rides.update({
        where: {
          RideID: rideData.rideId,
        },
        data: {
          Driver_ID: rideData.driverId,
        },
      });

      if (!rideUpdate) {
        throw new ServiceError(
          "Not able to update",
          "Update failed",
          status.BAD_REQUEST
        );
      }

      return rideUpdate;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedRides() {
    try {
      const rides = await prisma.completedRides.findMany();
      return rides;
    } catch (error) {
      throw error;
    }
  }

  async getCancelledRides() {
    try {
      const data = await prisma.rides.findMany({
        where: {
          Ride_Status: "CANCELLED",
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(emailId: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await prisma.admin.update({
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

  async getAllAdmins() {
    try {
      const admins = await prisma.admin.findMany();
      if (!admins) {
        throw new AppError(
          "Fetching failed",
          "Database error",
          httpStatus.BAD_REQUEST
        );
      }
      return admins;
    } catch (error) {
      throw error;
    }
  }

  async deleteAdminWithID(id: string) {
    try {
      const findAdmin = await prisma.admin.findUnique({
        where: {
          adminId: id,
        },
      });
      if (!findAdmin) {
        throw new AppError(
          "Admin not present",
          "Admin not present in DB which you want to delete",
          httpStatus.CONFLICT
        );
      }
      const value = await prisma.admin.delete({
        where: {
          adminId: id,
        },
      });
      if (!value) {
        throw new AppError(
          "Admin Not Found",
          "Admin with the id not found",
          httpStatus.NOT_FOUND
        );
      }
      return value;
    } catch (error) {
      throw error;
    }
  }

  async updateAdmin(id: string, adminData: AdminUpdateInput) {
    try {
      const findAdmin = await prisma.admin.findFirst({
        where: {
          adminId: id,
        },
      });

      if (!findAdmin)
        throw new AppError(
          "Admin not found",
          "Admin is not present in DB",
          httpStatus.NOT_FOUND
        );

      const admins = await prisma.admin.update({
        where: {
          adminId: id,
        },
        data: adminData,
      });

      return admins;
    } catch (error) {
      throw error;
    }
  }

  async createPayment(
    driverId: string,
    paid: number,
    date?: string,
    feedBack?: string
  ) {
    try {
      const payment = await prisma.$transaction(async (prismaClient) => {
        const findDriver = await prismaClient.driver.findUnique({
          where: {
            driverID: driverId,
          },
        });

        if (!findDriver) {
          throw new Error(`Driver with ID ${driverId} not found`);
        }

        let payment;
        if (date) {
          payment = await prismaClient.payment.create({
            data: {
              driverID: driverId,
              amount: paid,
              paymentDate: new Date(date).toISOString(),
              remarks: feedBack ? feedBack : "null",
            },
          });
        } else {
          payment = await prismaClient.payment.create({
            data: {
              driverID: driverId,
              amount: paid,
              paymentDate: new Date().toISOString(),
              remarks: feedBack ? feedBack : "null",
            },
          });
        }

        await prismaClient.driver.update({
          where: {
            driverID: driverId,
          },
          data: {
            lastPaymentDate: new Date(payment.paymentDate).toString(),
          },
        });

        return payment;
      });

      return payment;
    } catch (error) {
      throw error;
    }
  }

  async getAllPayments() {
    try {
      const payments = await prisma.payment.findMany();
      return payments;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentByDriverId(driverId: string) {
    try {
      const payment = await prisma.payment.findMany({
        where: {
          driverID: driverId,
        },
      });

      return payment;
    } catch (error) {
      throw error;
    }
  }

  async updatePayment(paymentId: string, values: updateBodyPayment) {
    try {
      const findFirst = await prisma.payment.findUnique({
        where: {
          paymentID: paymentId,
        },
      });
      if (!findFirst) {
        throw new AppError(
          "PaymentId undefined",
          "PaymentId details not present in database",
          httpStatus.CONFLICT
        );
      }
      const data: { paymentDate?: string; remarks?: string; amount?: number } =
        {};

      if (values.date !== undefined) {
        data.paymentDate = new Date(values.date).toISOString();
      }

      if (values.remarks !== undefined) {
        data.remarks = values.remarks;
      }
      if (values.amount !== undefined) {
        data.amount = Number(values.amount);
      }
      const updatedPayment = await prisma.payment.update({
        where: {
          paymentID: paymentId,
        },
        data: data,
      });

      return updatedPayment;
    } catch (error) {
      throw error;
    }
  }

  async getFormDataUnchecked() {
    try {
      const alldetails = await prisma.contactUsForm.findMany({
        where: {
          status: "NOT_CHECKED",
        },
      });
      return alldetails;
    } catch (error) {
      throw error;
    }
  }

  async updateFormContacted(id: string) {
    try {
      const findFirst = await prisma.contactUsForm.findUnique({
        where: {
          contactID: id,
        },
      });
      if (!findFirst) {
        throw new AppError(
          "ID Not available",
          "contact id is not present in DB",
          httpStatus.CONFLICT
        );
      }
      const data = await prisma.contactUsForm.update({
        where: {
          contactID: id,
        },
        data: {
          status: "CHECKED",
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getFormDataChecked() {
    try {
      const alldetails = await prisma.contactUsForm.findMany({
        where: {
          status: "CHECKED",
        },
      });
      return alldetails;
    } catch (error) {
      throw error;
    }
  }

  async addUserRide(userRideData: UserRideType) {
    try {
      const userRide = await prisma.userRide.create({
        //@ts-ignore
        data: userRideData,
      });
      return userRide;
    } catch (error) {
      throw error;
    }
  }

  async getUnassignedUserRides() {
    try {
      const data = await prisma.userRide.findMany({
        where: {
          rideStatus: "PENDING UPDATE",
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async assignUserRideToDriver(rideID: string, driverID: string) {
    try {
      const updated = await prisma.userRide.findUnique({
        where: {
          rideId: Number(rideID),
        },
      });

      if (!updated) {
        throw new ServiceError(
          "Ride Not Available",
          "Not able to assign unavailable ride",
          status.INTERNAL_SERVER_ERROR
        );
      }

      const ride = await prisma.userRide.update({
        where: {
          rideId: Number(rideID),
        },
        data: {
          rideStatus: "ASSIGNED",
          driverId: driverID,
        },
      });

      return ride;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedUserRides() {
    try {
      const details = await prisma.userRide.findMany({
        where: {
          rideStatus: {
            in: ["ASSIGNED"],
          },
        },
      });
      if (!details) {
        throw new ServiceError(
          "Something went wrong",
          "Not able to fetch details",
          status.INTERNAL_SERVER_ERROR
        );
      }
      return details;
    } catch (error) {
      throw error;
    }
  }

  async updateAssignedUserRides(rideData: updateUserRide) {
    try {
      const rideUpdate = await prisma.userRide.update({
        where: {
          rideId: Number(rideData.rideId),
        },
        data: {
          driverId: rideData.driverId,
        },
      });

      if (!rideUpdate) {
        throw new ServiceError(
          "Not able to update",
          "Update failed",
          status.BAD_REQUEST
        );
      }

      return rideUpdate;
    } catch (error) {
      throw error;
    }
  }

  async updateUserRideAsCompleted(rideID: string) {
    try {
      const findIfItsAssigned = await prisma.userRide.findUnique({
        where: {
          rideId: Number(rideID),
        },
      });
      if (findIfItsAssigned?.rideStatus !== "ASSIGNED") {
        throw new AppError(
          "Ride is not assigned",
          "For completeing the ride, first it should be assigned",
          httpStatus.BAD_REQUEST
        );
      }
      const completedRide = await prisma.userRide.update({
        where: {
          rideId: Number(rideID),
        },
        data: {
          rideStatus: "COMPLETED",
        },
      });

      return completedRide;
    } catch (error) {
      throw error;
    }
  }

  async updateUserRideAsCancelled(rideID: string) {
    try {
      const completedRide = await prisma.userRide.update({
        where: {
          rideId: Number(rideID),
        },
        data: {
          rideStatus: "CANCELLED",
        },
      });

      return completedRide;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedUserRides() {
    try {
      const rides = await prisma.userRide.findMany({
        where: {
          rideStatus: {
            in: ["COMPLETED"],
          },
        },
      });
      return rides;
    } catch (error) {
      throw error;
    }
  }

  async getCancelledUserRides() {
    try {
      const rides = await prisma.userRide.findMany({
        where: {
          rideStatus: {
            in: ["CANCELLED"],
          },
        },
      });
      return rides;
    } catch (error) {
      throw error;
    }
  }
}
