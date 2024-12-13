"use client";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setUserObj } from "@/app/lib/user/userSlice";
import { sendFriendRequest } from "@/services/FriendsService";
import { Avatar, Button, Card } from "@nextui-org/react";
import Link from "next/link";

function FindUsersList({
  isUsersLoading,
  userList,
}: {
  isUsersLoading: boolean;
  userList: any[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-6">
        {isUsersLoading || !userList
          ? ""
          : userList.map((user: any) => (
              <UserTile key={user._id} user={user} />
            ))}
      </div>
    </div>
  );
}

function UserTile({ user }: { user: any }) {
  const currentUser = useAppSelector((state) => state.user.userObj);
  const dispatch = useAppDispatch();
  const requestSent = currentUser.friendRequests.sent.includes(user._id);
  const addFriend = async () => {
    const updatedUser = {
      ...currentUser,
      friendRequests: {
        ...currentUser.friendRequests,
        sent: [...currentUser.friendRequests.sent, user._id],
      },
    };
    dispatch(setUserObj(updatedUser));
    try {
      const res = await sendFriendRequest({
        senderId: currentUser._id,
        recipientId: user._id,
      });
    } catch (err) {
      console.log("Send friend request error", err);
    }
  };
  return (
    <Card className="bg-primaryWhite px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar
            src={
              user.profilePicture ? user.profilePicture : "/images/avatar.jpg"
            }
            className="w-12 h-12"
            isBordered
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${user.username}`}>
                <h2 className="font-bold hover:underline">
                  {user.firstName} {user.lastName}
                </h2>
              </Link>

              <h5 className="text-sm text-default-400">@{user.username}</h5>
            </div>

            <h5 className="text-sm">{user.course}</h5>
          </div>
        </div>
        <div>
          {requestSent ? (
            <Button radius="sm" size="sm" color="default">
              Request Sent
            </Button>
          ) : (
            <Button
              onClick={addFriend}
              className="bg-neuBlue text-primaryWhite"
              radius="sm"
              size="sm"
            >
              Add Friend
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default FindUsersList;
