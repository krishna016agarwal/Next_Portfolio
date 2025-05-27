// src/helpers/parseForm.ts
import Busboy from 'busboy';
import { tmpdir } from 'os';
import { type ReadableStream as WebReadableStreamType } from 'stream/web';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream'; // Node.js Readable stream

// Define types for the parsed form data
export interface UploadedFile {
  filepath: string;
  originalFilename: string;
  mimeType: string;
  size: number; // Size of the file in bytes
}

export interface ParsedFormData {
  fields: Record<string, string>; // Form fields (key-value pairs)
  files: Record<string, UploadedFile>; // Uploaded files (keyed by fieldname)
}

export function parseFormData(req: Request): Promise<ParsedFormData> {
  console.log('[parseFormData] Started');
  return new Promise((resolve, reject) => {
    const headers = req.headers;
    const busboyHeaders: Record<string, string> = {};
    headers.forEach((value, key) => {
      busboyHeaders[key.toLowerCase()] = value; // Normalize header keys
    });
    console.log('[parseFormData] Request Headers for Busboy:', busboyHeaders);


    if (!busboyHeaders['content-type'] || !busboyHeaders['content-type'].includes('multipart/form-data')) {
        console.error('[parseFormData] Error: Invalid Content-Type. Must be multipart/form-data.');
        return reject(new Error('Invalid request: Content-Type must be multipart/form-data.'));
    }

    let busboyInstance: Busboy.Busboy;
    try {
        busboyInstance = Busboy({
            headers: busboyHeaders,
        });
        console.log('[parseFormData] Busboy instance created.');
    } catch (error) {
        console.error("[parseFormData] Error initializing Busboy:", error);
        return reject(error instanceof Error ? error : new Error('Failed to initialize form parser due to invalid headers.'));
    }

    const fields: Record<string, string> = {};
    const files: Record<string, UploadedFile> = {};
    const fileWritePromises: Promise<void>[] = [];

    busboyInstance.on('field', (fieldname: string, val: string) => {
      console.log(`[parseFormData] Field received: ${fieldname}`);
      fields[fieldname] = val;
    });

    busboyInstance.on('file', (
        fieldname: string,
        fileStream: Readable, // This is a Node.js Readable stream from Busboy
        info: { filename: string; encoding: string; mimeType: string }
    ) => {
      const { filename: originalFilenameFromInfo, mimeType } = info;
      console.log(`[parseFormData] File received: ${fieldname}, originalName: ${originalFilenameFromInfo}, mimeType: ${mimeType}`);
      
      const originalFilename = originalFilenameFromInfo || 'unknownfile';
      const safeDiskFilename = `${Date.now()}-${path.basename(originalFilename)}`;
      const saveTo = path.join(tmpdir(), safeDiskFilename);
      console.log(`[parseFormData] Saving file ${fieldname} to: ${saveTo}`);
      
      const writeStream = fs.createWriteStream(saveTo);
      let currentFileSize = 0;

      const writePromise = new Promise<void>((resolveFile, rejectFile) => {
        fileStream.on('data', (chunk: Buffer) => {
            currentFileSize += chunk.length;
        });

        fileStream.pipe(writeStream);

        writeStream.on('finish', () => {
            console.log(`[parseFormData] File ${fieldname} finished writing to ${saveTo}. Size: ${currentFileSize}`);
            files[fieldname] = {
                filepath: saveTo,
                originalFilename: originalFilename,
                mimeType: mimeType,
                size: currentFileSize
            };
            resolveFile();
        });

        writeStream.on('error', (err) => {
            console.error(`[parseFormData] Error writing file ${originalFilename} to ${saveTo}:`, err);
            fs.unlink(saveTo, (unlinkErr) => {
              if (unlinkErr) console.error(`[parseFormData] Error cleaning up partially written file ${saveTo} after write error:`, unlinkErr);
            });
            rejectFile(err);
        });

        fileStream.on('error', (err) => { // Errors from the source stream
            console.error(`[parseFormData] Error in source file stream for ${fieldname} (${originalFilename}):`, err);
            if (writeStream && !writeStream.closed) {
                writeStream.destroy(); 
            }
            fs.unlink(saveTo, (unlinkErr) => {
              if (unlinkErr) console.error(`[parseFormData] Error cleaning up file ${saveTo} after source stream error:`, unlinkErr);
            });
            rejectFile(err);
        });
      });
      fileWritePromises.push(writePromise);
    });

    busboyInstance.on('finish', async () => {
      console.log('[parseFormData] Busboy finished parsing. Waiting for file writes...');
      try {
        await Promise.all(fileWritePromises);
        console.log('[parseFormData] All files written. Resolving.');
        resolve({ fields, files });
      } catch (error) {
        console.error('[parseFormData] Error during file writing stage (Promise.all):', error);
        Object.values(files).forEach(fileInfo => {
          if (fileInfo && fileInfo.filepath) {
            fs.unlink(fileInfo.filepath, (unlinkErr) => {
              if (unlinkErr) console.error(`[parseFormData] Error cleaning up file ${fileInfo.filepath} after Promise.all error:`, unlinkErr);
            });
          }
        });
        reject(error); 
      }
    });

    busboyInstance.on('error', (err: Error) => {
      console.error("[parseFormData] Busboy global parsing error:", err);
      Object.values(files).forEach(fileInfo => {
        if (fileInfo && fileInfo.filepath) {
          fs.unlink(fileInfo.filepath, (unlinkErr) => {
            if (unlinkErr) console.error(`[parseFormData] Error cleaning up file ${fileInfo.filepath} during busboy global error:`, unlinkErr);
          });
        }
      });
      reject(err);
    });

    const requestBody = req.body;
    if (!requestBody) {
      console.error('[parseFormData] Error: Request body is missing.');
      return reject(new Error('Request body is missing. Cannot parse form data.'));
    }

    try {
        console.log('[parseFormData] Piping request body to Busboy...');
        // SOLUTION 1 APPLIED HERE: Cast req.body to ReadableStream<any>
  const nodeReadable = Readable.fromWeb(requestBody as WebReadableStreamType<Uint8Array>);
        nodeReadable.pipe(busboyInstance);
    } catch (error) {
        console.error("[parseFormData] Error piping request body to Busboy:", error);
        reject(error instanceof Error ? error : new Error('Failed to pipe request body for parsing.'));
    }
  });
}