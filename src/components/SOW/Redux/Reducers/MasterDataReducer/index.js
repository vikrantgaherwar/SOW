import { MASTER_DATA_ACTION_TYPES } from "../../Actions/MasterData/MasterDataType";
import {
  getMasterDataInitialState,
  getMasterDefaultData,
} from "./masterDataInitialState";

const initialState = getMasterDataInitialState();

const MasterDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case MASTER_DATA_ACTION_TYPES.VALUE_CHANGED:
      return { ...state, ...action.payload };
    case MASTER_DATA_ACTION_TYPES.MASTER_DATA_RESET:
      return { ...state, ...getMasterDefaultData(), oppIdFetched: false };
    case MASTER_DATA_ACTION_TYPES.MASTER_DATA_RESET_ALL:
      return { ...initialState };
    case MASTER_DATA_ACTION_TYPES.MASTER_DATA_OPPID_RESET:
      return { ...state, oppIdFetched: false };
    case MASTER_DATA_ACTION_TYPES.MASTER_DATA_RESET_DATA:
      const { oppId } = state;
      return { ...initialState, oppId };
    // case MASTER_DATA_ACTION_TYPES.COUNTRY_DROPDOWN_DATA_FETCHING:
    //   return {
    //     ...state,
    //     countryDropdownDataFetchState: APIFetchStatus.FETCHING,
    //   };
    // case MASTER_DATA_ACTION_TYPES.COUNTRY_DROPDOWN_DATA_FETCHED:
    //   return {
    //     ...state,
    //     countryDropdownDataFetchState: APIFetchStatus.FETCHED,
    //     country: action.payload,
    //   };
    // case MASTER_DATA_ACTION_TYPES.COUNTRY_DROPDOWN_DATA_FAILED:
    //   return {
    //     ...state,
    //     countryDropdownDataFetchState: APIFetchStatus.FAILED,
    //   };
    default:
      return state;
  }
};

export default MasterDataReducer;
