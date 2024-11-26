import { Input } from "@nextui-org/react";
import Link from "next/link";

function Signup() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-28 py-16">
      <div className="h-full w-full flex flex-col justify-between">
        <div>
          <p className="text-neuRed mb-4">NORTHEASTERN</p>
          <h1 className="text-3xl font-bold mb-2">Welcome to NEU Social</h1>
          <p>Create your NEU Social account</p>
        </div>

        <form className="flex flex-col gap-2">
          <div className="flex gap-4">
            <Input
              type="text"
              name=""
              label="First name"
              variant="underlined"
            />
            <Input type="text" name="" label="Last name" variant="underlined" />
          </div>
          <Input type="email" name="" label="Email" variant="underlined" />
          <Input type="text" name="" label="Course" variant="underlined" />
          <Input
            type="password"
            name=""
            label="Password"
            variant="underlined"
          />
          <Input
            type="password"
            name=""
            label="Confirm Password"
            variant="underlined"
          />

          <button className="bg-neuBlue text-white p-2 rounded-lg mt-6">
            Signup
          </button>
          <button className="bg-neuBlue text-white p-2 rounded-lg">
            Signup with Google
          </button>
        </form>

        <div>
          <p>
            Already have an account?{" "}
            <Link className="font-bold" href="/login">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
