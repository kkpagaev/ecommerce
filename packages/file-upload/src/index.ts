import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { Pool } from "pg";
import { sql } from "@pgtyped/runtime";
import { type IFileUploadInsertQueryQuery } from "./queries/index.types";

const fileUploadInsertQuery = sql<IFileUploadInsertQueryQuery>`INSERT
  INTO file_uploads
  (id, filename, mimetype, url) 
  VALUES ($id, $filename, $mimetype, $url)
  RETURNING *
`;

export interface UploadedFile {
  id: string;
  filename: string;
  mimetype: string;
  url: string;
}

export interface FileUploadProvider {
  uploadFile(file: Buffer): Promise<UploadedFile>;
}

export class LocalStorageProvider implements FileUploadProvider {
  constructor(
    public path: string,
    public url: string,
    public pool: Pool,
  ) {}

  // saves file to disk and saves metadata to DB
  async uploadFile(file: Buffer) {
    const fileTypeResult = await fileTypeFromBuffer(file);

    if (!fileTypeResult) {
      throw new Error("Could not determine file type");
    }
    const { mime, ext } = fileTypeResult;
    const fileId = randomUUID();
    const filename = `file_${fileId}.${ext}`;

    const filePath = path.join(this.path, filename);
    await fs.promises.writeFile(filePath, file);

    const url = `${this.url}/${filename}`;

    const uploadedFile: UploadedFile = {
      id: fileId,
      filename: filename,
      mimetype: mime,
      url: url,
    };

    const res = await fileUploadInsertQuery
      .run(uploadedFile, this.pool)
      .then((r) => r[0]!);

    return res;
  }
}
