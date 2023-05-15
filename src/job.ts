import { Job } from "bullmq";
import { PdfProcessTaskData } from "./types";

export async function processPdfTask(job: Job<PdfProcessTaskData>) {
  console.log("Processing PDF task", job.data);

  // Next step download the file
  return true;
}
