import { ContactUsFormData } from "../config/validations";
import { FormRepository } from "../repository";

export default class FormService {
  private formService: FormRepository;

  constructor() {
    this.formService = new FormRepository();
  }

  async createFormDetails(data: ContactUsFormData) {
    try {
      const formdetails = await this.formService.createFormDetails(data);
      return formdetails;
    } catch (error) {
      throw error;
    }
  }
}
