"use client";

import HomeSidebar from "@/app/(main)/home/HomeSidebar";
import CreatePost from "./CreatePost";
import Posts from "./Posts";
import { Divider } from "@nextui-org/react";

function Home() {
  return (
    <div className="flex">
      <div className="pr-[18vw] w-full">
        <div className="flex-1 py-8 px-4">
          <h1 className="text-2xl font-semibold mb-6">Home</h1>
          <div className="w-full">
            <CreatePost />
          </div>

          <Divider className="my-6" />
          <div className="max-h-screen overflow-auto">
            <Posts />
          </div>
        </div>
      </div>

      <Divider orientation="vertical" />

      <div className="w-[18vw] max-w-[18vw] fixed top-0 right-0">
        <HomeSidebar />
      </div>
    </div>
  );
}

export default Home;
