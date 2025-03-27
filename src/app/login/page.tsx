"use client";
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import apiClient from "@/lib/axios.config";
import { WaitingLoader } from "@/components/atoms/Loader";
import { useAuth } from "@/context/AuthContext";
type Props = {};

export default function page({}: Props) {
  const [disableButton, setDisableButton] = React.useState(false);
  const { setUpUserAndToken } = useAuth();
  const handleSuccess = async (response: any) => {
    try {
      setDisableButton(true);
      const { data } = await apiClient.post("/user/login", {
        token: response.credential,
      });

      if (data?.success) {
        alert("Login Success");
        setUpUserAndToken(data.data.token, JSON.stringify(data.data.user));
      } else {
        alert("Login Failed");
      }

      setDisableButton(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-grow justify-center items-center">
      <div className="p-6 bg-white shadow-lg rounded-lg min-w-[300px]">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue">Login</h1>

        {disableButton ? (
          <div className="flex justify-center items-center h-20 ">
            <WaitingLoader />
          </div>
        ) : (
          <GoogleLogin onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
