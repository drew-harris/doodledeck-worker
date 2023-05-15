import { Job } from "bullmq";
import { env } from "./environment";
import { PdfProcessTaskData } from "./types";
import path from "path";
import fs from "fs";
import { Stream } from "stream";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  region: "us-east-1",
});

async function downloadFile(key: string, jobName: string) {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  });
  const response = await s3.send(command);

  const filePath = path.join(__dirname, "..", "tmp", jobName, key);

  // Ensure directory exists
  fs.mkdirSync(path.join(__dirname, "..", "tmp", jobName), {
    recursive: true,
  });

  const writableStream = fs.createWriteStream(filePath);

  const stream = response.Body as Stream;

  return new Promise((resolve, reject) => {
    stream.pipe(writableStream);

    writableStream.on("finish", () => {
      writableStream.close();
      console.log("Finished downloading file");
      resolve(true);
    });

    writableStream.on("error", (err) => {
      console.log("Error downloading file", err);
      writableStream.close();
      reject(err);
    });
  });
}

export async function processPdfTask(job: Job<PdfProcessTaskData>) {
  console.log("Processing PDF task", job.data);

  await downloadFile(job.data.key, job.name);

  // Update progress every second
  const interval = setInterval(async () => {
    const progress = job.progress;
    if (typeof progress == "number" && progress < 100) {
      await job.updateProgress(progress + 9);
    }
  }, 500);

  // Do some work
  await new Promise((resolve) => setTimeout(resolve, 5000));

  clearInterval(interval);

  // set progress to 100%
  await job.updateProgress(100);

  return true;
}
