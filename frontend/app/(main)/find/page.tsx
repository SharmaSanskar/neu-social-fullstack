import { Divider } from "@nextui-org/react";
import FindControls from "./FindControls";
import FindUsersList from "./FindUsersList";

function Find() {
  return (
    <div className="px-20 py-8">
      <h1 className="text-xl font-bold mb-4">Find people</h1>
      <FindControls />
      <Divider className="my-6" />
      <FindUsersList />
    </div>
  );
}

export default Find;
