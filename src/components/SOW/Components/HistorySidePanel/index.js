import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ModulesSearchComponent from "../../ModuleSelection/ModulesSearchComponent";
import { actionCustomerDataReset } from "../../Redux/Actions/CustomerData";
import { actionResetDynamicFields } from "../../Redux/Actions/DynamicFields";
import { actionE3TRegionalDataReset } from "../../Redux/Actions/E3TData";
import { actionGeneratePreviewReset } from "../../Redux/Actions/GeneratePreview";
import { actionLogDataReset } from "../../Redux/Actions/LogData";
import { actionMasterDropDownDataReset } from "../../Redux/Actions/MasterDropDown";
import { actionSolutionHubDropDownReset } from "../../Redux/Actions/SolutionHubDropDown";
import {
  actionFetchSowHistoryData,
  actionSowHistorySidePanelClose,
  actionSowHistorySidePanelSearch,
} from "../../Redux/Actions/SOWHistory";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import HistoryRow from "./HistoryRow";
import { useInfiniteScroll } from "./InfiniteScroll";
import ChildProvider from "./HistoryChildProvider";
import URLConfig from "../../../URLConfig";
import HistoryLoader from "./HistoryLoader";
import HistorySearchLoader from "./HistorySearchLoader";
import { actionCloneSafeResetData } from "../../Redux/Actions/CloneSafe";
import "./style.css";
import {
  actionSharingModalSelectedId,
  actionSharingModalToggle,
} from "../../Redux/Actions/SharingModal";
import { actionDraftGetAllDrafts, actionResetDraft } from "../../Redux/Actions/Draft";

const HistorySidePanel = () => {
  const dispatch = useDispatch();
  const request = axios.CancelToken.source();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(2);
  const [childLoading, setChildLoading] = useState({});

  const [singleHistoryChild, setSingleHistoryChild] = useState({});
  const [searchLoader, setSearchLoader] = useState(false);
  const [historyListItems, setHistoryListItems] = useState([]);
  const [hasSearchInit, setHasSearchInit] = useState(false);

  const bottomDivRef = useRef(null);
  const initiateSearch = useRef();

  const history = useHistory();
  const {
    historyData,
    allHistoryData,
    panelOpen,
    pagination,
    historySearching,
    historyFetchStatus,
  } = useSelector(
    (state) => ({
      historyData: state.showHistory.history,
      allHistoryData: state.showHistory.allHistory,
      panelOpen: state.showHistory.panelOpen,
      pagination: state.showHistory.pagination,
      historySearching: state.showHistory.historySearching,
      historyFetchStatus: state.showHistory.historyFetchStatus,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (searchQuery || hasSearchInit) {
      setHasSearchInit(true);
      searchSowHistory();
    }
    return () => request.cancel("Request cancelled");
  }, [searchQuery]);

  const searchSowHistory = () => {
    setPage(2);
    clearTimeout(initiateSearch.current);
    initiateSearch.current = setTimeout(() => {
      searchQuery
        ? dispatch(
            actionSowHistorySidePanelSearch(searchQuery, 1, 100, request)
          )
        : dispatch(actionSowHistorySidePanelSearch());
    }, 300);
  };

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(actionSowHistorySidePanelClose());
  };

  /* get single history child data */
  const getSingleHistoryChilds = async (id) => {
    setChildLoading((prev) => ({ ...prev, [id]: true }));
    // const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetGeneratedSOWVersions";
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetGeneratedSOWVersionsV2";

    // const res = await axios.get(URL, {
    //   params: { sowGeneratedId: id },
    // });
    const res = await axios.get(URL, {
      params: { sowGeneratedId: id, createdBy: Cookies.get("name") },
    });
    if (res?.data) {
      /* get formatted name */
      const newHistory = res.data.map((e) => {
        let newName = e.templateOutputName.replace(".docx", "");
        const sp = newName.split("_");
        sp[1] = sp[1].startsWith("Adv") ? "A&PS" : sp[1];

        newName = sp.join("_");
        return { ...e, newName };
      });
      /* set history child's data */
      setSingleHistoryChild((prev) => {
        return { ...prev, [id]: newHistory };
      });
      setChildLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleChildHistoryClick = (type, id) => {
    dispatch(actionCloneSafeResetData());
    dispatch(actionSowHistorySidePanelClose());
    dispatch(actionLogDataReset());
    dispatch(actionCustomerDataReset());
    dispatch(actionMasterDropDownDataReset());
    dispatch(actionE3TRegionalDataReset());
    dispatch(actionSolutionHubDropDownReset());
    dispatch(actionResetDynamicFields());
    dispatch(actionGeneratePreviewReset());
    dispatch(actionResetDraft());
    dispatch(actionDraftGetAllDrafts());
    history.replace(`/sow/${type === 0 ? "view" : "clone"}/${id}`);
  };

  // 0- view, 1 edit, 2 clone
  const handleHistoryLinkClick = (id, type = 0) => {
    if (type === 4) {
      dispatch(actionSharingModalSelectedId(id));
      dispatch(actionSharingModalToggle());
    } else if (type === 3) {
      getSingleHistoryChilds(id);
    } else {
      dispatch(actionCloneSafeResetData());
      dispatch(actionSowHistorySidePanelClose());
      dispatch(actionLogDataReset());
      dispatch(actionCustomerDataReset());
      dispatch(actionMasterDropDownDataReset());
      dispatch(actionE3TRegionalDataReset());
      dispatch(actionSolutionHubDropDownReset());
      dispatch(actionResetDynamicFields());
      dispatch(actionGeneratePreviewReset());
      dispatch(actionResetDraft());
      dispatch(actionDraftGetAllDrafts());
      history.push(
        `/sow/${type === 1 ? "edit" : type === 2 ? "clone" : "view"}`,
        {
          id,
        }
      );
    }
  };
  const fetchMore = () => {
    dispatch(actionSowHistorySidePanelSearch(searchQuery, page));
    setPage((page) => page + 1);
  };

  useInfiniteScroll(bottomDivRef, fetchMore);

  const renderHistoryRows = () => {
    if (historyFetchStatus === APIFetchStatus.FETCHING) {
      return <HistoryLoader />;
    } else {
      return (
        <div
          style={{ margin: "60px 0px 30px 0px" }}
          className={
            historySearching === APIFetchStatus.FETCHING && searchLoader
              ? "search-in-progress"
              : ""
          }
        >
          <ChildProvider
            value={{
              data: singleHistoryChild,
              loader: childLoading,
            }}
          >
            {historySearching === APIFetchStatus.FETCHING && searchLoader && (
              <HistorySearchLoader />
            )}
            {historyData
              // .filter(historyItem => historyItem.newName.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((h, index) => (
                <HistoryRow
                  key={`history_${h.id}_${index}`}
                  listItem={h}
                  onClick={handleHistoryLinkClick}
                  onChildClick={handleChildHistoryClick}
                  loader={childLoading}
                />
              ))}
            {pagination.HasNext &&
              historySearching !== APIFetchStatus.FETCHING && (
                <div id="lastComponent" ref={bottomDivRef} />
              )}
            {historySearching === APIFetchStatus.FETCHING && !searchLoader && (
              <HistoryLoader />
            )}
          </ChildProvider>
        </div>
      );
    }
  };

  return (
    <>
      {panelOpen && (
        <div className="slider_click" id="sowslide">
          <button
            onClick={handleClose}
            className="close close_button_modules_popup"
            aria-label="Close"
          >
            <span>&times;</span>
          </button>
          <div id="sliderow">
            <div className="col-12 mt-3">
              <h5 className="slider_header">SOW History</h5>
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
            {renderHistoryRows()}
          </div>
        </div>
      )}
    </>
  );
};

export default HistorySidePanel;
