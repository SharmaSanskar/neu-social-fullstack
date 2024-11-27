import { useEffect } from "react";
import Post from "./Post";
import { fetchAllPosts } from "@/services/PostService";

const posts = [
  {
    content: "Hey",
    user: "ABC",
    course: "Computer Science",
    likes: 230,
    comments: 4,
  },
  {
    content: "Hey",
    user: "ABC",
    course: "Computer Science",
    likes: 230,
    comments: 4,
  },
  {
    content: "Hey",
    user: "ABC",
    course: "Computer Science",
    likes: 230,
    comments: 4,
  },
];

function Posts() {
  const getPost = async () => {
    const res = await fetchAllPosts();
    console.log(res);
  };

  useEffect(() => {
    getPost();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Post post={post} />
        ))}
      </div>
    </div>
  );
}

export default Posts;
