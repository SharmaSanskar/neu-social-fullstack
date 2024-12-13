import { fetchAllPosts, fetchTrendingPosts } from "@/services/PostService";
import { Card, Avatar } from "@nextui-org/react";
import Link from "next/link";
import useSWR from "swr";

const TRENDING_LIMIT = 3;
function TrendingSection() {
  const { data: postData, isLoading: isPostLoading } = useSWR(
    ["trending-posts", TRENDING_LIMIT],
    () => fetchTrendingPosts(TRENDING_LIMIT),
    {
      onError: (err) => {
        console.log("Post api error", err);
      },
    }
  );
  return (
    <div>
      <div className="flex flex-col gap-2 my-2">
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
    <Card shadow="sm" radius="sm" className="bg-primaryWhite p-2 mx-1">
      <div className="flex gap-2 items-center">
        <Avatar
          radius="full"
          isBordered
          src={
            post.author.profilePicture
              ? post.author.profilePicture
              : "/images/avatar.jpg"
          }
          className="w-6 h-6"
        />
        <div className="flex flex-col items-start justify-center">
          <Link href={`/profile/${post.author.username}`}>
            <h4 className="text-xs font-semibold leading-none text-default-600 hover:underline">
              {post.author.firstName} {post.author.lastName}
            </h4>
          </Link>
          <h5 className="text-xs text-default-400">@{post.author.username}</h5>
        </div>
      </div>
      <p className="text-sm">{post.content}</p>
    </Card>
  );
}

export default TrendingSection;
