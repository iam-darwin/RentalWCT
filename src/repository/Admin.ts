import bcrypt from "bcryptjs";
import status from "http-status";

import { prisma } from "../config/Connectdb";
import { AdminInput } from "../intrefaces/index";
import { AppError } from "../utils/Errors/index";

export default class AdminRepository {
  async createAdmin(details: AdminInput) {
    try {
      const hashedPassword = await bcrypt.hash(details.password, 10);

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
          "Current email is already in Use",
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
    } catch (error) {
      
    }
  }
}
