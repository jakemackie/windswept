import path from 'path';

export const filterTopLevelCommands = (
  files: string[],
  rootDir: string
): string[] => {
  return files.filter((filePath) => {
    const relative = path.relative(rootDir, filePath);
    const segments = relative.split(path.sep);
    const fileName = path.basename(filePath, path.extname(filePath));
    
    return segments.length === 2 || (segments.length === 3 && fileName === segments[segments.length - 2]);
  });
};
