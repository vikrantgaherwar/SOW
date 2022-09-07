import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useLocation } from "react-router";

export const ModeContext = createContext({
  isEdit: false,
  isClone: false,
  isView: false,
  isDraft: false,
});
const ModeProvider = ({ children }) => {
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const [isClone, setIsClone] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    if (location.pathname.indexOf("edit") > -1) {
      if (isClone) {
        setIsClone(false);
      }
      if (isView) {
        setIsView(false);
      }
      if (!isEdit) {
        setIsEdit(true);
      }
      if (isDraft) {
        setIsDraft(false);
      }
    } else if (location.pathname.indexOf("/view") > -1) {
      if (isClone) {
        setIsClone(false);
      }
      if (isEdit) {
        setIsEdit(false);
      }
      if (!isView) {
        setIsView(true);
      }
      if (isDraft) {
        setIsDraft(false);
      }
    } else if (location.pathname.indexOf("clone") > -1) {
      if (isEdit) {
        setIsEdit(false);
      }
      if (isView) {
        setIsView(false);
      }
      if (!isClone) {
        setIsClone(true);
      }
      if (isDraft) {
        setIsDraft(false);
      }
    } else if (location.pathname.indexOf("draft") > -1) {
      if (isEdit) {
        setIsEdit(false);
      }
      if (isView) {
        setIsView(false);
      }
      if (isClone) {
        setIsClone(false);
      }
      if (!isDraft) {
        setIsDraft(true);
      }
    } else {
      if (isEdit) {
        setIsEdit(false);
      }
      if (isView) {
        setIsView(false);
      }
      if (isClone) {
        setIsClone(false);
      }
      if (isDraft) {
        setIsDraft(false);
      }
    }
  }, [location]);

  return (
    <ModeContext.Provider value={{ isEdit, isClone, isView, isDraft }}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeProvider;
