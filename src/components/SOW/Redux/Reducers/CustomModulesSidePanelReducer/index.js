import { CUSTOM_MODULES_SIDE_PANEL_DATA } from "../../Actions/CustomModulesSidePanel/customModulesSidePanelData";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  selectedTypeOfWork: [],
  selectedWorkPackages: [],
  showCustomModal: false,
  customDropdown: [],
  customDropDownFetchState: APIFetchStatus.BOOTED,
  customModulesDataFetchState: APIFetchStatus.BOOTED,
  customModulesSubmitData: [],
  modulesDefaultData: [],
  customModulesState: [],
  customModulesAddState: APIFetchStatus.BOOTED,
  customModulesNameChangedState: APIFetchStatus.BOOTED,
  shouldLoadDynamicData: false,
  customModulesDomain: "",
  customMainModuleCloneDataFetchState: APIFetchStatus.BOOTED,
  customMainModuleCloneData: [],
  customModulesCloneSubmitFetchState: APIFetchStatus.BOOTED,
  isCustomModuleReset: false,
};

const CustomModulesSidePanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODAL_OPEN:
      return { ...state, showCustomModal: true };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODAL_CLOSE:
      return { ...state, showCustomModal: false };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODAL_TOGGLE:
      return { ...state, showCustomModal: !state.showCustomModal };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_SUBMIT_FETCHING:
      return { ...state, customModulesDataFetchState: APIFetchStatus.FETCHING };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_SUBMIT_FETCHED:
      return {
        ...state,
        customModulesSubmitData: action.payload,
        customModulesDataFetchState: APIFetchStatus.FETCHED,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_SEARCH_FETCHED:
      return {
        ...state,
        customModulesDataFetchState: APIFetchStatus.FETCHED,
        customModulesSubmitData: action.payload,
        isCustomModuleReset: false,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_DOMAIN_FETCHED:
      return {
        ...state,
        customModulesDomain: action.payload,
        isCustomModuleReset: false,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_SUBMIT_FAILED:
      return {
        ...state,
        customModulesDataFetchState: APIFetchStatus.FAILED,
        customModulesState: APIFetchStatus.FAILED,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_TYPE_OF_WORK_ADDED:
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

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_TYPE_OF_WORK_REMOVED:
      return {
        ...state,
        selectedTypeOfWork: state.selectedTypeOfWork.filter(
          (e) => action.payload.typeOfWork !== e
        ),
        selectedWorkPackages: state.selectedWorkPackages.filter(
          (e) => action.payload.workPackages.indexOf(e) === -1
        ),
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_WORK_PACKAGES_ADDING:
      return {
        ...state,
        customModulesAddState: APIFetchStatus.FETCHING,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_WORK_PACKAGES_ADD_COMPLETE:
      return {
        ...state,
        customModulesAddState: APIFetchStatus.FETCHED,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_WORK_PACKAGES_ADDED:
      return {
        ...state,
        selectedWorkPackages: [
          ...state.selectedWorkPackages,
          action.payload.workPackage,
        ],
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_WORK_PACKAGES_REMOVED:
      return {
        ...state,
        selectedWorkPackages: state.selectedWorkPackages.filter(
          (e) => e !== action.payload.workPackage
        ),
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_PANEL_RESET:
      return {
        ...state,
        selectedTypeOfWork: [],
        selectedWorkPackages: [],
        isCustomModuleReset: true,
      };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_ALL_RESET:
      return { ...initialState };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_DROPDOWN_FETCHING:
      return { ...state, customDropDownFetchState: APIFetchStatus.FETCHING };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_DROPDOWN_FETCHED:
      return {
        ...state,
        customDropDownFetchState: APIFetchStatus.FETCHED,
        customDropdown: action.payload,
      };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_DROPDOWN_FAILED:
      return { ...state, customDropDownFetchState: APIFetchStatus.FAILED };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_STATE_ADD: {
      return {
        ...state,
        customModulesState: [
          ...state.customModulesState,
          action.payload.workPackage,
        ],
      };
    }
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_STATE_ADD: {
      return {
        ...state,
        customModulesState: state.customModulesState.filter(
          (_, id) => id !== action.payload.idx
        ),
      };
    }

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_STATE_UPDATE: {
      return {
        ...state,
        customModulesState: state.customModulesState.map((e, id) =>
          id === action.payload.idx
            ? { ...e, [action.payload.name]: action.payload.data }
            : e
        ),
      };
    }

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_EDIT_LOADED: {
      return {
        ...state,
        selectedWorkPackages: action.payload.workPackages,
        selectedTypeOfWork: action.payload.typeOfWork,
      };
    }

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SETTING:
      return {
        ...state,
        customModulesNameChangedState: APIFetchStatus.FETCHING,
      };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SET:
      return {
        ...state,
        customModulesNameChangedState: APIFetchStatus.FETCHED,
      };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SET_FAILED:
      return {
        ...state,
        customModulesNameChangedState: APIFetchStatus.FAILED,
      };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.RESET_SUBMIT:
      return {
        ...state,
        customModulesDataFetchState: APIFetchStatus.BOOTED,
        customModulesSubmitData: [],
        customModulesDomain: "",
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.SHOULD_LOAD_DYNAMIC_VALUE_CHANGED:
      return {
        ...state,
        shouldLoadDynamicData: action.payload,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_CLONE_MAIN_MODULES_CLONE_FETCHING:
      return {
        ...state,
        customMainModuleCloneDataFetchState: APIFetchStatus.FETCHING,
      };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_CLONE_MAIN_MODULES_CLONE_FETCHED:
      return {
        ...state,
        customMainModuleCloneDataFetchState: APIFetchStatus.FETCHED,
        customMainModuleCloneData: action.payload,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_CLONE_MAIN_MODULES_CLONE_FAILED:
      return {
        ...state,
        customMainModuleCloneDataFetchState: APIFetchStatus.FAILED,
      };

    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_SUBMIT_MODULES_FETCHING:
      return {
        ...state,
        customModulesCloneSubmitFetchState: APIFetchStatus.FETCHING,
      };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_SUBMIT_MODULES_FETCHED:
      return {
        ...state,
        customModulesCloneSubmitFetchState: APIFetchStatus.FETCHED,
      };
    case CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_SUBMIT_MODULES_FAILED:
      return {
        ...state,
        customModulesCloneSubmitFetchState: APIFetchStatus.FAILED,
      };
    default:
      return state;
  }
};

export default CustomModulesSidePanelReducer;
