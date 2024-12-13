import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { fetchAllUsers, fetchMultipleUsers } from "@/services/UserService";
import { Card, Avatar, Button } from "@nextui-org/react";
import Link from "next/link";
import useSWR from "swr";
import { FaCheck } from "react-icons/fa";
import { setUserObj } from "@/app/lib/user/userSlice";
import { acceptFriendRequest } from "@/services/FriendsService";
import { useState } from "react";

function FriendSection() {
  // const [friendRequestsList, setFriendRequestsList] = useState([])
  const currrentUser = useAppSelector((state) => state.user.userObj);
  const { data: friendRequestsData, isLoading: isFriendRequestsLoading } =
    useSWR(
      "friend-requests",
      () =>
        fetchMultipleUsers({ userIds: currrentUser.friendRequests.received }),
      {
        onError: (err) => {
          console.log("Friends api error", err);
        },
      }
    );

  // console.log("CR", userObj.friendRequests.received);
  return (
    <div>
      <div className="flex flex-col gap-2 my-2">
        {isFriendRequestsLoading || !friendRequestsData
          ? ""
          : friendRequestsData.map((friend: any) => (
              <FriendTile
                key={friend._id}
                friend={friend}
                currentUser={currrentUser}
              />
            ))}
      </div>
    </div>
  );
}

function FriendTile({
  currentUser,
  friend,
}: {
  currentUser: any;
  friend: any;
}) {
  const dispatch = useAppDispatch();

  const requestAccepted = !currentUser.friendRequests.received.includes(
    friend._id
  );

  const acceptRequest = async () => {
    const updatedUser = {
      ...currentUser,
      friendRequests: {
        ...currentUser.friendRequests,
        received: currentUser.friendRequests.received.filter(
          (id: string) => id != friend._id
        ),
      },
      friendsList: [...currentUser.friendsList, friend._id],
      friends: currentUser.friends + 1,
    };
    dispatch(setUserObj(updatedUser));
    try {
      const res = await acceptFriendRequest({
        userId: currentUser._id,
        senderId: friend._id,
      });
    } catch (err) {
      console.log("Accept friend request error", err);
    }
  };

  return (
    <Card shadow="sm" radius="sm" className="bg-primaryWhite p-2 mx-1">
      <div className="flex items-center justify-between gap-1">
        <div className="flex gap-2 items-center">
          <Avatar
            radius="full"
            isBordered
            src={
              friend.profilePicture
                ? friend.profilePicture
                : "/images/avatar.jpg"
            }
            className="w-6 h-6"
          />
          <div className="flex flex-col items-start justify-center">
            <Link href={`/profile/${friend.username}`}>
              <h4 className="text-xs font-semibold leading-none text-default-600 hover:underline">
                {friend.firstName} {friend.lastName}
              </h4>
            </Link>
            <h5 className="text-xs text-default-400">@{friend.username}</h5>
          </div>
        </div>
        <button
          onClick={requestAccepted ? () => {} : acceptRequest}
          className={`${
            requestAccepted ? "bg-gray-400" : "bg-neuBlue"
          }  text-primaryWhite w-6 h-6 flex items-center justify-center rounded-full`}
        >
          <FaCheck size={10} />
        </button>
      </div>
    </Card>
  );
}

export default FriendSection;
