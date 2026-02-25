import { getInput } from "@actions/core";
import { sanitizeName } from "./utils/sanitizeName";
import { context } from "@actions/github";

export const REGION = getInput("scw_region", { required: true });
export const INSTANCE_NAME = sanitizeName(context.repo.repo);
export const ENDPOINT = `https://s3.${REGION}.scw.cloud`;
export const BUCKET_ENDPOINT = `https://${INSTANCE_NAME}.s3.${REGION}.scw.cloud`;
