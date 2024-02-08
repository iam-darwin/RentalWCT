import { NextFunction, Request, Response } from "express";
import status from "http-status";

import { AdminService, DriverService } from "../service/index";
import { AdminInput } from "../interfaces/index";
import {
  adminSchema,
  loginSchema,
  driverInputSchema,
  AdminUpdateInputValidation,
  paymentRequestValidation,
  updatePaymentSchema,
  UserRideSchema,
  assignRideValidation,
  RideUpdateDataSchema,
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
    const adminUser = await admin.createAdmin({
      ...adminBody,
      role: req.body.role,
    });

    return res.status(status.CREATED).json({
      message: "User created Successfullyy",
      data: adminUser,
      err: {},
    });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminLoginBody = loginSchema.parse(req.body);

    const { token, role } = await admin.loginAdmin(adminLoginBody);

    return res.status(status.OK).json({
      token,
      role,
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
      message: "Successfully fetched",
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
    const rides = await admin.getUnAssignedRides();
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
    const assignBody = assignRideValidation.parse(req.body);
    const success = await admin.assignRideToDriver(
      assignBody.rideId,
      assignBody.driverId
    );
    return res.status(status.OK).json({
      message: `ASSIGNED DRIVER`,
      assigned: success,
      rideId: assignBody.rideId,
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

export const updateDriverDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await admin.updateDriverDetails(req.params.driverId, req.body);
    return res.status(status.NO_CONTENT).json({
      message: "Successfully Updated",
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
      message: "Data Successfullyy Updated",
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
    const updateBody = RideUpdateDataSchema.parse(req.body);
    const updateData = await admin.updateAssignRides(updateBody);
    return res.status(status.OK).json({
      message: "Successfully updated",
      data: updateData,
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
    //@ts-ignore
    const updateData = await admin.getCompletedRides();
    return res.status(status.OK).json({
      message: "Successfully fetched",
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
};

export const getCancelledRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const updateData = await admin.getCancelledRides();
    return res.status(status.OK).json({
      message: "Successfully fetched",
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

export const resetPasswordGET = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const { emailId } = req.user;
    const url = req.originalUrl;
    const tokenMatch = url.match(/\/resetPwd\/([^\/]+)/);
    let token;
    if (tokenMatch && tokenMatch[1]) {
      token = tokenMatch[1];
    } else {
      return res.render("req-newLink");
    }

    return res.render("reset-password", { email: emailId, token });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordPOST = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await admin.updateForgotPassword(
      //@ts-ignore
      req.user.emailId,
      req.body.confirmPassword
    );
    if (response) {
      return res.status(status.OK).render("pwd-Update-Success");
    }
    return res.status(status.UNAUTHORIZED).render("req-newLink");
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admins = await admin.getAllAdmins();

    return res.status(status.OK).json({
      msg: "Successfully fetched",
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminUpateBody = AdminUpdateInputValidation.parse(req.body);
    //@ts-ignore
    const response = await admin.updateAdmin(
      adminUpateBody.adminId,
      adminUpateBody
    );

    return res.status(status.OK).json({
      msg: "Successfully updated",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await admin.deleteAdminWithID(req.body.adminId);

    return res.status(status.OK).json({
      msg: "Successfully deleted",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentBody = paymentRequestValidation.parse(req.body);
    const response = await admin.createPayment(
      paymentBody.driverId,
      Number(paymentBody.amount),
      paymentBody.date,
      paymentBody.remarks
    );

    return res.status(status.OK).json({
      msg: "Successfully Created",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await admin.getAllPayments();

    return res.status(status.OK).json({
      msg: "Successfully Fetched",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentByDriverId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { driverId } = req.params;

    if (!driverId)
      throw new AppError(
        "Id null",
        "Can't access without driverId",
        status.FORBIDDEN
      );
    const response = await admin.getPaymentByDriverId(driverId);

    return res.status(status.OK).json({
      msg: "Successfully Fetched",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    if (!paymentId) {
      throw new AppError(
        "PaymentID Undefined",
        "PaymentId field should not be empty",
        status.BAD_REQUEST
      );
    }

    const updatePaymentBody = updatePaymentSchema.parse(req.body);
    const response = await admin.updatePayment(
      paymentId,
      updatePaymentBody.date,
      updatePaymentBody.remarks,
      Number(updatePaymentBody.amount)
    );

    return res.status(status.OK).json({
      msg: "Updated sucessful",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFormDataOfUnchecked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await admin.getFormDataUnchecked();
    return res.status(status.OK).json({
      message: "Details fetched Successfullyy",
      details: data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFormContacted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contactId } = req.params;
    if (!contactId) {
      throw new AppError(
        "Id undefined",
        "Send the ID you want to update",
        status.BAD_REQUEST
      );
    }
    const data = await admin.updateFormContacted(contactId);
    return res.status(status.OK).json({
      message: "Details fetched Successfullyy",
      details: data,
    });
  } catch (error) {
    next(error);
  }
};

export const getFormDataChecked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await admin.getFormDataChecked();
    return res.status(status.OK).json({
      message: "Details fetched Successfullyy",
      details: data,
    });
  } catch (error) {
    next(error);
  }
};

export const createUserRide = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const addUserRideBody = UserRideSchema.parse(req.body);
    const response = await admin.addUserRide(addUserRideBody);
    return res.status(status.OK).json({
      message: "Ride Successfullyy added",
      details: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnassignedUserRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await admin.getUnassignedUserRides();
    return res.status(status.OK).json({
      message: "Details fetched Successfullyy",
      details: response,
    });
  } catch (error) {
    next(error);
  }
};

export const assignUserRidesToDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignBody = assignRideValidation.parse(req.body);
    const success = await admin.assignDriverToUserRide(
      assignBody.rideId,
      assignBody.driverId
    );
    return res.status(status.OK).json({
      message: `ASSIGNED DRIVER`,
      assigned: success,
      rideId: assignBody.rideId,
    });
  } catch (error) {
    next(error);
  }
};
export const getAssignedUserRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rides = await admin.getAssignedUserRides();
    return res.status(status.OK).json({
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAssignedUserRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const updateData = await admin.updateAssignUserRides(req.body);
    return res.status(status.OK).json({
      message: "Successfullyy updated",
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRideAsCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await admin.updateUserRideAsCompleted(req.body.rideId);
    return res.status(status.OK).json({
      message: "Data Successfullyy Updated",
      details: data,
      err: {},
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRideAsCancelled = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await admin.updateUserRideAsCancelled(req.body.rideId);
    return res.status(status.OK).json({
      message: "Data Successfullyy Updated",
      details: data,
      err: {},
    });
  } catch (error) {
    next(error);
  }
};

export const getCompletedUserRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const updateData = await admin.getCompletedUserRides();
    return res.status(status.OK).json({
      message: "Successfullyy fetched",
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
};

export const getCancelledUserRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const updateData = await admin.getCancelledUserRides();
    return res.status(status.OK).json({
      message: "Successfullyy fetched",
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
};
