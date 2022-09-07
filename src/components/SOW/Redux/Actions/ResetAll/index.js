import { actionCloneSafeResetData } from "../CloneSafe";
import { actionCustomerDataReset } from "../CustomerData";
import { actionCustomModuleSidePanelAllReset } from "../CustomModulesSidePanel";
import { actionResetDraft, actionResetDraftPagePostData } from "../Draft";
import { actionResetDynamicFields } from "../DynamicFields";
import { actionE3TDataReset } from "../E3T";
import { actionE3TDataDataReset } from "../E3TData";
import { actionGeneratePreviewReset } from "../GeneratePreview";
import { actionLogDataReset } from "../LogData";
import {
  actionMasterDataResetAll,
  actionMasterDataResetData,
} from "../MasterData";
import { actionMasterDropDownDataReset } from "../MasterDropDown";
import { actionModuleSidePanelAllReset } from "../ModulesSidePanel";
import { actionSolutionHubDropDownReset } from "../SolutionHubDropDown";
import { actionSowHistorySidePanelClose } from "../SOWHistory";

export const resetAll = (oppId) => {
  return (dispatch) => {
    if (oppId) {
      dispatch(actionMasterDataResetData());
    } else {
      dispatch(actionMasterDataResetAll());
    }
    dispatch(actionMasterDropDownDataReset());
    dispatch(actionCustomerDataReset());
    dispatch(actionE3TDataReset());
    dispatch(actionSolutionHubDropDownReset());
    dispatch(actionResetDynamicFields());
    dispatch(actionGeneratePreviewReset());
    dispatch(actionLogDataReset());
    dispatch(actionCloneSafeResetData());
    dispatch(actionE3TDataDataReset());
    dispatch(actionSowHistorySidePanelClose());
    dispatch(actionCustomModuleSidePanelAllReset());
    dispatch(actionModuleSidePanelAllReset());
    dispatch(actionResetDraftPagePostData());
    dispatch(actionResetDraft());
    // dispatch(actionCustomModuleSidePanelReset());
  };
};
