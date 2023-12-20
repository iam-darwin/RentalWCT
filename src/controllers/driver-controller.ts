import { Request, Response } from "express";
import { z } from "zod";
import status from "http-status";

import { DriverService } from "../service/index";
import { LoginInput } from "../intrefaces/index";
import {
  loginSchema,
} from "../config/validations";

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
