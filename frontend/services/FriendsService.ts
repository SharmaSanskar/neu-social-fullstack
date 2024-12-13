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

export const sendFriendRequest = async (data: {
  senderId: string;
  recipientId: string;
}) => {
  const res = await friendsApi.post(`/api/users/friend-request/send`, data);
  return res.data;
};

export const acceptFriendRequest = async (data: {
  userId: string;
  senderId: string;
}) => {
  const res = await friendsApi.post(`/api/users/friend-request/accept`, data);
  return res.data;
};

export const removeFriendRequest = async (data: {
  userId: string;
  friendId: string;
}) => {
  const res = await friendsApi.post(`/api/users/friends/remove`, data);
  return res.data;
};
