import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { Pool } from "pg";
import { sql } from "@pgtyped/runtime";
import {
  IFileUploadListQueryQuery,
  type IFileUploadInsertQueryQuery,
} from "./queries/index.types";

const fileUploadInsertQuery = sql<IFileUploadInsertQueryQuery>`INSERT
  INTO file_uploads
  (id, filename, mimetype, url) 
  VALUES ($id, $filename, $mimetype, $url)
  RETURNING *
`;

const fileUploadListQuery = sql<IFileUploadListQueryQuery>`
  SELECT * FROM file_uploads
  ORDER BY created_at DESC
`;

export interface UploadedFile {
  id: string;
  filename: string;
  mimetype: string;
  url: string;
}

export class Files {
  constructor(
    public fileUpload: FileUploadProvider,
    public pool: Pool,
  ) {}

  async uploadFile(file: Buffer) {
    const meta = await this.fileUpload.uploadFile(file);

    const res = await fileUploadInsertQuery
      .run(
        {
          id: meta.id,
          filename: meta.filename,
          mimetype: meta.mimetype,
          url: meta.url,
        },
        this.pool,
      )
      .then((r) => r[0]!);

    return res;
  }

  async list() {
    const res = await fileUploadListQuery.run(undefined, this.pool);

    return res;
  }
}

export interface FileUploadProvider {
  uploadFile(file: Buffer): Promise<UploadedFile>;
}

export class LocalStorageProvider implements FileUploadProvider {
  constructor(
    public path: string,
    public url: string,
  ) {}

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

    const res: UploadedFile = {
      id: fileId,
      filename: filename,
      mimetype: mime,
      url: url,
    };

    return res;
  }
}
