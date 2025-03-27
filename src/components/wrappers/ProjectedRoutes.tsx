"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProjectedRoutes(WrappedComponent) {
  return (props) => {
    const { user, token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (token === null || token === undefined || user === null || user === undefined) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, [user, router]);

    if (isLoading) {
      // Render a loading component or message
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
