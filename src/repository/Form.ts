import { prisma } from "../config/Connectdb";

import { ContactUsFormData } from "../config/validations";

export default class FormRepository {
  async createFormDetails(data: ContactUsFormData) {
    try {
      const formdetails = await prisma.contactUsForm.create({
        data,
      });
      return formdetails;
    } catch (error) {
      throw error;
    }
  }
}
