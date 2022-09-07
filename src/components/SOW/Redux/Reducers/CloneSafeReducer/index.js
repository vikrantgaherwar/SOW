import { CLONE_SAFE_TYPES } from "../../Actions/CloneSafe/CloneSafeTypes";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  productLinesFetched: APIFetchStatus.BOOTED,
  productLines: [],
  customerDataFetched: APIFetchStatus.BOOTED,
  customerData: {},
  templatesFetched: APIFetchStatus.BOOTED,
  templates: [],

  newTemplate: "",
  newBusiness: "",
  newProductLine: "",

  confirmModalMessage: "",
  confirmModalShow: false,
  type: "",
  cloneBreak: false,
};

const CloneSafeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLONE_SAFE_TYPES.PRODUCT_LINES_FETCHED:
      return {
        ...state,
        productLinesFetched: APIFetchStatus.FETCHED,
        productLines: action.payload,
      };
    case CLONE_SAFE_TYPES.CUSTOMER_DATA_FETCHED:
      return {
        ...state,
        customerDataFetched: APIFetchStatus.FETCHED,
        customerData: action.payload,
      };
    case CLONE_SAFE_TYPES.TEMPLATES_FETCHED:
      return {
        ...state,
        templatesFetched: APIFetchStatus.FETCHED,
        templates: action.payload,
      };

    case CLONE_SAFE_TYPES.RESET_DATA:
      return { ...initialState };

    case CLONE_SAFE_TYPES.SHOW_MODAL:
      return {
        ...state,
        confirmModalMessage: action.payload.message,
        confirmModalShow: action.payload.show,
        type: action.payload.type,
      };

    case CLONE_SAFE_TYPES.CLOSE_MODAL:
      return {
        ...state,
        confirmModalMessage: "",
        confirmModalShow: "",
        type: "",
      };

    case CLONE_SAFE_TYPES.CLONE_BREAK:
      return {
        ...state,
        cloneBreak: true,
      };
    case CLONE_SAFE_TYPES.SAVE_NEW_TEMPLATE:
      return {
        ...state,
        newTemplate: action.payload,
      };
    case CLONE_SAFE_TYPES.SAVE_NEW_BUSINESS:
      return {
        ...state,
        newBusiness: action.payload,
      };
    case CLONE_SAFE_TYPES.SAVE_NEW_PRODUCT_LINE:
      return {
        ...state,
        newProductLine: action.payload,
      };
    default:
      return state;
  }
};

export default CloneSafeReducer;
