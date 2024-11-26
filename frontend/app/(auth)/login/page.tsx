import { Input } from "@nextui-org/react";
import Link from "next/link";

function Login() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-28">
      <div className="h-full w-full flex flex-col justify-between">
        <div>
          <p className="text-neuRed mb-4">NORTHEASTERN</p>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p>Login to your NEU Social account</p>
        </div>

        <form className="flex flex-col gap-6">
          <Input type="email" name="" label="Email" variant="underlined" />
          <Input
            type="password"
            name=""
            label="Password"
            variant="underlined"
          />
          <button className="bg-neuBlue text-white p-2 rounded-lg">
            Login
          </button>
          <button className="bg-neuBlue text-white p-2 rounded-lg">
            Login with Google
          </button>
        </form>

        <div>
          <p className="">
            Don&apos;t have an account?{" "}
            <Link className="font-bold" href="/signup">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
