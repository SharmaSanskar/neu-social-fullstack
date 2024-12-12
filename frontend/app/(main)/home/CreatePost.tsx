import { useAppSelector } from "@/app/lib/hooks";
import { createPost } from "@/services/PostService";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { useSWRConfig } from "swr";

function CreatePost() {
  const { mutate } = useSWRConfig();
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState(false);
  const userObj = useAppSelector((state) => state.user.userObj);
  const userId = useAppSelector((state) => state.user.userId);

  const createNewPost = async () => {
    if (!postContent) {
      setError(true);
    }
    const newPost = {
      userId: userId,
      title: "new post",
      content: postContent,
    };
    try {
      const res = await createPost(newPost);
      mutate("feed-posts");
      setPostContent("");
      console.log(res);
    } catch (err) {
      console.log("New post error", err);
    }

    setError(false);
  };
  return (
    // <div className="w-full bg-slate-200">
    //   <div className="flex">
    //     <Avatar isBordered src="/images/avatar.jpg" size="sm" />

    //     <input type="text" placeholder="What is happening?" />
    //   </div>

    //   <button>Post</button>
    // </div>

    <div className="w-full">
      <Card className="w-full bg-primaryWhite py-2 px-4">
        <CardBody>
          <div className="flex items-center gap-4">
            <Avatar isBordered src="/images/avatar.jpg" className="w-12 h-12" />
            <Input
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="flex-1 p-2 rounded-lg"
              type="text"
              placeholder="What is happening?"
              isInvalid={error}
              errorMessage={"Post cannot be empty"}
            />
          </div>
        </CardBody>
        <CardFooter className="w-full flex justify-end">
          <Button
            onClick={createNewPost}
            className="bg-neuBlue text-primaryWhite"
            radius="sm"
            size="sm"
          >
            Post Update
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CreatePost;
