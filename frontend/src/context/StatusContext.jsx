import React, { createContext, useContext, useState } from "react";

// Create context
const StatusContext = createContext();

// Provider component
export const StatusProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null); // null initially
  const [statuses, setStatuses] = useState([]); // status list
  const [seenOpen, setSeenOpen] = useState(false);

  // Check if user is valid (not null, not empty object)
  const isValidUser = adminUser && Object.keys(adminUser).length > 0;

  // Example helper: mark a status as seen
  const markStatusSeen = (userId, statusId) => {
    setStatuses((prev) =>
      prev.map((status) =>
        status.id === statusId
          ? {
              ...status,
              SeenBy: [...(status.SeenBy || []), { _id: userId }],
            }
          : status
      )
    );
  };

  return (
    <StatusContext.Provider
      value={{
        adminUser,
        setAdminUser,
        statuses,
        setStatuses,
        isValidUser,
        markStatusSeen,
        seenOpen,
        setSeenOpen,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

// Custom hook for easy usage
export const useStatus = () => useContext(StatusContext);
