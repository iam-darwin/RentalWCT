import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import status from "http-status";

import { DriverService } from "../service/index";
import { LoginInput } from "../intrefaces/index";
import { loginSchema } from "../config/validations";
import { ServiceError } from "../utils/Errors";

const driver = new DriverService();

export const loginDriver = async (req: Request, res: Response) => {
  try {
    const driverLoginBody: LoginInput = loginSchema.parse(req.body);

    const driverToken = await driver.login(driverLoginBody);

    return res.status(status.OK).json({
      token: driverToken,
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

export const checkHisRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {driverId}=req.params;
    if(!driverId){
      throw new ServiceError("Id not found","Send Driver Id",status.UNAUTHORIZED)
    }
    const rides = await driver.getAssignedRides(driverId);
    return res.status(status.OK).json({
      message: "Successfully fetched rides",
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompletedRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {driverId}=req.params;
    if(!driverId){
      throw new ServiceError("Id not found","Send Driver Id",status.UNAUTHORIZED)
    }
    const rides=await driver.getCompletedRidesDriver(driverId);
    return res.status(status.OK).json({
      message:"Succesffuly Fetced",
      data:rides
    })
  } catch (error) {
    next(error);
  }
};

export const checkPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const response=await driver.checkPayments(req.params.driverId);
   
    return res.status(status.OK).json({
      message:"Succesffuly Fetced",
      data:response
    })
  } catch (error) {
    next(error);
  }
};

export const getDriverDetails=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {driverId}=req.params;
    if(!driverId){
      throw new ServiceError("Id not found","Send Driver Id",status.UNAUTHORIZED)
    }

    const response=await driver.getDetails(driverId);

    return res.status(status.OK).json({
      message:"Succesffuly Fetced",
      data:response
    })
  } catch (error) {
    next(error)
  }
}