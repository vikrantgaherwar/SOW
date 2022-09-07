import { isString } from "lodash";
import DRAFT_ACTION_TYPES from "../../Actions/Draft/DraftActionTypes";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  pagePostFetchState: APIFetchStatus.BOOTED,
  pagePostData: {},
  showSidePanel: false,
  sidePanelData: [],
  sidePanelDataFetchState: APIFetchStatus.BOOTED,
  customerDraftLog: [],
  transactionalDraftLog: [],
  predefinedModulesDraftLog: [],
  solutionHubDraftLog: [],
  customModulesDraftLog: [],
  customModulesDataDraftLog: [],
  e3tPricingDraftLog: [],
  draftLogsFetchState: APIFetchStatus.BOOTED,
  shouldLoadLatest: false,
  draftFetching: APIFetchStatus.BOOTED,
  pagination: {
    TotalCount: -1,
    PageSize: -1,
    CurrentPage: -1,
    TotalPages: -1,
    HasNext: false,
    HasPrevious: false,
  },
};

const DraftReducer = (state = initialState, action) => {
  switch (action.type) {
    case DRAFT_ACTION_TYPES.RESET_DRAFT:
      return {
        ...initialState,
        sidePanelData: state.sidePanelData,
        sidePanelDataFetchState: state.sidePanelDataFetchState,
      };
    case DRAFT_ACTION_TYPES.RESET_DRAFT_PAGEPOSTDATA:
      return {
        ...initialState,
        pagePostData: {},
        pagePostFetchState: APIFetchStatus.BOOTED,
      };
    case DRAFT_ACTION_TYPES.SAVE_PAGE_DRAFT_SAVING:
      return { ...state, pagePostFetchState: APIFetchStatus.FETCHING };
    case DRAFT_ACTION_TYPES.SAVE_PAGE_DRAFT_SAVING_FAILED:
      return { ...state, pagePostFetchState: APIFetchStatus.FAILED };
    case DRAFT_ACTION_TYPES.SAVE_PAGE_DRAFT_SAVED:
      return {
        ...state,
        pagePostFetchState: APIFetchStatus.FETCHED,
        pagePostData: isString(action.payload)
          ? state.pagePostData
          : action.payload,
      };
    case DRAFT_ACTION_TYPES.SIDE_PANEL_SHOW:
      return { ...state, showSidePanel: true };
    case DRAFT_ACTION_TYPES.SIDE_PANEL_HIDE:
      return { ...state, showSidePanel: false };
    case DRAFT_ACTION_TYPES.SIDE_PANEL_DATA_FETCHING: {
      if (state.sidePanelDataFetchState === APIFetchStatus.FETCHED) {
        return { ...state, draftFetching: APIFetchStatus.FETCHING };
      } else {
        return {
          ...state,
          sidePanelDataFetchState: APIFetchStatus.FETCHING,
        };
      }
    }
    case DRAFT_ACTION_TYPES.SIDE_PANEL_DATA_FETCHED:
      return {
        ...state,
        sidePanelDataFetchState: APIFetchStatus.FETCHED,
        sidePanelData: action.payload.data,
        draftFetching: APIFetchStatus.FETCHED,
        pagination: { ...JSON.parse(action.payload.pagination) },
      };
    case DRAFT_ACTION_TYPES.SIDE_PANEL_DATA_FETCH_FAILED:
      return { ...state, sidePanelDataFetchState: APIFetchStatus.FAILED };

    case DRAFT_ACTION_TYPES.PAGE_DATA_LOADING:
      return { ...state, draftLogsFetchState: APIFetchStatus.FETCHING };

    case DRAFT_ACTION_TYPES.PAGE_DATA_LOADING_FAILED:
      return { ...state, draftLogsFetchState: APIFetchStatus.FAILED };
    case DRAFT_ACTION_TYPES.SIDE_PANEL_DATA_APPEND:
      return {
        ...state,
        draftLogsFetchState: APIFetchStatus.FETCHED,
        draftFetching: APIFetchStatus.FETCHED,
        sidePanelData: [...state.sidePanelData, ...action.payload.data],
        pagination: { ...JSON.parse(action.payload.pagination) },
      };

    case DRAFT_ACTION_TYPES.PAGE_DATA_LOADED:
      return {
        ...state,
        draftLogsFetchState: APIFetchStatus.FETCHED,
        customerDraftLog: action.payload.customerDraftLog,
        transactionalDraftLog: action.payload.transactionalDraftLog,
        predefinedModulesDraftLog: action.payload.predefinedModulesDraftLog,
        solutionHubDraftLog: action.payload.solutionHubDraftLog,
        customModulesDraftLog: action.payload.customModulesDraftLog,
        customModulesDataDraftLog: action.payload.customModulesDataDraftLog,
        e3tPricingDraftLog: action.payload.e3tPricingDraftLog,
      };

    case DRAFT_ACTION_TYPES.DRAFT_LOAD_LATEST:
      return { ...state, shouldLoadLatest: true };
    case DRAFT_ACTION_TYPES.DRAFT_NOT_LOAD_LATEST:
      return { ...state, shouldLoadLatest: false };

    default:
      return state;
  }
};

export default DraftReducer;
