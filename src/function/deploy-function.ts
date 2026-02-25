import { getInput } from "@actions/core";
import { REGION } from "../constants";
import { getFunction } from "./get-function";

const waitForFunctionReady = async ({
  namespaceId,
}: {
  namespaceId: string;
}): Promise<string> => {
  const fn = await getFunction({ namespaceId });
  const { status } = fn;

  console.log(`Function status: ${status}`);

  if (status === "pending") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return waitForFunctionReady({ namespaceId });
  }

  return status;
};

export const deployFunction = async ({
  namespaceId,
  functionId,
}: {
  namespaceId: string;
  functionId: string;
}) => {
  const secretKey = getInput("scw_secret_access_key");

  const url = new URL(
    `https://api.scaleway.com/functions/v1beta1/regions/${REGION}/functions/${functionId}/deploy`,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "X-Auth-Token": secretKey,
      "Content-Type": "application/json",
    }),
  });

  await response.json();

  const finalStatus = await waitForFunctionReady({ namespaceId });
  console.log(`Function is ready with status: ${finalStatus}`);
};
