import { NextFunction, Request, Response } from "express";
import status from "http-status";

import { AdminService, DriverService } from "../service/index";
import { AdminInput } from "../intrefaces/index";
import {
  adminSchema,
  loginSchema,
  driverInputSchema,
  AdminUpdateInputValidation,
  adminIdValidation,
} from "../config/validations";
import { AppError, ServiceError } from "../utils/Errors";

const admin = new AdminService();
const driver = new DriverService();

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminBody: AdminInput = adminSchema.parse(req.body);
    const adminUser = await admin.createAdmin({...adminBody,role:req.body.role});

    return res.status(status.CREATED).json({
      message: "User created Successfully",
      data: adminUser,
      err: {},
    });
  } catch (error) {
    next(error)
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminLoginBody = loginSchema.parse(req.body);

    const adminToken = await admin.loginAdmin(adminLoginBody);

    return res.status(status.OK).json({
      token: adminToken,
    });
  } catch (error) {
    next(error);
  }
};

export const createDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const driverBody = driverInputSchema.parse(req.body);
    const newDriver = await driver.createDriver(driverBody);

    return res.status(status.CREATED).json({
      message: "Driver created Successfully",
      data: newDriver,
    });
  } catch (error) {
    next(error);
  }
};

export const getDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const drivers = await admin.getDrivers();
    return res.status(status.OK).json({
      message: "Fetched all details",
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
};

export const getDriverById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.driverId;
    if (!id) {
      throw new AppError(
        "Bad Request",
        "Invalid request parameters",
        status.BAD_REQUEST
      );
    }
    const driverDetails = await admin.getDriverById(id);

    return res.status(status.OK).json({
      message: "User deatils",
      data: driverDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activeDrivers = await admin.getActiveDrivers();

    return res.status(status.OK).json({
      message: "Fetched users",
      data: activeDrivers,
    });
  } catch (error) {
    next(error);
  }
};

export const fileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new ServiceError(
        "File missing",
        "File Not Uploaded",
        status.BAD_REQUEST
      );
    }

    const message = await admin.fileUpload(req.file.path);

    return res.status(status.OK).json({
      msg: message,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnAssignedRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rides = await admin.getUnAssiignedRides();
    return res.status(status.OK).json({
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

export const assignRideToDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const success = await admin.assginRideToDriver(
      req.body.rideId,
      req.body.driverId
    );

    return res.status(status.OK).json({
      message: `ASSIGNED DRIVER`,
      assigned: success,
      rideId: req.body.rideID,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rides = await admin.getAssignRides();
    return res.status(status.OK).json({
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDrivedetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await admin.updateDriverDetails(req.params.driverId, req.body);
    return res.status(status.NO_CONTENT).json({
      message: "Sucessfully Updated",
      status: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRideAsCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await admin.updateRideAsCompleted(req.body.rideId);
    return res.status(status.OK).json({
      message: "Data Succesfully Updated",
      details: data,
      err: {},
    });
  } catch (error) {
    next(error);
  }
};

export const updateAssignedRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const updateData = await admin.updateAssignRides(req.query.rideId,
      req.body
    );
    return res.status(status.OK).json({
      message: "Successfully updated",
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await admin.forgotPwd(req.body.email);

    return res.status(status.OK).json({
      msg: response,
    });
  } catch (error) {
    next(error);
  }
};


export const resetPasswordGET =async(req:Request,res:Response,next:NextFunction)=>{
  try {
    //@ts-ignore
    const {emailId}=req.user;
    const url=req.originalUrl
    const tokenMatch=url.match(/\/resetPwd\/([^\/]+)/);
    let token
    if (tokenMatch && tokenMatch[1]) {
      token = tokenMatch[1];
    } else {
     return res.render("req-newLink");
    }

    return res.render("reset-password",{email:emailId,token});
  } catch (error) {
    next(error);
  }
}

export const resetPasswordPOST=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    //@ts-ignore
    console.log("2",req.user)
    //@ts-ignore
    const response=await admin.updateForgotPassword(req.user.emailId,req.body.confirmPassword);
    if(response){
      return res.status(status.OK).render('pwd-Update-Success')
    }
    return res.status(status.UNAUTHORIZED).render('req-newLink')
  } catch (error) {
    next(error);
  }
}

export const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admins=await admin.getAllAdmins();

    return res.status(status.OK).json({
      msg:"Successfull fetched",
      data:admins
    })
  } catch (error) {
    next(error)
  }
};

export const updateAdmin=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const adminID=adminIdValidation.parse(req.query)
    const adminUpateBody=AdminUpdateInputValidation.parse(req.body)
    //@ts-ignore
    const response=await admin.updateAdmin(adminID.adminId,adminUpateBody);

    return res.status(status.OK).json({
      msg:"Successfull updated",
      data:response
    })
  } catch (error) {
    next(error);
  }
}
