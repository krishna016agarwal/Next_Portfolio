// src/helpers/parseForm.ts
import Busboy from 'busboy';
import { tmpdir } from 'os';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export function parseFormData(req: Request): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: Object.fromEntries(req.headers),
    });

    const fields: any = {};
    const files: any = {};

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filename) => {
      const saveTo = path.join(tmpdir(), `${Date.now()}-${filename}`);
      const writeStream = fs.createWriteStream(saveTo);
      file.pipe(writeStream);

      files[fieldname] = {
        filepath: saveTo,
        filename,
      };

      writeStream.on('close', () => {});
    });

    busboy.on('finish', () => {
      resolve({ fields, files });
    });

    busboy.on('error', (err) => {
      reject(err);
    });

    Readable.fromWeb(req.body as any).pipe(busboy);
  });
}
