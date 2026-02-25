import { glob } from "fast-glob";
import { relative } from "path";
import { client } from "./client";
import { createReadStream } from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import mime from "mime-types";

export async function uploadDirectory(bucketName: string, sourceDir: string) {
  let uploadCount = 0;
  const files = await glob(`${sourceDir}/**/*`, { onlyFiles: true });

  for (const filePath of files) {
    const relativePath = relative(sourceDir, filePath.toString());
    const fileStream = createReadStream(filePath);

    const upload = new Upload({
      client: client,
      params: {
        Bucket: bucketName,
        Key: relativePath,
        Body: fileStream,
        ContentType: mime.lookup(relativePath) || "application/octet-stream",
      },
    });

    try {
      await upload.done();
      uploadCount++;
      console.log(`${filePath.toString()} uploaded`);
    } catch (error) {
      console.error(`Error ${relativePath}:`, error);
    }
  }

  console.log(`Upload completed! Uploaded ${uploadCount} files`);
}
