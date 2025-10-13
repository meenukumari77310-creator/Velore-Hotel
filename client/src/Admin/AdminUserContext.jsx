// UserContext.js
import React, { createContext, useState, useContext } from "react";

const AdminUserContext = createContext();

export const useUser = () => useContext(AdminUserContext);

export const AdminUserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
  });

  return (
    <AdminUserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </AdminUserContext.Provider>
  );
};
