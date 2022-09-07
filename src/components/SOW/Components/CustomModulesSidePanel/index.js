import { groupBy } from "lodash";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector, useDispatch, shallowEqual, batch } from "react-redux";
import { useLocation } from "react-router-dom";

import ModulesSearchComponent from "../../ModuleSelection/ModulesSearchComponent";
import ShowLoading from "../../ModuleSelection/ShowLoading";
import { parseInteger } from "../../PricingTab/PricingFormFields";
import {
  actionCustomModuleChangeName,
  actionCustomModuleSidePanelClose,
  actionCustomModuleSidePanelOpen,
  actionCustomModuleSidePanelReset,
  actionCustomModuleSidePanelTypeOfWorkAdd,
  actionCustomModuleSidePanelTypeOfWorkRemove,
  actionCustomModuleSidePanelWorkPackageAdd,
  actionCustomModuleSidePanelWorkPackageRemove,
  actionCustomModuleWPChangeName,
  actionCustomWorkPackageClearSubmitData,
  actionSubmitCustomModules,
} from "../../Redux/Actions/CustomModulesSidePanel";
import {
  actionDynamicDataFieldsApplyWorkPackages,
  actionDynamicDataFieldsCustomWorkPackageAdd,
} from "../../Redux/Actions/DynamicDataFields";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { ModeContext } from "../ModeProvider";
import WorkPackageModal from "../WorkPackageModal";
import WorkPackageNameEditModal from "../WorkPackageNameEditModal";
import CloneMainModule from "./CloningModals/CloneMainModule";
import CustomSubModules from "./CustomSubModules";
import CustomTypeOfWorkList from "./CustomTypeOfWorkList";

const CustomModulesSidePanel = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  const [modalType, setModalType] = useState(0);
  const [showMainCloneModal, setShowMainCloneModal] = useState(false);

  const [editModalShow, setEditModalShow] = useState(false);

  const { isView } = useContext(ModeContext);

  const [tow, setTow] = useState(0);
  const [wp, setWp] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isClone, setIsClone] = useState(false);

  const [isEditWorkPackage, setIsEditWorkPackage] = useState(false);

  const [selectedDomain, setSelectedDomain] = useState(
    customModulesDomain ?? ""
  );

  const location = useLocation();
  const {
    customDropDownLoaded,
    dd,
    customDropDown,
    showCustomModal,
    selectedTypeOfWork,
    selectedWorkPackages,
    workPackageSectionData,
    templateId,
    customModulesSubmitData,
    customModulesDataFetchState,
    customModulesFetchState,
    originalDropDown,
    customModulesNameChangedState,
    practiceDomainDropDownData,
    customModulesDomain,
    customMainModuleCloneDataFetchState,
    customMainModuleCloneData,
    customModulesCloneSubmitFetchState,
    isCustomModuleReset,
  } = useSelector(
    (state) => ({
      customDropDownLoaded:
        state.customModuleSidePanel.customDropDownFetchState,
      dd: state.customModuleSidePanel.customDropdown,
      customDropDown: state.customModuleSidePanel.customDropdown
        .map((e) => ({
          ...e,
          workPackages: e.sowCustomModulesWorkPackages.map((wp) => ({
            id: wp.id,
            name: wp.workPackage,
          })),
        }))
        .filter((e) =>
          search === "" ||
          e.typeOfWork.trim().toLowerCase().indexOf(search.toLowerCase()) > -1
            ? true
            : false
        ),
      originalDropDown: state.customModuleSidePanel.customDropdown,
      showCustomModal: state.customModuleSidePanel.showCustomModal,
      selectedTypeOfWork: state.customModuleSidePanel.selectedTypeOfWork,
      selectedWorkPackages: state.customModuleSidePanel.selectedWorkPackages,
      workPackageSectionData: state.masterDropDown.workPackageSectionData,
      templateId: state.masterData.sowTemplate,
      customModulesSubmitData:
        state.customModuleSidePanel.customModulesSubmitData,

      customModulesDataFetchState:
        state.customModuleSidePanel.customModulesDataFetchState,
      customModulesNameChangedState:
        state.customModuleSidePanel.customModulesNameChangedState,
      customModulesFetchState: state.dynamicData.customModulesFetchState,
      isAdmin: state.showHistory?.isAdmin,

      practiceDomainDropDownData:
        state.masterDropDown.practiceDomainDropDownData,
      customModulesDomain: state.customModuleSidePanel.customModulesDomain,
      customMainModuleCloneDataFetchState:
        state.customModuleSidePanel.customMainModuleCloneDataFetchState,
      customMainModuleCloneData:
        state.customModuleSidePanel.customMainModuleCloneData,
      customModulesCloneSubmitFetchState:
        state.customModuleSidePanel.customModulesCloneSubmitFetchState,
      isCustomModuleReset: state.customModuleSidePanel.isCustomModuleReset,
    }),
    shallowEqual
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(actionSubmitCustomModules(templateId, selectedWorkPackages, true));
    // dispatch(actionCustomModuleSidePanelClose());
  };

  useEffect(() => {
    setSelectedDomain(customModulesDomain ?? "");
  }, [customModulesDomain]);

  useEffect(() => {
    if (customModulesDataFetchState === APIFetchStatus.FETCHED) {
      dispatch(actionCustomModuleSidePanelClose());
    }
  }, [customModulesDataFetchState]);

  useEffect(() => {
    if (location.pathname.indexOf("dynamic-data") === -1 && showCustomModal) {
      dispatch(actionCustomModuleSidePanelClose());
    }
    if (
      customModulesDataFetchState === APIFetchStatus.FETCHED &&
      customModulesSubmitData?.length &&
      selectedTypeOfWork.length === 0 &&
      !isCustomModuleReset
    ) {
      Object.keys(groupBy(customModulesSubmitData, "typeOfWorkId")).forEach(
        (cm) => {
          const tow = customDropDown.find((e) => e.id === parseInteger(cm));
          const workPackages = tow.workPackages.map((e) => e.id);
          dispatch(
            actionCustomModuleSidePanelTypeOfWorkAdd(
              parseInteger(cm),
              workPackages
            )
          );
        }
      );
    }
  }, [location.pathname, showCustomModal]);

  const handleReset = (e) => {
    e.preventDefault();
    dispatch(actionCustomModuleSidePanelReset());
    setSelected([]);
    // dispatch(actionCustomModuleSidePanelClose());
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    dispatch(actionCustomModuleSidePanelClose());
  };

  const handleWorkPackageSelect = (id) => {
    if (selectedWorkPackages.indexOf(id) > -1) {
      dispatch(actionCustomModuleSidePanelWorkPackageRemove(id));
    } else {
      dispatch(actionCustomModuleSidePanelWorkPackageAdd(id));
    }
  };

  const handleSelectTypeOfWork = (id) => {
    const tow = customDropDown.find((e) => e.id === id);
    const workPackages = tow.workPackages.map((e) => e.id);
    // console.log({ workPackages });
    if (selectedTypeOfWork.indexOf(id) > -1) {
      dispatch(actionCustomModuleSidePanelTypeOfWorkRemove(id, workPackages));
      setSelected((state) => state.filter((e) => e.id !== id));
    } else {
      dispatch(actionCustomModuleSidePanelTypeOfWorkAdd(id, workPackages));
      setSelected((state) => [...state, tow]);
    }
  };

  useEffect(() => {
    setName("");
    setTow(0);
    setWp(0);
    setIsEdit(false);
    setIsEditWorkPackage(false);
    setId(0);
    setEditModalShow(false);
    setSelectedDomain("");
  }, []);

  useEffect(() => {
    if (
      (customModulesNameChangedState === APIFetchStatus.FETCHED ||
        customModulesNameChangedState === APIFetchStatus.FAILED) &&
      editModalShow === true
    ) {
      setEditModalShow(false);
      dispatch(actionCustomModuleSidePanelOpen());
    }
  }, [customModulesNameChangedState]);

  useEffect(() => {
    if (dd && dd.length > 0) {
      // console.log({ dd });
      setSelected(() => {
        const ret = dd
          .filter((e) => selectedTypeOfWork.indexOf(e.id) > -1)
          .map((e) => ({
            id: e.id,
            typeOfWork: e.typeOfWork,
            workPackages: e.sowCustomModulesWorkPackages.map((wp) => ({
              id: wp.id,
              name: wp.workPackage,
            })),
          }));
        return ret;
      });
    }
  }, [dd, selectedTypeOfWork, selectedWorkPackages]);

  if (showCustomModal && customDropDownLoaded !== APIFetchStatus.FETCHED) {
    return <ShowLoading />;
  }

  const handleCreateModal = (e) => {
    e.preventDefault();
    dispatch(actionCustomWorkPackageClearSubmitData());
    setIsEdit(false);
    setIsEditWorkPackage(false);
    setShow(true);
    setSelectedDomain("");
    dispatch(actionCustomModuleSidePanelClose());
  };
  return (
    <>
      {showCustomModal && (
        <div className="module_slider_click" id="sowslide">
          <button
            onClick={handleClose}
            className="close close_button_modules_popup"
            aria-label="Close"
          >
            <span>&times;</span>
          </button>
          <div id="slidersow">
            <div className="col-12 mt-3">
              <button
                onClick={handleCreateModal}
                disabled={isView}
                className="createModuleBtn btn btn-success hpe-green-background"
              >
                Create
              </button>

              <h5 className="slider_header">Select from Custom Modules</h5>
            </div>
          </div>
          <div className="module_selection_grid px-1">
            <div className="grid_modules p-2">
              <ModulesSearchComponent
                searchQuery={search}
                setSearchQuery={setSearch}
              />
              <CustomTypeOfWorkList
                isView={isView}
                customDropDown={customDropDown}
                selectedTypeOfWork={selectedTypeOfWork}
                setSelectedTypeOfWork={handleSelectTypeOfWork}
              />
            </div>
            <div className="grid_selection border-left p-2">
              <CustomSubModules
                setShowMainCloneModal={setShowMainCloneModal}
                templateId={templateId}
                setShow={setShow}
                setName={setName}
                setWp={setWp}
                setIsEdit={setIsEdit}
                setIsClone={setIsClone}
                originalDropDown={originalDropDown}
                setTow={setTow}
                setIsEditWorkPackage={setIsEditWorkPackage}
                setId={setId}
                isView={isView}
                setModalType={setModalType}
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
                  {customModulesDataFetchState === 1 ? (
                    <Spinner size="sm" animation="border" role="status">
                      <span className="sr-only">Submitting...</span>
                    </Spinner>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  disabled={isView || customModulesDataFetchState === 1}
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
      <WorkPackageModal
        workPackageSectionData={workPackageSectionData}
        customModulesSubmitData={customModulesSubmitData}
        customModulesDataFetchState={customModulesDataFetchState}
        customDropDown={customDropDown}
        practiceDomainDropDownData={practiceDomainDropDownData}
        customModulesDomain={customModulesDomain}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        templateId={templateId}
        tow={tow}
        isEdit={isEdit}
        isClone={isClone}
        setIsClone={setIsClone}
        isEditWorkPackage={isEditWorkPackage}
        setIsEditWorkPackage={isEditWorkPackage}
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
        savingClone={customModulesCloneSubmitFetchState}
        name={"Work Package"}
      />

      <WorkPackageNameEditModal
        show={editModalShow}
        name={name}
        id={id}
        showLoading={
          customModulesNameChangedState === APIFetchStatus.FETCHING
            ? true
            : false
        }
        setName={setName}
        submitChange={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          dispatch(actionCustomModuleChangeName(name, id));
        }}
        handleClose={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setEditModalShow(false);
          dispatch(actionCustomModuleSidePanelOpen());
        }}
      />

      <CloneMainModule
        practiceDomainDropDownData={practiceDomainDropDownData}
        customDropDown={customDropDown}
        templateId={templateId}
        customMainModuleCloneData={customMainModuleCloneData}
        customMainModuleCloneDataFetchState={
          customMainModuleCloneDataFetchState
        }
        show={showMainCloneModal}
        setShow={setShowMainCloneModal}
        savingClone={customModulesCloneSubmitFetchState}
      />
    </>
  );
};

export default CustomModulesSidePanel;
