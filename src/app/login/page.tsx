"use client";
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
// import apiClient from ""
import apiClient from "@/lib/axios.config";
type Props = {};

export default function page({}: Props) {
  const handleSuccess = async (response: any) => {
    try {
      const { data } = await apiClient.post("/user/login", {
        token: response.credential,
      });

      if (data?.success) {
        console.log("success", data);
      } else {
        // toast.error(data?.message, toastStyle);
        console.log("error", data?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      page
      <GoogleLogin onSuccess={handleSuccess}></GoogleLogin>
    </div>
  );
}
