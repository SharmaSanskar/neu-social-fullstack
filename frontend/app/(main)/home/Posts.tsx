import Post from "./Post";

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
