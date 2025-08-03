import fs from 'fs';
import path from 'path';

export const getAllCommandFiles = (dir: string, fileList: string[] = []): string[] => {
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllCommandFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
};
