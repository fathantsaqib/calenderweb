import React, { createContext, useState } from "react";

// Buat UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Nama Pengguna", // Ganti dengan data pengguna yang sebenarnya
    email: "user@example.com",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};