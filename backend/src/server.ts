
import "dotenv/config";

import app from "./app.js";
import { env } from "@/config/index.js";
import { connectDB } from "@/core/database/index.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on localhost:${env.PORT}`);
  });
};

startServer();