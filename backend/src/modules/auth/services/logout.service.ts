import {
  revokeSession,
} from "@/modules/sessions/services/session.service.js";


export const logout = async (
  sessionId:string,
) => {

  const revoked = await revokeSession(
    sessionId,
  );


  return revoked;
};