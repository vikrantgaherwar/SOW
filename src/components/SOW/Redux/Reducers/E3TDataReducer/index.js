import { E3T_DATA_DATA_TYPE } from "../../Actions/E3TData/e3tDataDataTypes";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  e3tHistory: {},
  e3tRegionalData: {},
  e3tRegionalDataV2: [],
  e3tResourceDropDown: [],
  e3tHistoryFetchState: APIFetchStatus.BOOTED,
  e3tRegionalDataFetchState: APIFetchStatus.BOOTED,
  e3tRegionalDataV2FetchState: APIFetchStatus.BOOTED,
  e3tRemoteSTDs: [],
  e3tRemoteSTDsFetchState: APIFetchStatus.BOOTED,
  e3tTshirtSizes: [],
  e3tTshirtSizesV2: [],
  e3tTshirtSizesFetchState: APIFetchStatus.BOOTED,
  e3tFxRates: [],
  e3tFxRatesFetchState: APIFetchStatus.BOOTED,
  e3tCostingEstimation: [],
  e3tCostingEstimationV2: [],
  e3tCostingEstimationFetchState: APIFetchStatus.BOOTED,
  e3tTshirtSizesV2FetchState: APIFetchStatus.BOOTED,
  e3tCostingEstimationV2FetchState: APIFetchStatus.BOOTED,
  e3tShouldRecalculate: false,
  shouldLoadEditData: false,
};

const E3TDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case E3T_DATA_DATA_TYPE.HISTORY_DATA_FETCHING:
      return { ...state, e3tHistoryFetchState: APIFetchStatus.FETCHING };

    case E3T_DATA_DATA_TYPE.REGIONAL_DATA_V2_FETCHING:
      return { ...state, e3tRegionalDataV2FetchState: APIFetchStatus.FETCHING };

    case E3T_DATA_DATA_TYPE.REGIONAL_DATA_V2_FETCHED:
      return {
        ...state,
        e3tHistoryFetchState: APIFetchStatus.FETCHED,
        e3tRegionalDataV2: action.payload,
        e3tRegionalDataV2FetchState: APIFetchStatus.FETCHED,
      };
    case E3T_DATA_DATA_TYPE.REGIONAL_DATA_V2_FAILED:
      return {
        ...state,
        e3tHistoryFetchState: APIFetchStatus.FAILED,
        e3tRegionalDataV2FetchState: APIFetchStatus.FAILED,
      };
    case E3T_DATA_DATA_TYPE.HISTORY_DATA_FETCHED:
      return {
        ...state,
        e3tHistoryFetchState: APIFetchStatus.FETCHED,
        e3tHistory: action.payload,
      };
    case E3T_DATA_DATA_TYPE.E3T_SHOULD_RECALCULATE:
      return { ...state, e3tShouldRecalculate: true };
    case E3T_DATA_DATA_TYPE.E3T_RECALCULATED:
      return { ...state, e3tShouldRecalculate: false };
    case E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FETCHING:
      return { ...state, e3tRemoteSTDsFetchState: APIFetchStatus.FETCHING };
    case E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FETCHED:
      return {
        ...state,
        e3tRemoteSTDs: [...action.payload],
        e3tRemoteSTDsFetchState: APIFetchStatus.FETCHED,
      };
    case E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FAILED:
      return { ...state, e3tRemoteSTDsFetchState: APIFetchStatus.FAILED };

    case E3T_DATA_DATA_TYPE.TSHIRTSIZE_DATA_FETCHING:
      return { ...state, e3tTshirtSizesFetchState: APIFetchStatus.FETCHING };
    case E3T_DATA_DATA_TYPE.TSHIRTSIZE_DATA_FETCHED:
      return {
        ...state,
        e3tTshirtSizes: [...action.payload],
        e3tTshirtSizesFetchState: APIFetchStatus.FETCHED,
      };
    case E3T_DATA_DATA_TYPE.TSHIRTSIZE_DATA_FAILED:
      return { ...state, e3tTshirtSizesFetchState: APIFetchStatus.FAILED };

    case E3T_DATA_DATA_TYPE.TSHIRTSIZEV2_DATA_FETCHING:
      return { ...state, e3tTshirtSizesV2FetchState: APIFetchStatus.FETCHING };
    case E3T_DATA_DATA_TYPE.TSHIRTSIZEV2_DATA_FETCHED:
      return {
        ...state,
        e3tTshirtSizesV2: [...action.payload],
        e3tTshirtSizesV2FetchState: APIFetchStatus.FETCHED,
      };
    case E3T_DATA_DATA_TYPE.TSHIRTSIZEV2_DATA_FAILED:
      return { ...state, e3tTshirtSizesV2FetchState: APIFetchStatus.FAILED };

    case E3T_DATA_DATA_TYPE.FXRATES_DATA_FETCHING:
      return { ...state, e3tFxRatesFetchState: APIFetchStatus.FETCHING };
    case E3T_DATA_DATA_TYPE.FXRATES_DATA_FETCHED:
      return {
        ...state,
        e3tFxRates: [...action.payload],
        e3tFxRatesFetchState: APIFetchStatus.FETCHED,
      };
    case E3T_DATA_DATA_TYPE.FXRATES_DATA_FAILED:
      return { ...state, e3tFxRatesFetchState: APIFetchStatus.FAILED };

    case E3T_DATA_DATA_TYPE.COSTING_ESTIMATION_FETCHING:
      return {
        ...state,
        e3tCostingEstimationFetchState: APIFetchStatus.FETCHING,
      };
    case E3T_DATA_DATA_TYPE.COSTING_ESTIMATION_FETCHED:
      return {
        ...state,
        e3tCostingEstimation: [...action.payload],
        e3tCostingEstimationFetchState: APIFetchStatus.FETCHED,
      };
    case E3T_DATA_DATA_TYPE.COSTING_ESTIMATION_FAILED:
      return {
        ...state,
        e3tCostingEstimationFetchState: APIFetchStatus.FAILED,
      };

    case E3T_DATA_DATA_TYPE.COSTING_ESTIMATIONV2_FETCHING:
      return {
        ...state,
        e3tCostingEstimationV2FetchState: APIFetchStatus.FETCHING,
      };
    case E3T_DATA_DATA_TYPE.COSTING_ESTIMATIONV2_FETCHED:
      return {
        ...state,
        e3tCostingEstimationV2: [...action.payload],
        e3tCostingEstimationV2FetchState: APIFetchStatus.FETCHED,
      };
    case E3T_DATA_DATA_TYPE.COSTING_ESTIMATIONV2_FAILED:
      return {
        ...state,
        e3tCostingEstimationV2FetchState: APIFetchStatus.FAILED,
      };

    case E3T_DATA_DATA_TYPE.HISTORY_DATA_FETCH_FAILED:
      return {
        ...state,
        e3tHistoryFetchState: APIFetchStatus.FAILED,
      };

    case E3T_DATA_DATA_TYPE.REGIONAL_DATA_FETCHING:
      return { ...state, e3tRegionalDataFetchState: APIFetchStatus.FETCHING };
    case E3T_DATA_DATA_TYPE.REGIONAL_DATA_FETCHED:
      return {
        ...state,
        e3tRegionalDataFetchState: APIFetchStatus.FETCHED,
        ...action.payload,
      };
    case E3T_DATA_DATA_TYPE.REGIONAL_DATA_FETCH_FAILED:
      return {
        ...state,
        e3tRegionalDataFetchState: APIFetchStatus.FAILED,
      };
    case E3T_DATA_DATA_TYPE.REGIONAL_DATA_RESET:
      return {
        ...initialState,
      };
    case E3T_DATA_DATA_TYPE.E3T_EDIT_DATA_CHANGED: {
      return {
        ...state,
        shouldLoadEditData: action.payload,
      };
    }
    case E3T_DATA_DATA_TYPE.E3T_EDIT_DATA_RESET: {
      return {
        ...state,
        shouldLoadEditData: false,
      };
    }

    case E3T_DATA_DATA_TYPE.E3T_DATA_RESET: {
      return { ...initialState };
    }

    default:
      return state;
  }
};

export default E3TDataReducer;
