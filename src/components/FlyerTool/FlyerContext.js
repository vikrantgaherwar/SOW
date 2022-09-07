import React, { createContext, useReducer, useContext } from "react";

export const UPDATE_FLYER = "UPDATE_FLYER";

const initialState = { flyerFlag: false };

const reducer = (state, action) => {
  switch (action?.type) {
    case UPDATE_FLYER:
      return action?.payload == null
        ? state
        : { ...state, flyerFlag: action.payload };
    default:
      return state;
  }
};

export const FlyerContext = createContext();

export const FlyerContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FlyerContext.Provider value={[state, dispatch]}>
      {props.children}
    </FlyerContext.Provider>
  );
};

export const useFlyer = () => {
  const context = useContext(FlyerContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
};

export const FlyerContextConsumer = FlyerContext.Consumer;
