import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
});

export const signupRequest = async (data: any) => {
  const res = await authApi.post("/api/signup", data);
  return res.data;
};

export const loginRequest = async (data: any) => {
  const res = await authApi.post("/api/login", data);
  return res.data;
};
