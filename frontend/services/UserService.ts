import axios from "axios";

const userApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
});

export const fetchUserData = async (id: string) => {
  const res = await userApi.get(`/api/users/${id}`);
  return res.data;
};
