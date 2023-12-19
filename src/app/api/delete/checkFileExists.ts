import path from "path";

const checkFileExists = (filename: string) => {
  const absolute_path = path.join(
    process.cwd(),
    "public",
    "tmp",
    "videos",
    filename
  );
  return fs.existsSync(absolute_path);
};
