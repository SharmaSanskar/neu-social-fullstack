import { Input } from "@nextui-org/react";

function FindControls() {
  return (
    <div className="flex gap-6">
      <Input type="text" placeholder="Search by username" />
      <Input type="text" placeholder="Search by course" />
    </div>
  );
}

export default FindControls;
