import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import status from "http-status";

import { DriverInput, LoginInput } from "../interfaces";
import { DriverRepository } from "../repository";
import { utils } from "../utils/utilities";
import { AppError } from "../utils/Errors";
import httpStatus from "http-status";
import { htmlTemplate } from "../utils/helper";
import { transporter } from "../config/email";
import { Driver } from "@prisma/client";

export default class DriverService {
  private driverRepo: DriverRepository;
  constructor() {
    this.driverRepo = new DriverRepository();
  }

  async createDriver(data: DriverInput) {
    try {
      const driver = await this.driverRepo.createDriver(data);
      return driver;
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginInput) {
    try {
      const findDriver = await this.driverRepo.getEmail(data.email);

      if (!findDriver) {
        throw Error("No_Driver");
      }

      const passwordMatch = await bcrypt.compare(
        data.password,
        findDriver.password
      );

      if (!passwordMatch) {
        throw new Error("Password_Wrong");
      }

      const { driverID, driverFirstName } = findDriver;
      const token = this.generateToken({ driverID, driverFirstName });

      return token;
    } catch (error) {
      //@ts-ignore
      if (error.message == "No_Driver") {
        throw new AppError(
          "No_Driver",
          "Driver with the email doesn't exist",
          status.NOT_FOUND
        );
      }
      //@ts-ignore
      if (error.message == "Password_Wrong") {
        throw new AppError(
          "Password_Wrong",
          "Incorrect Password",
          status.UNAUTHORIZED
        );
      }
    }
  }

  generateToken(data: JwtPayload) {
    return jwt.sign(data, utils.JWT_SECRET, { expiresIn: "10h" });
  }
  generateToken5mins(data: JwtPayload) {
    return jwt.sign(data, utils.JWT_SECRET, { expiresIn: "5m" });
  }

  async getAssignedRides(driverId: string) {
    try {
      const rides = await this.driverRepo.getAssignedRides(driverId);
      return rides;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedRidesDriver(driverId: string) {
    try {
      const rides = await this.driverRepo.getCompletedRides(driverId);
      return rides;
    } catch (error) {
      throw error;
    }
  }

  async checkPayments(driverId: string) {
    try {
      const payments = await this.driverRepo.checkPayments(driverId);
      return payments;
    } catch (error) {
      throw error;
    }
  }

  async getDetails(driverId: string) {
    try {
      const driver = await this.driverRepo.getDetails(driverId);
      return driver;
    } catch (error) {
      throw error;
    }
  }

  async forgotPwd(email: string) {
    try {
      const user = await this.driverRepo.getEmail(email);

      const token = this.generateToken5mins({ emailId: user?.email });
      if (!token) {
        throw new AppError(
          "Something went wrong",
          "Internal Server Error",
          httpStatus.INTERNAL_SERVER_ERROR
        );
      }
      //@ts-ignore
      const info = await this.sendEmail(user?.email, user, token);
      return info;
    } catch (error) {
      throw error;
    }
  }

  private async sendEmail(email: string, user: Driver, token: string) {
    try {
      const mailOptions = {
        from: utils.fromEmail,
        to: email,
        subject: "Test HTML Email",
        text: "Hello, this is a test email!",
        html: htmlTemplate(user.driverFirstName, token, utils.driverURL),
      };

      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  }

  async updateForgotPassword(emailId: string, confirmPassword: string) {
    try {
      const user = await this.driverRepo.updatePassword(
        emailId,
        confirmPassword
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedUserRides(driverId: string) {
    try {
      const data = await this.driverRepo.getAssignedUserRides(driverId);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedUserRides(driverId: string) {
    try {
      const data = await this.driverRepo.getCompletedUserRides(driverId);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
