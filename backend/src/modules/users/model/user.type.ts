export interface IUser {
  userId: string;

  username: string;

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  role: string;
  roleId: string;
  status: string;

  isProtected: boolean;

  approvedAt: Date | null;

  approvedBy: string | null;
  approvedByName?: string | null;

  phone: string;
  location: string;
  address: string;
  bio: string;
  lastActive: Date | null;

  createdAt: Date;

  updatedAt: Date;
}