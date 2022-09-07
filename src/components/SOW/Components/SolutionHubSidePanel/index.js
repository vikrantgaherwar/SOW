import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
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
  actionSharingModalSelectedId,
  actionSharingModalToggle,
} from "../../Redux/Actions/SharingModal";
import { actionSolutionHubDropDownReset } from "../../Redux/Actions/SolutionHubDropDown";
import {
  actionSolutionHubSidePanelClose,
  actionSolutionHubSidePanelSearch,
} from "../../Redux/Actions/SolutionHubSidePanelData";
import { actionSowHistorySidePanelClose } from "../../Redux/Actions/SOWHistory";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import URLConfig from "../../URLConfig";
import PanelWrapper from "../SidePanels/PanelWrapper";
import RowRenderer from "./RowRenderer";
import { useInfiniteScroll } from "../HistorySidePanel/InfiniteScroll";

const SolutionHubSidePanel = () => {
  const dispatch = useDispatch();
  const request = axios.CancelToken.source();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(2);
  const [childLoading, setChildLoading] = useState({});

  const [singleChild, setSingleChild] = useState({});
  const [hasSearchInit, setHasSearchInit] = useState(false);

  const bottomDivRef = useRef(null);
  const initiateSearch = useRef();

  const history = useHistory();
  const { panelData, panelOpen, pagination, searching, panelDataFetchStatus } =
    useSelector(
      (state) => ({
        panelData: state.solutionHubSidePanelData.panelData,
        panelOpen: state.solutionHubSidePanelData.panelOpen,
        pagination: state.solutionHubSidePanelData.pagination,
        searching: state.solutionHubSidePanelData.panelDataSearching,
        panelDataFetchStatus:
          state.solutionHubSidePanelData.panelDataFetchStatus,
      }),
      shallowEqual
    );

  useEffect(() => {
    if (searchQuery || hasSearchInit) {
      setHasSearchInit(true);
      search();
    }
    return () => request.cancel("Request cancelled");
  }, [searchQuery]);

  const search = () => {
    setPage(2);
    clearTimeout(initiateSearch.current);
    initiateSearch.current = setTimeout(() => {
      searchQuery
        ? dispatch(
            actionSolutionHubSidePanelSearch(searchQuery, 1, 100, request)
          )
        : dispatch(actionSolutionHubSidePanelSearch());
    }, 300);
  };

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(actionSolutionHubSidePanelClose());
  };

  /* get single history child data */
  const getSingleChild = async (id) => {
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
      setSingleChild((prev) => {
        return { ...prev, [id]: newHistory };
      });
      setChildLoading((prev) => ({ ...prev, [id]: false }));
    }
  };
  // 0- view, 1 edit, 2 clone
  const handleLinkClick = (id, type = 0) => {
    if (type === 4) {
      dispatch(actionSharingModalSelectedId(id));
      dispatch(actionSharingModalToggle());
    } else if (type === 3) {
      getSingleChild(id);
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
      dispatch(actionSolutionHubSidePanelClose());

      history.push(
        `/sow/${type === 1 ? "edit" : type === 2 ? "clone" : "view"}`,
        {
          id,
        }
      );
    }
  };

  const handleChildClick = (type, id) => {
    dispatch(actionCloneSafeResetData());
    dispatch(actionSowHistorySidePanelClose());
    dispatch(actionLogDataReset());
    dispatch(actionCustomerDataReset());
    dispatch(actionMasterDropDownDataReset());
    dispatch(actionE3TRegionalDataReset());
    dispatch(actionSolutionHubDropDownReset());
    dispatch(actionResetDynamicFields());
    dispatch(actionGeneratePreviewReset());
    dispatch(actionSolutionHubSidePanelClose());

    history.replace(`/sow/${type === 0 ? "view" : "clone"}/${id}`);
  };

  const fetchMore = () => {
    dispatch(actionSolutionHubSidePanelSearch(searchQuery, page));
    setPage((page) => page + 1);
  };

  useInfiniteScroll(bottomDivRef, fetchMore);

  const searchComponent = (
    <ModulesSearchComponent
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="Search"
      aria-describedby="Search"
      className="form-history-control"
    />
  );

  return (
    <PanelWrapper
      panelOpen={panelOpen}
      panelTitle={"Solution Hub Team History"}
      onClick={handleClose}
      searchComponent={searchComponent}
    >
      <RowRenderer
        panelData={panelData}
        panelOpen={panelOpen}
        pagination={pagination}
        searching={searching}
        fetchStatus={panelDataFetchStatus}
        bottomDivRef={bottomDivRef}
        handleLinkClick={handleLinkClick}
        handleChildClick={handleChildClick}
        childLoading={childLoading}
        singleChild={singleChild}
        APIFetchStatus={APIFetchStatus}
      />
    </PanelWrapper>
  );
};
export default SolutionHubSidePanel;
