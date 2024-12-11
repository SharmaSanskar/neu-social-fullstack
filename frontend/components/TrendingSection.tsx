import { fetchAllPosts } from "@/services/PostService";
import { Card, Avatar } from "@nextui-org/react";
import useSWR from "swr";

function TrendingSection() {
  const { data: postData, isLoading: isPostLoading } = useSWR(
    "posts",
    fetchAllPosts,
    {
      onError: (err) => {
        console.log("Post api error", err);
      },
    }
  );
  return (
    <div>
      <div className="flex flex-col gap-2">
        {isPostLoading || !postData
          ? ""
          : postData.map((post: any) => (
              <PostTile key={post._id} post={post} />
            ))}
      </div>
    </div>
  );
}

function PostTile({ post }: { post: any }) {
  return (
    <Card shadow="sm" radius="sm" className="bg-primaryWhite px-2 py-1 mx-1">
      <div className="flex gap-3 items-center">
        <Avatar
          radius="full"
          isBordered
          src="https://nextui.org/avatars/avatar-1.png"
          className="w-6 h-6"
        />
        <div className="flex flex-col items-start justify-center">
          <h4 className="text-xs font-semibold leading-none text-default-600">
            {post.author.firstName} {post.author.lastName}
          </h4>
          <h5 className="text-xs text-default-400">@newuser</h5>
        </div>
      </div>
      <p className="text-sm">{post.content}</p>
    </Card>
  );
}

export default TrendingSection;
