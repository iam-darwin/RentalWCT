import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { AppError, ServiceError } from "../utils/Errors/index";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  let statusCode = 500;
  let errorMessage = err.message;
  if (err.message === "CSV_file") {
    statusCode = 400;
    errorMessage = "Invalid file type. Only CSV files are allowed.";
  } else if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    errorMessage = "File size exceeds the allowed limit.";
  } else if (err instanceof z.ZodError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: `${err.issues[0].path[0]} ${err.issues[0].message}` });
  } else if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      name: err.name,
      message: err.message,
    });
  } else if (err instanceof ServiceError) {
    return res.status(err.statusCode).json({
      name: err.name,
      message: err.message,
    });
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Invalid input",
    });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(httpStatus.CONFLICT).json({
      message: `the user with this ${err.meta?.target} already exists`,
    });
  }

  return res.status(statusCode).json({ message: errorMessage });
};
