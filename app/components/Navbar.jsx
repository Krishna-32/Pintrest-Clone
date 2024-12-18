"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    router.push(`/?search=${query}`);
  };

  return (
    <>
    <div className="p-4 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Image src={"/pinterest.png"} className="cursor-pointer" onClick={() => router.push("/")} alt="logo" width={40} height={40}></Image>

        <Link className="text-lg" href="/">
          Home
        </Link>

        <Link className="text-lg" href="/upload-pin">
          Create
        </Link>
      </div>

      <div className="w-1/3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-200 rounded-full p-2 focus:outline-none text-black"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          ></input>
          <Search
            className="absolute right-2 top-1/2 -translate-y-1/2 text-black cursor-pointer"
            onClick={handleSearch}
          ></Search>
        </div>
      </div>

      <div className="">
        {session?.user?.image && (
          <Image src={session?.user?.image} alt="user" width={40} height={40} className="rounded-full cursor-pointer object-fit w-10 h-10" onClick={() => signOut({callbackUrl: '/login'})}></Image>
        )}
      </div>
    </div>
    <hr className="mx-4" />
    </>
  );
}

export default Navbar;
