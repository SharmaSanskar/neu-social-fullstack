import Link from "next/link";

function Login() {
  return (
    <div>
      <h1>Login</h1>

      <form className="flex flex-col">
        <input type="email" name="" className="border border-gray-400" />
        <input type="password" name="" className="border border-gray-400" />
        <button className="bg-blue-500 w-10">Login</button>
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
  );
}

export default Login;
