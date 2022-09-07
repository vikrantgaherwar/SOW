import axios from "axios";
import URLConfig from "../../../URLConfig";
import { actionGeneratePreviewSaveTemplate } from "../GeneratePreview";
import { actionMasterDataLoadClone } from "../MasterData";
import { LOG_DATA_TYPE } from "./logDataType";

export const actionLogDataFetch = (id, clone) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOG_DATA_TYPE.LOG_DATA_FETCHING,
      });

      const URL1 =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetStandardFieldsLogData";
      const URL2 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetTransactionLogData";
      const URL3 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubLogData";
      const URL4 =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetPredefinedModuleLogData";

      const URL5 = URLConfig.getURL_SOW_GetE3THistoryData();
      const URL6 =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetCustomModulesLogData";
      const URL7 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetCustomModulesLog";

      const prArr = [URL1, URL2, URL3, URL4, URL5, URL6, URL7].map((url) =>
        axios.get(url, { params: { sowGeneratedId: id } })
      );

      const res = await Promise.all(prArr);
      dispatch({
        type: LOG_DATA_TYPE.LOG_DATA_FETCHED,
        payload: {
          transactionalLog: res[1].data,
          customerLog: res[0].data,
          solutionHubLog: res[2].data,
          predefinedLog: res[3].data,
          e3tLog: res[4].data,
          customModulesLog: res[6].data,
          customModulesDataLog: res[5].data,
        },
      });

      if (clone) {
        dispatch(actionMasterDataLoadClone());
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: LOG_DATA_TYPE.LOG_DATA_FETCH_FAILED,
      });
    }
  };
};

export const actionLogDataReset = () => {
  return (dispatch) => {
    dispatch({
      type: LOG_DATA_TYPE.LOG_DATA_RESET,
    });
  };
};

export const actionFetchLatestSow = (id, loadId, shouldLoad = true) => {
  return async (dispatch) => {
    try {
      const URL = URLConfig.getURL_SOW_LatestSOW();
      const res = await axios.get(URL, { params: { sowGeneratedId: id } });
      const data = res.data;
      // const newId = res.data?.id?;

      dispatch({
        type: LOG_DATA_TYPE.LATEST_DATA,
        payload: { latestData: data },
      });
      dispatch(actionGeneratePreviewSaveTemplate(data.templateOutputPath));
      if (shouldLoad) {
        if (loadId) {
          dispatch(actionLogDataFetch(id));
        } else {
          dispatch(actionLogDataFetch(data.id));
        }
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: LOG_DATA_TYPE.LOG_DATA_FETCH_FAILED,
      });
      // dispatch(actionLogDataFetch(id));
    }
  };
};
