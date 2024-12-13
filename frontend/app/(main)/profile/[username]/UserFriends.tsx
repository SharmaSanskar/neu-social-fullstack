import {
  fetchUserFriends,
  removeFriendRequest,
} from "@/services/FriendsService";
import { Avatar, Button, Card } from "@nextui-org/react";
import { useState } from "react";
import useSWR from "swr";
import { FaUserSlash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setUserObj } from "@/app/lib/user/userSlice";
import Link from "next/link";

function UserFriends({
  userId,
  isOwnProfile,
}: {
  userId: string;
  isOwnProfile: boolean;
}) {
  const [friendsList, setFriendsList] = useState([]);
  const { data: friendsData, isLoading: isFriendsLoading } = useSWR(
    ["user-friends", userId],
    () => fetchUserFriends(userId),
    {
      onSuccess: (data) => {
        setFriendsList(data);
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
          : friendsList.map((friend: any) => (
              <FriendTile
                key={friend._id}
                friend={friend}
                friendsList={friendsList}
                setFriendsList={setFriendsList}
                isOwnProfile={isOwnProfile}
              />
            ))}
      </div>
    </div>
  );
}

function FriendTile({
  friend,
  friendsList,
  setFriendsList,
  isOwnProfile,
}: {
  friend: any;
  friendsList: any[];
  setFriendsList: any;
  isOwnProfile: boolean;
}) {
  const currentUser = useAppSelector((state) => state.user.userObj);
  const dispatch = useAppDispatch();

  const removeFriend = async () => {
    const updatedUser = {
      ...currentUser,
      friendsList: currentUser.friendsList.filter(
        (id: string) => id != friend._id
      ),
      friends: currentUser.friends - 1,
    };
    dispatch(setUserObj(updatedUser));

    setFriendsList(friendsList.filter((f: any) => f._id != friend._id));
    try {
      const res = await removeFriendRequest({
        userId: currentUser._id,
        friendId: friend._id,
      });
    } catch (err) {
      console.log("Remove friend request error", err);
    }
  };
  return (
    <Card className="bg-primaryWhite px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar
            src={
              friend.profilePicture
                ? friend.profilePicture
                : "/images/avatar.jpg"
            }
            className="w-12 h-12"
            isBordered
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${friend.username}`}>
                <h2 className="font-bold hover:underline">
                  {friend.firstName} {friend.lastName}
                </h2>
              </Link>

              <h5 className="text-sm text-default-400">@{friend.username}</h5>
            </div>

            <h5 className="text-sm text-left">{friend.course}</h5>
          </div>
        </div>

        {isOwnProfile && (
          <div>
            <Button
              onClick={removeFriend}
              className="bg-neuRed text-primaryWhite"
              radius="sm"
              size="sm"
            >
              Remove
            </Button>
          </div>
        )}
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
