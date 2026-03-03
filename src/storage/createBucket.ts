import {
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { client } from "./client";
import { getInput } from "@actions/core";

export async function createBucket(bucketName: string) {
  const secretAccessKey = getInput("scw_secret_access_key", { required: true });

  const createBucketCommand = new CreateBucketCommand({ Bucket: bucketName });
  await client.send(createBucketCommand);

  const putBucketPolicyCommand = new PutBucketPolicyCommand({
    Bucket: bucketName,
    Policy: JSON.stringify({
      Id: "Function Access",
      Statement: [
        {
          Sid: "Public Read",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [bucketName, `${bucketName}/*`],
        },
        {
          Sid: "Scaleway secure statement",
          Effect: "Allow",
          Principal: {
            SCW: [
              `user_id:${secretAccessKey}`
            ],
          },
          Action: "*",
          Resource: [bucketName, `${bucketName}/*`],
        },
      ],
    }),
  });
  await client.send(putBucketPolicyCommand);
}
