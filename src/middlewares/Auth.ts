import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { utils } from "../utils/utilities";
import httpStatus from "http-status";

const jwtKey = utils.JWT_SECRET;

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized", message: "Token missing" });
    }

    const decoded = await JWT.verify(token, jwtKey);
    //@ts-ignore
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "Unauthorized", message: "Invalid token" });
  }
};

export const authDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized", message: "Token missing" });
    }
    const decoded = await JWT.verify(token, jwtKey);
    //@ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "Unauthorized", message: "Invalid token" });
  }
};

export const superAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("inside super admin auth");
    //@ts-ignore
    if (req.user.role !== "SUPER ADMIN") {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized", message: "You cant add Admins" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const resetPwdAuthGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    //@ts-ignore
    req.userToken = token;
    const payload = await JWT.verify(token, jwtKey);
    //@ts-ignore
    req.user = payload;

    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).render("req-newLink");
  }
};

export const resetPwdAuthPOST = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    const payload = await JWT.verify(token, jwtKey);
    //@ts-ignore
    req.user = payload;
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).render("req-newLink");
  }
};
