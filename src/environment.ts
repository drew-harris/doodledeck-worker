import dotenv from "dotenv";
dotenv.config();
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /*
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  clientPrefix: "PUBLIC_",
  server: {
    REDIS_URL: z.string().url(),
    PDF_QUEUE_NAME: z.string(),
  },
  client: {},
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: process.env,
});

export const validateEnv = () => {
  if (env.REDIS_URL && env.PDF_QUEUE_NAME) {
    return true;
  }
};
