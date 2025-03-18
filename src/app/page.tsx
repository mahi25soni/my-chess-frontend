"use client";

import React from "react";

export default function Home({ name, className }: { name: string; className: string }) {
  const message = "Hello World";
  return (
    <div className="bg-red-500">
      mahendra
      <img src="image.jpg" />
      <button onClick={() => alert("Clicked!")}>Click Me</button>
      <input type="text"></input>
      <p>{"Use single quotes here"}</p>
      <div>Click me</div> {/* Bad inline function */}
    </div>
  );
}
