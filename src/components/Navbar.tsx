"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  console.log("The user is ", user);

  const handleGameLink = () => {
    router.push(`/game?gameTypeId=cm9i374u30000o8k7kgcaiprl`);
  };
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-border-basic">
      <div className="flex items-center gap-6 ">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold">
            Chess Master
          </Link>
        </div>

        <div className="flex gap-4">
          <Link href="/" className="text-blue underline-blue border-b-2 border-blue">
            Home
          </Link>
          <div className="text-off-white button" onClick={handleGameLink}>
            Game
          </div>
          {/* <Link href="/community" className="text-off-white">
          Community
        </Link>
        <Link href="/profile" className="text-off-white">
          Profile
        </Link> */}
        </div>
      </div>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-off-white">Hello, {user?.name}</span>
            <button
              onClick={logout}
              className="px-2 py-1 text-white bg-red-500  hover:bg-red-600 rounded-lg button-hover"
            >
              Logout
            </button>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
}
