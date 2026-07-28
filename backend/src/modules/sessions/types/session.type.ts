export interface ISession {
  sessionId: string;

  userId: string;

  refreshTokenHash: string;

  device?: string | null;

  browser?: string | null;

  os?: string | null;

  ipAddress?: string | null;

  userAgent?: string | null;

  isRevoked: boolean;

  expiresAt: Date;

  lastActiveAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

export type CreateSessionInput = {
  sessionId: string;

  userId: string;

  refreshTokenHash: string;

  device?: string;

  browser?: string;

  os?: string;

  ipAddress?: string;

  userAgent?: string;

  expiresAt: Date;
};