import { getInput } from "@actions/core";
import { context } from "@actions/github";
import { REGION } from "../constants";
import { sanitizeName } from "../utils/sanitizeName";

export const getFunction = async ({ namespaceId }: { namespaceId: string }) => {
  const secretKey = getInput("scw_secret_access_key");
  const branchName = sanitizeName(context.ref.replace("refs/heads/", ""));

  const url = new URL(
    `https://api.scaleway.com/functions/v1beta1/regions/${REGION}/functions`,
  );

  url.searchParams.append("namespace_id", namespaceId);
  url.searchParams.append("name", branchName);

  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      "X-Auth-Token": secretKey,
    }),
  });

  const { functions } = await response.json();

  return functions
    ? functions.find(({ name }) => name === branchName)
    : undefined;
};
