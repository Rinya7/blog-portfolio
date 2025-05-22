// src/context/UserContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UserContextType {
  user: ReturnType<typeof useAuth>["user"];
  loading: ReturnType<typeof useAuth>["loading"];
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
