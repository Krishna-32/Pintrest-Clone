"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleLogin = async () => {
    setLoading(true);
    if (!username || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    setLoading(false);

    if (res?.error) {
     setLoading(false)
     toast.error("Invalid credentials");
    }

    if (res?.ok) {
      toast.success("Logged in successfully");
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pt-16 ">
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="flex flex-col items-center justify-center gap-6 bg-[#171717] p-8 rounded-xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="/pinterest.png" alt="logo" width={80} height={80} />
            <h2>Welcome to Pinterest</h2>
            <p>Find your inspiration. Share your creativity.</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <span className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                placeholder="Username"
                className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </span>

            <span className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Password"
                className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </span>
          </div>

          <button
            onClick={handleLogin}
            className="bg-red-500 text-white p-2 rounded-lg w-48 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Login"}
          </button>
        </div>

        <hr className="w-full" />

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 bg-white text-black p-2 rounded-lg w-full"
          >
            <Image
              src="/google.png"
              alt="google"
              width={20}
              height={20}
              priority
            />
            <span>|</span>
            <span className="text-md">Continue with Google</span>
          </button>

          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 bg-white text-black p-2 rounded-lg w-full"
          >
            <Image
              src="/github.png"
              alt="github"
              width={20}
              height={20}
              priority
            />
            <span>|</span>
            <span className="text-md">Continue with Github</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-xs">
            New to Pinterest? &nbsp;
            <Link className="text-blue-500 hover:underline" href="/register">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
