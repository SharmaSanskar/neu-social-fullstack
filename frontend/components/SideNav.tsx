import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/lib/hooks";
import { removeAuthUser } from "@/app/utils/auth";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMenu, IoCloseOutline } from "react-icons/io5";

function SideNav() {
  const router = useRouter();
  const userObj = useAppSelector((state) => state.user.userObj);

  // State to manage mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State to track screen size
  const [isMobile, setIsMobile] = useState(false);

  // Handle logout
  const logoutUser = () => {
    removeAuthUser();
    router.push("/login");
  };

  // Check screen size and update state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation links component
  const NavLinks = () => (
    <>
      <Link
        href={"/home"}
        className="hover:bg-slate-900/80 w-full rounded-lg p-2"
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        href={"/find"}
        className="hover:bg-slate-900/80 w-full rounded-lg p-2"
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Find
      </Link>
      <Link
        href={`/profile/${userObj.username}`}
        className="hover:bg-slate-900/80 w-full rounded-lg p-2"
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Profile
      </Link>
    </>
  );

  // Render desktop navigation
  if (!isMobile) {
    return (
      <header className="fixed top-0 left-0 flex flex-col py-8 px-4 bg-black text-primaryWhite h-full w-[14vw] max-w-[14vw] items-center justify-between shadow-md shadow-slate-200">
        <div className="w-full">
          <div className="text-center">
            <h3>NEUSocial</h3>
            <div className="text-center mt-3">
              <h4 className="text-base font-bold">
                {userObj.firstName} {userObj.lastName}
              </h4>
              <p className="text-xs opacity-70">Computer Science</p>
            </div>
          </div>
          <nav className="flex flex-col items-start gap-4 mt-10">
            <NavLinks />
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

  // Render mobile hamburger and slide-out menu
  return (
    <>
      {/* Hamburger Icon */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 bg-black text-primaryWhite p-2 rounded-md"
      >
        {isMobileMenuOpen ? <IoCloseOutline size={26} /> : <IoMenu size={20} />}
      </button>

      {/* Mobile Slide-out Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-1/2 bg-black text-primaryWhite p-6 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3>NEUSocial</h3>
              <div className="text-center mt-3">
                <h4 className="text-base font-bold">
                  {userObj.firstName} {userObj.lastName}
                </h4>
                <p className="text-xs opacity-70">Computer Science</p>
              </div>
            </div>
            <nav className="flex flex-col items-start gap-4">
              <NavLinks />
            </nav>
            <div className="absolute bottom-6 left-6 right-6">
              <Button
                onClick={logoutUser}
                className="bg-neuRed text-primaryWhite w-full py-1 rounded-lg"
              >
                LOGOUT
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SideNav;
