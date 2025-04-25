import { randomUUID } from 'crypto';
import * as multer from 'multer';
import { extname } from 'path';

export const uploadDiskFile = (path: string): multer.StorageEngine => {
  const s = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const fname = randomUUID() + extname(file.originalname);
      cb(null, fname);
    },
  });
  return s;
};
