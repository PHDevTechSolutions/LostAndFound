"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SessionChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const cachedSession = sessionStorage.getItem("isLoggedIn");
      if (cachedSession) {
        // Use cached session status for faster response
        if (cachedSession === "true") {
          setLoading(false);
        } else {
          router.push("/login");
        }
      } else {
        // Check for an active session
        try {
          const response = await fetch("/api/session");
          const data = await response.json();
          if (data.isLoggedIn) {
            sessionStorage.setItem("isLoggedIn", "true");
            setLoading(false);
          } else {
            sessionStorage.setItem("isLoggedIn", "false");
            router.push("/login");
          }
        } catch (error) {
          console.error("Error checking session:", error);
          router.push("/login");
        }
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default SessionChecker;
