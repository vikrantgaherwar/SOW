import { APIFetchStatus } from "./fetchStatus";

export const showCustomModules = (state) => {
  if (state.masterData.sowTemplate === "16") {
    return false;
  }
  return true;
};
