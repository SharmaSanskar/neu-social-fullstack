import { Input } from "@nextui-org/react";

function FindControls({
  nameSearchTerm,
  courseSearchTerm,
  setNameSearchTerm,
  setCourseSearchTerm,
}: {
  nameSearchTerm: string;
  courseSearchTerm: string;
  setNameSearchTerm: (name: string) => void;
  setCourseSearchTerm: (course: string) => void;
}) {
  return (
    <div className="flex gap-6 flex-wrap">
      <Input
        type="text"
        placeholder="Search by name"
        value={nameSearchTerm}
        className="flex-1 min-w-40"
        onChange={(e) => setNameSearchTerm(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Search by course"
        value={courseSearchTerm}
        className="flex-1 min-w-40"
        onChange={(e) => setCourseSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default FindControls;
