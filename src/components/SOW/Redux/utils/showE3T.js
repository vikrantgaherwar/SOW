import { APIFetchStatus } from "./fetchStatus";
import { includes } from "lodash";

export const showE3T = (state) => {
  if (
    !includes(["10", "14", "19"], state.masterData.sowTemplate)
    // || process.env.REACT_APP_ENV === "PROD"
  ) {
    return false;
  } else if (
    state.e3tData.e3tRegionalDataFetchState === APIFetchStatus.FETCHED &&
    state.e3tData.e3tRegionalData.length > 0
  ) {
    return true;
  } else if (
    state.e3tData.e3tRegionalDataFetchState === APIFetchStatus.BOOTED
  ) {
    return true;
  } else {
    return false;
  }
};
