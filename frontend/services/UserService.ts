import axios from "axios";

const userApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
});

export const fetchUserData = async (id: string) => {
  const res = await userApi.get(`/api/users/${id}`);
  return res.data;
};

export const fetchUserDataByUsername = async (username: string) => {
  const res = await userApi.get(`/api/users/username/${username}`);
  return res.data;
};

export const fetchAllUsers = async () => {
  const res = await userApi.get(`/api/users`);
  return res.data;
};

export const updateUserProfile = async (userId: string, newProfile: any) => {
  const res = await userApi.put(`/api/users/${userId}`, newProfile);
  return res.data;
};

export const updateUserProfilePicture = async (
  userId: string,
  data: { profilePictureUrl: string }
) => {
  const res = await userApi.put(`/api/users/${userId}/profile-picture`, data);
  return res.data;
};
