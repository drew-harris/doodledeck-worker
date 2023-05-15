import dotenv from "dotenv";
dotenv.config();
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  server: {
    REDIS_URL: z.string().url(),
    PDF_QUEUE_NAME: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_BUCKET: z.string(),
  },
  client: {},
  runtimeEnv: process.env,
});

export const validateEnv = () => {
  if (env.REDIS_URL && env.PDF_QUEUE_NAME) {
    return true;
  }
};
