"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  const handleGameLink = () => {
    router.push(`/game?gameTypeId=cm9i374u30000o8k7kgcaiprl`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-border-basic">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold">
          Chess Master
        </Link>
        <div className="hidden md:flex gap-4">
          <Link
            href="/"
            className={`cursor-pointer ${isActiveLink("/") ? "border-b-2 border-blue text-blue" : ""}`}
          >
            Home
          </Link>
          <div
            className={`cursor-pointer ${isActiveLink("/game") ? "border-b-2 border-blue text-blue" : ""}`}
            onClick={handleGameLink}
          >
            Game
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {user ? <span className="text-off-white hidden md:block">Hello, {user?.name}</span> : null}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-xl">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {user && (
          <button
            onClick={logout}
            className="px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded-lg button-hover hidden md:block"
          >
            Logout
          </button>
        )}
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
          <div className="flex flex-col items-center p-4 gap-4">
            <Link
              href="/"
              className={`cursor-pointer ${isActiveLink("/") ? "border-b-2 border-blue text-blue" : ""}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <div
              className={`cursor-pointer ${isActiveLink("/game") ? "border-b-2 border-blue text-blue" : ""}`}
              onClick={() => {
                handleGameLink();
                toggleMenu();
              }}
            >
              Game
            </div>
            {user && (
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded-lg button-hover"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
