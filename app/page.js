"use client";

import Image from "next/image";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

// Search Component (Uses useSearchParams)
function PinsList() {
  const { data: session } = useSession();
  const [pins, setPins] = useState([]);

  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const getPins = async () => {
    const url = search ? `/api/pins?search=${search}` : `/api/pins`;
    const res = await axios.get(url);
    setPins(res.data.pins);
  };

  useEffect(() => {
    getPins();
  }, [search, session]);

  if (!pins || pins.length <= 0) {
    return !search ? (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#fff" size={120} />
      </div>
    ) : (
      <div className="flex justify-center items-center h-screen text-2xl font-bold text-gray-500">
        No Results Found :(
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 [&>div]:mb-4">
      {pins.map((items) => (
        <Link
          href={`/pins/${items._id}`}
          key={items._id}
          className="cursor-pointer hover:opacity-80"
        >
          <Image
            className="rounded-lg w-full h-auto object-cover mb-4"
            src={items?.image?.url}
            alt={items.title}
            width={500}
            height={500}
          />
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#fff" size={120} />
        </div>
      }
    >
      <div className="m-4">
        <PinsList />
      </div>
    </Suspense>
  );
}
