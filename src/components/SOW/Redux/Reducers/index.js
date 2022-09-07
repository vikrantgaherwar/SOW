import { combineReducers } from "redux";
import CloneSafeReducer from "./CloneSafeReducer";
import CustomerDataReducer from "./CustomerDataReducer";
import CustomModulesSidePanelReducer from "./CustomModulesSidePanelReducer";
import DraftReducer from "./DraftReducer";
import DynamicFieldsReducer from "./DynamicFieldsReducer";
import DynamicFormDataReducer from "./DynamicFormDataReducer";
import E3TDataReducer from "./E3TDataReducer";
import E3TReducer from "./E3TReducer";
import GeneratePreviewReducer from "./GeneratePreviewReducer";
import LogDataReducer from "./LogDataReducer";
import MasterDataReducer from "./MasterDataReducer";
import MasterDropDownDataReducer from "./MasterDropDownDataReducer";
import ModulesSidePanelReducer from "./ModulesSidePanelReducer";
import SharingModalReducer from "./SharingModalReducer";
import SolutionHubDropDownReducer from "./SolutionHubDropDownReducer";
import SolutionHubReducer from "./SolutionHubReducer";
import SolutionHubSidePanelDataReducer from "./SolutionHubSidePanelDataReducer";
import SOWHistoryReducer from "./SOWHistoryReducer";

const rootReducer = combineReducers({
  masterData: MasterDataReducer,
  masterDropDown: MasterDropDownDataReducer,
  customerData: CustomerDataReducer,
  e3t: E3TReducer,
  e3tData: E3TDataReducer,
  showHistory: SOWHistoryReducer,
  solutionHubDropDown: SolutionHubDropDownReducer,
  dynamicFields: DynamicFieldsReducer,
  moduleSidePanel: ModulesSidePanelReducer,
  customModuleSidePanel: CustomModulesSidePanelReducer,
  dynamicData: DynamicFormDataReducer,
  logData: LogDataReducer,
  solutionHubData: SolutionHubReducer,
  generatePreview: GeneratePreviewReducer,
  cloneSafe: CloneSafeReducer,
  sharingModal: SharingModalReducer,
  solutionHubSidePanelData: SolutionHubSidePanelDataReducer,
  draft: DraftReducer,
});

export default rootReducer;
