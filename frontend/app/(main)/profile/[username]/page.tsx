"use client";

import { Divider } from "@nextui-org/react";
import UserCard from "./UserCard";
import UserPosts from "./UserPosts";
import { useAppSelector } from "@/app/lib/hooks";
import { fetchUserDataByUsername } from "@/services/UserService";
import { MdLockPerson } from "react-icons/md";
import useSWR from "swr";
import { Tabs, Tab } from "@nextui-org/react";
import UserFriends from "./UserFriends";

function Profile({ params }: { params: { username: string } }) {
  const userObj = useAppSelector((state) => state.user.userObj);

  const isOwnProfile = userObj.username === params.username;

  const { data: userProfileData, isLoading: isUserProfileLoading } = useSWR(
    ["user-profile", params.username],
    () => fetchUserDataByUsername(params.username),
    {
      onSuccess: (data) => {},
      onError: (err) => {
        console.log("User profile api error", err);
      },
    }
  );

  return (
    <div className="px-20 py-8">
      {isUserProfileLoading || !userProfileData ? (
        <div>Getting user profile...</div>
      ) : (
        <>
          <UserCard
            userObj={isOwnProfile ? userObj : userProfileData}
            isOwnProfile={isOwnProfile}
          />
          <Divider className="my-6" />

          {userProfileData.isPrivate && !isOwnProfile ? (
            <PrivateProfileMessage />
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-full text-center">
                <Tabs aria-label="Options" size="lg" variant="solid">
                  <Tab key="posts" title="Posts">
                    <UserPosts userId={userProfileData._id} />
                  </Tab>
                  <Tab key="friends" title="Friends">
                    <UserFriends
                      userId={userProfileData._id}
                      isOwnProfile={isOwnProfile}
                    />
                  </Tab>
                </Tabs>
              </div>
            </div>
            //
          )}
        </>
      )}
    </div>
  );
}

function PrivateProfileMessage() {
  return (
    <div className="w-full text-center text-xl font-bold flex flex-col items-center gap-2">
      <MdLockPerson size={60} />
      <p>This profile is private</p>
    </div>
  );
}

export default Profile;
