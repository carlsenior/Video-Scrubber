import fs from "fs";
export function getFilenamesInFolderSorted(folderPath: string) {
  try {
    const filenames = fs.readdirSync(folderPath);
    return filenames.sort();
  } catch (error) {
    console.error(error);
    return [];
  }
}
