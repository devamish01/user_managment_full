
import "dotenv/config";

import app from "./app.js";
import { env } from "@/config/index.js";
import { connectDB } from "@/core/database/index.js";
import { seedPermissions } from "@/modules/permissions/services/seed.permissions.js";
import { seedRoles } from "@/modules/roles/services/seed.roles.js";
import { seedSuperAdminUser } from "@/modules/users/services/seed.users.js";

const startServer = async () => {
  await connectDB();
  await seedPermissions();
  await seedRoles();
  await seedSuperAdminUser();

  app.listen(env.PORT, () => {
    console.log(`Server running on localhost:${env.PORT}`);
  });
};

startServer();