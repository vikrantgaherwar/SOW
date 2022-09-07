import SECTION_DATA_STRUCTURE, {
  generateBlankExisitingSectionData,
} from "../../Actions/MasterDropDown/sectionDataStructure";
import { SOLUTION_HUB_DATA } from "../../Actions/SolutionHubData/solutionHubDataType";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  data: [generateBlankExisitingSectionData()],
  fieldsLoaded: APIFetchStatus.BOOTED,
};

const SolutionHubReducer = (state = initialState, action) => {
  switch (action.type) {
    case SOLUTION_HUB_DATA.FIELD_ADDED:
      const length = state.data.length;
      const ob = generateBlankExisitingSectionData();
      ob.sectionName = `${ob.sectionName} (${length + 1})`;
      return { ...state, data: [...state.data, ob] };
    case SOLUTION_HUB_DATA.FIELDS_LOADED:
      const newState = generateBlankExisitingSectionData();
      return {
        ...state,
        fieldsLoaded: APIFetchStatus.FETCHED,
        data: [...newState],
      };
    case SOLUTION_HUB_DATA.FIELD_REMOVED:
      const newState2 = generateBlankExisitingSectionData();
      return {
        ...state,
        data:
          state.data.length === 1
            ? [...newState2]
            : state.data.filter((_, index) => index !== action.payload.index),
      };
    case SOLUTION_HUB_DATA.FIELD_UPDATED:
      return {
        ...state,
        data: state.data.map((e, id) => {
          const newE = { ...e };
          if (id === action.payload.index) {
            newE[action.payload.name] = action.payload.value;
          }
          return newE;
        }),
      };

    case SOLUTION_HUB_DATA.FIELDS_RESET:
      return {
        ...state,
        data: [...generateBlankExisitingSectionData()],
        fieldsLoaded: APIFetchStatus.FETCHED,
      };
    default:
      return state;
  }
};

export default SolutionHubReducer;
