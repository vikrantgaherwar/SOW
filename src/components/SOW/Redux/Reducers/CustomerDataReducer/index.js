import { CUSTOMER_DATA_TYPE } from "../../Actions/CustomerData/CustomerDataType";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  accountName: "",
  geo: "",
  countryName: "",
  businessName: "",
  oppId: "",
  sku: [],
  productLine: "",
  salesStage: "",
  winLossReason: "",
  customerDataFetchState: APIFetchStatus.BOOTED,
  noResponseData: "",
  isClone: false,
  isNew: true,
};

const CustomerDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER_DATA_TYPE.VALUE_CHANGED:
      return { ...state, ...action.payload };
    case CUSTOMER_DATA_TYPE.API_DATA_FETCHING:
      return { ...state, customerDataFetchState: APIFetchStatus.FETCHING };
    case CUSTOMER_DATA_TYPE.API_DATA_FETCHED:
      return {
        ...state,
        ...action.payload,
        customerDataFetchState: APIFetchStatus.FETCHED,
      };
    case CUSTOMER_DATA_TYPE.API_DATA_FAILED:
      return {
        ...state,
        customerDataFetchState: APIFetchStatus.FAILED,
      };
    case CUSTOMER_DATA_TYPE.RESET_DATA:
      return { ...initialState };
    case CUSTOMER_DATA_TYPE.RESET_SKU:
      return { ...state, sku: [] };
    case CUSTOMER_DATA_TYPE.REMOVE_SKU_INDEX:
      return {
        ...state,
        sku: state.sku.filter((_, index) => index !== action.payload.index),
      };
    case CUSTOMER_DATA_TYPE.NO_RESPONSE_ERROR_HANDLER:
      return { ...state, noResponseData: action.payload };
    case CUSTOMER_DATA_TYPE.ISCLONE:
      return {
        ...state,
        isClone: action.payload.clone,
        isNew: action.payload.new,
      };
    default:
      return state;
  }
};

export default CustomerDataReducer;
