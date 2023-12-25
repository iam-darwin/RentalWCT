import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { utils } from "../utils/utilities";
import httpStatus from "http-status";

const jwtKey = utils.JWT_SECRET;

export const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log("inside middleware");
  
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorized", message: "Token missing" });
  }

  try {
    const decoded = JWT.verify(token, jwtKey);
    //@ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorized", message: "Invalid token" });
  }
};
