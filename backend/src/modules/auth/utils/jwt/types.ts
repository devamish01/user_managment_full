export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
  role: string;
  roleId: string;
  isSuperAdmin: boolean;
};

export type RefreshTokenPayload = {
  userId: string;
  sessionId: string;
};
