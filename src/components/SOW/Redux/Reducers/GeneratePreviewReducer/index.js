import { GENERATE_PREVIEW_TYPE } from "../../Actions/GeneratePreview/generatePreviewType";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  previewPostState: APIFetchStatus.BOOTED,
  downloadState: APIFetchStatus.BOOTED,
  res: {},
  percent: 0,
};

const GeneratePreviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POSTING:
      return {
        ...state,
        previewPostState: APIFetchStatus.FETCHING,
        percent: 0,
      };
    case GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POSTED:
      return {
        ...state,
        previewPostState: APIFetchStatus.FETCHED,
        res: action.payload,
      };
    case GENERATE_PREVIEW_TYPE.GENERATE_PREVIEW_POST_FAILED:
      return {
        ...state,
        previewPostState: APIFetchStatus.FAILED,
        percent: 0,
      };
    case GENERATE_PREVIEW_TYPE.DOWNLOAD_POSTING:
      return { ...state, downloadState: APIFetchStatus.FETCHING, percent: 0 };
    case GENERATE_PREVIEW_TYPE.DOWNLOAD_POSTED:
      return { ...state, downloadState: APIFetchStatus.FETCHED, percent: 100 };
    case GENERATE_PREVIEW_TYPE.DOWNLOAD_POST_FAILED:
      return { ...state, downloadState: APIFetchStatus.FAILED, percent: 0 };

    case GENERATE_PREVIEW_TYPE.SET_DOWNLOAD_PERCENT:
      return { ...state, percent: action.payload };

    case GENERATE_PREVIEW_TYPE.RESET_DATA:
      return {
        ...state,
        previewPostState: APIFetchStatus.BOOTED,
        percent: 0,
      };

    case GENERATE_PREVIEW_TYPE.SAVE_TEMPLATE:
      return {
        ...state,
        res: { templateOutputPath: action.payload },
      };
    case GENERATE_PREVIEW_TYPE.LOAD_PREVIEW: {
      const previewPostState =
        state.res && state.res.templateOutputPath
          ? APIFetchStatus.FETCHED
          : APIFetchStatus.FAILED;
      console.log({ previewPostState });
      return {
        ...state,
        previewPostState,
      };
    }
    default:
      return state;
  }
};

export default GeneratePreviewReducer;
