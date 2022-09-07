import React, { createContext, useReducer } from "react";

export const UPDATE_STATE = "UPDATE_STATE";
export const UPDATE_FEEDBACK = "UPDATE_FEEDBACK";
export const UPDATE_BOOKMARK = "UPDATE_BOOKMARK";
export const UPDATE_DELTASHARE = "UPDATE_DELTASHARE";

const initialState = {};

const reducer = (state, action) => {
  switch (action?.type) {
    case UPDATE_STATE:
      return action?.payload ? { ...state, ...action.payload } : state;
    case UPDATE_FEEDBACK:
      return action?.payload
        ? { ...state, userFeedbacks: [...action.payload] }
        : state;
    case UPDATE_BOOKMARK:
      return action?.payload
        ? { ...state, userBookmarks: [...action.payload] }
        : state;
    case UPDATE_DELTASHARE:
      return action?.payload
        ? { ...state, userDeltaShares: [...action.payload] }
        : state;
    default:
      return state;
  }
};

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={[state, dispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};
