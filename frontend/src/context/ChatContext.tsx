// import React, { createContext, useContext, useEffect, useState } from "react";
// // import { getCurrentChat } from "../api/auth";

// // user context
// const ChatContext = createContext<any>(null);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState(null); // user and setUser
//   const [loading, setLoading] = useState(true); // for initial load

//   // get current user on initial load
//   useEffect(() => {
//     getCurrentUser().then((user) => {
//       setUser(user);
//       setLoading(false);
//     });
//   }, []);

//   // provider
//   return (
//     <ChatContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);
