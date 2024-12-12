"use client";

import { Divider } from "@nextui-org/react";
import FindControls from "./FindControls";
import FindUsersList from "./FindUsersList";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchAllUsers } from "@/services/UserService";

function Find() {
  const [userList, setUserList] = useState([]);
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const { data: usersData, isLoading: isUsersLoading } = useSWR(
    "users",
    fetchAllUsers,
    {
      onSuccess: (data) => {
        setUserList(data);
      },
      onError: (err) => {
        console.log("Users api error", err);
      },
    }
  );

  useEffect(() => {
    if (usersData) {
      setUserList(
        usersData.filter((user: any) =>
          (user.firstName.toLowerCase() + user.lastName.toLowerCase()).includes(
            nameSearchTerm.toLowerCase()
          )
        )
      );
    }
  }, [nameSearchTerm]);

  useEffect(() => {
    if (usersData) {
      setUserList(
        usersData.filter((user: any) =>
          user.course.toLowerCase().includes(courseSearchTerm.toLowerCase())
        )
      );
    }
  }, [courseSearchTerm]);

  return (
    <div className="px-20 py-8">
      <h1 className="text-xl font-bold mb-4">Find people</h1>
      <FindControls
        nameSearchTerm={nameSearchTerm}
        setNameSearchTerm={setNameSearchTerm}
        courseSearchTerm={courseSearchTerm}
        setCourseSearchTerm={setCourseSearchTerm}
      />
      <Divider className="my-6" />
      <FindUsersList isUsersLoading={isUsersLoading} userList={userList} />
    </div>
  );
}

export default Find;
