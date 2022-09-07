import axios from "axios";
import Cookies from "js-cookie";
import URLConfig from "../../../URLConfig";
import { Store } from "../../Store";
import { dynamicDataMapper } from "../../utils/dynamicDataMapper";
import { e3tMapDataToArray } from "../../utils/e3tDataMapper";
import { GENERATE_PREVIEW_TYPE } from "./generatePreviewType";
import { saveAs } from "file-saver";
import {
  actionFetchSowHistoryData,
  actionSowHistorySidePanelSearch,
} from "../SOWHistory";
import { LOG_DATA_TYPE } from "../LogData/logDataType";
import {
  getCustomerDataPacket,
  getDynamicDataPacket,
  getE3TDataPacket,
} from "../Draft/DraftSave";
import {
  actionDraftGetAllDrafts,
  actionResetDraftPagePostData,
} from "../Draft";
import { APIFetchStatus } from "../../utils/fetchStatus";

export const actionGeneratePreview = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POSTING,
      });
      const state = Store.getState();
      const url = URLConfig.getURL_SOW_GeneratePreview();

      const dynamicFields = getDynamicDataPacket(state);

      dynamicFields.e3tFormState = getE3TDataPacket(state);
      // dynamicFields.e3tFormState.remoteDeliveryMix = deliveryMix;
      dynamicFields.createdBy = Cookies.get("name");
      dynamicFields.modifiedBy = Cookies.get("name");
      dynamicFields.userId = Cookies.get("empnumber");

      dynamicFields.standardField = getCustomerDataPacket(state);

      console.log({ dynamicFields });
      const params = {
        SOWDraftGeneratedId:
          state.draft.draftLogsFetchState === APIFetchStatus.FETCHED
            ? state.draft.customerDraftLog[0].sowGeneratedId
            : "",
      };

      console.log({ params });
      const res = await axios.post(url, dynamicFields, {
        params,
      });
      // console.log({ data: res.data });

      // dispatch(actionResetDraftPagePostData());

      dispatch({
        type: GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POSTED,
        payload: res.data,
      });
      dispatch({
        type: LOG_DATA_TYPE.LATEST_DATA,
        payload: { latestData: res.data },
      });
      dispatch(
        actionGeneratePreviewSaveTemplate(res?.data?.templateOutputPath)
      );
      dispatch({
        type: LOG_DATA_TYPE.LOG_DATA_FETCHED,
        payload: {
          transactionalLog: res.data?.sowTransactionLogs,
          customerLog: res.data?.sowStandardFieldsLogs,
          solutionHubLog: res.data?.sowSolutionHubDataLogs,
          predefinedLog: res.data?.sowPredefinedModuleLogs,
          e3tLog: res.data?.sowE3tPricingCostingLogs,
        },
      });

      //The below api call is for sending mail when any custom module approved.
      //Date : 21-04-2022
      const mailUrl = URLConfig.getURL_SOW_Admin_Mail() + res.data.id;
      await axios.get(mailUrl);

      dispatch(actionSowHistorySidePanelSearch());
      dispatch(actionDraftGetAllDrafts());
    } catch (err) {
      console.log(err);
      dispatch({
        type: GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POST_FAILED,
      });
    }
  };
};

export const actionGeneratePreviewSaveTemplate = (templateOutputPath) => {
  return (dispatch) => {
    dispatch({
      type: GENERATE_PREVIEW_TYPE.SAVE_TEMPLATE,
      payload: templateOutputPath,
    });
  };
};

export const actionGeneratePreviewLoadView = () => {
  return (dispatch) => {
    dispatch({
      type: GENERATE_PREVIEW_TYPE.LOAD_PREVIEW,
    });
  };
};

export const actionGeneratePreviewDownloadPDFV2 = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GENERATE_PREVIEW_TYPE.DOWNLOAD_POSTING,
      });

      const URL = URLConfig.getURL_SOW_GenerateSOWPdfV2();
      const state = Store.getState();

      const data = new FormData();
      data.append("", state.generatePreview.res.templateOutputPath);
      // const data = state.generatePreview.res.templateOutputPath;

      const res = await axios.post(URL, data, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) =>
          dispatch({
            type: GENERATE_PREVIEW_TYPE.SET_DOWNLOAD_PERCENT,
            payload: Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            ),
          }),
      });

      if (res.data) {
        const sp = state.generatePreview.res.templateOutputPath.split("\\");
        const name = sp[sp.length - 1];

        console.log({ name });
        saveAs(res.data, `${name.split(".").slice(0, -1).join(".")}.pdf`);

        dispatch({
          type: GENERATE_PREVIEW_TYPE.DOWNLOAD_POSTED,
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: GENERATE_PREVIEW_TYPE.DOWNLOAD_POST_FAILED,
      });
    }
  };
};

export const actionGeneratePreviewDownloadPDF = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GENERATE_PREVIEW_TYPE.DOWNLOAD_POSTING,
      });
      const URL = URLConfig.getURL_SOW_GenerateSOWPdf();
      const state = Store.getState();
      const data = state.generatePreview.res;

      const res = await axios.post(URL, data, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) =>
          dispatch({
            type: GENERATE_PREVIEW_TYPE.SET_DOWNLOAD_PERCENT,
            payload: Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            ),
          }),
      });

      if (res.data) {
        saveAs(
          res.data,
          `${data.templateOutputName.split(".").slice(0, -1).join(".")}.pdf`
        );

        dispatch({
          type: GENERATE_PREVIEW_TYPE.DOWNLOAD_POSTED,
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: GENERATE_PREVIEW_TYPE.DOWNLOAD_POST_FAILED,
      });
    }
  };
};

export const actionUpdateAndPreview = (clone = false) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POSTING,
      });

      const state = Store.getState();
      const URL = URLConfig.getURL_SOW_UpdateSOW();

      const dynamicFields = getDynamicDataPacket(state);

      dynamicFields.e3tFormState = getE3TDataPacket(state);
      dynamicFields.modifiedBy = Cookies.get("name");
      dynamicFields.createdBy = state.logData.latestData.createdBy;
      dynamicFields.userId = Cookies.get("empnumber");

      const {
        id: currentId,
        clonedId,
        originalId,
        prevGeneratedId,
      } = state.logData.latestData;
      dynamicFields.currentId = currentId;
      dynamicFields.clonedId = clonedId;
      dynamicFields.originalId = originalId;
      dynamicFields.prevGeneratedId = prevGeneratedId;
      dynamicFields.isCloned = clone;

      dynamicFields.standardField = getCustomerDataPacket(state);

      const res = await axios.post(URL, dynamicFields, {
        params: {
          sowGeneratedId: state.logData.transactionalLog[0]?.sowGeneratedId,
          SOWDraftGeneratedId:
            state.draft.draftLogsFetchState === APIFetchStatus.FETCHED
              ? state.draft.customerDraftLog[0].sowGeneratedId
              : "",
          sowGeneratedId: currentId,
        },
      });

      dispatch({
        type: GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POSTED,
        payload: res.data,
      });

      dispatch({
        type: LOG_DATA_TYPE.LATEST_DATA,
        payload: { latestData: res.data },
      });
      dispatch(
        actionGeneratePreviewSaveTemplate(res?.data?.templateOutputPath)
      );
      dispatch({
        type: LOG_DATA_TYPE.LOG_DATA_FETCHED,
        payload: {
          transactionalLog: res.data?.sowTransactionLogs,
          customerLog: res.data?.sowStandardFieldsLogs,
          solutionHubLog: res.data?.sowSolutionHubDataLogs,
          predefinedLog: res.data?.sowPredefinedModuleLogs,
          e3tLog: res.data?.sowE3tPricingCostingLogs,
        },
      });
      //The below api call is for sending mail when any custom module used to generate for more than 3 SOWs
      //Date : 21-04-2022
      if (clone) {
        const mailUrl = URLConfig.getURL_SOW_Admin_Mail() + res?.data.id;
        await axios.get(mailUrl);
      }
      // dispatch({
      //   type: "SOMETHING",
      // });

      dispatch(actionSowHistorySidePanelSearch());
      dispatch(actionDraftGetAllDrafts());
    } catch (err) {
      console.log(err);
      dispatch({
        type: GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POST_FAILED,
      });
    }
  };
};

export const actionGeneratePreviewReset = () => {
  return (dispatch) => {
    dispatch({
      type: GENERATE_PREVIEW_TYPE.RESET_DATA,
    });
  };
};
