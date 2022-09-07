import { SOW_HISTORY_DATA_TYPE } from "../../Actions/SOWHistory/sowHistoryDataType";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  history: [],
  historyFetchStatus: APIFetchStatus.BOOTED,
  historySearching: APIFetchStatus.BOOTED,
  panelOpen: false,
  allHistoryFetched: false,
  allHistory: [],
  sowUserDetails: {},
  sowUserDetailsFetchState: APIFetchStatus.BOOTED,
  isAdmin: false,
  pagination: {
    TotalCount: -1,
    PageSize: -1,
    CurrentPage: -1,
    TotalPages: -1,
    HasNext: false,
    HasPrevious: false,
  },
};

const SOWHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SOW_HISTORY_DATA_TYPE.HISTORY_FETCHING: {
      if (state.historyFetchStatus === APIFetchStatus.FETCHED) {
        return { ...state, historySearching: APIFetchStatus.FETCHING };
      } else {
        return { ...state, historyFetchStatus: APIFetchStatus.FETCHING };
      }
    }
    case SOW_HISTORY_DATA_TYPE.HISTORY_FETCHED:
      return {
        ...state,
        historyFetchStatus: APIFetchStatus.FETCHED,
        historySearching: APIFetchStatus.FETCHED,
        history: action.payload.data,
        pagination: { ...JSON.parse(action.payload.pagination) },
      };
    case SOW_HISTORY_DATA_TYPE.HISTORY_FETCH_FAILED:
      return { ...state, historyFetchStatus: APIFetchStatus.FAILED };
    case SOW_HISTORY_DATA_TYPE.PANEL_CLOSE:
      return { ...state, panelOpen: false };
    case SOW_HISTORY_DATA_TYPE.PANEL_OPEN:
      return { ...state, panelOpen: true };
    case SOW_HISTORY_DATA_TYPE.PANEL_TOGGLE:
      return { ...state, panelOpen: !state.panelOpen };
    case SOW_HISTORY_DATA_TYPE.HISTORY_APPEND:
      return {
        ...state,
        historySearching: APIFetchStatus.FETCHED,
        history: [...state.history, ...action.payload.data],
        pagination: { ...JSON.parse(action.payload.pagination) },
      };

    case "ALL_HISTORY_FETCHED":
      return {
        ...state,
        allHistoryFetched: true,
        allHistory: action.payload.data,
      };

    case SOW_HISTORY_DATA_TYPE.SOW_USER_DETAILS_FETCHING:
      return { ...state, sowUserDetailsFetchState: APIFetchStatus.FETCHING };
    case SOW_HISTORY_DATA_TYPE.SOW_USER_DETAILS_FETCHED:
      return {
        ...state,
        sowUserDetailsFetchState: APIFetchStatus.FETCHED,
        sowUserDetails: action.payload,
      };
    case SOW_HISTORY_DATA_TYPE.SOW_USER_DETAILS_FAILED:
      return { ...state, sowUserDetailsFetchState: APIFetchStatus.FAILED };

    case SOW_HISTORY_DATA_TYPE.SOW_USER_ROLE: {
      return {
        ...state,
        isAdmin: action.payload,
      };
    }

    default:
      return state;
  }
};

export default SOWHistoryReducer;
