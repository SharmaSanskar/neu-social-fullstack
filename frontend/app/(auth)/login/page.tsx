"use client";

import { Input } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginRequest } from "@/services/AuthService";
import { useAppDispatch } from "@/app/lib/hooks";
import { setUserId } from "@/app/lib/user/userSlice";

function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email address"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);

      console.log("values", values);
      loginRequest(values)
        .then((res) => {
          console.log("logged in", res.userId);
          localStorage.setItem("userId", res.userId);
          dispatch(setUserId(res.userId));
          router.push("/home");
        })
        .catch((err) => {
          console.log(err);
          setErrorMsg("Login failed");

          setLoading(false);
        });
    },
  });
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-28">
      <div className="h-full w-full flex flex-col justify-between">
        <div>
          <p className="text-neuRed mb-4">NORTHEASTERN</p>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p>Login to your NEU Social account</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <Input
            type="email"
            name="email"
            label="Email"
            variant="underlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.touched.email && formik.errors.email)}
            errorMessage={formik.errors.email}
          />
          <Input
            type="password"
            name="password"
            label="Password"
            variant="underlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.touched.password && formik.errors.password)}
            errorMessage={formik.errors.password}
          />

          {errorMsg && (
            <p className="text-neuRed text-sm text-center">{errorMsg}</p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="bg-neuBlue text-white p-2 rounded-lg"
          >
            {loading ? "..." : "Login"}
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
