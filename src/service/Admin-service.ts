import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import status from "http-status";
import * as TwilioSDK from "twilio";

import { AdminInput, LoginInput, Rides } from "../intrefaces";
import { utils } from "../utils";
import { AdminRepository } from "../repository/index";
import { AppError } from "../utils/Errors";
import { log } from "console";

export default class AdminService {
  private adminService: AdminRepository;
  constructor() {
    this.adminService = new AdminRepository();
  }

  async createAdmin(data: AdminInput) {
    try {
      const adminUser = await this.adminService.createAdmin(data);
      return adminUser;
    } catch (error) {
      //@ts-ignore
      throw error;
    }
  }

  async loginAdmin(data: LoginInput) {
    try {
      const findAdmin = await this.adminService.getAdminByEmail(data.email);

      if (!findAdmin) {
        throw Error("No_Admin");
      }

      const passwordMatch = await bcrypt.compare(
        data.password,
        findAdmin.password
      );

      if (!passwordMatch) {
        throw new Error("Password_Wrong");
      }
      const { adminId, name } = findAdmin;
      const token = this.generateToken({ adminId, name });

      return token;
    } catch (error) {
      //@ts-ignore
      console.log(error.message);
      //@ts-ignore
      console.log("Service layer error :", error.name);
      //@ts-ignore
      if (error.message == "Password_Wrong") {
        throw new AppError(
          "Password_Wrong",
          "Incorrect Password",
          status.UNAUTHORIZED
        );
      }
      //@ts-ignore
      if (error.message == "No_Admin") {
        throw new AppError(
          "Email Invalid",
          "User with email Not found",
          status.NOT_FOUND
        );
      }
    }
  }

  generateToken(data: JwtPayload) {
    return jwt.sign(data, utils.JWT_SECRET, { expiresIn: "1h" });
  }

  async getDrivers() {
    try {
      const drivers = await this.adminService.getAllDriverDetails();
      return drivers;
    } catch (error) {
      throw error;
    }
  }

  async getDriverById(id: string) {
    try {
      const driver = await this.adminService.getDriver(id);
      return driver;
    } catch (error) {
      throw error;
    }
  }

  async getActiveDrivers() {
    try {
      const active = await this.adminService.getActiverDrivers();
      return active;
    } catch (error) {
      throw error;
    }
  }

  async fileUpload(filePath: string) {
    try {
      const upload = await this.adminService.uploadCsvFile(filePath);
      return upload;
    } catch (error) {
      throw error;
    }
  }

  async getUnAssiignedRides() {
    try {
      const rides = await this.adminService.getUnAssignedRides();
      return rides;
    } catch (error) {
      throw error;
    }
  }

  async assginRideToDriver(rideID: string, driverId: string) {
    try {
      const done = await this.adminService.assignRideToDriver(rideID, driverId); //this tas
      if (!done) {
        throw new Error("Ride_not_Assigned");
      }

      const {
        RideID,
        Ride_Date,
        Customer_FirstName,
        Customer_LastName,
        Phone_Number,
        Scheduled_Pickup_Time,
        Estimated_Arrival_Time,
        Estimated_Distance,
        Dropoff_Directions,
        Pickup_Address,
        Dropoff_Address,
      } = done;
      const data: Rides = {
        RideID,
        Ride_Date,
        Customer_FirstName,
        Customer_LastName,
        Phone_Number,
        Scheduled_Pickup_Time,
        Estimated_Arrival_Time,
        Estimated_Distance,
        Dropoff_Directions,
        Pickup_Address,
        Dropoff_Address,
      };
      const messageData = this.sendSms(data).then((messagedata) => messagedata); //this task
      return messageData;
    } catch (error) {
      throw error;
    }
  }

  async getAssignRides(){
    try {
      const rides = await this.adminService.getAssignedRides();
      return rides;
    } catch (error) {
      throw error;
    }
  } 

  private async sendSms(data: Rides) {
    const client = new TwilioSDK.Twilio(utils.accountSid, utils.authToken);

    try {
      const message = await client.messages.create({
        body: `Your ride details
            Customer Name :${data.Customer_FirstName} ${data.Customer_LastName}, PhoneNo: ${data.Phone_Number},PickUpTime:${data.Scheduled_Pickup_Time},ArrivalTime:${data.Estimated_Arrival_Time},Pick Up Address :${data.Pickup_Address},Drop Off Address:${data.Dropoff_Address},Instructions:${data.Dropoff_Directions},Distance :${data.Estimated_Distance} 
            `,
        to: utils.toNumber,
        from: utils.fromNumber,
      });

      log(message);

      //@ts-ignore
      if (message.code) {
        throw new Error("Message_NOT_SENT");
      }

      if (!message.body) {
        throw new Error("Message_not_sent");
      }

      return message.body ? true : false;
    } catch (error) {
      throw error;
    }
  }
}
