import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-border-basic">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold">
          Chess Master
        </Link>
      </div>

      <div className="flex gap-6">
        <Link href="/" className="text-blue underline-blue border-b-2 border-blue">
          Home
        </Link>
        <Link href="/game" className="text-off-white">
          Game
        </Link>
        {/* <Link href="/community" className="text-off-white">
          Community
        </Link>
        <Link href="/profile" className="text-off-white">
          Profile
        </Link> */}
      </div>
    </nav>
  );
}
