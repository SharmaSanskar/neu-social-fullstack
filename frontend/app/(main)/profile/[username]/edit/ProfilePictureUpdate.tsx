"use client";

import { useState } from "react";
import axios from "axios";
import { Avatar, Button } from "@nextui-org/react";
import Image from "next/image";
import { updateUserProfilePicture } from "@/services/UserService";
import { useAppSelector } from "@/app/lib/hooks";

export default function ProfilePictureUpdate() {
  const userId = useAppSelector((state) => state.user.userId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const cloudName = "dobvfb8yb"; // Replace with your Cloudinary cloud name
  const uploadPreset = "profile_pictures"; // Replace with your upload preset

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setSelectedFile(event.target.files[0]);
      setImageUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", uploadPreset);

    try {
      const storageRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const res = await updateUserProfilePicture(userId, {
        profilePictureUrl: storageRes.data.secure_url,
      });
      // setImageUrl(storageRes.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="">
      <h3 className="font-bold my-2">Update Profile Picture</h3>

      {imageUrl && (
        <div>
          <Avatar className="w-24 h-24" src={imageUrl} isBordered />
        </div>
      )}
      <div className="text-sm">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <Button
          className="bg-neuBlue text-primaryWhite"
          radius="sm"
          size="md"
          onClick={handleUpload}
          isDisabled={uploading}
          isLoading={uploading}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
