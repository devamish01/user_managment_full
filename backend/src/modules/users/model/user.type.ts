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

  approvedAt: Date | null;

  approvedBy: string | null;

  createdAt: Date;

  updatedAt: Date;
}