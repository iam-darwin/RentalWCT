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
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      const { name, email, role, password } = data;
      return (
        name !== undefined ||
        email !== undefined ||
        role !== undefined ||
        password !== undefined
      );
    },
    {
      message:
        "At least one of 'name', 'email','password' or 'role' must be provided.",
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

export const paymentRequestValidation = z.object({
  driverId: z.string().refine((val) => val !== "", {
    message: "driverId is required",
  }),
  totalAmount: z.string().refine((val) => val !== "", {
    message: "totalAmount is required",
  }),
  rideIds: z.array(z.string()).refine((val) => val.length > 0, {
    message: "rideIds is required and must not be empty",
  }),
  feedBack: z.string().optional(),
});

export const updatePaymentSchema = z
  .object({
    remarks: z.string().optional(),
    amount: z.string().min(1).optional(),
  })
  .refine(
    ({ remarks, amount }) => {
      return (
        (remarks !== undefined || amount !== undefined) &&
        !(remarks === undefined && amount === undefined)
      );
    },
    {
      message:
        "Either one of date, remarks, or amount should be present, or else what will you update",
    }
  );
export const ContactUsFormSchema = z.object({
  name: z.string().refine((value) => value.trim() !== "", {
    message: "Name cannot be empty or contain only whitespace",
  }),
  phoneNumber: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "Phone number must be a 10-digit number",
  }),
  email: z.string().email({
    message: "Invalid email address format",
  }),
  message: z.string().refine((value) => value.trim() !== "", {
    message: "Message cannot be empty or contain only whitespace",
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
  instructions: z.string().optional(),
});

export const RideUpdateDataSchema = z.object({
  driverId: z
    .string()
    .refine((value) => value.length > 0, {
      message: "Driver ID must not be empty",
    })
    .optional(),
  rideId: z.string().refine((value) => value.length > 0, {
    message: "Ride ID must not be empty",
  }),
  deadHead: z
    .string()
    .refine((value) => value.length > 0, {
      message: "Dead Head must not be empty",
    })
    .optional(),
  load: z
    .string()
    .refine((value) => value.length > 0, {
      message: "Load must not be empty",
    })
    .optional(),
  type: z.enum(["updateAssignRides", "updateDeadHeadAndLoad"]).refine(
    (value) => {
      return value === "updateAssignRides" || value === "updateDeadHeadAndLoad";
    },
    {
      message:
        "Invalid type. Must be 'updateAssignRides' or 'updateDeadHeadAndLoad'.",
    }
  ),
});

export const DriverUpdateInputSchema = z
  .object({
    driverFirstName: z.string().optional(),
    driverLastName: z.string().optional(),
    email: z.string().email().optional(),
    driverAddress: z.string().optional(),
    driverPhoneNumber1: z.string().optional(),
    driverPhoneNumber2: z.string().optional(),
    vehicleColor: z.string().optional(),
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
    vehicleLicense: z.string().optional(),
    driverSSN: z.string().optional(),
    driverLicense: z.string().optional(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      const values = Object.values(data);
      const atLeastOneProvided = values.some(
        (value) => value !== undefined && value !== null && value !== ""
      );

      if (!atLeastOneProvided) {
        throw new Error("At least one property should be provided");
      }
      return true; // No error
    },
    { message: "At least one property should be provided" }
  );

export const UserRideUpdateSchema = z.object({
  driverId: z.string().refine(isNonEmptyString, {
    message: "Driver ID must not be empty",
  }),
  rideId: z.string().refine(isNonEmptyString, {
    message: "Ride ID must not be empty",
  }),
});

// Types
export type ContactUsFormData = z.infer<typeof ContactUsFormSchema>;
export type UserRideType = z.infer<typeof UserRideSchema>;
export type updateBodyPayment = z.infer<typeof updatePaymentSchema>;
export type updateUserRide = z.infer<typeof UserRideUpdateSchema>;
