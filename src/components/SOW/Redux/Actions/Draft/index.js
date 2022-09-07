import axios from "axios";
import Cookies from "js-cookie";
import { parseInteger } from "../../../PricingTab/PricingFormFields";
import URLConfig from "../../../URLConfig";
import { Store } from "../../Store";
import { APIFetchStatus } from "../../utils/fetchStatus";
import { actionFetchLatestSow } from "../LogData";
import DRAFT_ACTION_TYPES from "./DraftActionTypes";
import { getDraftData, getPageType } from "./DraftSave";

export const actionResetDraft = () => {
  return (dispatch) => {
    dispatch({
      type: DRAFT_ACTION_TYPES.RESET_DRAFT,
    });
  };
};

export const actionResetDraftPagePostData = () => {
  return (dispatch) => {
    dispatch({
      type: DRAFT_ACTION_TYPES.RESET_DRAFT_PAGEPOSTDATA,
    });
  };
};

export const actionSidePanelToggle = () => {
  return (dispatch) => {
    const state = Store.getState();
    const showSidePanel = state.draft.showSidePanel;
    if (showSidePanel) {
      dispatch(actionDraftSidePanelClose());
    } else {
      dispatch(actionDraftSidePanelOpen());
    }
  };
};

export const actionDraftGetAllDrafts = (
  page = 1,
  pageSize = 10,
  searchText = ""
) => {
  // console.trace();
  return async (dispatch) => {
    try {
      dispatch({
        type: DRAFT_ACTION_TYPES.SIDE_PANEL_DATA_FETCHING,
      });

      const res = await axios.get(URLConfig.getURL_SOW_GetDrafts(), {
        params: {
          createdBy: Cookies.get("name"),
          searchText,
          pageNumber: page,
          pageSize,
        },
      });

      if (page === 1) {
        dispatch({
          type: DRAFT_ACTION_TYPES.SIDE_PANEL_DATA_FETCHED,
          payload: { data: res.data, pagination: res.headers["x-pagination"] },
        });
      } else {
        dispatch({
          type: DRAFT_ACTION_TYPES.SIDE_PANEL_DATA_APPEND,
          payload: { data: res.data, pagination: res.headers["x-pagination"] },
        });
      }

      dispatch(actionDraftCheckShouldLoadLatest());
    } catch (err) {
      console.error(err);
      dispatch({
        type: DRAFT_ACTION_TYPES.SIDE_PANEL_DATA_FETCH_FAILED,
      });
    }
  };
};

const actionDraftCheckShouldLoadLatest = () => {
  return (dispatch) => {
    const state = Store.getState();
    if (state.draft.shouldLoadLatest) {
      dispatch({
        type: DRAFT_ACTION_TYPES.DRAFT_NOT_LOAD_LATEST,
      });
      dispatch(
        actionDraftCheckLatest(state.draft.customerDraftLog[0].sowGeneratedId)
      );
    } else {
      dispatch({
        type: "Draft nothing",
      });
    }
  };
};

export const actionSavePageDraft = (name, genId = "", isClone) => {
  return async (dispatch) => {
    try {
      if (name) {
        const state = Store.getState();
        const generatedId =
          state.logData.latestData.id !== -1
            ? state.logData.latestData.id
            : genId;
        const id =
          state.draft.pagePostFetchState === APIFetchStatus.FETCHED
            ? state.draft.pagePostData?.id?.toString()
            : state.draft.customerDraftLog &&
              state.draft.customerDraftLog.length > 0
            ? state.draft.customerDraftLog[0].sowGeneratedId
            : "";
        const page = getPageType(name);
        const url = URLConfig.getURL_SOW_SavePageDraft();
        console.log({ name, page, url, id, state });

        const data = {
          ...getDraftData(page, Store.getState()),
          isCloned: isClone,
        };

        dispatch({
          type: DRAFT_ACTION_TYPES.SAVE_PAGE_DRAFT_SAVING,
        });

        const res = await axios.post(url, data, {
          params: {
            TabName: page,
            SowDraftGeneratedId: id.length === 0 ? "" : id,
            SowGeneratedId: generatedId,
          },
        });
        console.log({ data, res: res.data });
        dispatch({
          type: DRAFT_ACTION_TYPES.SAVE_PAGE_DRAFT_SAVED,
          payload: res.data,
        });

        dispatch(actionDraftFixLogs());
        dispatch(actionDraftGetAllDrafts());
      } else {
        throw "Name not provided to actionSavePageDraft()";
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: DRAFT_ACTION_TYPES.SAVE_PAGE_DRAFT_SAVING_FAILED,
      });
    }
  };
};

const actionDraftFixLogs = () => {
  return (dispatch) => {
    const state = Store.getState();
    const postData = state.draft.pagePostData;
    const packet = {
      customerDraftLog: {},
      transactionalDraftLog: [],
      predefinedModulesDraftLog: [],
      solutionHubDraftLog: [],
      customModulesDraftLog: [],
      customModulesDataDraftLog: [],
      e3tPricingDraftLog: [],
    };

    packet.customModulesDataDraftLog = postData
      ? postData.sowDraftCustomModulesDataLogs
      : [];
    packet.customModulesDraftLog = postData
      ? postData.sowDraftCustomModulesLogs
      : [];
    packet.customerDraftLog = postData
      ? postData.sowDraftStandardFieldsLogs
      : [];
    packet.transactionalDraftLog = postData
      ? postData.sowDraftTransactionLogs
      : [];
    packet.solutionHubDraftLog = postData
      ? postData.sowDraftTransactionLogs
      : [];
    packet.predefinedModulesDraftLog = postData
      ? postData.sowDraftPredefinedModuleLogs[0]
      : [];

    packet.e3tPricingDraftLog = postData
      ? postData.sowDraftE3tPricingCostingLogs
      : [];

    dispatch({
      type: DRAFT_ACTION_TYPES.PAGE_DATA_LOADED,
      payload: packet,
    });
  };
};

export const actionDraftSidePanelOpen = () => {
  return (dispatch) => {
    dispatch({
      type: DRAFT_ACTION_TYPES.SIDE_PANEL_SHOW,
    });
  };
};

export const actionDraftSidePanelClose = () => {
  return (dispatch) => {
    dispatch({
      type: DRAFT_ACTION_TYPES.SIDE_PANEL_HIDE,
    });
  };
};

export const actionDraftFetchPageData = (id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: DRAFT_ACTION_TYPES.PAGE_DATA_LOADING,
      });
      const urls = [
        URLConfig.getURL_SOW_LoadPageDraft_Customer(),
        URLConfig.getURL_SOW_LoadPageDraft_Transaction(),
        URLConfig.getURL_SOW_LoadPageDraft_Predefined(),
        URLConfig.getURL_SOW_LoadPageDraft_SolutionHub(),
        URLConfig.getURL_SOW_LoadPageDraft_CustomModule(),
        URLConfig.getURL_SOW_LoadPageDraft_CustomModuleData(),
        URLConfig.getURL_SOW_LoadPageDraft_PricingAndCosting(),
      ];

      const dataPr = urls.map((e) =>
        axios.get(e, { params: { sowGeneratedId: id } })
      );
      const data = await Promise.all(dataPr);
      dispatch({
        type: DRAFT_ACTION_TYPES.PAGE_DATA_LOADED,
        payload: {
          customerDraftLog: data[0].data,
          transactionalDraftLog: data[1].data,
          predefinedModulesDraftLog: data[2].data,
          solutionHubDraftLog: data[3].data,
          customModulesDraftLog: data[4].data,
          customModulesDataDraftLog: data[5].data,
          e3tPricingDraftLog: data[6].data,
        },
      });
      dispatch(actionDraftCheckLatest(id));
    } catch (err) {
      console.log(err);
      dispatch({
        type: DRAFT_ACTION_TYPES.PAGE_DATA_LOADING_FAILED,
      });
    }
  };
};

const actionDraftCheckLatest = (id) => {
  return async (dispatch) => {
    const state = Store.getState();
    console.log({ id, sidePanelData: state.draft.sidePanelData });

    if (state.draft.sidePanelDataFetchState !== APIFetchStatus.FETCHED) {
      dispatch({
        type: DRAFT_ACTION_TYPES.DRAFT_LOAD_LATEST,
      });
    } else {
      const f = state.draft.sidePanelData.find(
        (e) => e.id === parseInteger(id)
      );
      console.log({ f });
      if (f && f.originalId) {
        dispatch(actionFetchLatestSow(f.originalId, "", false));
      } else {
        dispatch({
          type: "NEW DRAFT",
        });
      }
    }
  };
};
