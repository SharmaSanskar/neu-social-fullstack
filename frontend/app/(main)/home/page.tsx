"use client";

import HomeSidebar from "@/app/(main)/home/HomeSidebar";
import HomeFeed from "./HomeFeed";

function Home() {
  return (
    <div className="flex">
      <div className="pr-[18vw] w-full">
        <HomeFeed />
      </div>

      <div className="w-[18vw] max-w-[18vw] fixed top-0 right-0">
        <HomeSidebar />
      </div>
    </div>
  );
}

export default Home;
