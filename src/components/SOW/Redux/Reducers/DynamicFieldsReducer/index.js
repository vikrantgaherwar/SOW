import { DYNAMIC_FIELDS_DATA } from "../../Actions/DynamicFields/dynamicFieldsData";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  data: [],
  fields: [],
  MsaTextArea: {},
  fetchStatus: APIFetchStatus.BOOTED,
};
const DynamicFieldsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DYNAMIC_FIELDS_DATA.API_FETCHING:
      return { ...state, fetchStatus: APIFetchStatus.FETCHING };
    case DYNAMIC_FIELDS_DATA.API_FETCHED:
      return {
        ...state,
        fetchStatus: APIFetchStatus.FETCHED,
        data: action.payload.data,
        fields: action.payload.fields,
        MsaTextArea: action.payload.MsaTextArea,
      };

    case DYNAMIC_FIELDS_DATA.API_FETCH_FAILED:
      return { ...state, fetchStatus: APIFetchStatus.FAILED };
    case DYNAMIC_FIELDS_DATA.API_RESET:
      return { ...initialState };
    case DYNAMIC_FIELDS_DATA.SOW_TEMPLATE_FIELD_CHANGED:
      return {
        ...state,
        data: { ...state.data, sowTemplateFields: [...action.payload] },
      };
    default:
      return state;
  }
};

export default DynamicFieldsReducer;
