import axios, { AxiosRequestConfig } from "axios";

export async function uploadFile(data: FormData, optioins: AxiosRequestConfig) {
  const res = await axios.post("/api/upload", data, optioins);
  if (res.status !== 200) {
    throw new Error("Failed to upload file");
  }
  return res.data;
}
