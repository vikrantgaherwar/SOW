import axios from "axios";
import Cookies from "js-cookie";
import URLConfig from "../../../URLConfig";
import { SOLUTIONHUB_SIDE_PANEL_DATA_TYPES } from "./solutionHubSidePanelDataTypes";

export const actionSolutionHubSidePanelClose = () => {
  return (dispatch) => {
    dispatch({
      type: SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.PANEL_CLOSE,
    });
  };
};

export const actionSolutionHubSidePanelOpen = () => {
  return (dispatch) => {
    dispatch({
      type: SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.PANEL_OPEN,
    });
  };
};

export const actionSolutionHubSidePanelToggle = () => {
  return (dispatch) => {
    dispatch({
      type: SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.PANEL_TOGGLE,
    });
  };
};

export const actionSolutionHubSidePanelSearch = (
  searchText = "",
  pageNumber = 1,
  pageSize = 10,
  request = axios.CancelToken.source()
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.SOLUTIONHUB_SIDEPANEL_DATA_FETCHING,
      });
      const currentRole = "SolutionHub Team";
      const currentUser = Cookies.get("name");
      // const currentUser = "Sindhu A";

      const URL =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubGeneratedSOWHistory";
      const res = await axios.get(URL, {
        params: { currentUser, currentRole, searchText, pageNumber, pageSize },
        cancelToken: request.token,
      });

      const newHistory = res.data.map((e) => {
        let newName = e.templateOutputName.replace(".docx", "");
        const sp = newName.split("_");
        sp[1] = sp[1] && sp[1].startsWith("Adv") ? "A&PS" : sp[1];

        newName = sp.join("_");
        return { ...e, newName };
      });

      if (pageNumber === 1) {
        dispatch({
          type: SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.SOLUTIONHUB_SIDEPANEL_DATA_FETCHED,
          payload: {
            data: newHistory,
            pagination: res.headers["x-pagination"],
          },
        });
      } else {
        dispatch({
          type: SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.SOLUTIONHUB_SIDEPANEL_DATA_APPEND,
          payload: {
            data: newHistory,
            pagination: res.headers["x-pagination"],
          },
        });
      }
      // dispatch(actionGetSOWUserDetails());
    } catch (err) {
      console.error(err);
      dispatch({
        type: SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.SOLUTIONHUB_SIDEPANEL_DATA_FAILED,
      });
    }
  };
};
