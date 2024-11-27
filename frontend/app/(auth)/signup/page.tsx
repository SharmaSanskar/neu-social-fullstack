"use client";

import { Input } from "@nextui-org/react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signupRequest } from "@/services/AuthService";
import { useRouter } from "next/navigation";

function Signup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      course: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      course: Yup.string().required("Course name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email address"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref("password")],
        "Passwords must match"
      ),
    }),
    onSubmit: (values) => {
      setLoading(true);

      const updatedValues: any = { ...values };
      delete updatedValues.confirmPassword;
      console.log("values", updatedValues);
      signupRequest(updatedValues)
        .then((res) => {
          router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          if (err.response)
            setErrorMsg(
              err.response.data.message
                ? err.response.data.message
                : "Signup failed"
            );

          setLoading(false);
        });
    },
  });

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-28 py-16">
      <div className="h-full w-full flex flex-col justify-between">
        <div>
          <p className="text-neuRed mb-4">NORTHEASTERN</p>
          <h1 className="text-3xl font-bold mb-2">Welcome to NEU Social</h1>
          <p>Create your NEU Social account</p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-2 text-left"
        >
          <div className="flex gap-4">
            <Input
              type="text"
              name="firstName"
              label="First name"
              variant="underlined"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                !!(formik.touched.firstName && formik.errors.firstName)
              }
              errorMessage={formik.errors.firstName}
            />
            <Input
              type="text"
              name="lastName"
              label="Last name"
              variant="underlined"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
              errorMessage={formik.errors.lastName}
            />
          </div>
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
            type="text"
            name="course"
            label="Course"
            variant="underlined"
            value={formik.values.course}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.touched.course && formik.errors.course)}
            errorMessage={formik.errors.course}
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
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            variant="underlined"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              !!(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )
            }
            errorMessage={formik.errors.confirmPassword}
          />

          {errorMsg && (
            <p className="text-neuRed text-sm text-center">{errorMsg}</p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="bg-neuBlue text-white p-2 rounded-lg mt-4"
          >
            {loading ? "..." : "Signup"}
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
