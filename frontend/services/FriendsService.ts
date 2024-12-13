import axios from "axios";

const friendsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
});

export const fetchUserFriends = async (id: string) => {
  const res = await friendsApi.get(`/api/users/friends/${id}`);
  return res.data;
};

export const fetchUnknownUsers = async (id: string) => {
  const res = await friendsApi.get(`/api/users/find-new/${id}`);
  return res.data;
};
