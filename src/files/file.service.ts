import { promises } from 'fs';
import { isAbsolute, join } from 'path';

export class FileService {
  private async isExist(path: string) {
    try {
      await promises.stat(path);
      return true;
    } catch {
      return false;
    }
  }

  public getFilePath(path: string) {
    if (!isAbsolute) {
      path = join(__dirname + '/' + path);
    }

    return path;
  }
}
