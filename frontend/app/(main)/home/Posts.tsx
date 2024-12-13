import Post from "./Post";
import { fetchAllPosts } from "@/services/PostService";
import useSWR from "swr";

// const posts = [
//   {
//     _id: 2,
//     content: "Hey",
//     user: "ABC",
//     course: "Computer Science",
//     likes: 230,
//     comments: 4,
//   },
//   {
//     _id: 3,
//     content: "Hey",
//     user: "ABC",
//     course: "Computer Science",
//     likes: 230,
//     comments: 4,
//   },
//   {
//     _id: 4,
//     content: "Hey",
//     user: "ABC",
//     course: "Computer Science",
//     likes: 230,
//     comments: 4,
//   },
// ];

function Posts() {
  const { data: postData, isLoading: isPostLoading } = useSWR(
    "feed-posts",
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
          : postData.map((post: any) => <Post key={post._id} postObj={post} />)}
      </div>
    </div>
  );
}

export default Posts;
