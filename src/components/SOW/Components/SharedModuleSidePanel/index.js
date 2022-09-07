import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ModulesSearchComponent from "../../ModuleSelection/ModulesSearchComponent";
import { actionCloneSafeResetData } from "../../Redux/Actions/CloneSafe";
import { actionCustomerDataReset } from "../../Redux/Actions/CustomerData";
import { actionResetDynamicFields } from "../../Redux/Actions/DynamicFields";
import { actionE3TRegionalDataReset } from "../../Redux/Actions/E3TData";
import { actionGeneratePreviewReset } from "../../Redux/Actions/GeneratePreview";
import { actionLogDataReset } from "../../Redux/Actions/LogData";
import { actionMasterDropDownDataReset } from "../../Redux/Actions/MasterDropDown";
import {
  actionGetSharingSidePanelData,
  actionGetSowVersions,
  actionSharingModalClose,
  actionSharingSidePanelClose,
} from "../../Redux/Actions/SharingModal";
import { SHARING_MODAL_DATA } from "../../Redux/Actions/SharingModal/SharingModalDataType";
import { actionSolutionHubDropDownReset } from "../../Redux/Actions/SolutionHubDropDown";
import { actionSowHistorySidePanelClose } from "../../Redux/Actions/SOWHistory";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import ChildProvider from "../HistorySidePanel/HistoryChildProvider";
import HistoryLoader from "../HistorySidePanel/HistoryLoader";
import HistorySearchLoader from "../HistorySidePanel/HistorySearchLoader";
import { useInfiniteScroll } from "../HistorySidePanel/InfiniteScroll";
import SharedDataRow from "./SharedDataRow.js";

const SharedModuleSidePanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(2);
  const request = axios.CancelToken.source();
  const [hasSearchInit, setHasSearchInit] = useState(false);
  const bottomRef = useRef(null);
  const initiateSearch = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  const [versionLoading, setVersionLoading] = useState({});

  const versioId = useRef(null);
  const {
    sharingSidePanel,
    sidePanelDataFetchState,
    sharingSidePanelData,
    sharingSearching,
    pagination,
    sowVersionsFetchState,
    sowVersions,
  } = useSelector(
    (state) => ({
      sharingSidePanel: state.sharingModal.sharingSidePanel,
      sidePanelDataFetchState:
        state.sharingModal.sharingSidePanelDataFetchState,
      sharingSearching: state.sharingModal.sharingSearching,
      sharingSidePanelData: state.sharingModal.sharingSidePanelData,
      pagination: state.sharingModal.pagination,
      sowVersionsFetchState: state.sharingModal.sowVersionsFetchState,
      sowVersions: state.sharingModal.sowVersions,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (searchQuery || hasSearchInit) {
      setHasSearchInit(true);
      searchSharedSow();
    }
    return () => request.cancel("Request cancelled");
  }, [searchQuery]);

  const searchSharedSow = () => {
    setPage(2);
    clearTimeout(initiateSearch.current);
    initiateSearch.current = setTimeout(() => {
      searchQuery
        ? dispatch(actionGetSharingSidePanelData(searchQuery, 1, 100, request))
        : dispatch(actionGetSharingSidePanelData());
    }, 300);
  };

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(actionSharingSidePanelClose());
  };

  useEffect(() => {
    if (sowVersionsFetchState === APIFetchStatus.FETCHED) {
      setVersionLoading((prev) => ({ ...prev, [versioId.current]: false }));
    }
  }, [sowVersionsFetchState]);

  const getSowVersion = (id) => {
    versioId.current = id;
    setVersionLoading((prev) => ({ ...prev, [versioId.current]: true }));
    dispatch(actionGetSowVersions(id));
  };

  const handleSharedVersionClick = (type, id) => {
    dispatch(actionCloneSafeResetData());
    dispatch(actionSowHistorySidePanelClose());
    dispatch(actionLogDataReset());
    dispatch(actionCustomerDataReset());
    dispatch(actionMasterDropDownDataReset());
    dispatch(actionE3TRegionalDataReset());
    dispatch(actionSolutionHubDropDownReset());
    dispatch(actionResetDynamicFields());
    dispatch(actionGeneratePreviewReset());
    history.replace(`/sow/${type === 0 ? "view" : "clone"}/${id}`);
  };

  // 0- view, 1 edit, 2 clone
  const handleSharedLinkClick = (id, type = 0) => {
    if (type === 3) {
      getSowVersion(id);
    } else {
      dispatch(actionSharingSidePanelClose());
      dispatch(actionSharingModalClose());
      dispatch(actionCloneSafeResetData());
      dispatch(actionSowHistorySidePanelClose());
      dispatch(actionLogDataReset());
      dispatch(actionCustomerDataReset());
      dispatch(actionMasterDropDownDataReset());
      dispatch(actionE3TRegionalDataReset());
      dispatch(actionSolutionHubDropDownReset());
      dispatch(actionResetDynamicFields());
      dispatch(actionGeneratePreviewReset());
      history.push(
        `/sow/${type === 1 ? "edit" : type === 2 ? "clone" : "view"}`,
        {
          id,
        }
      );
    }
  };

  const fetchMore = () => {
    dispatch(actionGetSharingSidePanelData(searchQuery, page));
    setPage((page) => page + 1);
  };

  useInfiniteScroll(bottomRef, fetchMore);

  const renderSharedRows = () => {
    if (sidePanelDataFetchState === APIFetchStatus.FETCHING) {
      return <HistoryLoader />;
    } else {
      return (
        <div
          style={{ margin: "60px 0px 30px 0px" }}
          // className={
          //   sowVersionsFetchState === APIFetchStatus.FETCHING
          //     ? "search-in-progress"
          //     : ""
          // }
        >
          <ChildProvider
            value={{
              data: sowVersions,
              loader: versionLoading,
            }}
          >
            {sharingSidePanelData.map((h, index) => (
              <SharedDataRow
                key={`shared_${h.id}_${index}`}
                listItem={h}
                onClick={handleSharedLinkClick}
                onChildClick={handleSharedVersionClick}
              />
            ))}
            {pagination.HasNext &&
              sharingSearching !== APIFetchStatus.FETCHING && (
                <div id="lastComponent" ref={bottomRef} />
              )}
            {sharingSearching === APIFetchStatus.FETCHING && <HistoryLoader />}
          </ChildProvider>
        </div>
      );
    }
  };

  const handleReload = (e) => {
    e.preventDefault();
    dispatch({ type: SHARING_MODAL_DATA.RESET_SIDEPANEL_DATA });
    dispatch(actionGetSharingSidePanelData());
  };

  return (
    <>
      {sharingSidePanel && (
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
              <h5 className="slider_header">
                Shared SOWs &nbsp;
                {sharingSearching === 1 ? (
                  <i
                    style={{ cursor: "pointer" }}
                    className="fas history-panel-icon-size fa-sync fa-spin"
                  />
                ) : (
                  <i
                    style={{ cursor: "pointer" }}
                    onClick={handleReload}
                    title="Refresh Shared SOWs"
                    className="fas history-panel-icon-size fa-sync"
                  />
                )}
              </h5>
            </div>
          </div>

          <div className="col-12 slider_content">
            <div className="pt-1 input-search sow-history-search">
              {/* To be changed later */}
              <ModulesSearchComponent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search"
                aria-describedby="Search"
                className="form-history-control"
              />
            </div>
            {renderSharedRows()}
          </div>
        </div>
      )}
    </>
  );
};

export default SharedModuleSidePanel;
