import { z } from "zod";

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

export const AdminUpdateInputValidation = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.string().optional(),
}).refine((data) => {
  const { name, email, role } = data;
  return name !== undefined || email !== undefined || role !== undefined;
}, {
  message: "At least one of 'name', 'email', or 'role' must be provided.",
});

export const adminIdValidation = z.object({
  adminId: z.string(),
}).refine((data) => {
  const { adminId } = data;
  return adminId !== undefined && adminId.trim() !== '';
}, {
  message: "Provide AdminID.",
});

export const assgnRideValidation = z.object({
  rideId: z.string(),
  driverId: z.string(),
}).refine(data => {
  const { rideId, driverId } = data;

  const isRideIdValid = rideId.trim() !== ''; 
  const isDriverIdValid = driverId.trim() !== ''; 

  return isRideIdValid && isDriverIdValid;
}, {
  message: "Invalid values for rideId or driverId. They should not be empty."
});


export const paymentRequestValidation = z.object({
  driverId: z.string(),
  amount: z.string(),
  date: z.string().optional(), 
}).refine(data => data.driverId !== '' && data.amount !== undefined, {
  message: "driverId and amount are required fields.",
});

