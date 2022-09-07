import { SOLUTIONHUB_SIDE_PANEL_DATA_TYPES } from "../../Actions/SolutionHubSidePanelData/solutionHubSidePanelDataTypes";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  panelData: [],
  panelDataFetchStatus: APIFetchStatus.BOOTED,
  panelDataSearching: APIFetchStatus.BOOTED,
  panelOpen: false,
  panelDataFetched: false,
  allPanelData: [],
  pagination: {
    TotalCount: -1,
    PageSize: -1,
    CurrentPage: -1,
    TotalPages: -1,
    HasNext: false,
    HasPrevious: false,
  },
};

const SolutionHubSidePanelDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.SOLUTIONHUB_SIDEPANEL_DATA_FETCHING: {
      if (state.panelDataFetchStatus === APIFetchStatus.FETCHED) {
        return { ...state, panelDataSearching: APIFetchStatus.FETCHING };
      } else {
        return { ...state, panelDataFetchStatus: APIFetchStatus.FETCHING };
      }
    }
    case SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.SOLUTIONHUB_SIDEPANEL_DATA_FETCHED:
      return {
        ...state,
        panelDataFetchStatus: APIFetchStatus.FETCHED,
        panelDataSearching: APIFetchStatus.FETCHED,
        panelData: action.payload.data,
        pagination: { ...JSON.parse(action.payload.pagination) },
      };
    case SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.SOLUTIONHUB_SIDEPANEL_DATA_FAILED:
      return { ...state, panelDataFetchStatus: APIFetchStatus.FAILED };
    case SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.PANEL_CLOSE:
      return { ...state, panelOpen: false };
    case SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.PANEL_OPEN:
      return { ...state, panelOpen: true };
    case SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.PANEL_TOGGLE:
      return { ...state, panelOpen: !state.panelOpen };
    case SOLUTIONHUB_SIDE_PANEL_DATA_TYPES.SOLUTIONHUB_SIDEPANEL_DATA_APPEND:
      return {
        ...state,
        panelDataSearching: APIFetchStatus.FETCHED,
        panelData: [...state.panelData, ...action.payload.data],
        pagination: { ...JSON.parse(action.payload.pagination) },
      };

    case "ALL_SOLUTIONHUB_SIDEPANEL_DATA_FETCHED":
      return {
        ...state,
        panelDataFetched: true,
        allPanelData: action.payload.data,
      };

    default:
      return state;
  }
};

export default SolutionHubSidePanelDataReducer;
