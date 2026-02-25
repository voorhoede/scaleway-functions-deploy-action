import { getNamespace } from "./get-namespace";
import { createNamespace } from "./create-namespace";
import { getFunction } from "./get-function";
import { createFunction } from "./create-function";
import { uploadFunction } from "./upload-function";
import { deployFunction } from "./deploy-function";

export default async function createDeployment({
  namespaceName,
}: {
  namespaceName: string;
}) {
  let namespace = await getNamespace(namespaceName);

  console.log(namespace ? `Namespace found!` : `Namespace not found!`);

  if (!namespace) {
    namespace = await createNamespace({ namespaceName });
    console.log(`Namespace created!`);
  }

  let scwFunction = await getFunction({ namespaceId: namespace.id });

  console.log(scwFunction ? `Function exists!` : `Function does not exist!`);

  if (!scwFunction) {
    scwFunction = await createFunction({ namespaceId: namespace.id });
    console.log(`Function created!`);
  }

  if (scwFunction) {
    console.log(`Uploading function...`);
    await uploadFunction({ functionId: scwFunction.id });
    console.log(`Function uploaded!`);
    console.log(`Deploying function...`);
    await deployFunction({
      namespaceId: namespace.id,
      functionId: scwFunction.id,
    });
    console.log(`Function deployed!`);
  }
}
