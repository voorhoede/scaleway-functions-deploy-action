import { join } from 'node:path';
import { getInput } from '@actions/core';
import { uploadDirectory } from './upload';
import { ensureBucket } from "./ensureBucket";
import { emptyBucket } from "./emptyBucket";
import { createBucket } from "./createBucket";

export default async function createDeployment({ bucketName }) {
  const bucketExists = await ensureBucket(bucketName);

  if (bucketExists) {
    await emptyBucket(bucketName);
  } else {
    await createBucket(bucketName);
  }

  await uploadDirectory(bucketName, join(process.cwd(), getInput('dist_path'), 'client'));
}
