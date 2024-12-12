"use client";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setUserObj } from "@/app/lib/user/userSlice";
import { updateUserProfile } from "@/services/UserService";
import { Input, Switch, Card, Button } from "@nextui-org/react";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import * as Yup from "yup";

function ProfileEdit() {
  const router = useRouter();
  const userObj = useAppSelector((state) => state.user.userObj);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: userObj.firstName as string,
      lastName: userObj.lastName as string,
      course: userObj.course as string,
      bio: userObj.bio as string,
      isPrivate: userObj.isPrivate,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      course: Yup.string().required("Course name is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await updateUserProfile(userObj._id, values);
        dispatch(setUserObj(res.user));
        console.log("user profile updated", res);
        router.push(`/profile/${userObj.username}`);
      } catch (err) {
        console.log("Profile update error", err);
      }
    },
  });

  return (
    <div className="px-20 py-8">
      <Card className="bg-primaryWhite px-12 py-8">
        <div className="flex items-center gap-2">
          <Link href={`/profile/${userObj.username}`}>
            <FaArrowLeft className="rounded-md cursor-pointer" />
          </Link>

          <h2 className="text-xl font-bold">Edit Profile</h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="flex gap-8">
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
            type="text"
            name="bio"
            label="Bio"
            variant="underlined"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.touched.bio && formik.errors.bio)}
            errorMessage={formik.errors.bio}
          />

          <div className="my-6">
            <Switch
              size="sm"
              isSelected={formik.values.isPrivate}
              onValueChange={(newVal) =>
                formik.setFieldValue("isPrivate", newVal)
              }
            >
              Make account private
            </Switch>
          </div>

          <Button
            type="submit"
            className="bg-neuBlue text-primaryWhite block"
            radius="sm"
            size="md"
          >
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ProfileEdit;
