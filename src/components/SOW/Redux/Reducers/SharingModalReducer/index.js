import { parseInteger } from "../../../PricingTab/PricingFormFields";
import { SHARING_MODAL_DATA } from "../../Actions/SharingModal/SharingModalDataType";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  rights: [],
  userList: [],
  userListFetchState: APIFetchStatus.BOOTED,
  rightsFetchState: APIFetchStatus.BOOTED,
  shareSowFetchState: APIFetchStatus.BOOTED,
  sharingSidePanelDataFetchState: APIFetchStatus.BOOTED,
  showModal: false,
  selectedUser: [],
  sharingSelectedId: "",
  sharingSidePanel: false,
  sharingSidePanelData: [],
  sharingSearching: APIFetchStatus.BOOTED,
  pagination: {
    TotalCount: -1,
    PageSize: -1,
    CurrentPage: -1,
    TotalPages: -1,
    HasNext: false,
    HasPrevious: false,
  },
  sowVersions: [],
  sowVersionsFetchState: APIFetchStatus.BOOTED,
};

const SharingModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHARING_MODAL_DATA.MODAL_OPEN:
      return { ...state, showModal: true };
    case SHARING_MODAL_DATA.MODAL_CLOSE:
      return { ...state, showModal: false };
    case SHARING_MODAL_DATA.MODAL_TOGGLE:
      return { ...state, showModal: !state.showModal };

    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_OPEN:
      return { ...state, sharingSidePanel: true };
    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_CLOSE:
      return { ...state, sharingSidePanel: false };
    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_TOGGLE:
      return { ...state, sharingSidePanel: !state.sharingSidePanel };

    case SHARING_MODAL_DATA.SHARING_RIGHTS_FETCHING:
      return { ...state, rightsFetchState: APIFetchStatus.FETCHING };

    case SHARING_MODAL_DATA.SHARING_RIGHTS_FETCHED:
      return {
        ...state,
        rightsFetchState: APIFetchStatus.FETCHED,
        rights: action.payload,
      };

    case SHARING_MODAL_DATA.SHARING_RIGHTS_FAILED:
      return { ...state, rightsFetchState: APIFetchStatus.FAILED };

    case SHARING_MODAL_DATA.SHARING_USERLIST_FETCHING:
      return { ...state, userListFetchState: APIFetchStatus.FETCHING };

    case SHARING_MODAL_DATA.SHARING_USERLIST_FETCHED:
      return {
        ...state,
        userListFetchState: APIFetchStatus.FETCHED,
        userList: action.payload,
      };

    case SHARING_MODAL_DATA.SHARING_SOW_FETCHING:
      return { ...state, shareSowFetchState: APIFetchStatus.FETCHING };
    case SHARING_MODAL_DATA.SHARING_SOW_FETCHED:
      return { ...state, shareSowFetchState: APIFetchStatus.FETCHED };
    case SHARING_MODAL_DATA.SHARING_SOW_FAILED:
      return { ...state, shareSowFetchState: APIFetchStatus.FAILED };

    case SHARING_MODAL_DATA.SHARING_USERLIST_FAILED:
      return { ...state, userListFetchState: APIFetchStatus.FAILED };

    case SHARING_MODAL_DATA.SHARING_MODAL_RESET:
      return {
        ...state,
        rights: state.rights.map((r) => ({ ...r, checked: false })),
        selectedUser: [],
      };

    case SHARING_MODAL_DATA.SHARING_SELECT_USER:
      return { ...state, selectedUser: action.payload };

    case SHARING_MODAL_DATA.RESET_SIDEPANEL_DATA:
      return {
        ...state,
        sharingSidePanelData: [],
      };

    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_APPEND:
      return {
        ...state,
        sharingSidePanelDataFetchState: APIFetchStatus.FETCHED,
        sharingSearching: APIFetchStatus.FETCHED,
        sharingSidePanelData: [
          ...state.sharingSidePanelData,
          ...action.payload.data,
        ],
        pagination: { ...JSON.parse(action.payload.pagination) },
      };
    case SHARING_MODAL_DATA.SHARING_MODAL_SELECTED_ID:
      return {
        ...state,
        sharingSelectedId: action.payload,
      };

    case SHARING_MODAL_DATA.SHARING_RIGHTS_SELECTED: {
      const updatedRights = state.rights.map((r) => {
        if (r.id === parseInteger(action.payload.id)) {
          return { ...r, checked: action.payload.checked };
        }
        return { ...r };
      });
      return {
        ...state,
        rights: updatedRights,
      };
    }

    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_FETCHING: {
      if (state.sharingSidePanelDataFetchState === APIFetchStatus.FETCHED) {
        return { ...state, sharingSearching: APIFetchStatus.FETCHING };
      } else {
        return {
          ...state,
          sharingSidePanelDataFetchState: APIFetchStatus.FETCHING,
        };
      }
    }

    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_FETCHED:
      return {
        ...state,
        sharingSidePanelDataFetchState: APIFetchStatus.FETCHED,
        sharingSearching: APIFetchStatus.FETCHED,
        sharingSidePanelData: action.payload.data,
        pagination: { ...JSON.parse(action.payload.pagination) },
      };
    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_FAILED:
      return {
        ...state,
        sharingSidePanelDataFetchState: APIFetchStatus.FAILED,
      };
    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_SEARCH:
      return {
        ...state,
        sharingSidePanelData: state.sharingSidePanelData.filter((f) =>
          Object.values(f).includes(action.payload)
        ),
      };
    case SHARING_MODAL_DATA.SOW_VERSIONS_FETCHING:
      return {
        ...state,
        sowVersionsFetchState: APIFetchStatus.FETCHING,
      };
    case SHARING_MODAL_DATA.SOW_VERSIONS_FETCHED:
      return {
        ...state,
        sowVersions: action.payload,
        sowVersionsFetchState: APIFetchStatus.FETCHED,
      };
    case SHARING_MODAL_DATA.SHARING_SIDE_PANEL_DATA_FAILED:
      return {
        ...state,
        sowVersionsFetchState: APIFetchStatus.FAILED,
      };

    default:
      return state;
  }
};

export default SharingModalReducer;
