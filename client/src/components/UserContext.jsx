// components/UserContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { apis } from "../utils/apis";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    _id: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(apis().user, {
          credentials: "include", // 👈 important to send cookies
        });
        const data = await res.json();
        if (res.ok) {
          setUserDetails(data); // { name, email, _id }
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
