"use client";

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

const sendFriendRequest = () => {};

function UserTile({ user }: { user: any }) {
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
          <Button
            onClick={sendFriendRequest}
            className="bg-neuBlue text-primaryWhite"
            radius="sm"
            size="sm"
          >
            Add Friend
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default FindUsersList;
