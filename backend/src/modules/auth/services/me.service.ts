import { User } from "@/modules/users/model/index.js";
import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";


export const getMe = async (
  userId: string,
) => {

  const user = await User.findOne({
    userId,
  });


  if (!user) {
    throw new AppError({
      message: "User not found",
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "USER_NOT_FOUND",
    });
  }


  const userObject = user.toObject();


  return {
    userId: userObject.userId,
    username: userObject.username,

    firstName: userObject.firstName,
    lastName: userObject.lastName,

    email: userObject.email,
    roleId: userObject.roleId,

    role: userObject.role,
    status: userObject.status,

    approvedAt: userObject.approvedAt,
    approvedBy: userObject.approvedBy,

    phone: userObject.phone,
    location: userObject.location,
    address: userObject.address,
    bio: userObject.bio,
    lastActive: userObject.lastActive,

    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt,
  };
};