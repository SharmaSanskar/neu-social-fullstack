import CreatePost from "./CreatePost";
import Posts from "./Posts";
import { Divider } from "@nextui-org/react";

function HomeFeed() {
  return (
    <div className="flex-1 py-8 px-20">
      <h1 className="text-2xl font-semibold mb-6">Home</h1>
      <div className="w-full">
        <CreatePost />
      </div>

      <Divider className="my-6" />
      <div>
        <Posts />
      </div>
    </div>
  );
}

export default HomeFeed;
