import { LOG_DATA_TYPE } from "../../Actions/LogData/logDataType";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  fetchStatus: APIFetchStatus.BOOTED,
  transactionalLog: [],
  customerLog: [],
  solutionHubLog: [],
  predefinedLog: [],
  e3tLog: [],
  customModulesLog: {},
  customModulesDataLog: [],
  latestData: {
    id: -1,
    templateId: -1,
    templateOutputName: "",
    templateOutputPath: "",
    isPreview: true,
    createdDate: "",
    createdBy: "",
    modifiedDate: "",
    modifiedBy: "",
    isActive: true,
    prevGeneratedId: null,
    clonedId: null,
    originalId: null,
    userId: null,
    template: null,
    sowPredefinedModuleLogs: [],
    sowSolutionHubDataLogs: [],
    sowStandardFieldsLogs: [],
    sowTransactionLogs: [],
    sowE3tPricingCostingLogs: [],
  },
};
const LogDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_DATA_TYPE.LOG_DATA_FETCHING:
      return { ...state, fetchStatus: APIFetchStatus.FETCHING };
    case LOG_DATA_TYPE.LOG_DATA_FETCHED:
      return {
        ...state,
        fetchStatus: APIFetchStatus.FETCHED,
        transactionalLog: action.payload.transactionalLog ?? [],
        customerLog: action.payload.customerLog ?? [],
        solutionHubLog: action.payload.solutionHubLog ?? [],
        predefinedLog: action.payload.predefinedLog ?? [],
        e3tLog: action.payload.e3tLog ?? {},
        customModulesLog: action.payload.customModulesLog ?? {},
        customModulesDataLog: action.payload.customModulesDataLog ?? [],
      };
    case LOG_DATA_TYPE.LATEST_DATA:
      return { ...state, latestData: action.payload.latestData };

    case LOG_DATA_TYPE.LOG_DATA_FETCH_FAILED:
      return { ...state, fetchStatus: APIFetchStatus.FAILED };

    case LOG_DATA_TYPE.LOG_DATA_RESET:
      return { ...initialState };
    default:
      return state;
  }
};

export default LogDataReducer;
