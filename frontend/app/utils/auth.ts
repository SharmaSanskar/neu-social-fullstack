import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const setAuthUser = (userId: string) => {
  setCookie("userId", userId, {
    req: undefined,
    res: undefined,
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("userId", userId);
  }
};

export const getAuthUser = () => {
  if (typeof window !== "undefined") {
    return getCookie("userId") || localStorage.getItem("userId");
  }
  return null;
};

export const removeAuthUser = () => {
  deleteCookie("userId");

  if (typeof window !== "undefined") {
    localStorage.removeItem("userId");
  }
};

export const isAuthenticated = () => {
  const userId = getAuthUser();
  return !!userId;
};
