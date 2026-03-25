import { z } from "zod";
import { UserRole, SubscriptionTier } from "@prisma/client";
import { AdminCreateInput, CustomerCreateInput } from "../types/user";

const adminCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_ADMIN,
    UserRole.PROJECT_ADMIN,
    UserRole.CUSTOMER,
  ]),
});

const adminUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z
    .enum([
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.CONTENT_ADMIN,
      UserRole.PROJECT_ADMIN,
      UserRole.CUSTOMER,
    ])
    .optional(),
});

const documentSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
});

const customerCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().optional(),
  // Handle phoneNumbers coming as string from form data
  phoneNumbers: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [val];
      }
    }
    return val;
  }, z.array(z.string())),
  // Coerce string numbers from form data to actual numbers
  sectorId: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional(),
  ),
  locationId: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional(),
  ),
  annualTurnover: z.preprocess((val) => Number(val), z.number()),
  // Handle date string from form data
  subscriptionValidity: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional(),
  ),
  subscriptionTier: z
    .nativeEnum(SubscriptionTier)
    .default(SubscriptionTier.GUEST),
  documents: z.array(documentSchema).optional(),
});
const customerUpdateSchema = customerCreateSchema.partial().extend({
  subscriptionTier: z.nativeEnum(SubscriptionTier).optional(),
});

const loginSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

// Updated tenderCreateSchema to make only the specified fields mandatory
const tenderCreateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  value: z.string().optional(), // Keeping as string since it will be converted to Decimal in controller
  // Only sector and location are mandatory
  sectorId: z.coerce.number(),
  locationId: z.coerce.number(),
  // Expiry date is now optional as it will be calculated automatically
  expiryDate: z.coerce.date().optional(),
  tenderingAuthority: z.string(),
  tenderNo: z.string().optional(),
  tenderID: z.string(),
  tenderBrief: z.string().optional(),
  documentFees: z.string().optional(),
  emd: z.string().optional(),
  biddingType: z.string().optional(),
  competitionType: z.string().optional(),
  publishDate: z.coerce.date(),
  lastDateOfSubmission: z.coerce.date().optional(),
  document: documentSchema.optional(),
});
const tenderUpdateSchema = tenderCreateSchema.partial();

const sectorCreateSchema = z.object({
  name: z.string().min(1),
});

const sectorUpdateSchema = sectorCreateSchema;

const locationCreateSchema = z.object({
  state: z.string().min(1),
  district: z.string().min(1),
  city: z.string().optional(),
});

const locationUpdateSchema = locationCreateSchema.partial();

const socaialMediaSchema = z.object({
  platformName: z.string().min(1),
  link: z.string().min(5),
  logo: z.string(),
});

const socaialMediaUpdateSchema = socaialMediaSchema.partial();

export const validateAdminCreate = (data: unknown): AdminCreateInput => {
  return adminCreateSchema.parse(data);
};

export const validateAdminUpdate = (
  data: unknown,
): Partial<AdminCreateInput> => {
  return adminUpdateSchema.parse(data);
};

export const validateCustomerCreate = (data: unknown) => {
  return customerCreateSchema.parse(data);
};

export const validateCustomerUpdate = (data: unknown) => {
  return customerUpdateSchema.parse(data);
};

export const validateLogin = (data: unknown) => {
  return loginSchema.parse(data);
};

export const validateTenderCreate = (data: unknown) => {
  return tenderCreateSchema.parse(data);
};

export const validateTenderUpdate = (data: unknown) => {
  return tenderUpdateSchema.parse(data);
};

export const validateSectorCreate = (data: unknown) => {
  return sectorCreateSchema.parse(data);
};

export const validateSectorUpdate = (data: unknown) => {
  return sectorUpdateSchema.parse(data);
};

export const validateLocationCreate = (data: unknown) => {
  return locationCreateSchema.parse(data);
};

export const validateLocationUpdate = (data: unknown) => {
  return locationUpdateSchema.parse(data);
};

export const validateSocialMediaCreate = (data: unknown) => {
  return socaialMediaSchema.parse(data);
};
export const validateSocialMediaUpdate = (data: unknown) => {
  return socaialMediaUpdateSchema.parse(data);
};
