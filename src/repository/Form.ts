import { prisma } from "../config/Connectdb";

import { ContactUsFormData } from "../config/validations";

export default class FormRepository {
  async createFormDetails(data: ContactUsFormData) {
    try {
      const formDetails = await prisma.contactUsForm.create({
        data,
      });
      return formDetails;
    } catch (error) {
      throw error;
    }
  }
}
