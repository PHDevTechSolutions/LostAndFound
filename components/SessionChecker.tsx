"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SessionChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session");
        const data = await response.json();
        if (data.isLoggedIn) {
          setLoading(false);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
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
