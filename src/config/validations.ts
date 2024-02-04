import { ZodType, z } from "zod";

const isNonEmptyString = (data: string) => data.trim() !== "";

export const adminSchema = z.object({
  name: z.string(),
  email: z
    .string()
    .email()
    .refine((value) => value.includes("@"), {
      message: "Invalid email format. It must contain the @ symbol.",
    }),
  password: z.string().refine((value) => value.length >= 8, {
    message: "Password must be at least 8 characters long",
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().refine(
    (value) => {
      return value.length >= 8;
    },
    {
      message: "Password Incorrect",
    }
  ),
});

export const driverInputSchema = z.object({
  driverFirstName: z.string(),
  driverLastName: z.string(),
  email: z.string().email(),
  password: z.string().refine((value) => value.length >= 8, {
    message: "Password must be at least 8 characters long",
  }),
  driverAddress: z.string(),
  driverPhoneNumber1: z.string(),
  driverPhoneNumber2: z.string(),
  vehicleColor: z.string(),
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  vehicleLicense: z.string(),
  driverSSN: z.string(),
  driverLicense: z.string(),
});

export const AdminUpdateInputValidation = z
  .object({
    adminId: z.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    role: z.string().optional(),
  })
  .refine(
    (data) => {
      const { name, email, role } = data;
      return name !== undefined || email !== undefined || role !== undefined;
    },
    {
      message: "At least one of 'name', 'email', or 'role' must be provided.",
    }
  );

export const adminIdValidation = z
  .object({
    adminId: z.string(),
  })
  .refine(
    (data) => {
      const { adminId } = data;
      return adminId !== undefined && adminId.trim() !== "";
    },
    {
      message: "Provide AdminID.",
    }
  );

export const assignRideValidation = z
  .object({
    rideId: z.string(),
    driverId: z.string(),
  })
  .refine(
    (data) => {
      const { rideId, driverId } = data;

      const isRideIdValid = rideId.trim() !== "";
      const isDriverIdValid = driverId.trim() !== "";

      return isRideIdValid && isDriverIdValid;
    },
    {
      message:
        "Invalid values for rideId or driverId. They should not be empty.",
    }
  );

export const paymentRequestValidation = z
  .object({
    driverId: z.string(),
    amount: z.string(),
    remarks: z.string().optional(),
    date: z.string().optional(),
  })
  .refine((data) => data.driverId !== "" && data.amount !== undefined, {
    message: "driverId and amount are required fields.",
  });

export const updatePaymentSchema = z
  .object({
    date: z.string().optional(),
    remarks: z.string().optional(),
    amount: z.string().min(1).optional(), // Updated amount to be a non-empty string
  })
  .refine(
    ({ date, remarks, amount }) => {
      return (
        (date !== undefined || remarks !== undefined || amount !== undefined) &&
        !(date === undefined && remarks === undefined && amount === undefined)
      );
    },
    {
      message:
        "Either one of date, remarks, or amount should be present, or else what will you update",
    }
  );
export const ContactUsFormSchema = z.object({
  name: z.string().refine((value) => value.trim() !== "", {
    message: "Name cannot be empty or contain only whitespaces",
  }),
  phoneNumber: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "Phone number must be a 10-digit number",
  }),
  email: z.string().email({
    message: "Invalid email address format",
  }),
  message: z.string().refine((value) => value.trim() !== "", {
    message: "Message cannot be empty or contain only whitespaces",
  }),
});

export const UserRideSchema = z.object({
  firstName: z.string().refine(isNonEmptyString, {
    message: "First name is required",
  }),
  lastName: z.string().refine(isNonEmptyString, {
    message: "Last name is required",
  }),
  rideDate: z.string().refine(isNonEmptyString, {
    message: "Ride date is required",
  }),
  pickUpTime: z.string().refine(isNonEmptyString, {
    message: "Pick-up time is required",
  }),
  pickUpAddress: z.string().refine(isNonEmptyString, {
    message: "Pick-up address is required",
  }),
  dropOffAddress: z.string().refine(isNonEmptyString, {
    message: "Drop-off address is required",
  }),
  phoneNumber: z
    .string()
    .refine((value) => value.length === 10 && /^\d+$/.test(value), {
      message: "Phone number should have exactly 10 digits",
    }),
});

// Types
export type ContactUsFormData = z.infer<typeof ContactUsFormSchema>;
export type UserRideType = z.infer<typeof UserRideSchema>;
