import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { ContactUsFormSchema } from "../config/validations";
import { FormService } from "../service";

const form = new FormService();
export const createContactForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formBody = ContactUsFormSchema.parse(req.body);
    const data = await form.createFormDetails(formBody);
    return res.status(status.OK).json({
      message: "Form created Successfully",
      details: data,
      err: {},
    });
  } catch (error) {
    next(error);
  }
};
