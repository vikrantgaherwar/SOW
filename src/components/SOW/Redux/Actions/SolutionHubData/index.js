import { SOLUTION_HUB_DATA } from "./solutionHubDataType";

export const actionSolutionHubDataLoaded = () => {
  return (dispatch) => {
    dispatch({
      type: SOLUTION_HUB_DATA.FIELDS_LOADED,
    });
  };
};

export const actionSolutionHubDataNewAdded = () => {
  return (dispatch) => {
    dispatch({
      type: SOLUTION_HUB_DATA.FIELD_ADDED,
    });
  };
};

export const actionSolutionHubDataRemoved = (index) => {
  return (dispatch) => {
    dispatch({
      type: SOLUTION_HUB_DATA.FIELD_REMOVED,
      payload: { index },
    });
  };
};

export const actionSolutionHubDataUpdated = (index, name, value) => {
  return (dispatch) => {
    dispatch({
      type: SOLUTION_HUB_DATA.FIELD_UPDATED,
      payload: { index, name, value },
    });
  };
};

export const actionSolutionHubDataReset = () => {
  return (dispatch) => {
    dispatch({
      type: SOLUTION_HUB_DATA.FIELDS_RESET,
    });
  };
};
