import bcrypt from "bcryptjs";
import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import jwt, { JwtPayload } from "jsonwebtoken";
import status from "http-status";
import * as TwilioSDK from "twilio";
import { AdminInput, AdminUpdateInput, DriverUpdateInput, LoginInput, Rides, RidesAssignedUpdate } from "../intrefaces";
import { utils} from "../utils/utilities";
import { AdminRepository } from "../repository/index";
import { AppError, ServiceError } from "../utils/Errors";
import httpStatus from "http-status";
import { htmlTemplate } from "../utils/helper";
import { Admin } from "@prisma/client";
import { transporter } from "../config/email";
import { client } from "../config/aws";



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
        throw new AppError("Password Incorrect","Invalid Password",httpStatus.UNAUTHORIZED);
      }
      //@ts-ignore
      const { adminId, name,role } = findAdmin;
      const token = this.generateToken({ adminId, name,role });

      return token;
    } catch (error) {
      throw error
    }
  }

  private generateToken(data: JwtPayload) {
    return jwt.sign(data, utils.JWT_SECRET, { expiresIn: "10h" });
  }

  private generateToken5mins(data: JwtPayload) {
    return jwt.sign(data, utils.JWT_SECRET, { expiresIn: "1m" });
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
      await this.storeInS3(filePath);
      return upload;
    } catch (error) {
      throw error;
    }
  }

  private async storeInS3(filePath:string){
    try {
      const fileContent = fs.createReadStream(filePath);

      const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = `uploads/${uniqueId}.csv`;

      const command = new PutObjectCommand({
        Bucket: utils.bucket,
        Key:fileName,
        Body: fileContent,
      })

      await client.send(command);
    } catch (error) {
      console.error(error);
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
      const driver=await this.adminService.getDriver(driverId);
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
      const messageData =await this.sendSms(data,driver.driverPhoneNumber1) //this will send SMS
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

  async updateDriverDetails(id:string,updateFields:DriverUpdateInput){
    try {
      const user=await this.adminService.updateDriverDetails(id,updateFields);
      return user;
    } catch (error) {
      throw error;
    }
  }


  private async sendSms(data: Rides,driverNumber:string) {
    const client = new TwilioSDK.Twilio(utils.accountSid, utils.authToken);

    try {
      const message = await client.messages.create({
        body: `Your ride details
            Customer Name :${data.Customer_FirstName} ${data.Customer_LastName}, PhoneNo: ${data.Phone_Number},PickUpTime:${data.Scheduled_Pickup_Time},ArrivalTime:${data.Estimated_Arrival_Time},Pick Up Address :${data.Pickup_Address},Drop Off Address:${data.Dropoff_Address},Instructions:${data.Dropoff_Directions},Distance :${data.Estimated_Distance} 
            `,
        to: `+91${driverNumber}`,
        from: utils.fromNumber,
      });
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

  async updateAssignRides(data:RidesAssignedUpdate){
    try {
      const updated=await this.adminService.updateAssignedRides(data);
      if(data.Driver_ID){
        const driver =await this.adminService.getDriver(data.Driver_ID);
        const sendSms=await this.sendSms(updated,driver.driverPhoneNumber1);
        return sendSms;
      }
      return updated?true:false;
    } catch (error) {
      throw error
    }
  }

  async getCompletedRides(){
    try {
      const rides=await this.adminService.getCompletedRides();
      return rides;
    } catch (error) {
      throw error;
    }
  }
  async getCancelledRides(){
    try {
      const data=await this.adminService.getCancelledRides();
      return data;
    } catch (error) {
      throw error
    }
  }

  async forgotPwd(email:string){
    try {
      const user=await this.adminService.getAdminByEmail(email);

      const token=this.generateToken5mins({emailId:user.email})
      if(!token){
        throw new AppError("Something went wrong","Internal Server Error",httpStatus.INTERNAL_SERVER_ERROR)
      }
      const info=await this.sendEmail(user.email,user,token);
      return info;
    } catch (error) {
      throw error
    }
  }

  private async sendEmail(email:string,user:Admin,token:string){
    try { 
      const mailOptions={
        from: utils.fromEmail,
        to: email,
        subject: 'Test HTML Email',
        text: 'Hello, this is a test email!',
        html: htmlTemplate(user.name,token),
      }

      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getAllAdmins(){
    try {
      const admins=await this.adminService.getAllAdmins();
      return admins;
    } catch (error) {
      throw error
    }
  }

  async updateForgotPassword(emailId:string,confirmPassword:string){
    try {
      const user =await this.adminService.updatePassword(emailId,confirmPassword);
      return user;
    } catch (error) {
      throw error
    }
  }

  async deleteAdminWithID(id:string){
    try {
      const value=await this.adminService.deleteAdminWithID(id);
      return value;
    } catch (error) {
      throw error;
    }
  }

  async updateAdmin(id:string,adminData:AdminUpdateInput){
    try {
      const admin=await this.adminService.updateAdmin(id,adminData);
      return admin
    } catch (error) {
      throw error;
    }
  }

  async createPayment(driverId:string,paid:number,date?:string,feedBack?:string){
    try {
      const payment=await this.adminService.createPayment(driverId,paid,date,feedBack);
      return payment;
    } catch (error) {
      throw error;
    }
  }


  async getAllPayments(){
    try {
      const payments=await this.adminService.getAllPayments();
      return payments;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentByDriverId(driverId:string){
    try {
      const payment=await this.adminService.getPaymentByDriverId(driverId);
      return payment;
    } catch (error) {
      throw error;
    }
  }

}
