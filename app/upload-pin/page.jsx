"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import { ArrowUpFromLine } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

function UploadPin() {
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !tags || !image) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);

    if (session) {
      const user = session?.user?.name;
      formData.append("user", user);
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/pins", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      setImage("");
      setImagePreview("");
      setTitle("");
      setDescription("");
      setTags("");
      if (response.status === 201) {
        toast.success(response.data.message);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error while uploading pin, please try again");
    }
  };

  return (
    <div className="wrapper w-full h-screen">
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="main h-[80%] mx-auto w-[80%] flex flex-col relative">
          <div className="w-full absolute">
            <h1 className="text-2xl font-medium pb-2">Create Pin</h1>
            <hr />
          </div>
          <div className="flex justify-center items-center w-full h-full gap-4">
            <div className="left h-[80%] w-[40%] cursor-pointer" onClick={() => document.getElementById("fileInput").click()}>
              <input type="file" id="fileInput" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleImageChange} />
              {imagePreview ? (
                <div className="overflow-hidden w-full h-full">
                  <Image src={imagePreview} alt="Preview" className="rounded-xl object-cover" width={1000} height={1000} />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-[#E9E9E9] rounded-xl">
                  <ArrowUpFromLine className="w-10 h-10 text-gray-500" />
                  <p className="text-gray-500">Click to upload image</p>
                </div>
              )}
            </div>

            <div className="right h-[80%] w-[60%] rounded-xl flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="font-bold">Title</label>
                <input type="text" id="title" className="w-full h-10 bg-[#E9E9E9] text-black rounded-md px-2 focus:outline-none focus:border-none" onChange={(e) => setTitle(e.target.value)} value={title} placeholder="Enter title" />
              </div>
              <div className="flex flex-col gap-2">                
                <label htmlFor="description" className="font-bold">Description</label>
                <textarea id="description" className="w-full bg-[#E9E9E9] text-black rounded-md px-2 resize-none h-20 focus:outline-none focus:border-none" onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Enter description" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="tags" className="font-bold">Tags</label>
                <input type="text" id="tags" className="w-full h-10 bg-[#E9E9E9] text-black rounded-md px-2 focus:outline-none focus:border-none" onChange={(e) => setTags(e.target.value)} value={tags} placeholder="Anime, Manga, etc." />
              </div>
              <button className="w-full h-10 bg-red-500 mt-4 text-white rounded-md flex items-center justify-center" onClick={handleSubmit}>
                {loading ? <ClipLoader color="#fff" size={20} /> : "Upload"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default UploadPin;
