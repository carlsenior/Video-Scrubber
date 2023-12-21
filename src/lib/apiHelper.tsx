import axios, { AxiosRequestConfig } from "axios";

export async function uploadFile(data: FormData, optioins: AxiosRequestConfig) {
  const res = await axios.post("/api/upload", data, optioins);
  if (res.status !== 200) {
    throw new Error("Failed to upload file");
  }
  return res.data;
}

export async function deleteFile(filename: string) {
  return await fetch("/api/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  }).then((res) => res.json());
}

export async function getTrimedMedia(
  basename: string,
  workfile: string,
  startMs: number,
  endMs: number
) {
  return await fetch("/api/edit/trim", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      basename,
      workfile,
      startMs,
      endMs,
    }),
  }).then((res) => res.json());
}
