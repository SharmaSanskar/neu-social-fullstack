import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setUserObj } from "@/app/lib/user/userSlice";
import {
  removeFriendRequest,
  sendFriendRequest,
} from "@/services/FriendsService";
import { fetchKanyeQuote } from "@/services/ThirdPartyService";
import { Avatar, Card, Divider, Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import WeatherComponent from "./WeatherComponent";

function UserCard({
  userObj,
  isOwnProfile,
}: {
  userObj: any;
  isOwnProfile: boolean;
}) {
  const currentUser = useAppSelector((state) => state.user.userObj);
  const dispatch = useAppDispatch();
  const requestSent = currentUser.friendRequests.sent.includes(userObj._id);
  const [kanyeQuote, setKanyeQuote] = useState("");
  const isAlreadyFriend = currentUser.friendsList.includes(userObj._id);

  const addFriend = async () => {
    const updatedUser = {
      ...currentUser,
      friendRequests: {
        ...currentUser.friendRequests,
        sent: [...currentUser.friendRequests.sent, userObj._id],
      },
    };
    dispatch(setUserObj(updatedUser));
    try {
      const res = await sendFriendRequest({
        senderId: currentUser._id,
        recipientId: userObj._id,
      });
    } catch (err) {
      console.log("Send friend request error", err);
    }
  };

  const removeFriend = async () => {
    const updatedUser = {
      ...currentUser,
      friendsList: currentUser.friendsList.filter(
        (id: string) => id != userObj._id
      ),
      friends: currentUser.friends - 1,
    };
    dispatch(setUserObj(updatedUser));
    try {
      const res = await removeFriendRequest({
        userId: currentUser._id,
        friendId: userObj._id,
      });
    } catch (err) {
      console.log("Remove friend request error", err);
    }
  };

  const getKanyeQuote = async () => {
    const res = await fetchKanyeQuote();
    setKanyeQuote(res.quote);
  };

  useEffect(() => {
    getKanyeQuote();
  }, []);

  return (
    <Card className="bg-primaryWhite px-12 py-8 shao">
      <div>
        <div className="flex items-center flex-col md:flex-row md:justify-between">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar
              src={
                userObj.profilePicture
                  ? userObj.profilePicture
                  : "/images/avatar.jpg"
              }
              className="w-28 h-28 m-1"
              isBordered
            />

            <div className="flex flex-col text-center md:text-left">
              <div className="mb-3">
                <h2 className="font-bold text-xl">
                  {userObj.firstName} {userObj.lastName}
                </h2>

                <h5 className="text-sm text-default-400">
                  @{userObj.username}
                </h5>
              </div>

              <div className="flex items-center gap-6">
                <p>
                  <b>Posts:</b> {userObj.posts}
                </p>
                <p>
                  <b>Friends:</b> {userObj.friendsList.length}
                </p>
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-4 md:mt-0">
              <WeatherComponent />
            </div>
          )}
        </div>

        <Divider className="my-6" />
        <div>
          <h3 className="font-semibold text-lg">About</h3>
          <p className="my-2">{userObj.bio}</p>

          <div className="text-sm text-black/60">
            <p>Course: {userObj.course}</p>
            <p>Email: {userObj.email}</p>
          </div>
        </div>
        {isOwnProfile ? (
          <Link href={`/profile/${userObj.username}/edit`}>
            <Button
              className="bg-neuBlue text-primaryWhite mt-6"
              radius="sm"
              size="md"
            >
              Edit Profile
            </Button>
          </Link>
        ) : isAlreadyFriend ? (
          <Button
            className="bg-neuRed text-primaryWhite mt-6"
            radius="sm"
            size="md"
            onClick={removeFriend}
          >
            Remove Friend
          </Button>
        ) : requestSent ? (
          <Button className="mt-6" radius="sm" size="md" color="default">
            Request Sent
          </Button>
        ) : (
          <Button
            onClick={addFriend}
            className="bg-neuBlue text-primaryWhite mt-6"
            radius="sm"
            size="md"
          >
            Add Friend
          </Button>
        )}
        {isOwnProfile && (
          <>
            <Divider className="my-6" />

            <div>
              <p className="italic">&rdquo;{kanyeQuote}&rdquo;</p>
              <p className="font-semibold">-Kanye West</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export default UserCard;
