
import "dotenv/config";

import app from "./app.js";
import { env } from "@/config/index.js";
import { connectDB } from "@/core/database/index.js";
import { seedPermissions } from "@/modules/permissions/services/seed.permissions.js";
import { seedRoles } from "@/modules/roles/services/seed.roles.js";

const startServer = async () => {
  await connectDB();
  await seedPermissions();
  await seedRoles();

  app.listen(env.PORT, () => {
    console.log(`Server running on localhost:${env.PORT}`);
  });
};

startServer();