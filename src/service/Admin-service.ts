import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import status from "http-status";
import * as TwilioSDK from "twilio";

import { AdminInput, DriverUpdateInput, LoginInput, Rides, RidesAssignedUpdate } from "../intrefaces";
import { utils} from "../utils/utilities";
import { AdminRepository } from "../repository/index";
import { AppError, ServiceError } from "../utils/Errors";
import httpStatus from "http-status";


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
        throw new ServiceError("NOT_FOUND","User with email didnt found",httpStatus.NOT_FOUND)
      }

      const passwordMatch = await bcrypt.compare(
        data.password,
        findAdmin.password
      );

      if (!passwordMatch) {
        throw new AppError("Password Incorrect","Invalid Password",httpStatus.UNAUTHORIZED);
      }
      const { adminId, name } = findAdmin;
      const token = this.generateToken({ adminId, name });

      return token;
    } catch (error) {
      throw error
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
      // const messageData =await this.sendSms(data) //this will send SMS
      // return messageData;
      return false;
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

  async updateDriverDetails(id:string,updateFields:DriverUpdateInput){
    try {
      const user=await this.adminService.updateDriverDetails(id,updateFields);
      return user;
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
      console.log(message)
      //@ts-ignore
      if (message.code) {
        throw new ServiceError("SMS NOT SENT","Not able to send sms to driver",status.INTERNAL_SERVER_ERROR);
      }

      if (!message.body) {
        throw new ServiceError("SMS NOT SENT","Not able to send sms to driver",status.INTERNAL_SERVER_ERROR);
      }

      return message.body ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async updateRideAsCompleted(rideId:string){
    try {
      const details=await this.adminService.updateRideAsCompleted(rideId);
      return details;
    } catch (error) {
      throw error
    }
  }

  async updateAssignRides(rideId:string,data:RidesAssignedUpdate){
    try {
      const updated=await this.adminService.updateAssignedRides(rideId,data);
      if(data.Driver_ID){
        const sendSms=await this.sendSms(updated);
        return sendSms;
      }
      return updated?true:false;
    } catch (error) {
      throw error
    }
  }
}
