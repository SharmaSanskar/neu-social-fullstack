import { fetchUserPosts } from "@/services/PostService";
import useSWR from "swr";
import Post from "../../home/Post";
import { TbNotesOff } from "react-icons/tb";

function UserPosts({ userId }: { userId: string }) {
  const { data: postData, isLoading: isPostLoading } = useSWR(
    "user-posts",
    () => fetchUserPosts(userId),
    {
      onError: (err) => {
        console.log("User post api error", err);
      },
    }
  );

  return (
    <div>
      <div className="flex flex-col gap-6">
        {!isPostLoading && postData.length == 0 && <NoPostsMessage />}
        {isPostLoading || !postData
          ? ""
          : postData.map((post: any) => <Post key={post._id} post={post} />)}
      </div>
    </div>
  );
}

function NoPostsMessage() {
  return (
    <div className="w-full text-center text-xl font-bold flex flex-col items-center gap-2">
      <TbNotesOff size={60} />
      <p>No posts found</p>
    </div>
  );
}

export default UserPosts;
