import { useAppSelector } from "@/app/lib/hooks";
import { Avatar, Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function SideNav() {
  const router = useRouter();
  const userObj = useAppSelector((state) => state.user.userObj);
  const logoutUser = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };
  return (
    <header className="fixed top-0 left-0 flex flex-col py-8 px-4 bg-black text-primaryWhite h-full w-[14vw] max-w-[14vw] items-center justify-between shadow-md shadow-slate-200">
      <div className="w-full">
        <div className="text-center">
          <h3>NEUSocial</h3>

          <div className="flex flex-col items-center mt-5">
            <Avatar src="/images/avatar.jpg" className="w-16 h-16" />

            <div className="text-center mt-3">
              <h4 className="text-base font-bold">
                {userObj.firstName} {userObj.lastName}
              </h4>
              <p className="text-xs opacity-70">Computer Science</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col items-start gap-4 mt-10">
          <Link
            href={"/home"}
            className="hover:bg-slate-900/40 w-full rounded-lg p-2"
          >
            Home
          </Link>
          <Link
            href={"/find"}
            className="hover:bg-slate-900/40 w-full rounded-lg p-2"
          >
            Find
          </Link>
          <Link
            href={"/profile"}
            className="hover:bg-slate-900/40 w-full rounded-lg p-2"
          >
            Profile
          </Link>
        </nav>
      </div>

      <div className="w-full">
        <Button
          onClick={logoutUser}
          className="bg-neuRed text-primaryWhite w-full py-1 rounded-lg"
        >
          LOGOUT
        </Button>
      </div>
    </header>
  );
}

export default SideNav;
