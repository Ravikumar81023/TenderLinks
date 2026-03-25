export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  CONTENT_ADMIN = "CONTENT_ADMIN",
  PROJECT_ADMIN = "PROJECT_ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface AdminUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface AdminCreateInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface AdminUpdateInput {
  email?: string;
  password?: string;
  role?: UserRole;
}
