"use client";
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
// import apiClient from ""
import apiClient from "@/lib/axios.config";
type Props = {};

export default function page({}: Props) {
  const handleSuccess = async () => {
    try {
      const { data } = await apiClient.post("/create-room", {
        roomName: "room1",
        personId: "person1",
        classId: "class1",
      });
      console.log(data);
    } catch (error) {}
  };
  return (
    <div>
      page
      <button onClick={handleSuccess}>Click here</button>
    </div>
  );
}
