"use client";
import React, { useEffect, useState } from "react";

const UserFetcher: React.FC<{ children: (userName: string, userEmail: string) => React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (userId) {
      // Fetch user data using userId
      fetch(`/api/user?id=${encodeURIComponent(userId)}`)
        .then(response => response.json())
        .then(data => {
          setUserName(data.name);
          setUserEmail(data.email);
        })
        .catch(error => console.error("Error fetching user data:", error));
    }
  }, []);

  return <>{children(userName, userEmail)}</>;
};

export default UserFetcher;
