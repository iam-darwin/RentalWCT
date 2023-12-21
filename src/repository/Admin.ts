import bcrypt from "bcryptjs";
import status from "http-status";
import fs from "fs";
import * as csv from "fast-csv";

import { prisma } from "../config/Connectdb";
import { AdminInput } from "../intrefaces/index";
import { AppError } from "../utils/Errors/index";

export default class AdminRepository {
  async createAdmin(details: AdminInput) {
    try {
      const hashedPassword = await bcrypt.hash(details.password, 10);

      const existingUser = await prisma.admin.findUnique({
        where: {
          email: details.email,
        },
      });

      if (existingUser) {
        throw new Error("User_Exists");
      }

      const user = await prisma.admin.create({
        data: {
          name: details.name,
          email: details.email,
          password: hashedPassword,
        },
      });

      console.log("Admin user created:", user);

      return user;
    } catch (error) {
      //@ts-ignore
      if (error.name == "PrismaClientKnownRequestError") {
        throw new AppError(
          "Client Error",
          "User email already exists",
          status.CONFLICT
        );
      }
      //@ts-ignore
      if (error.message == "User_Exists") {
        throw new AppError(
          "Admin Exits",
          "admin already exits with the email",
          status.CONFLICT
        );
      }
    }
  }

  async getAdminByEmail(email: string) {
    try {
      const user = await prisma.admin.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {}
  }

  async getActiverDrivers() {
    try {
      const active = await prisma.driver.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          driverID: true,
          driverLastName: true,
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
          payments: true,
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
                Driver_ID:"NULL"
              }

            });
          } else {
            await prisma.rides_Kaizen.update({
              where: {
                RideID: ride["Ride ID"],
              },
              data: {
                Ride_Status: ride["Status"],
              },
            });

            await prisma.rides.update({
              where: {
                RideID: ride["Ride ID"],
              },
              data: {
                Ride_Status: ride["Status"],
              },
            });

          }
        })
        .on("end", async () => {
          fs.unlinkSync(filePath);
        });
      stream.on("error", (error) => {
        console.error(error);
        throw new Error("File_Upload");
      });
      return "successFully Uploaded";
    } catch (error) {
      //@ts-ignore
      if (error.message == "File_Upload") {
        throw new AppError(
          "FILE_NOT_UPLOADED",
          "File upload unsucessfull",
          status.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
