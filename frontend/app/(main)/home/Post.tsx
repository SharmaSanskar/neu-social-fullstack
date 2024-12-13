import { useAppSelector } from "@/app/lib/hooks";
import { formatRelativeDate } from "@/app/utils/utils";
import {
  addCommentRequest,
  deleteCommentRequest,
  likePostRequest,
  unlikePostRequest,
} from "@/services/PostService";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Input,
  Button,
  Divider,
} from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentAlt,
  FaTrashAlt,
} from "react-icons/fa";

function Post({ postObj }: { postObj: any }) {
  const userObj = useAppSelector((state) => state.user.userObj);
  const [post, setPost] = useState(postObj);
  const [newComment, setNewComment] = useState("");

  const postNewComment = async () => {
    try {
      const updatedPost = {
        ...post,
        commentsList: post.commentsList
          ? [
              ...post.commentsList,
              {
                _id: 4,
                username: userObj.username,
                content: newComment,
              },
            ]
          : [
              {
                _id: 4,
                username: userObj.username,
                content: newComment,
              },
            ],
      };
      console.log(updatedPost);
      setPost(updatedPost);
      await addCommentRequest(post._id, {
        userId: userObj._id,
        content: newComment,
      });
    } catch (err) {
      console.log("Add comment error", err);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const updatedPost = {
        ...post,
        commentsList: post.commentsList.filter(
          (comment: any) => comment._id !== commentId
        ),
      };
      setPost(updatedPost);
      await deleteCommentRequest(post._id, commentId, {
        userId: userObj._id,
      });
    } catch (err) {
      console.log("Delete comment error", err);
    }
  };

  const handleLikeClick = async () => {
    try {
      if (post.likedBy.includes(userObj._id)) {
        const updatedPost = {
          ...post,
          likedBy: post.likedBy.filter((i: string) => i !== userObj._id),
          likes: post.likes - 1,
        };
        setPost(updatedPost);
        await unlikePostRequest(post._id, {
          userId: userObj._id,
        });
      } else {
        const updatedPost = {
          ...post,
          likedBy: [...post.likedBy, userObj._id],
          likes: post.likes + 1,
        };
        setPost(updatedPost);
        await likePostRequest(post._id, {
          userId: userObj._id,
        });
      }
    } catch (err) {
      console.log("Like api err", err);
    }
  };
  return (
    <Card className="bg-primaryWhite py-2 px-4">
      <CardHeader>
        <div className="flex gap-5 items-center">
          <Avatar
            radius="full"
            isBordered
            src={
              post.author.profilePicture
                ? post.author.profilePicture
                : "/images/avatar.jpg"
            }
            className="w-12 h-12"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author.username}`}>
                <h4 className="text-sm font-semibold leading-none text-default-600 hover:underline">
                  {post.author.firstName} {post.author.lastName}
                </h4>
              </Link>
              <h5 className="text-xs text-default-400">
                @{post.author.username}
              </h5>
            </div>
            <h5 className="text-xs tracking-tight text-default-400">
              {formatRelativeDate(new Date(post.createdAt))}
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody>{post.content}</CardBody>
      <div className="flex flex-col">
        <div className="flex gap-4">
          <div
            onClick={() => handleLikeClick()}
            className="flex items-center gap-2"
          >
            {post.likedBy.includes(userObj._id) ? (
              <FaHeart className="text-neuRed" />
            ) : (
              <FaRegHeart />
            )}

            {post.likes}
          </div>
          <div onClick={() => {}} className="flex items-center gap-2">
            <FaRegCommentAlt />
            {post.comments}
          </div>
        </div>

        <Divider className="my-3" />
        <h2 className="font-semibold">Comments</h2>
        <div className="flex items-center">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 rounded-lg"
            type="text"
            placeholder="Add comment..."
          />
          <Button
            onClick={postNewComment}
            className="bg-neuBlue text-primaryWhite"
            radius="sm"
            size="sm"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-col gap-1 text-left">
          {post.commentsList &&
            [...post.commentsList].reverse().map((comment: any) => (
              <div
                key={comment._id}
                className="text-sm bg-gray-100 p-2 ml-2 rounded-lg border-l-4 border-neuBlue flex items-center justify-between"
              >
                <div>
                  <Link href={`/profile/${comment.username}`}>
                    <p className="font-semibold">@{comment.username}</p>
                  </Link>
                  <p className="ml-4">{comment.content}</p>
                </div>
                {comment.author === userObj._id && (
                  <button
                    className="bg-neuRed text-primaryWhite p-2 rounded-lg"
                    onClick={() => deleteComment(comment._id)}
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}

export default Post;
