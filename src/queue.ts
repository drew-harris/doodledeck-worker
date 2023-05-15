import IORedis from "ioredis";
import { Worker } from "bullmq";
import { env } from "./environment";
import { processPdfTask } from "./job";
import { PdfProcessTaskData } from "./types";

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const pdfWorker = new Worker<PdfProcessTaskData>(
  env.PDF_QUEUE_NAME,
  processPdfTask,
  {
    connection,
    autorun: false,
  }
);
