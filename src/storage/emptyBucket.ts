import {
  DeleteObjectsCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { client } from "./client";

export async function emptyBucket(bucketName: string) {
  const listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName });
  const { Contents } = await client.send(listObjectsCommand);

  console.log(`Emptying bucket`);

  if (Contents) {
    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: Contents.map(({ Key }) => ({ Key })),
      },
    });

    const { Deleted, $metadata } = await client.send(deleteObjectsCommand);

    if ($metadata.httpStatusCode === 200) {
      console.log(`Bucket emptied! ${Deleted?.length || 0} objects deleted`);
    }
  }
}
