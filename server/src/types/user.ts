import { UserRole, SubscriptionTier } from "@prisma/client";

export type AdminCreateInput = {
  email: string;
  password: string;
  role: UserRole;
};

export type CustomerCreateInput = {
  email: string;
  password: string;
  companyName?: string;
  phoneNumbers: string[];
  sectorId?: number;
  locationId?: number;
  annualTurnover: number;
  subscriptionValidity?: Date;
  subscriptionTier?: SubscriptionTier;
  documents?: {
    name: string;
    path: string;
    type: string;
  }[];
};

export interface JWTPayload {
  id: number;
  email: string;
  role: UserRole;
  adminedByUserId?: number;
}

export type TenderCreateInput = {
  title: string;
  description: string;
  value: string;
  sectorId: number;
  locationId: number;
  userId: number;
  expiryDate: Date;
  tenderingAuthority: string;
  tenderNo: string;
  tenderID: string;
  tenderBrief: string;
  documentFees?: string | null; // Updated field
  emd?: string;
  biddingType: string;
  competitionType: string;
  publishDate: Date;
  lastDateOfSubmission: Date;
};
