import axios from "axios";
import Cookies from "js-cookie";
import URLConfig from "../../../URLConfig";
import { Store } from "../../Store";
import { SHARING_MODAL_DATA } from "./SharingModalDataType";

export const actionSharingModalOpen = () => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.MODAL_OPEN,
    });
  };
};

export const actionSharingModalClose = () => {
  return (dispatch) => {
    dispatch(actionSharingModalReset());
    dispatch({
      type: SHARING_MODAL_DATA.MODAL_CLOSE,
    });
  };
};

export const actionSharingModalToggle = () => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.MODAL_TOGGLE,
    });
  };
};

export const actionSharingModalSelectedId = (id) => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.SHARING_MODAL_SELECTED_ID,
      payload: id,
    });
  };
};

export const actionSharingModalReset = () => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.SHARING_MODAL_RESET,
    });
  };
};

export const actionSelectUser = (user) => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.SHARING_SELECT_USER,
      payload: user,
    });
  };
};

export const actionGetSharingUserList = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_USERLIST_FETCHING,
      });
      const URL = URLConfig.getURLDeltaSOWAPI() + "SOWUser/GetSowUsersList";
      const res = await axios.get(URL, {
        params: { emailId: Cookies.get("mail") },
      });
      const userList = res.data;
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_USERLIST_FETCHED,
        payload: userList,
      });
      dispatch(actionGetSharingRights());
    } catch (err) {
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_USERLIST_FAILED,
      });
    }
  };
};

export const actionSharingSidePanelClose = () => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.SHARING_SIDE_PANEL_CLOSE,
    });
  };
};

export const actionSharingSidePanelOpen = () => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.SHARING_SIDE_PANEL_OPEN,
    });
  };
};

export const actionSharingSidePanelToggle = () => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.SHARING_SIDE_PANEL_TOGGLE,
    });
  };
};

export const actionGetSharingRights = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_RIGHTS_FETCHING,
      });
      const URL = URLConfig.getURLDeltaSOWAPI() + "SOWUser/GetSowRights";
      const res = await axios.get(URL);
      // const rightsData = res.data.map((r) => {
      //   if (r.rightsName === "View") {
      //     r.checked = true;
      //   } else {
      //     r.checked = false;
      //   }
      //   return r;
      // });
      const data = res.data.sort((a, b) =>
        a.displayOrder > b.displayOrder ? 1 : -1
      );
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_RIGHTS_FETCHED,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_RIGHTS_FAILED,
      });
    }
  };
};

export const actionShareSow = (ob) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_SOW_FETCHING,
      });
      const URL = URLConfig.getURLDeltaSOWAPI() + "SOWUser/ShareSOW";
      const res = await axios.post(URL, ob);
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_SOW_FETCHED,
        payload: res.data,
      });

      dispatch(actionSharingModalClose());
    } catch (err) {
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_SOW_FAILED,
      });
    }
  };
};

export const actionSelectRights = (id, checked) => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.SHARING_RIGHTS_SELECTED,
      payload: { id, checked },
    });
  };
};

export const actionGetSharingSidePanelData = (
  searchText = "",
  pageNumber = 1,
  pageSize = 10,
  request = axios.CancelToken.source()
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_FETCHING,
      });
      const state = Store.getState();

      const currentUserId =
        state.showHistory?.sowUserDetails?.sowUserRoles[0].userId;

      const URL = URLConfig.getURLDeltaSOWAPI() + "SOWUser/SowSharedWithMe";
      const res = await axios.get(URL, {
        params: { currentUserId, searchText, pageNumber, pageSize },
        cancelToken: request.token,
      });
      const data = res.data.map((e) => {
        let newName = e.templateOutputName.replace(".docx", "");
        const sp = newName.split("_");
        sp[1] = sp[1].startsWith("Adv") ? "A&PS" : sp[1];

        newName = sp.join("_");
        return { ...e, newName };
      });
      if (pageNumber === 1) {
        dispatch({
          type: SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_FETCHED,
          payload: { data, pagination: res.headers["x-pagination"] },
        });
      } else {
        dispatch({
          type: SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_APPEND,
          payload: { data, pagination: res.headers["x-pagination"] },
        });
      }
    } catch (err) {
      dispatch({
        type: SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_FAILED,
      });
    }
  };
};

export const actionFilterSharingSidePanelList = (query) => {
  return (dispatch) => {
    dispatch({
      type: SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_SEARCH,
      payload: query,
    });
  };
};

export const actionGetSowVersions = (sowGeneratedId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SHARING_MODAL_DATA.SOW_VERSIONS_FETCHING,
      });
      const URL =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetGeneratedSOWVersionsV2";
      const res = await axios.get(URL, {
        params: { sowGeneratedId, createdBy: Cookies.get("name") },
      });
      /* get formatted name */
      const newVesrion = res.data.map((e) => {
        let newName = e.templateOutputName.replace(".docx", "");
        const sp = newName.split("_");
        sp[1] = sp[1].startsWith("Adv") ? "A&PS" : sp[1];

        newName = sp.join("_");
        return { ...e, newName };
      });
      dispatch({
        type: SHARING_MODAL_DATA.SOW_VERSIONS_FETCHED,
        payload: { [sowGeneratedId]: newVesrion },
      });
    } catch (err) {
      dispatch({
        type: SHARING_MODAL_DATA.SOW_VERSIONS_FAILED,
      });
    }
  };
};
