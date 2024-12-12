import { formatRelativeDate } from "@/app/utils/utils";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import { FaHeart, FaCommentAlt } from "react-icons/fa";

function Post({ post }: { post: any }) {
  console.log("POST", post);
  return (
    <Card className="bg-primaryWhite py-2 px-4">
      <CardHeader>
        <div className="flex gap-5 items-center">
          <Avatar
            radius="full"
            isBordered
            src="https://nextui.org/avatars/avatar-1.png"
            className="w-12 h-12"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold leading-none text-default-600">
                {post.author.firstName} {post.author.lastName}
              </h4>
              <h5 className="text-xs text-default-400">{`@newwuser`}</h5>
            </div>
            <h5 className="text-xs tracking-tight text-default-400">
              {formatRelativeDate(new Date(post.createdAt))}
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody>{post.content}</CardBody>
      <CardFooter className="flex gap-4">
        <div className="flex items-center gap-2">
          <FaHeart />
          {post.likes}
        </div>
        <div className="flex items-center gap-2">
          <FaCommentAlt />
          {post.comments}
        </div>
      </CardFooter>
    </Card>
  );
}

export default Post;
