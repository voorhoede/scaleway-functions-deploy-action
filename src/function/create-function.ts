import { getInput } from "@actions/core";
import { context } from "@actions/github";
import { sanitizeName } from "../utils/sanitizeName";
import { REGION } from "../constants";

export const createFunction = async ({ namespaceId }: { namespaceId: string }) => {
  const secretKey = getInput("scw_secret_access_key");
  const branchName = sanitizeName(context.ref.replace("refs/heads/", ""));

  const url = new URL(
    `https://api.scaleway.com/functions/v1beta1/regions/${REGION}/functions`,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "X-Auth-Token": secretKey,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name: sanitizeName(branchName),
      namespace_id: namespaceId,
      runtime: "node22",
    }),
  });

  return await response.json();
};
