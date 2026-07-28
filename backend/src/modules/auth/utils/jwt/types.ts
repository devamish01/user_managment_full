export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
  role: string;
};

export type RefreshTokenPayload = {
  userId: string;
  sessionId: string;
};
