import { getInput } from "@actions/core";
import { BUCKET_ENDPOINT, REGION } from "../constants";

export const createNamespace = async ({ namespaceName }: { namespaceName: string }) => {
  const secretKey = getInput("scw_secret_access_key");
  const projectId = getInput("scw_project_id");

  const url = new URL(
    `https://api.scaleway.com/functions/v1beta1/regions/${REGION}/namespaces`,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "X-Auth-Token": secretKey,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name: namespaceName,
      project_id: projectId,
      environment_variables: {
        BUCKET_ENDPOINT: BUCKET_ENDPOINT,
      }
    }),
  });

  return await response.json();
};
