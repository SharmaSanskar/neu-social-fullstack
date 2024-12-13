import { fetchUserFriends } from "@/services/FriendsService";
import { Avatar, Button, Card } from "@nextui-org/react";
import { useState } from "react";
import useSWR from "swr";
import { FaUserSlash } from "react-icons/fa";

function UserFriends({ userId }: { userId: string }) {
  const [friendsList, setFriendList] = useState([]);
  const { data: friendsData, isLoading: isFriendsLoading } = useSWR(
    ["users", userId],
    () => fetchUserFriends(userId),
    {
      onSuccess: (data) => {
        setFriendList(data);
      },
      onError: (err) => {
        console.log("Users api error", err);
      },
    }
  );
  return (
    <div>
      <div className="flex flex-col gap-6 mt-4">
        {!isFriendsLoading && friendsList.length == 0 && <NoFriendsMessage />}

        {isFriendsLoading || !friendsList
          ? ""
          : friendsList.map((user: any) => (
              <FriendTile key={user._id} user={user} />
            ))}
      </div>
    </div>
  );
}

function FriendTile({ user }: { user: any }) {
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
              <h2 className="font-bold">
                {user.firstName} {user.lastName}
              </h2>

              <h5 className="text-sm text-default-400">@{user.username}</h5>
            </div>

            <h5 className="text-sm">{user.course}</h5>
          </div>
        </div>
        <div>
          <Button
            className="bg-neuBlue text-primaryWhite"
            radius="sm"
            size="sm"
          >
            Follow
          </Button>
        </div>
      </div>
    </Card>
  );
}

function NoFriendsMessage() {
  return (
    <div className="w-full text-center text-xl font-bold flex flex-col items-center gap-2">
      <FaUserSlash size={60} />
      <p>No friends found</p>
    </div>
  );
}

export default UserFriends;
