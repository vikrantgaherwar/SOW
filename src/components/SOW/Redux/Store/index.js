import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../Reducers";

const mw =
  process.env.REACT_APP_ENV === "UAT"
    ? compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__
          ? window.__REDUX_DEVTOOLS_EXTENSION__()
          : (f) => f
      )
    : applyMiddleware(thunk);
export const Store = createStore(rootReducer, {}, mw);
