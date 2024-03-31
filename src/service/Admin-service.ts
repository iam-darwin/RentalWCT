import bcrypt from "bcryptjs";
import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import jwt, { JwtPayload } from "jsonwebtoken";
import status from "http-status";
import * as TwilioSDK from "twilio";
import {
  AdminInput,
  AdminUpdateInput,
  AmountTotalPaid,
  DriverUpdateInput,
  LoginInput,
  PaymentData,
  Rides,
  UpdateData,
  UserRideTypeSMS,
  updateDeadHeadAndLoad,
} from "../interfaces";
import { utils } from "../utils/utilities";
import { AdminRepository } from "../repository/index";
import { AppError, ServiceError } from "../utils/Errors";
import httpStatus from "http-status";
import { htmlTemplate } from "../utils/helper";
import { Admin } from "@prisma/client";
import { transporter } from "../config/email";
import { client } from "../config/aws";
import {
  UserRideType,
  updateBodyPayment,
  updateUserRide,
} from "../config/validations";

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

      const passwordMatch = await bcrypt.compare(
        data.password,
        findAdmin.password
      );

      if (!passwordMatch) {
        throw new AppError(
          "Password Incorrect",
          "Invalid Password",
          httpStatus.UNAUTHORIZED
        );
      }
      //@ts-ignore
      const { adminId, name, role } = findAdmin;
      const token = this.generateToken({ adminId, name, role });

      return { token: token, role: findAdmin.role };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(data: JwtPayload) {
    return jwt.sign(data, utils.JWT_SECRET, { expiresIn: "10h" });
  }

  private generateToken5mins(data: JwtPayload) {
    return jwt.sign(data, utils.JWT_SECRET, { expiresIn: "10m" });
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
      const active = await this.adminService.getActiveDrivers();
      return active;
    } catch (error) {
      throw error;
    }
  }

  async fileUpload(filePath: string) {
    try {
      const uploadPromise = this.adminService.uploadCsvFile(filePath);
      const storeInS3Promise = this.storeInS3(filePath);
      const [uploadResult, storeInS3Result] = await Promise.all([
        uploadPromise,
        storeInS3Promise,
      ]);
      return uploadResult;
    } catch (error) {
      throw error;
    }
  }

  private async storeInS3(filePath: string) {
    try {
      const fileContent = fs.createReadStream(filePath);

      const uniqueId = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `uploads/${uniqueId}.csv`;

      const command = new PutObjectCommand({
        Bucket: utils.bucket,
        Key: fileName,
        Body: fileContent,
      });

      await client.send(command);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUnAssignedRides() {
    try {
      const rides = await this.adminService.getUnAssignedRides();
      return rides;
    } catch (error) {
      throw error;
    }
  }

  async assignRideToDriver(rideID: string, driverId: string) {
    try {
      const done = await this.adminService.assignRideToDriver(rideID, driverId);
      const driver = await this.adminService.getDriver(driverId);
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
        Cost,
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
        Cost,
      };
      const messageData = await this.sendSms(data, driver.driverPhoneNumber1); //this will send SMS
      return messageData;
    } catch (error) {
      throw error;
    }
  }

  async getAssignRides() {
    try {
      const rides = await this.adminService.getAssignedRides();
      return rides;
    } catch (error) {
      throw error;
    }
  }

  async updateDriverDetails(id: string, updateFields: DriverUpdateInput) {
    try {
      const user = await this.adminService.updateDriverDetails(
        id,
        updateFields
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  private async sendSms(data: Rides, driverNumber: string) {
    const client = new TwilioSDK.Twilio(utils.accountSid, utils.authToken);

    const [pickUpDate, pickUpTime, pickUperiod] =
      data.Scheduled_Pickup_Time.split(" ");
    const [arrivalDate, arrivalTime, arrivalPeriod] =
      data.Estimated_Arrival_Time.split(" ");

    try {
      const message = await client.messages.create({
        body: `Your ride details 
        Ride Id:${data.RideID}, 
        Customer Name :${data.Customer_FirstName} ${data.Customer_LastName}, 
        PhoneNo: ${data.Phone_Number},
        PickUpDate&Time:${pickUpDate} - ${pickUpTime} ${pickUperiod},
        ArrivalDate&Time:${arrivalDate} - ${arrivalTime} ${arrivalPeriod},
        Pick Up Address :${data.Pickup_Address},Drop Off Address:${
          data.Dropoff_Address
        },Instructions:${
          data.Dropoff_Directions === "" ? "NONE" : `${data.Dropoff_Directions}`
        },Distance :${data.Estimated_Distance},Cost:${data.Cost}
            `,
        to: `+1${driverNumber}`,
        from: utils.fromNumber,
        messagingServiceSid: utils.twilioMessageId,
      });
      //@ts-ignore
      if (message.code) {
        throw new ServiceError(
          "SMS NOT SENT",
          "Not able to send sms to driver",
          status.INTERNAL_SERVER_ERROR
        );
      }

      if (!message.body) {
        throw new ServiceError(
          "SMS NOT SENT",
          "Not able to send sms to driver",
          status.INTERNAL_SERVER_ERROR
        );
      }

      return message.body ? true : false;
    } catch (error) {
      throw error;
    }
  }
  private async sendSmsUserRide(data: UserRideTypeSMS, phoneNumber: string) {
    const client = new TwilioSDK.Twilio(utils.accountSid, utils.authToken);
    try {
      const message = await client.messages.create({
        body: `Your ride details
        Ride Id :${data.rideId}
        Customer Name:${data.firstName} ${data.lastName},
        Phone No:${data.phoneNumber},
        Pick Up Time :${data.pickUpTime},
        Pick Up Address : ${data.pickUpAddress},
        Drop Off Address : ${data.dropOffAddress},
        Instructions :${data.instructions}
        `,
        to: `+1${phoneNumber}`,
        from: utils.fromNumber,
      });

      //@ts-ignore
      if (message.code) {
        throw new ServiceError(
          "SMS NOT SENT",
          "Not able to send sms to driver",
          status.INTERNAL_SERVER_ERROR
        );
      }

      if (!message.body) {
        throw new ServiceError(
          "SMS NOT SENT",
          "Not able to send sms to driver",
          status.INTERNAL_SERVER_ERROR
        );
      }

      return message.body ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async updateRideAsCompleted(rideId: string) {
    try {
      const details = await this.adminService.updateRideAsCompleted(rideId);
      return details;
    } catch (error) {
      throw error;
    }
  }
  async updateRideAsCancelled(rideId: string) {
    try {
      const status = await this.adminService.updateRideAsCancelled(rideId);
      return status;
    } catch (error) {
      throw error;
    }
  }

  async updateAssignRides(data: UpdateData) {
    try {
      let response;
      if (
        data.type !== "updateAssignRides" &&
        data.type !== "updateDeadHeadAndLoad"
      ) {
        throw new AppError(
          "Invalid data type",
          "Either update DriverId or update DeadHead and load as batch wise",
          httpStatus.BAD_REQUEST
        );
      }
      if (data.type === "updateAssignRides") {
        if (
          data.driverId === "" ||
          data.driverId === null ||
          data.driverId === undefined
        ) {
          throw new AppError(
            "DriverId is required",
            "DriverId is req while updating the ride",
            httpStatus.BAD_REQUEST
          );
        }
        const updated = await this.adminService.updateAssignedRides(data);
        const driver = await this.adminService.getDriver(data.driverId);
        response = await this.sendSms(updated, driver.driverPhoneNumber1);
      }
      if (data.type === "updateDeadHeadAndLoad") {
        console.log("inside");
        if (
          data.deadHead === "" ||
          data.deadHead === null ||
          data.deadHead === undefined ||
          data.load === "" ||
          data.load === null ||
          data.load === undefined
        ) {
          throw new AppError(
            "deadHead and Load not sent",
            "send both DeadHead and Load while updating the ride",
            httpStatus.BAD_REQUEST
          );
        }
        response = await this.adminService.updateAssignedRides(data);
      }
      console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedRides() {
    try {
      const rides = await this.adminService.getCompletedRides();
      return rides;
    } catch (error) {
      throw error;
    }
  }
  async getCancelledRides() {
    try {
      const data = await this.adminService.getCancelledRides();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async forgotPwd(email: string) {
    try {
      const user = await this.adminService.getAdminByEmail(email);

      const token = this.generateToken5mins({ emailId: user.email });
      if (!token) {
        throw new AppError(
          "Something went wrong",
          "Internal Server Error",
          httpStatus.INTERNAL_SERVER_ERROR
        );
      }
      const info = await this.sendEmail(user.email, user, token);
      return info;
    } catch (error) {
      throw error;
    }
  }

  private async sendEmail(email: string, user: Admin, token: string) {
    try {
      const mailOptions = {
        from: utils.fromEmail,
        to: email,
        subject: "Test HTML Email",
        text: "Hello, this is a test email!",
        html: htmlTemplate(user.name, token, utils.adminURL),
      };

      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getAllAdmins() {
    try {
      const admins = await this.adminService.getAllAdmins();
      return admins;
    } catch (error) {
      throw error;
    }
  }

  async updateForgotPassword(emailId: string, confirmPassword: string) {
    try {
      const user = await this.adminService.updatePassword(
        emailId,
        confirmPassword
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteAdminWithID(id: string) {
    try {
      const value = await this.adminService.deleteAdminWithID(id);
      return value;
    } catch (error) {
      throw error;
    }
  }

  async updateAdmin(id: string, adminData: AdminUpdateInput) {
    try {
      const admin = await this.adminService.updateAdmin(id, adminData);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async createPayment(data: PaymentData) {
    try {
      const payment = await this.adminService.createPayment(data);
      return payment;
    } catch (error) {
      throw error;
    }
  }

  async driverTotalAmountCalculate(data: AmountTotalPaid) {
    try {
      const resp = await this.adminService.driverTotalAmountCalculate(data);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async getAllPayments() {
    try {
      const payments = await this.adminService.getAllPayments();
      return payments;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentByDriverId(driverId: string) {
    try {
      const payment = await this.adminService.getPaymentByDriverId(driverId);
      return payment;
    } catch (error) {
      throw error;
    }
  }

  async updatePayment(paymentId: string, values: updateBodyPayment) {
    try {
      const updatedPayment = this.adminService.updatePayment(paymentId, values);
      return updatedPayment;
    } catch (error) {
      throw error;
    }
  }

  async deletePayment(paymentId: string) {
    try {
      const deleted = await this.adminService.deletePayment(paymentId);
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  async getFormDataUnchecked() {
    try {
      const alldetails = await this.adminService.getFormDataUnchecked();
      return alldetails;
    } catch (error) {
      throw error;
    }
  }

  async updateFormContacted(id: string) {
    try {
      const data = await this.adminService.updateFormContacted(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getFormDataChecked() {
    try {
      const allDetails = await this.adminService.getFormDataChecked();
      return allDetails;
    } catch (error) {
      throw error;
    }
  }

  async addUserRide(userRideData: UserRideType) {
    try {
      const userRide = await this.adminService.addUserRide(userRideData);
      return userRide;
    } catch (error) {
      throw error;
    }
  }
  async getUnassignedUserRides() {
    try {
      const data = await this.adminService.getUnassignedUserRides();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async assignDriverToUserRide(rideID: string, driverId: string) {
    try {
      const done = await this.adminService.assignUserRideToDriver(
        rideID,
        driverId
      );
      const driver = await this.adminService.getDriver(driverId);
      const {
        firstName,
        lastName,
        rideDate,
        pickUpAddress,
        dropOffAddress,
        phoneNumber,
        pickUpTime,
        instructions,
        rideId,
      } = done;
      const data: UserRideTypeSMS = {
        firstName,
        lastName,
        rideDate,
        pickUpAddress,
        dropOffAddress,
        phoneNumber,
        pickUpTime,
        instructions,
        rideId,
      };
      const messageData = await this.sendSmsUserRide(
        data,
        driver.driverPhoneNumber1
      );
      return messageData ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedUserRides() {
    try {
      const data = await this.adminService.getAssignedUserRides();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateAssignUserRides(data: updateUserRide) {
    try {
      const updated = await this.adminService.updateAssignedUserRides(data);
      const driver = await this.adminService.getDriver(data.driverId);
      const sendSms = await this.sendSmsUserRide(
        updated,
        driver.driverPhoneNumber1
      );
      return sendSms;
    } catch (error) {
      throw error;
    }
  }
  async updateUserRideAsCompleted(rideId: string) {
    try {
      const details = await this.adminService.updateUserRideAsCompleted(rideId);
      return details;
    } catch (error) {
      throw error;
    }
  }
  async updateUserRideAsCancelled(rideId: string) {
    try {
      const details = await this.adminService.updateUserRideAsCancelled(rideId);
      return details;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedUserRides() {
    try {
      const data = await this.adminService.getCompletedUserRides();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getCancelledUserRides() {
    try {
      const data = await this.adminService.getCancelledUserRides();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async completedRideUndo(rideId: string) {
    try {
      const data = await this.adminService.completedRideUndo(rideId);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async cancelledRideUndo(rideId: string) {
    try {
      const data = await this.adminService.cancelledRideUndo(rideId);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
