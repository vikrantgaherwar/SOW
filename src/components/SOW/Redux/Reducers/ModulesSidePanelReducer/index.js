import { MODULES_SIDE_PANEL_DATA } from "../../Actions/ModulesSidePanel/modulesSidePanelData";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  selectedTypeOfWork: [],
  selectedWorkPackages: [],
  showModal: false,
  towDisabled: {},
  cloneSelectedTypeOfWork: "",
  cloneSelectedWorkPackage: "",
  solutionHubCloneDataFetchState: APIFetchStatus.BOOTED,
  solutionHubCloneData: [],
  typeOfWorkCloningData: {},
  typeOfWorkCloningDataFetchState: APIFetchStatus.BOOTED,
  towCloneSaveFetchState: APIFetchStatus.BOOTED,
};

const ModulesSidePanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case MODULES_SIDE_PANEL_DATA.MODAL_OPEN:
      return { ...state, showModal: true };
    case MODULES_SIDE_PANEL_DATA.MODAL_CLOSE:
      return { ...state, showModal: false };
    case MODULES_SIDE_PANEL_DATA.MODAL_TOGGLE:
      return { ...state, showModal: !state.showModal };

    case MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_ADDED:
      return {
        ...state,
        selectedTypeOfWork: [
          ...state.selectedTypeOfWork,
          action.payload.typeOfWork,
        ],
        selectedWorkPackages: [
          ...state.selectedWorkPackages,
          ...action.payload.workPackages,
        ],
      };
    case MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_REMOVED:
      return {
        ...state,
        selectedTypeOfWork: state.selectedTypeOfWork.filter(
          (e) => action.payload.typeOfWork !== e
        ),
        selectedWorkPackages: state.selectedWorkPackages.filter(
          (e) => action.payload.workPackages.indexOf(e) === -1
        ),
      };
    case MODULES_SIDE_PANEL_DATA.WORK_PACKAGES_ADDED:
      return {
        ...state,
        selectedWorkPackages: [
          ...state.selectedWorkPackages,
          action.payload.workPackage,
        ],
      };
    case MODULES_SIDE_PANEL_DATA.WORK_PACKAGES_REMOVED:
      return {
        ...state,
        selectedWorkPackages: state.selectedWorkPackages.filter(
          (e) => e !== action.payload.workPackage
        ),
      };

    case MODULES_SIDE_PANEL_DATA.PANEL_RESET:
      return {
        ...state,
        selectedTypeOfWork: [],
        selectedWorkPackages: [],
        towDisabled: {},
      };
    case MODULES_SIDE_PANEL_DATA.ALL_RESET:
      return { ...initialState };

    case MODULES_SIDE_PANEL_DATA.EDIT_LOADED:
      return {
        ...state,
        selectedTypeOfWork: action.payload.typeOfWork,
        selectedWorkPackages: action.payload.workPackages,
      };
    case MODULES_SIDE_PANEL_DATA.SET_TOW_DISABLED: {
      return {
        ...state,
        towDisabled: {
          ...state.towDisabled,
          [action.payload.tow.typeGrouping]: {
            selectedId: action.payload.tow.id,
            checked: action.payload.checked,
          },
        },
      };
    }
    case MODULES_SIDE_PANEL_DATA.SET_TOW_WP: {
      return {
        ...state,
        cloneSelectedTypeOfWork: action.payload.typeOfWork,
        cloneSelectedWorkPackage: action.payload.wp,
      };
    }
    case MODULES_SIDE_PANEL_DATA.GET_SOLUTION_HUB_DATA_FETCHING: {
      return {
        ...state,
        solutionHubCloneDataFetchState: APIFetchStatus.FETCHING,
      };
    }

    case MODULES_SIDE_PANEL_DATA.GET_SOLUTION_HUB_DATA_FETCHED: {
      return {
        ...state,
        solutionHubCloneDataFetchState: APIFetchStatus.FETCHED,
        solutionHubCloneData: action.payload,
      };
    }

    case MODULES_SIDE_PANEL_DATA.GET_SOLUTION_HUB_DATA_FAILED: {
      return {
        ...state,
        solutionHubCloneDataFetchState: APIFetchStatus.FAILED,
      };
    }

    case MODULES_SIDE_PANEL_DATA.GET_CLONE_SELECTED_TYPE_OF_WORK: {
      return {
        ...state,
        typeOfWorkCloningData: action.payload,
      };
    }

    case MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_DATA_FETCHING: {
      return {
        ...state,
        typeOfWorkCloningDataFetchState: APIFetchStatus.FETCHING,
      };
    }
    case MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_DATA_FETCHED: {
      return {
        ...state,
        typeOfWorkCloningDataFetchState: APIFetchStatus.FETCHED,
        typeOfWorkCloningData: action.payload,
      };
    }
    case MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_DATA_FAILED: {
      return {
        ...state,
        typeOfWorkCloningDataFetchState: APIFetchStatus.FAILED,
      };
    }
    case MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_CLONE_SAVE_FETCHING: {
      return {
        ...state,
        towCloneSaveFetchState: APIFetchStatus.FETCHING,
      };
    }
    case MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_CLONE_SAVE_FETCHED: {
      return {
        ...state,
        towCloneSaveFetchState: APIFetchStatus.FETCHED,
      };
    }
    case MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_CLONE_SAVE_FAILED: {
      return {
        ...state,
        towCloneSaveFetchState: APIFetchStatus.FAILED,
      };
    }
    default:
      return state;
  }
};

export default ModulesSidePanelReducer;
