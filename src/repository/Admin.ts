import bcrypt from "bcryptjs";
import status from "http-status";

import { prisma } from "../config/Connectdb";
import { AdminInput } from "../intrefaces/index";
import { AppError } from "../utils/Errors/index";

export default class AdminRepository {
  async createAdmin(details: AdminInput) {
    try {
      const hashedPassword = await bcrypt.hash(details.password, 10);

      const existingUser=await prisma.admin.findUnique({
        where:{
          email:details.email
        }
      })

      if(existingUser){
        throw new Error("User_Exists")
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
      if(error.message=="User_Exists"){
        throw new AppError("Admin Exits","admin already exits with the email",status.CONFLICT);
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
    } catch (error) {
      
    }
  }

  async uploadToRidesKaize(){
    
  }

  async getAllDriverDetails(){
    try {
      const drivers=await prisma.driver.findMany({
        include:{
          payments:true
        }
      });
      return drivers;
    } catch (error) {
      throw error
    }
  }

  async getDriver(id:string){
    try {
      const driver=await prisma.driver.findUnique({
        where:{
          driverID:id
        },
        select:{
          driverID:true,
          driverFirstName:true,
          driverAddress:true,
          driverPhoneNumber1:true,
          driverSSN:true,
          payments:true,
          driverLicense:true,
          lastPaymentDate:true
        },
      })
      return driver;
    } catch (error) {
      throw error
    }
  }
}
