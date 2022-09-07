import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actionDraftSidePanelClose,
  actionDraftGetAllDrafts,
  actionResetDraft,
} from "../../Redux/Actions/Draft";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import HistoryLoader from "../HistorySidePanel/HistoryLoader";
import HistoryRow from "../HistorySidePanel/HistoryRow";
import { useHistory } from "react-router-dom";
import { actionCloneSafeResetData } from "../../Redux/Actions/CloneSafe";
import { actionSowHistorySidePanelClose } from "../../Redux/Actions/SOWHistory";
import { actionLogDataReset } from "../../Redux/Actions/LogData";
import { actionCustomerDataReset } from "../../Redux/Actions/CustomerData";
import { actionMasterDropDownDataReset } from "../../Redux/Actions/MasterDropDown";
import { actionE3TRegionalDataReset } from "../../Redux/Actions/E3TData";
import { actionSolutionHubDropDownReset } from "../../Redux/Actions/SolutionHubDropDown";
import { actionResetDynamicFields } from "../../Redux/Actions/DynamicFields";
import { actionGeneratePreviewReset } from "../../Redux/Actions/GeneratePreview";
import { useInfiniteScroll } from "../HistorySidePanel/InfiniteScroll";
import ChildProvider from "../HistorySidePanel/HistoryChildProvider";

const DraftSidePanel = () => {
  const {
    showSidePanel,
    sidePanelData,
    sidePanelDataFetchState,
    pagination,
    draftFetching,
  } = useSelector((state) => ({
    showSidePanel: state.draft.showSidePanel,
    sidePanelData: state.draft.sidePanelData,
    sidePanelDataFetchState: state.draft.sidePanelDataFetchState,
    pagination: state.draft.pagination,
    draftFetching: state.draft.draftFetching,
  }));
  const [page, setPage] = useState(2);

  const bottomRef = useRef(null);

  const history = useHistory();

  const dispatch = useDispatch();

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    dispatch(actionDraftSidePanelClose());
  };

  const fetchMore = () => {
    dispatch(actionDraftGetAllDrafts(page));
    setPage((page) => page + 1);
  };

  useInfiniteScroll(bottomRef, fetchMore);

  const renderRows = () => {
    if (sidePanelDataFetchState === APIFetchStatus.FETCHING) {
      return <HistoryLoader />;
    }
    return (
      <>
        {sidePanelData.map((h, index) => {
          console.log({ h });
          return (
            <HistoryRow
              dontShow
              key={`history_${h.id}_${index}`}
              listItem={h}
              onClick={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                dispatch(actionCloneSafeResetData());
                dispatch(actionSowHistorySidePanelClose());
                dispatch(actionLogDataReset());
                dispatch(actionCustomerDataReset());
                dispatch(actionMasterDropDownDataReset());
                dispatch(actionE3TRegionalDataReset());
                dispatch(actionSolutionHubDropDownReset());
                dispatch(actionResetDynamicFields());
                dispatch(actionGeneratePreviewReset());

                dispatch(actionDraftSidePanelClose());
                dispatch(actionResetDraft());
                history.push(`/sow/draft/${h.id}`);
              }}
              onChildClick={(e) => {}}
              loader={false}
            />
          );
        })}
        {pagination.HasNext && draftFetching !== APIFetchStatus.FETCHING && (
          <div id="lastComponent" ref={bottomRef} />
        )}
        {draftFetching === APIFetchStatus.FETCHING && <HistoryLoader />}
      </>
    );
  };
  return (
    <>
      {showSidePanel && (
        <div className="slider_click_right" id="shareslide">
          <button
            onClick={handleClose}
            className="close close_button_modules_popup"
            aria-label="Close"
          >
            <span>&times;</span>
          </button>
          <div id="sliderow">
            <div className="col-12 mt-3">
              <h5 className="slider_header">Drafts</h5>
            </div>
          </div>

          <div className="col-12 slider_content">
            {renderRows()}
            {/* {renderSharedRows()} */}
          </div>
        </div>
      )}
    </>
  );
};

export default DraftSidePanel;
