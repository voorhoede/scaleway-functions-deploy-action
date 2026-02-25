import {
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { client } from "./client";

export async function createBucket(bucketName: string) {
  const createBucketCommand = new CreateBucketCommand({ Bucket: bucketName });
  await client.send(createBucketCommand);

  // const putBucketPolicyCommand = new PutBucketPolicyCommand({
  //   Bucket: bucketName,
  //   Policy: JSON.stringify({
  //     Id: "Function Access",
  //     Statement: [
  //       {
  //         Sid: "Public Read",
  //         Effect: "Allow",
  //         Principal: "*",
  //         Action: ["s3:GetObject"],
  //         Resource: [bucketName, `${bucketName}/*`],
  //       },
  //       {
  //         Sid: "Public Read",
  //         Effect: "Allow",
  //         Principal: "*",
  //         Action: ["*"],
  //         Resource: [bucketName, `${bucketName}/*`],
  //       }
  //     ],
  //   }),
  // });
  // await client.send(putBucketPolicyCommand);
}
