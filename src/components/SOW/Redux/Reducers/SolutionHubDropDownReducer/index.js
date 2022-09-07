import { SOLUTION_HUB_DROP_DOWN_DATA } from "../../Actions/SolutionHubDropDown/solutionHubDropDownData";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  dropDown: [],
  dropDownFetchState: APIFetchStatus.BOOTED,
};

// console.log({ SOLUTION_HUB_DROP_DOWN_DATA });

const SolutionHubDropDownReducer = (state = initialState, action) => {
  switch (action.type) {
    case SOLUTION_HUB_DROP_DOWN_DATA.DROP_DOWN_DATA_FETCHING:
      return { ...state, dropDownFetchState: APIFetchStatus.FETCHING };
    case SOLUTION_HUB_DROP_DOWN_DATA.DROP_DOWN_DATA_FETCHED:
      return {
        ...state,
        dropDownFetchState: APIFetchStatus.FETCHED,
        dropDown: action.payload,
      };
    case SOLUTION_HUB_DROP_DOWN_DATA.DROP_DOWN_DATA_FETCH_FAILED:
      return { ...state, dropDownFetchState: APIFetchStatus.FAILED };
    case SOLUTION_HUB_DROP_DOWN_DATA.DROP_DOWN_DATA_RESET:
      return { ...initialState };
    default:
      return state;
  }
};

export default SolutionHubDropDownReducer;
