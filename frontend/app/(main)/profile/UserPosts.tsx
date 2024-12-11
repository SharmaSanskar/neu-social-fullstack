import { fetchAllPosts } from "@/services/PostService";
import useSWR from "swr";
import Post from "../home/Post";

function UserPosts() {
  const { data: postData, isLoading: isPostLoading } = useSWR(
    "userposts",
    fetchAllPosts,
    {
      onError: (err) => {
        console.log("Post api error", err);
      },
    }
  );

  return (
    <div>
      <div className="flex flex-col gap-6">
        {isPostLoading || !postData
          ? ""
          : postData.map((post: any) => <Post key={post._id} post={post} />)}
      </div>
    </div>
  );
}

export default UserPosts;
