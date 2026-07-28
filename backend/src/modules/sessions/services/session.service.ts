import { Session } from "@/modules/sessions/models/index.js";
import { CreateSessionInput } from "@/modules/sessions/types/session.type.js";

export const createSession = async (
  data: CreateSessionInput,
) => {
  return Session.create(data);
};

export const findSessionBySessionId = async (
  sessionId: string,
) => {
  return Session.findOne({
    sessionId,
  });
};

export const findActiveSession = async (
  sessionId: string,
  userId: string,
) => {
  return Session.findOne({
    sessionId,
    userId,
    isRevoked: false,
    expiresAt: {
      $gt: new Date(),
    },
  });
};

export const updateLastActive = async (
  sessionId: string,
) => {
  return Session.updateOne(
    {
      sessionId,
    },
    {
      $set: {
        lastActiveAt: new Date(),
      },
    },
  );
};

export const revokeSession = async (
  sessionId: string,
) => {

  const session = await Session.findOne({
    sessionId,
  });


  if (!session) {
    return false;
  }


  if (session.isRevoked) {
    return false;
  }


  await Session.updateOne(
    {
      sessionId,
    },
    {
      $set: {
        isRevoked: true,
      },
    },
  );


  return true;
};

export const revokeAllSessions = async (
  userId: string,
) => {
  return Session.updateMany(
    {
      userId,
      isRevoked: false,
    },
    {
      $set: {
        isRevoked: true,
      },
    },
  );
};

export const deleteExpiredSessions = async () => {
  return Session.deleteMany({
    expiresAt: {
      $lte: new Date(),
    },
  });
};

export const countActiveSessions = async (
 userId:string,
) => {

 return Session.countDocuments({
   userId,
   isRevoked:false,
   expiresAt:{
     $gt:new Date(),
   },
 });

};