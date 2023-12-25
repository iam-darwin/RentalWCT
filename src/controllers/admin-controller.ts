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
import { AppError, ServiceError } from "../utils/Errors";

const admin = new AdminService();
const driver = new DriverService();

export const registerAdmin = async (req: Request, res: Response,next:NextFunction) => {
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
    next(error)

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

export const loginAdmin = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const adminLoginBody = loginSchema.parse(req.body);

    const adminToken = await admin.loginAdmin(adminLoginBody);

    return res.status(status.OK).json({
      token: adminToken,
    });
  } catch (error) {
    next(error)
  }
};

export const createDriver = async (req: Request, res: Response,next:NextFunction) => {
  try {
    
    const driverBody = driverInputSchema.parse(req.body);
    const newDriver = await driver.createDriver(driverBody);

    return res.status(status.CREATED).json({
      message: "Driver created Successfully",
      data: newDriver,
    });
  } catch (error) {
    next(error)
  }
};

export const getDrivers=async(req: Request, res: Response,next:NextFunction)=>{
  try {
    const drivers=await admin.getDrivers();
    return res.status(status.OK).json({
      message:"Fetched all details",
      data:drivers,
    })
  } catch (error) {
    next(error)
  }
}

export const getDriverById=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const id=req.params.id;
    if(!id){
      throw new AppError("Bad Request","Invalid request parameters",status.BAD_REQUEST)
    }
    const driverDetails=await admin.getDriverById(id);

    return res.status(status.OK).json({
      message:"User deatils",
      data:driverDetails
    })
  } catch (error) {
    next(error)
  }
}

export const getActiveDrivers=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const activeDrivers=await admin.getActiveDrivers();

    return res.status(status.OK).json({
      message:"Fetched users",
      data:activeDrivers
    })

  } catch (error) {
    next(error)
  }
}

export const fileUpload =async (req:Request,res:Response,next:NextFunction)=>{
  try {
    if(!req.file){
      throw new ServiceError("File missing","File Not Uploaded",status.BAD_REQUEST);
    }
    const message=await admin.fileUpload(req.file.path);
    
    return res.status(status.OK).json({
      msg:message,
      success:true
    })
  } catch (error) {
    next(error)
  }
}

export const getUnAssignedRides=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const rides=await admin.getUnAssiignedRides();
    return res.status(status.OK).json({
      data:rides
    })
  } catch (error) {
    next(error);
  }
}

export const assignRideToDriver=async (req:Request,res:Response,next:NextFunction)=>{
  try {
  
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
    return res.status(status.OK).json({
      data:rides
    })
  } catch (error) {
    next(error);
  }
}

export const updateDrivedetails=async (req:Request,res:Response,next:NextFunction)=>{
try {
  const user=await admin.updateDriverDetails(req.params.driverId,req.body);
  return res.status(status.NO_CONTENT).json({
    message:"Sucessfully Updated",
    status:user
  })
} catch (error) {
  next(error);
}
}

export const updateRideAsCompleted=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const data=await admin.updateRideAsCompleted(req.body.rideID);
    return res.status(status.OK).json({
      message:"Data Succesfully Updated",
      details:data,
      err:{}
    })
  } catch (error) {
    next(error)
  }
}

export const updateAssignedRides=async (req:Request,res:Response,next:NextFunction)=>{
    try {
     //@ts-ignore
      const updateData=await admin.updateAssignRides(req.query.rideId,req.body);
      return res.status(status.OK).json({
        message:"Successfully updated",
        data:updateData
      })
    } catch (error) {
      next(error)
    }
}