import { fetchAllUsers } from "@/services/UserService";
import { Card, Avatar } from "@nextui-org/react";
import useSWR from "swr";

function FriendSection() {
  const { data: friendsData, isLoading: isFriendsLoading } = useSWR(
    "friends",
    fetchAllUsers,
    {
      onError: (err) => {
        console.log("Friends api error", err);
      },
    }
  );
  return (
    <div>
      <div className="flex flex-col gap-2">
        {isFriendsLoading || !friendsData
          ? ""
          : friendsData.map((friend: any) => (
              <FriendTile key={friend._id} friend={friend} />
            ))}
      </div>
    </div>
  );
}

function FriendTile({ friend }: { friend: any }) {
  return (
    <Card shadow="sm" radius="sm" className="bg-primaryWhite p-2 mx-1">
      <div className="flex gap-3 items-center">
        <Avatar
          radius="full"
          isBordered
          src="https://nextui.org/avatars/avatar-1.png"
          className="w-6 h-6"
        />
        <div className="flex flex-col items-start justify-center">
          <h4 className="text-xs font-semibold leading-none text-default-600">
            {friend.firstName} {friend.lastName}
          </h4>
          <h5 className="text-xs text-default-400">@newuser</h5>
        </div>
      </div>
    </Card>
  );
}

export default FriendSection;
