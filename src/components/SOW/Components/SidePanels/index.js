import { useLocation } from "react-router-dom";
import PredefinedModulesSidePanel from "../PredefinedModulesSidePanel";
import SidePopper from "../SidePoper";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  actionModuleSidePanelClose,
  actionModuleSidePanelToggle,
} from "../../Redux/Actions/ModulesSidePanel";
import {
  actionSowHistorySidePanelClose,
  actionSowHistorySidePanelToggle,
} from "../../Redux/Actions/SOWHistory";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import HistorySidePanel from "../HistorySidePanel";
import CustomModulesSidePanel from "../CustomModulesSidePanel";
import {
  actionCustomModuleSidePanelClose,
  actionCustomModuleSidePanelToggle,
} from "../../Redux/Actions/CustomModulesSidePanel";
import SharedModuleSidePanel from "../SharedModuleSidePanel";
import {
  actionSharingSidePanelClose,
  actionSharingSidePanelToggle,
} from "../../Redux/Actions/SharingModal";
import {
  actionSolutionHubSidePanelClose,
  actionSolutionHubSidePanelToggle,
} from "../../Redux/Actions/SolutionHubSidePanelData";
import SolutionHubSidePanel from "../SolutionHubSidePanel";
import { useMemo } from "react";
import { actionDraftSidePanelClose, actionSidePanelToggle } from "../../Redux/Actions/Draft";
import DraftSidePanel from "../DraftSidePanel";

const SidePanels = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    showHistoryPopper,
    historyPanelOpen,
    modulesPanelOpen,
    sharingDataPopper,
    isSolutionHubTeam,
    sowUserDetailsFetchState,
    isAdmin,
    wpSectionDataLoad,
    customModulesDataFetchState,
    costingEstimationFetchState,
    showModules,
    e3tTshirtSizesV2FetchState,
  } = useSelector(
    (state) => ({
      showHistoryPopper:
        state.showHistory.historyFetchStatus === APIFetchStatus.FETCHED
          ? true
          : false,
      historyPanelOpen: state.showHistory.panelOpen,
      modulesPanelOpen: state.moduleSidePanel.showModal,
      sharingDataPopper:
        state.sharingModal.sharingSidePanelDataFetchState ===
        APIFetchStatus.FETCHED
          ? true
          : false,
      isSolutionHubTeam: state.showHistory?.sowUserDetails?.isSolutionHubTeam,
      sowUserDetailsFetchState: state.showHistory.sowUserDetailsFetchState,
      isAdmin: state.showHistory?.isAdmin,
      wpSectionDataLoad: state.dynamicData?.wpSectionDataLoad,
      customModulesDataFetchState:
        state.customModuleSidePanel?.customModulesDataFetchState,
      costingEstimationFetchState:
        state.e3tData.e3tCostingEstimationV2FetchState,
      showModules:
        state.masterDropDown.workPackageSectionData.length > 0 ? true : false,
      e3tTshirtSizesV2FetchState: state.e3tData.e3tTshirtSizesV2FetchState,
    }),
    shallowEqual
  );

  // useEffect(() => {
  //   if (historyPanelOpen) {
  //     dispatch(actionModuleSidePanelClose());
  //   } else if (modulesPanelOpen) {
  //     dispatch(actionSowHistorySidePanelClose());
  //   }
  // }, [historyPanelOpen, modulesPanelOpen]);

  return (
    <>
      <div
        className={
          wpSectionDataLoad === 1 ||
          customModulesDataFetchState === 1 ||
          costingEstimationFetchState === 1 ||
          e3tTshirtSizesV2FetchState === 1
            ? "disableModal"
            : ""
        }
      >
        <div id="sowslider" className="slider_pos">
          {showModules && (
            <SidePopper
              title="Predefined Modules"
              toggle={() => {
                dispatch(actionCustomModuleSidePanelClose());
                dispatch(actionSowHistorySidePanelClose());
                dispatch(actionModuleSidePanelToggle());
                dispatch(actionSharingSidePanelClose());
                dispatch(actionDraftSidePanelClose());
                dispatch(actionSolutionHubSidePanelClose());
              }}
              show={
                location.pathname.indexOf("dynamic-data") > -1 ? true : false
              }
              pos="left"
            />
          )}

          <SidePopper
            title="SOW History"
            toggle={() => {
              dispatch(actionModuleSidePanelClose());
              dispatch(actionCustomModuleSidePanelClose());
              dispatch(actionSowHistorySidePanelToggle());
              dispatch(actionSharingSidePanelClose());
              dispatch(actionDraftSidePanelClose());
              dispatch(actionSolutionHubSidePanelClose());
            }}
            show={showHistoryPopper}
            pos="left"
          />

          {isSolutionHubTeam && (
            <SidePopper
              title="SA History"
              toggle={() => {
                dispatch(actionModuleSidePanelClose());
                dispatch(actionCustomModuleSidePanelClose());
                dispatch(actionSowHistorySidePanelClose());
                dispatch(actionSolutionHubSidePanelToggle());
                dispatch(actionDraftSidePanelClose());
                dispatch(actionSharingSidePanelClose());
              }}
              show={showHistoryPopper}
              pos="left"
            />
          )}

          {showModules && (
            <SidePopper
              title="Custom Modules"
              toggle={() => {
                dispatch(actionSowHistorySidePanelClose());
                dispatch(actionModuleSidePanelClose());
                dispatch(actionCustomModuleSidePanelToggle());
                dispatch(actionSharingSidePanelClose());
                dispatch(actionDraftSidePanelClose());
                dispatch(actionSolutionHubSidePanelClose());
              }}
              show={
                location.pathname.indexOf("dynamic-data") > -1
                // && sowUserDetailsFetchState === APIFetchStatus.FETCHED
                // && isAdmin
              }
              pos="left"
            />
          )}
        </div>
        <div className="slider_pos_right">
          <SidePopper
            title="Shared SOWs"
            toggle={() => {
              dispatch(actionModuleSidePanelClose());
              dispatch(actionSowHistorySidePanelClose());
              dispatch(actionSharingSidePanelToggle());
              dispatch(actionDraftSidePanelClose());
              dispatch(actionCustomModuleSidePanelClose());
              dispatch(actionSolutionHubSidePanelClose());
            }}
            show={sharingDataPopper}
            pos="right"
          />
          <SidePopper
            title="Drafts"
            toggle={() => {
              dispatch(actionModuleSidePanelClose());
              dispatch(actionSowHistorySidePanelClose());
              dispatch(actionSharingSidePanelClose());
              dispatch(actionCustomModuleSidePanelClose());
              dispatch(actionSolutionHubSidePanelClose());
              dispatch(actionSidePanelToggle());
            }}
            show={sharingDataPopper}
            pos="right"
          />
        </div>
        <PredefinedModulesSidePanel />
        <HistorySidePanel />
        <SolutionHubSidePanel />
        <CustomModulesSidePanel />
        <SharedModuleSidePanel />
        <DraftSidePanel />
      </div>
    </>
  );
};

export default SidePanels;
