import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import status from "http-status";

import { AdminService, DriverService } from "../service/index";
import { AdminInput } from "../intrefaces/index";
import {
  adminSchema,
  loginSchema,
  driverInputSchema,
} from "../config/validations";
import { log } from "console";

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

export const getDrivers=async(req: Request, res: Response)=>{
  try {
    const drivers=await admin.getDrivers();
    return res.status(status.OK).json({
      message:"Fetched all details",
      data:drivers,
    })
  } catch (error) {
    throw error
  }
}

export const getDriverById=async (req:Request,res:Response)=>{
  try {
    const id=req.params.id;
    const driverDetails=await admin.getDriverById(id);

    return res.status(status.OK).json({
      message:"User deatils",
      data:driverDetails
    })
  } catch (error) {
    return res.status(401).json({
      message:"User not found",
      err:error
    })
  }
}

export const getActiveDrivers=async (req:Request,res:Response)=>{
  try {
    const activeDrivers=await admin.getActiveDrivers();

    return res.status(status.OK).json({
      message:"Fetched users",
      data:activeDrivers
    })

  } catch (error) {
    return res.status(401).json({
      message:"Unsuccessful req",
      err:error
    })
  }
}

export const fileUpload =async (req:Request,res:Response)=>{
  try {
    if(!req.file){
      return res.status(status.CONFLICT).json({
        message:"File Not Uploaded"
      })
    }
    const message=await admin.fileUpload(req.file.path);
    
    return res.status(status.OK).json({
      msg:message,
      success:true
    })
  } catch (error) {
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
        })
    );
  }
}

export const getUnAssignedRides=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const rides=await admin.getUnAssiignedRides();
    log(rides.length)
    return res.status(status.OK).json({
      data:rides
    })
  } catch (error) {
    next(error);
  }
}

export const assignRideToDriver=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    console.log(typeof req.body.rideID);
    
    const success=await admin.assginRideToDriver(req.body.rideID,req.body.driverId);

    return res.status(status.OK).json({
      message:`ASSIGNED DRIVER`,
      assigned:success,
      rideId:req.body.rideID
    })
  } catch (error) {
    next(error)
  }
}


export const getAssignedRides=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const rides=await admin.getAssignRides();
    log(rides.length)
    return res.status(status.OK).json({
      data:rides
    })
  } catch (error) {
    next(error);
  }
}

export const updateDrivedetails=async (req:Request,res:Response,next:NextFunction)=>{
try {
  const user=await admin.updateDriverDetails(req.body.driverId,req.body);
  return res.status(status.NO_CONTENT).json({
    message:"Sucessfully Updated",
    status:user
  })
} catch (error) {
  next(error);
}
}