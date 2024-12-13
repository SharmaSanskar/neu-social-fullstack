import { Avatar, Card, Divider, Button } from "@nextui-org/react";
import Link from "next/link";

function UserCard({
  userObj,
  isOwnProfile,
}: {
  userObj: any;
  isOwnProfile: boolean;
}) {
  return (
    <Card className="bg-primaryWhite px-12 py-8 shao">
      <div>
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

              <h5 className="text-sm text-default-400">@{userObj.username}</h5>
            </div>

            <div className="flex items-center gap-6">
              <p>
                <b>Posts:</b> {userObj.posts}
              </p>
              <p>
                <b>Friends:</b> {userObj.friends}
              </p>
            </div>
          </div>
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
        {isOwnProfile && (
          <Link href={`/profile/${userObj.username}/edit`}>
            <Button
              className="bg-neuBlue text-primaryWhite mt-6"
              radius="sm"
              size="md"
            >
              Edit Profile
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}

export default UserCard;
