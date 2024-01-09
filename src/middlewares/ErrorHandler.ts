import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { z } from "zod";


import {AppError,ServiceError} from "../utils/Errors/index"

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.name)
  console.error(err.message)
  let statusCode = 500;
  let errorMessage = "Internal  server error";
  if (err.message === "CSV_file") {
    statusCode = 400;
    errorMessage = "Invalid file type. Only CSV files are allowed.";
  } else if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    errorMessage = "File size exceeds the allowed limit.";
  } else if (err instanceof z.ZodError) {
     return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: err.issues[0].message });
  }else if (err instanceof AppError){
    return res.status(err.statusCode).json({
        name:err.name,
        message:err.message
    })
  }else if (err instanceof ServiceError){
    return res.status(err.statusCode).json({
        name:err.name,
        message:err.message
    })
  }

  return res.status(statusCode).json({ error: errorMessage });
};
