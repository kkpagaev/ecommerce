import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { Pool } from "pg";
import { sql } from "@pgtyped/runtime";
import {
  IFileUploadListQueryQuery,
  type IFileUploadInsertQueryQuery,
  IFileUploadDeleteQueryQuery,
  IFileFindByIdQueryQuery,
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
const fileUploadDeleteQuery = sql<IFileUploadDeleteQueryQuery>`DELETE FROM file_uploads WHERE id = $id!`;

const fileFindByIdQuery = sql<IFileFindByIdQueryQuery>`SELECT * FROM file_uploads WHERE id = $id! LIMIT 1`;

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

  async upload(str: string, ext: string, mime: string) {
    const id = randomUUID();
    const file = await this.fileUpload.upload(str, ext, mime);

    const res: UploadedFile = {
      id: id,
      filename: file.filename,
      mimetype: mime,
      url: file.url,
    };

    return res;
  }

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

  async findById(id: string) {
    const res = await fileFindByIdQuery.run(
      {
        id: id,
      },
      this.pool,
    );

    return res[0];
  }

  async delete(id: string) {
    return await fileUploadDeleteQuery
      .run(
        {
          id: id,
        },
        this.pool,
      )
      .then((r) => r[0]!);
  }
}

export interface FileUploadProvider {
  uploadFile(file: Buffer): Promise<UploadedFile>;
  upload(str: string, ext: string, mime: string): Promise<UploadedFile>;
}

export class LocalStorageProvider implements FileUploadProvider {
  constructor(
    public path: string,
    public url: string,
  ) {}

  async upload(str: string, ext: string, mime: string) {
    const fileId = randomUUID();
    const filename = `file_${fileId}.${ext}`;

    const filePath = path.join(this.path, filename);

    await fs.promises.writeFile(filePath, str);

    const url = `${this.url}/${filename}`;

    const res: UploadedFile = {
      id: fileId,
      filename: filename,
      mimetype: mime,
      url: url,
    };

    return res;
  }
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
