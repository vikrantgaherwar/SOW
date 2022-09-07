import { MASTER_DROP_DOWN_DATA_ACTION_TYPES } from "../../Actions/MasterDropDown/MasterDropDownType";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  countryDropDownData: [],
  businessDropDownData: [],
  contractTermsDropDownData: [],
  revRecogDropDownData: [],
  productLineDropDownData: [],
  preloadFieldsDataFetchDataStatus: APIFetchStatus.BOOTED,

  templateFieldDropDownData: [],
  templateFieldDataFetchStatus: APIFetchStatus.BOOTED,

  workPackageSectionData: [],
  workPackageSectionDataFetchStatus: APIFetchStatus.BOOTED,

  skuFetchStatus: APIFetchStatus.BOOTED,
  sku: [],
};

const MasterDropDownDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FETCHING:
      return {
        ...state,
        preloadFieldsDataFetchDataStatus: APIFetchStatus.FETCHING,
        // templateFieldDataFetchStatus: APIFetchStatus.FETCHING,
        // workPackageSectionDataFetchStatus: APIFetchStatus.FETCHING,
      };

    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FETCHED:
      return {
        ...state,
        preloadFieldsDataFetchDataStatus: APIFetchStatus.FETCHED,
        // templateFieldDataFetchStatus: APIFetchStatus.FETCHED,
        // workPackageSectionDataFetchStatus: APIFetchStatus.FETCHED,
        ...action.payload,
      };

    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FAILED:
      return {
        ...state,
        preloadFieldsDataFetchDataStatus: APIFetchStatus.FAILED,
        // templateFieldDataFetchStatus: APIFetchStatus.FAILED,
        // workPackageSectionDataFetchStatus: APIFetchStatus.FAILED,
      };

    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.TEMPLATE_FIELD_FETCHING:
      return {
        ...state,
        templateFieldDataFetchStatus: APIFetchStatus.FETCHING,
      };
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.TEMPLATE_FIELD_FETCHED:
      return {
        ...state,
        templateFieldDataFetchStatus: APIFetchStatus.FETCHED,
        templateFieldDropDownData: action.payload,
      };
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.TEMPLATE_FIELD_FAILED:
      return {
        ...state,
        templateFieldDataFetchStatus: APIFetchStatus.FAILED,
      };

    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FETCHING:
      return {
        ...state,
        workPackageSectionDataFetchStatus: APIFetchStatus.FETCHING,
      };
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FETCHED:
      return {
        ...state,
        workPackageSectionData: action.payload,
        workPackageSectionDataFetchStatus: APIFetchStatus.FETCHED,
      };
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FAILED:
      return {
        ...state,
        workPackageSectionDataFetchStatus: APIFetchStatus.FAILED,
      };
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_RESET:
      return {
        ...initialState,
      };
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FETCHING:
      return {
        ...state,
        skuFetchStatus: APIFetchStatus.FETCHING,
      };
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FETCHED:
      return {
        ...state,
        skuFetchStatus: APIFetchStatus.FETCHED,
        sku: action.payload,
      };
    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FAILED:
      return {
        ...state,
        skuFetchStatus: APIFetchStatus.FAILED,
      };

    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.SAVE_PRODUCTLINE_DATA:
      return {
        ...state,
        productLineDropDownData: action.payload,
      };

    case MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_VALUE_CHANGED: {
      const { id, value } = action.payload;
      return {
        ...state,
        workPackageSectionData: state.workPackageSectionData.map(
          (wpData, index) => {
            if (id === index) {
              return { ...wpData, value };
            }
            return wpData;
          }
        ),
      };
    }
    default:
      return state;
  }
};

export default MasterDropDownDataReducer;
