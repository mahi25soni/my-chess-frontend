"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

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
          <Link
            href="/"
            className={`cursor-pointer ${isActiveLink("/") ? "border-b-2 border-blue text-blue  " : ""} `}
          >
            Home
          </Link>
          <div
            className={`cursor-pointer  ${isActiveLink("/game") ? "border-b-2 border-blue text-blue  " : ""} `}
            onClick={handleGameLink}
          >
            Game
          </div>
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
