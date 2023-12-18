import axios, { AxiosRequestConfig } from "axios";

export async function uploadFile(data: FormData, optioins: AxiosRequestConfig) {
  const res = await axios.post("/api/upload", data, optioins);
  if (res.status !== 200) {
    throw new Error("Failed to upload file");
  }
  return res.data;
}

export async function getThumbnails(filename: string) {
  return await fetch("/api/thumbnails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  }).then((res) => res.json());
}
