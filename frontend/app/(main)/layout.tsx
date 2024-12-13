"use client";
import SideNav from "@/components/SideNav";
import { fetchUserData } from "@/services/UserService";
import useSWR from "swr";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import LoadingScreen from "@/components/LoadingScreen";
import { setUserId, setUserObj } from "../lib/user/userSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = useAppSelector((state) => state.user.userId);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      const localId = localStorage.getItem("userId");
      console.log(localId);
      if (localId) {
        dispatch(setUserId(localId));
      } else {
        router.push("/login");
      }
    }
  }, [userId]);

  const { data: userData, isLoading: isUserLoading } = useSWR(
    userId ? ["userData", userId] : null,
    () => fetchUserData(userId),
    {
      onSuccess: (data) => {
        dispatch(setUserObj(data));
      },
      onError: (err) => {
        // Signout if any authorization error
        console.log("User api error", err);
      },
    }
  );
  return (
    <main>
      {!userId || isUserLoading ? (
        <LoadingScreen message="Getting Your Data" />
      ) : (
        <>
          <SideNav />
          <div className="bg-slate-200 ml-0 md:ml-[14vw] min-h-screen">
            {children}
          </div>
        </>
      )}
    </main>
  );
}
