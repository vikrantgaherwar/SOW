import { createContext } from "react";

export const HistoryChild = createContext();
const ChildProvider = ({ children, value }) => {
  return (
    <HistoryChild.Provider value={value}>{children}</HistoryChild.Provider>
  );
};

export default ChildProvider;
