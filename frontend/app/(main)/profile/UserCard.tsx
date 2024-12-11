import { useAppSelector } from "@/app/lib/hooks";
import { Avatar, Card, Divider, Button } from "@nextui-org/react";
import Link from "next/link";

function UserCard() {
  const userObj = useAppSelector((state) => state.user.userObj);

  return (
    <Card className="bg-primaryWhite px-12 py-8 shao">
      <div>
        <div className="flex items-center gap-6">
          <Avatar
            src="/images/avatar.jpg"
            className="w-28 h-28 m-1"
            isBordered
          />

          <div className="flex flex-col">
            <div className="mb-3">
              <h2 className="font-bold text-xl">
                {userObj.firstName} {userObj.lastName}
              </h2>

              <h5 className="text-sm text-default-400">{userObj.course}</h5>
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
          <p className="my-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
            dignissimos est ratione provident recusandae tempora possimus
            deleniti nisi minus doloremque!
          </p>

          <div className="text-sm text-black/60">
            <p>Email: {userObj.email}</p>
          </div>
        </div>
        <Link href={"/profile/edit"}>
          <Button
            className="bg-neuBlue text-primaryWhite mt-6"
            radius="sm"
            size="md"
          >
            Edit Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default UserCard;
