import { cleanEnv, str, port , num} from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),

  PORT: port({
    default: 5000,
  }),

  API_PREFIX: str({
    default: "/api/v1",
  }),

  MONGODB_URI: str(),
  JWT_ACCESS_SECRET: str(),

  JWT_REFRESH_SECRET: str(),

  JWT_ACCESS_EXPIRES_IN: str(),

  JWT_REFRESH_EXPIRES_IN: str(),
  BCRYPT_SALT_ROUNDS: num(),
});