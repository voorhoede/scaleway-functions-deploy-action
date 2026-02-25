import { getInput } from "@actions/core";
import { REGION } from "../constants";

export const getNamespace = async (namespaceName: string) => {
  const secretKey = getInput("scw_secret_access_key");

  const url = new URL(
    `https://api.scaleway.com/functions/v1beta1/regions/${REGION}/namespaces`,
  );

  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      "X-Auth-Token": secretKey,
    }),
  });

  const { namespaces } = await response.json();

  return namespaces
    ? namespaces.find(({ name }) => name === namespaceName)
    : undefined;
};
