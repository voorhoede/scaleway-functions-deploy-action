import { getInput } from "@actions/core";
import { S3Client } from "@aws-sdk/client-s3";
import { ENDPOINT, REGION } from "../constants";

const accessKeyId = getInput("scw_access_key_id", { required: true });
const secretAccessKey = getInput("scw_secret_access_key", { required: true });

export const client = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
