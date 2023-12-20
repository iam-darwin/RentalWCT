import { Request, Response } from "express";
import { z } from "zod";
import status from "http-status";

import { AdminService, DriverService } from "../service/index";
import { AdminInput } from "../intrefaces/index";
import {
  adminSchema,
  loginSchema,
  driverInputSchema,
} from "../config/validations";

const admin = new AdminService();
const driver = new DriverService();

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const adminBody: AdminInput = adminSchema.parse(req.body);

    const { name, email, password } = adminBody;
    const adminUser = await admin.createAdmin({ name, email, password });

    return res.status(status.CREATED).json({
      message: "User created Successfully",
      data: adminUser,
      err: {},
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: error.issues[0].message });
    }
    console.log(error);

    //@ts-ignore
    return (
      res
        //@ts-ignore
        .status(error.statusCode)
        .json({
          //@ts-ignore
          message: error.message,
          success: "fail",
          //@ts-ignore
          explanation: error.explanation,
          data: {},
        })
    );
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const adminLoginBody = loginSchema.parse(req.body);

    const adminToken = await admin.loginAdmin(adminLoginBody);

    return res.status(status.OK).json({
      token: adminToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: error.issues[0].message });
    }
    //@ts-ignore
    res.status(error.statusCode).json({
      //@ts-ignore
      err: error.message,
      success: "fail",
    });
  }
};

export const createDriver = async (req: Request, res: Response) => {
  try {
    console.log("Inside driver body");
    
    const driverBody = driverInputSchema.parse(req.body);
    const newDriver = await driver.createDriver(driverBody);

    return res.status(status.CREATED).json({
      message: "Driver created Successfully",
      data: newDriver,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: error.issues[0].message });
    }

    //@ts-ignore
    res.status(error.statusCode).json({
      //@ts-ignore
      err: error.message,
      success: "fail",
    });
  }
};
