import axios from "axios";
import Cookies from "js-cookie";
import URLConfig from "../../../URLConfig";
import moment from "moment";
import { SOW_HISTORY_DATA_TYPE } from "./sowHistoryDataType";
import {
  actionGetSharingSidePanelData,
  actionGetSharingUserList,
} from "../SharingModal";

export const actionFetchSowHistoryData = () => {
  return async (dispatch) => {
    try {
      console.error("actionFetchSowHistoryData is deprecated. DONT USE IT!");
      dispatch({
        type: SOW_HISTORY_DATA_TYPE.HISTORY_FETCHING,
      });
      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetGeneratedSOWHistory";
      const createdBy = Cookies.get("name");

      const res = await axios.get(URL, { params: { createdBy } });

      // console.error("ASK WHY ARE WE SORTING HISTORY BASED ON CREATED DATE!!");

      const data = res.data.sort((a, b) => {
        const aMom = moment(a.createdDate, moment.ISO_8601);
        const bMom = moment(b.createdDate, moment.ISO_8601);

        if (aMom.isAfter(bMom)) {
          return -1;
        } else if (aMom.isBefore(bMom)) {
          return 1;
        } else {
          return 0;
        }
      });

      dispatch({
        type: SOW_HISTORY_DATA_TYPE.HISTORY_FETCHED,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: SOW_HISTORY_DATA_TYPE.HISTORY_FETCH_FAILED,
      });
    }
  };
};

export const actionSowHistorySidePanelClose = () => {
  return (dispatch) => {
    dispatch({
      type: SOW_HISTORY_DATA_TYPE.PANEL_CLOSE,
    });
  };
};

export const actionSowHistorySidePanelOpen = () => {
  return (dispatch) => {
    dispatch({
      type: SOW_HISTORY_DATA_TYPE.PANEL_OPEN,
    });
  };
};

export const actionSowHistorySidePanelToggle = () => {
  return (dispatch) => {
    dispatch({
      type: SOW_HISTORY_DATA_TYPE.PANEL_TOGGLE,
    });
  };
};

export const actionSowHistorySidePanelSearch = (
  searchText = "",
  pageNumber = 1,
  pageSize = 10,
  request = axios.CancelToken.source()
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SOW_HISTORY_DATA_TYPE.HISTORY_FETCHING,
      });
      const createdBy = Cookies.get("name");
      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetGeneratedSOWHistory";
      const res = await axios.get(URL, {
        params: { createdBy, searchText, pageNumber, pageSize },
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
          type: SOW_HISTORY_DATA_TYPE.HISTORY_FETCHED,
          payload: {
            data: newHistory,
            pagination: res.headers["x-pagination"],
          },
        });
      } else {
        dispatch({
          type: SOW_HISTORY_DATA_TYPE.HISTORY_APPEND,
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
        type: SOW_HISTORY_DATA_TYPE.HISTORY_FETCH_FAILED,
      });
    }
  };
};

export const actionIsAdmin = (isAdmin) => {
  return (dispatch) => {
    dispatch({
      type: SOW_HISTORY_DATA_TYPE.SOW_USER_ROLE,
      payload: isAdmin,
    });
  };
};

export const actionGetSOWUserDetails = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SOW_HISTORY_DATA_TYPE.SOW_USER_DETAILS_FETCHING,
      });
      const empNumber = Cookies.get("empnumber");
      // const empNumber = 60147959;

      const URL = URLConfig.getURLDeltaSOWAPI() + "SOWUser/GetSowUserDetails";
      const res = await axios.get(URL, {
        params: { empNumber },
      });
      const roleObj = res.data?.sowUserRoles.find(
        (e) => e.role?.roleName === "Admin"
      );
      const isSolutionHubTeam = res.data?.sowUserRoles?.find(
        (e) => e?.role?.roleName === "SolutionHub Team"
      );
      let state = false;
      if (isSolutionHubTeam && Object.keys(isSolutionHubTeam).length > 0) {
        state = true;
      }

      if (roleObj && Object.keys(roleObj).length > 0) {
        dispatch(actionIsAdmin(true));
      } else {
        dispatch(actionIsAdmin(false));
      }
      dispatch({
        type: SOW_HISTORY_DATA_TYPE.SOW_USER_DETAILS_FETCHED,
        payload: { ...res.data, isSolutionHubTeam: state },
      });
      dispatch(actionGetSharingSidePanelData());
      dispatch(actionGetSharingUserList());
    } catch (err) {
      dispatch({
        type: SOW_HISTORY_DATA_TYPE.SOW_USER_DETAILS_FAILED,
      });
    }
  };
};
