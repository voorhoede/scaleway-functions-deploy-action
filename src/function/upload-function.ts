import { getInput } from "@actions/core";
import { readFileSync, statSync } from "fs";
import { join } from "path";
import { REGION } from "../constants";

export const uploadFunction = async ({ functionId }: { functionId: string }) => {
  const secretKey = getInput("scw_secret_access_key");

  const zipFilePath = join(process.cwd(), getInput("dist_path"), "function.zip");
  const zipFileBuffer = readFileSync(zipFilePath);
  const fileSize = statSync(zipFilePath).size;

  const url = new URL(
    `https://api.scaleway.com/functions/v1beta1/regions/${REGION}/functions/${functionId}/upload-url`,
  );

  url.searchParams.append("content_length", String(fileSize));

  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      "X-Auth-Token": secretKey,
    }),
  });

  const { url: uploadUrl, headers: uploadHeaders } = await response.json();

  await fetch(uploadUrl, {
    method: "PUT",
    headers: uploadHeaders,
    body: zipFileBuffer,
  });
};
