// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { account } from '../appwrite';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    account.get()
      .then(res => setUser(res))
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
