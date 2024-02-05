import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import status from "http-status";

import { DriverService } from "../service/index";
import { LoginInput } from "../interfaces/index";
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
    //@ts-ignore
    const { driverID } = req.user;
    if (!driverID) {
      throw new ServiceError(
        "Id not found",
        "Send Driver Id",
        status.UNAUTHORIZED
      );
    }
    const rides = await driver.getAssignedRides(driverID);
    return res.status(status.OK).json({
      message: "Successfullyy fetched rides",
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
    //@ts-ignore
    const { driverID } = req.user;
    if (!driverID) {
      throw new ServiceError(
        "Id not found",
        "Send Driver Id",
        status.UNAUTHORIZED
      );
    }
    const rides = await driver.getCompletedRidesDriver(driverID);
    return res.status(status.OK).json({
      message: "Succesffuly Fetced",
      data: rides,
    });
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
    //@ts-ignore
    const { driverID } = req.user;

    if (!driverID) {
      throw new ServiceError(
        "Id not found",
        "Send Driver Id",
        status.UNAUTHORIZED
      );
    }
    const response = await driver.checkPayments(driverID);

    return res.status(status.OK).json({
      message: "Succesffuly Fetced",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getDriverDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const { driverID } = req.user;
    if (!driverID) {
      throw new ServiceError(
        "Id not found",
        "Send Driver Id",
        status.UNAUTHORIZED
      );
    }

    const response = await driver.getDetails(driverID);

    return res.status(status.OK).json({
      message: "Succesffuly Fetced",
      data: response,
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
    const response = await driver.forgotPwd(req.body.email);

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

    return res.render("reset-pwd-driver", { email: emailId, token });
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
    const response = await driver.updateForgotPassword(
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
