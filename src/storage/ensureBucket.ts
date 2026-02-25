import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { client } from "./client";

export async function ensureBucket(bucketName: string) {
  try {
    const headCommand = new HeadBucketCommand({ Bucket: bucketName });
    const { $metadata } = await client.send(headCommand);

    if ($metadata.httpStatusCode === 200) {
      console.log(`Bucket found!`);
      return true;
    }
  } catch {
    console.log(`No bucket found!`);
    return false;
  }
}
