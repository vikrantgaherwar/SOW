import { groupBy } from "lodash";
import { useContext, useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";

import ModulesSearchComponent from "../../ModuleSelection/ModulesSearchComponent";
import ShowLoading from "../../ModuleSelection/ShowLoading";
import { parseInteger } from "../../PricingTab/PricingFormFields";
import { actionDynamicDataFieldsApplyWorkPackages } from "../../Redux/Actions/DynamicDataFields";
import {
  actionModuleSidePanelClose,
  actionModuleSidePanelReset,
  actionModuleSidePanelTypeOfWorkAdd,
  actionModuleSidePanelTypeOfWorkRemove,
  actionModuleSidePanelWorkPackageAdd,
  actionModuleSidePanelWorkPackageRemove,
} from "../../Redux/Actions/ModulesSidePanel";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { ModeContext } from "../ModeProvider";
import ClonePredefinedModuleDialogue from "./ClonePredefinedModuleDialogue";
import CloneTypeOfWorkDialogue from "./CloneTypeOfWorkDialogue";
import SubModules from "./SubModules";
import TypeOfWorkList from "./TypeOfWorkList";

const PredefinedModulesSidePanel = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const { isView, isEdit, isClone } = useContext(ModeContext);
  const [show, setShow] = useState(false);
  const [showTowModal, setShowTowModal] = useState(false);

  const [id, setId] = useState(0);
  const [modalType, setModalType] = useState(0);

  const [editModalShow, setEditModalShow] = useState(false);

  const [tow, setTow] = useState(0);
  const [wp, setWp] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const location = useLocation();
  const {
    solutionHubDropDownLoaded,
    dd,
    solutionHubDropDown,
    showModal,
    selectedTypeOfWork,
    selectedWorkPackages,
    towDisabled,
    wpSectionDataLoad,
    costingEstimationFetchState,

    customDropDown,
    workPackageSectionData,
    templateId,
    customModulesSubmitData,
    customModulesDataFetchState,
    customModulesFetchState,
    customModulesNameChangedState,
    cloneSelectedTypeOfWork,
    cloneSelectedWorkPackage,
    solutionHubCloneData,
    solutionHubCloneDataFetchState,
    typeOfWorkCloningData,
    typeOfWorkCloningDataFetchState,
    savingClone,
    practiceDomainDropDownData,
    customModulesDomain,
    costingEstimation,
    e3tTshirtSizesV2FetchState,
    predefinedLogData,
  } = useSelector(
    (state) => ({
      solutionHubDropDownLoaded: state.solutionHubDropDown.dropDownFetchState,
      dd: state.solutionHubDropDown.dropDown,
      solutionHubDropDown: state.solutionHubDropDown.dropDown
        .map((e) => ({
          typeGrouping: e.typeGrouping,
          id: e.id,
          typeOfWork: e.typeOfWork,
          workPackages: e.sowSolutionHubWorkPackages.map((wp) => ({
            id: wp.id,
            name: wp.workPackage,
            displayOrder: wp.displayOrder,
          })),
        }))
        .filter((e) =>
          search === "" ||
          e.typeOfWork.trim().toLowerCase().indexOf(search.toLowerCase()) > -1
            ? true
            : false
        )
        .sort((a, b) => a.typeOfWork.localeCompare(b.typeOfWork)),
      showModal: state.moduleSidePanel.showModal,
      selectedTypeOfWork: state.moduleSidePanel.selectedTypeOfWork,
      selectedWorkPackages: state.moduleSidePanel.selectedWorkPackages,
      towDisabled: state.moduleSidePanel.towDisabled,
      wpSectionDataLoad: state.dynamicData?.wpSectionDataLoad,
      costingEstimationFetchState:
        state.e3tData.e3tCostingEstimationV2FetchState,

      customDropDown: state.customModuleSidePanel.customDropdown.map((e) => ({
        ...e,
        workPackages: e.sowCustomModulesWorkPackages.map((wp) => ({
          id: wp.id,
          name: wp.workPackage,
        })),
      })),
      workPackageSectionData: state.masterDropDown.workPackageSectionData,
      templateId: state.masterData.sowTemplate,
      customModulesSubmitData:
        state.customModuleSidePanel.customModulesSubmitData,

      customModulesDataFetchState:
        state.customModuleSidePanel.customModulesDataFetchState,
      customModulesNameChangedState:
        state.customModuleSidePanel.customModulesNameChangedState,
      customModulesFetchState: state.dynamicData.customModulesFetchState,
      cloneSelectedTypeOfWork: state.moduleSidePanel.cloneSelectedTypeOfWork,
      cloneSelectedWorkPackage: state.moduleSidePanel.cloneSelectedWorkPackage,
      solutionHubCloneData: state.moduleSidePanel.solutionHubCloneData,
      solutionHubCloneDataFetchState:
        state.moduleSidePanel.solutionHubCloneDataFetchState,
      typeOfWorkCloningData: state.moduleSidePanel.typeOfWorkCloningData,
      typeOfWorkCloningDataFetchState:
        state.moduleSidePanel.typeOfWorkCloningDataFetchState,
      savingClone: state.moduleSidePanel.towCloneSaveFetchState,
      practiceDomainDropDownData:
        state.masterDropDown.practiceDomainDropDownData,
      customModulesDomain: state.customModuleSidePanel.customModulesDomain,
      costingEstimation: state.e3tData.e3tCostingEstimationV2,
      e3tTshirtSizesV2FetchState: state.e3tData.e3tTshirtSizesV2FetchState,
      predefinedLogData:
        state.logData?.predefinedLog?.predefinedModuleSelectedValue,
    }),
    shallowEqual
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    dispatch(actionDynamicDataFieldsApplyWorkPackages(selectedWorkPackages));
    // dispatch(actionModuleSidePanelClose());
  };

  useEffect(() => {
    if (
      wpSectionDataLoad === APIFetchStatus.FETCHED &&
      costingEstimationFetchState === APIFetchStatus.FETCHED &&
      submitting
    ) {
      dispatch(actionModuleSidePanelClose());
    }
  }, [wpSectionDataLoad, costingEstimationFetchState]);

  const isFetching = useMemo(() => {
    return (
      wpSectionDataLoad === 1 ||
      costingEstimationFetchState === 1 ||
      e3tTshirtSizesV2FetchState === 1
    );
  }, [
    wpSectionDataLoad,
    costingEstimationFetchState,
    e3tTshirtSizesV2FetchState,
  ]);

  // useEffect(() => {
  //   if (solutionHubDropDown && solutionHubDropDown.length > 0) {
  //     setSelected(
  //       solutionHubDropDown.filter((e) => selectedTypeOfWork.indexOf(e.id) > -1)
  //     );
  //   }
  // }, [solutionHubDropDown]);

  useEffect(() => {
    if (location.pathname.indexOf("dynamic-data") === -1 && showModal) {
      dispatch(actionModuleSidePanelClose());
    }
  }, [location.pathname, showModal]);

  useEffect(() => {
    if (
      costingEstimationFetchState === APIFetchStatus.FETCHED &&
      costingEstimation.length &&
      selectedTypeOfWork.length === 0 &&
      isReset
    ) {
      Object.keys(groupBy(costingEstimation, "typeOfWorkId")).forEach((m) => {
        const tow = solutionHubDropDown.find((e) => e.id === parseInteger(m));
        const workPackages = tow.workPackages.map((e) => e.id);
        dispatch(
          actionModuleSidePanelTypeOfWorkAdd(parseInteger(m), workPackages)
        );
        setSelected((state) => [...state, tow]);
      });
    }
  }, [showModal]);

  const handleReset = (e) => {
    e.preventDefault();
    setSubmitting(false);

    const shouldReset =
      costingEstimation.length > 0 ||
      (predefinedLogData && JSON.parse(predefinedLogData)?.length) ||
      wpSectionDataLoad;

    if (shouldReset) {
      setIsReset(true);
    } else {
      setIsReset(false);
    }
    dispatch(actionModuleSidePanelReset(shouldReset));
    setSelected([]);
    // dispatch(actionModuleSidePanelClose());
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    dispatch(actionModuleSidePanelClose());
  };

  const handleWorkPackageSelect = (id) => {
    if (selectedWorkPackages.indexOf(id) > -1) {
      dispatch(actionModuleSidePanelWorkPackageRemove(id));
    } else {
      dispatch(actionModuleSidePanelWorkPackageAdd(id));
    }
  };

  const handleSelectTypeOfWork = (id) => {
    const tow = solutionHubDropDown.find((e) => e.id === id);
    const workPackages = tow.workPackages.map((e) => e.id);
    // console.log({ workPackages });
    if (selectedTypeOfWork.indexOf(id) > -1) {
      dispatch(actionModuleSidePanelTypeOfWorkRemove(id, workPackages));
      setSelected((state) => state.filter((e) => e.id !== id));
    } else {
      dispatch(actionModuleSidePanelTypeOfWorkAdd(id, workPackages));
      setSelected((state) => [...state, tow]);
    }
  };

  // const incFn = () => {
  //   setTimeout(() => {
  //     setSelected((state) => [...state, 1]);
  //     incFn();
  //   }, 1000);
  // };

  // useEffect(() => {
  //   incFn();
  // }, []);

  useEffect(() => {
    if (dd && dd.length > 0) {
      setSelected(
        dd
          .filter((e) => selectedTypeOfWork.indexOf(e.id) > -1)
          .map((e) => ({
            id: e.id,
            typeOfWork: e.typeOfWork,
            workPackages: e.sowSolutionHubWorkPackages.map((wp) => ({
              id: wp.id,
              name: wp.workPackage,
            })),
          }))
      );
    }
  }, [dd]);

  if (showModal && solutionHubDropDownLoaded !== APIFetchStatus.FETCHED) {
    return <ShowLoading />;
  }
  return (
    <>
      {showModal && (
        <div
          className="module_slider_click module_slider_click_width"
          id="sowslide"
        >
          <button
            onClick={handleClose}
            className="close close_button_modules_popup"
            aria-label="Close"
          >
            <span>&times;</span>
          </button>
          <div id="slidersow">
            <div className="col-12 mt-3">
              <h5 className="slider_header">Select from Predefined Modules</h5>
            </div>
          </div>
          <div className="module_selection_grid px-1">
            <div className="grid_modules p-2">
              <ModulesSearchComponent
                searchQuery={search}
                setSearchQuery={setSearch}
              />
              <TypeOfWorkList
                isView={isView}
                isEditable={isEdit || isClone}
                towDisabled={towDisabled}
                solutionHubDropDown={solutionHubDropDown}
                selectedTypeOfWork={selectedTypeOfWork}
                setSelectedTypeOfWork={handleSelectTypeOfWork}
              />
            </div>
            <div className="grid_selection border-left p-2">
              <SubModules
                templateId={templateId}
                setShow={setShow}
                setShowTowModal={setShowTowModal}
                selectedTypeOfWork={selectedTypeOfWork}
                isView={isView}
                selected={selected}
                workPackages={selectedWorkPackages}
                handleChange={handleWorkPackageSelect}
              />
              <div className="button-container">
                <button
                  onClick={handleSubmit}
                  disabled={isView || selectedTypeOfWork?.length === 0}
                  className="mr-1 btn btn-success hpe-green-background"
                >
                  {isFetching ? (
                    <Spinner size="sm" animation="border" role="status">
                      <span className="sr-only">Submitting...</span>
                    </Spinner>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  disabled={isView || isFetching}
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ClonePredefinedModuleDialogue
        practiceDomainDropDownData={practiceDomainDropDownData}
        customModulesDomain={customModulesDomain}
        solutionHubCloneData={solutionHubCloneData}
        solutionHubCloneDataFetchState={solutionHubCloneDataFetchState}
        cloneSelectedTypeOfWork={cloneSelectedTypeOfWork}
        cloneSelectedWorkPackage={cloneSelectedWorkPackage}
        workPackageSectionData={workPackageSectionData}
        customModulesSubmitData={customModulesSubmitData}
        customModulesDataFetchState={customModulesDataFetchState}
        customDropDown={customDropDown}
        templateId={templateId}
        tow={tow}
        // isEdit={isEdit}
        setModalType={setModalType}
        setTow={setTow}
        customModulesNameChangedState={customModulesNameChangedState}
        setWp={setWp}
        wp={wp}
        show={show}
        customModulesFetchState={customModulesFetchState}
        setEditModalShow={setEditModalShow}
        setId={setId}
        setShow={setShow}
        name={"Work Package"}
      />

      <CloneTypeOfWorkDialogue
        practiceDomainDropDownData={practiceDomainDropDownData}
        customDropDown={customDropDown}
        templateId={templateId}
        solutionHubDropDown={solutionHubDropDown}
        typeOfWorkCloningData={typeOfWorkCloningData}
        typeOfWorkCloningDataFetchState={typeOfWorkCloningDataFetchState}
        show={showTowModal}
        setShow={setShowTowModal}
        savingClone={savingClone}
      />
    </>
  );
};

export default PredefinedModulesSidePanel;
