import bcrypt from "bcryptjs";
import status from "http-status";

import { prisma } from "../config/Connectdb";
import { DriverInput } from "../intrefaces";
import { AppError } from "../utils/Errors";

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
        throw new Error("User_Exits")
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

      return driver;
    } catch (error) {
        //@ts-ignore
        if(error.message=="User_Exits"){
            throw new AppError("User_exist","User with similar details already exists",status.CONFLICT)
        }
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
}
