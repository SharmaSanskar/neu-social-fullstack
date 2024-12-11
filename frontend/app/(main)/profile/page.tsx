"use client";

import { Divider } from "@nextui-org/react";
import UserCard from "./UserCard";
import UserPosts from "./UserPosts";

function Profile() {
  return (
    <div className="px-20 py-8">
      <UserCard />
      <Divider className="my-6" />
      <UserPosts />
    </div>
  );
}

export default Profile;
