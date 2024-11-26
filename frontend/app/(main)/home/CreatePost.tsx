import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";

function CreatePost() {
  return (
    // <div className="w-full bg-slate-200">
    //   <div className="flex">
    //     <Avatar isBordered src="/images/avatar.jpg" size="sm" />

    //     <input type="text" placeholder="What is happening?" />
    //   </div>

    //   <button>Post</button>
    // </div>

    <div className="w-full">
      <Card className="w-full bg-primaryWhite p-2">
        <CardBody>
          <div className="flex items-center gap-4">
            <Avatar isBordered src="/images/avatar.jpg" className="w-12 h-12" />
            <input
              className="flex-1 p-2 rounded-lg"
              type="text"
              placeholder="What is happening?"
            />
          </div>
        </CardBody>
        <CardFooter className="w-full flex justify-end">
          <Button
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
