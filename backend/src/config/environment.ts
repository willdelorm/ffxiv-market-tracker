import dotenv from "dotenv";
import path from "path";

// Load environment-specific .env file
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${nodeEnv}`;

// Try to load environment-specific file first, then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  // Server
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  databaseUrl: process.env.DATABASE_URL || "",

  // Security
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-in-production",

  // CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ],

  // Features
  debug: process.env.DEBUG === "true",
  logLevel: process.env.LOG_LEVEL || "info",

  // External services
  redisUrl: process.env.REDIS_URL || "",
  apiKey: process.env.API_KEY || "",
};

export const validateConfig = () => {
  const required = ["DATABASE_URL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(", ")}`);
  }

  if (
    config.nodeEnv === "production" &&
    config.jwtSecret === "fallback-secret-change-in-production"
  ) {
    throw new Error("JWT_SECRET must be set in production environment");
  }
};

// Run validation on import
validateConfig();
