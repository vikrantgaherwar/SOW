import Cookies from "js-cookie";
import { Modal, Button, Row, Spinner, Form, Col } from "react-bootstrap";
import { useEffect, useMemo, useRef, useState } from "react";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import { useDispatch } from "react-redux";
import {
  actionDynamicDataFieldsWorkPackageAdd,
  actionDynamicDataFieldsWorkPackageUpdate,
  actionDynamicDataSaveUpdateCustomModule,
} from "../../Redux/Actions/DynamicDataFields";
import { actionE3TResourceTableWPAdd } from "../../Redux/Actions/E3T";
import TextAreaFormField from "../TextAreaFormField";
import { actionSectionDataValueChanged } from "../../Redux/Actions/MasterDropDown";
import {
  actionCustomModuleSidePanelOpen,
  actionCustomModuleWPChangeName,
  actionCustomWorkPackageClearSubmitData,
  actionCustomWorkPackageWorkPackageAdd,
  actionCustomWorkPackageWorkPackageRemove,
  actionFetchCustomModulesDropdown,
  actionSubmitCustomMainModulesData,
  actionSubmitCustomModules,
} from "../../Redux/Actions/CustomModulesSidePanel";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import {
  makeCustomWorkPackageClonePacket,
  makeCustomWorkPackagePacket,
} from "../../Redux/Actions/DynamicDataFields/customWorkPackages";
import MyRow from "../MyRow";
import WorkPackageNameEditModal from "../WorkPackageNameEditModal";

const WorkPackageModal = ({
  workPackageSectionData,
  show,
  setShow,
  idx,
  name,
  customDropDown,
  setModalType,
  templateId,
  customModulesFetchState,
  wp,
  tow,
  setId,
  isEdit,
  isClone,
  isEditWorkPackage,
  setEditModalShow,
  setTow,
  setWp,
  customModulesDataFetchState,
  customModulesSubmitData,
  customModulesNameChangedState,
  practiceDomainDropDownData,
  customModulesDomain,
  selectedDomain,
  setSelectedDomain,
  setIsClone,
  savingClone,
}) => {
  const emptyValue = { value: "", label: "", id: "" };
  const [typeOfWork, setTypeOfWork] = useState(emptyValue);
  const [workPackage, setWorkPackage] = useState(emptyValue);
  const [workPackageList, setWorkPackageList] = useState([]);

  const [domain, setDomain] = useState("");
  const [domainData, setDomainData] = useState({});
  const [domainList, setDomainList] = useState([]);

  const [editedTypeOfWork, setEditedTypeOfWork] = useState("");
  const [editedTypeOfWorkError, setEditedTypeOfWorkError] = useState(false);

  // const [editedTypeOfWork, setEditedTypeOfWork] = useState("");
  const [editedWorkPackageError, setEditedWorkPackageError] = useState(false);
  const [editedWorkPackageErrorMessage, setEditedWorkPackageErrorMessage] =
    useState("");

  const [editedTypeOfWorkErrorMessage, setEditedTypeOfWorkErrorMessage] =
    useState(false);
  const [editedWorkPackage, setEditedWorkPackage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isPublished, setIsPublished] = useState(false);

  const [showError, setShowError] = useState(false);

  const [edit, setEdit] = useState(false);

  const [editToW, setEditToW] = useState(false);
  const [editWP, setEditWP] = useState(false);
  // const [editWP, setEditWP] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [wpName, setWpName] = useState("");
  const [wpId, setWpId] = useState(0);

  const [state, setState] = useState(
    customModulesDataFetchState === APIFetchStatus.FETCHED
      ? customModulesSubmitData.map((e) => ({
          ...e,
          value: e.fieldHtmlDefaultValue ?? e.fieldDefaultValue,
          fieldDefaultValue: e.fieldDefaultValue,
          fieldHtmlDefaultValue: e.fieldHtmlDefaultValue,
          typeOfWorkId: e.typeOfWorkId,
          workPackageId: e.workPackageId,
          id: e.id,
        }))
      : workPackageSectionData.length > 0
      ? workPackageSectionData.map((e) => ({
          ...e,
          value: "<p><br/></p>",
          workPackageId: 0,
          typeOfWorkId: 0,
          id: 0,
        }))
      : []
  );

  const typeOfWorkList = useMemo(() => {
    return customDropDown
      .filter((e) => e.createdBy === Cookies.get("name"))
      .map((tow) => ({
        value: tow.typeOfWork,
        label: tow.typeOfWork,
        id: tow.id,
      }));
  }, [customDropDown]);

  useEffect(() => {
    setDomain(selectedDomain);
  }, [selectedDomain]);

  useEffect(() => {
    if (practiceDomainDropDownData && practiceDomainDropDownData.length) {
      setDomainList(
        practiceDomainDropDownData.map((el) => ({
          id: el.domain,
          name: el.domain,
        }))
      );
    }
  }, [practiceDomainDropDownData]);

  useEffect(() => {
    if (domain) {
      let practice = practiceDomainDropDownData.find(
        (e) => e.domain === domain
      ).practice;
      setDomainData({ practice, domain });
    }
  }, [domain]);

  useEffect(() => {
    if (typeOfWorkList.length > 0) {
      if (tow !== 0 && typeOfWork.id !== tow) {
        const typeOW = typeOfWorkList.find((e) => e.id === tow);
        // console.log({ typeOW });
        setTypeOfWork(typeOW);
      }
    }
    if (workPackageList.length > 0) {
      if (wp !== 0 && workPackage.id !== wp) {
        const workP = workPackageList.find((e) => e.id === wp);
        // console.log({ workP });
        setWorkPackage(workP);
        if (workP && customModulesDataFetchState !== APIFetchStatus.FETCHING) {
          dispatch(actionSubmitCustomModules(templateId, [workP.id]));
        }
      }
    }
  }, [typeOfWorkList, tow, wp, workPackageList]);

  const workPkgList = useMemo(() => {
    if (typeOfWork?.value) {
      setWorkPackageList(
        customDropDown
          .filter((cd) => cd.typeOfWork === typeOfWork.value)
          .map((wp) =>
            wp.workPackages.map((w) => ({
              value: w.name,
              label: w.name,
              id: w.id,
            }))
          )
          .flat()
      );
    }
  }, [typeOfWork]);

  const handleClose = () => {
    setIsClone(false);
    setTypeOfWork(emptyValue);
    setWorkPackage(emptyValue);
    setWp(0);
    setTow(0);
    setEditToW(false);
    setIsPublished(false);
    setEditWP(false);
    setEditedTypeOfWorkError(false);
    setEditedTypeOfWorkErrorMessage("");
    setEditedWorkPackageError("");
    setEditedWorkPackageErrorMessage("");
    setEditedTypeOfWork("");
    setShowError(false);
    setEditedWorkPackage("");
    setWorkPackageList([]);
    setDomain("");
    setSelectedDomain("");
    console.log("closing resetting");
    setState(
      workPackageSectionData.length > 0
        ? workPackageSectionData.map((e) => ({
            ...e,
            value: "<p><br/></p>",
            workPackageId: 0,
            typeOfWorkId: 0,
            id: 0,
          }))
        : []
    );
    dispatch(actionCustomWorkPackageClearSubmitData());
    setShow(false);
    dispatch(actionCustomModuleSidePanelOpen());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let packet;
    if (isClone) {
      packet = makeCustomWorkPackageClonePacket(
        editedTypeOfWork,
        editedWorkPackage,
        domainData,
        state,
        typeOfWork.id,
        workPackage.id
      );
    } else {
      packet = makeCustomWorkPackagePacket(
        editedTypeOfWork,
        editedWorkPackage,
        domainData,
        state,
        typeOfWork.id === undefined || typeOfWork.id === "" ? 0 : typeOfWork.id,
        workPackage.id === undefined || workPackage.id === ""
          ? 0
          : workPackage.id
      );
    }

    const totalWorkpkgsOfTow = customDropDown.find(
      (e) => e.id === typeOfWork.id
    )?.sowCustomModulesWorkPackages;

    packet.sowCustomModulesWorkPackage.displayOrder = isEditWorkPackage
      ? totalWorkpkgsOfTow.find((f) => f.id === workPackage.id)?.displayOrder
      : totalWorkpkgsOfTow?.length ?? 1;

    packet.sowCustomModulesWorkPackage.isPublished = isPublished;
    if (isClone)
      dispatch(actionSubmitCustomMainModulesData(templateId, packet));
    else dispatch(actionDynamicDataSaveUpdateCustomModule(packet));

    setSubmitting(true);
  };

  useEffect(() => {
    if (
      (customModulesFetchState === APIFetchStatus.FETCHED ||
        customModulesFetchState === APIFetchStatus.FAILED) &&
      submitting
    ) {
      setSubmitting(false);
      handleClose();
    }
  }, [customModulesFetchState, submitting]);

  useEffect(() => {
    if (
      (customModulesNameChangedState === APIFetchStatus.FAILED ||
        customModulesNameChangedState === APIFetchStatus.FETCHED) &&
      showModal === true
    ) {
      dispatch(actionSubmitCustomModules(templateId, [wpId]));
      dispatch(actionFetchCustomModulesDropdown());
      // dis
      // setShowModal(false);
      handleClose();
    }
    // console.log({ customModulesNameChangedState });
  }, [customModulesNameChangedState]);

  useEffect(() => {
    if (savingClone === APIFetchStatus.FETCHED) {
      handleClose();
    }
  }, [savingClone]);

  useEffect(() => {
    if (!show) {
      setTypeOfWork(emptyValue);
      setTow(0);
      setWp(0);
      // setEdit(false);
      setEditToW(false);
      setIsPublished(false);
      setShowError(false);
      setEditWP(false);
      setEditedTypeOfWorkError(false);
      setEditedTypeOfWorkErrorMessage("");
      setEditedWorkPackageErrorMessage("");
      // setEditedTypeOfWork("");
      // setEditedWorkPackage("");
      setEditedTypeOfWork("");
      setEditedWorkPackage("");
      setWorkPackage(emptyValue);
      setDomain("");
      console.log("use effect !show resetting");
      setState(
        workPackageSectionData.length > 0
          ? workPackageSectionData.map((e) => ({
              ...e,
              value: "<p><br/></p>",
              workPackageId: 0,
              typeOfWorkId: 0,
              id: 0,
            }))
          : []
      );
    }
  }, [show]);

  // const handleWorkPackageChange = (val) => {
  //   setWp(0);
  //   setWorkPackage(val ?? emptyValue);
  //   setState(
  //     workPackageSectionData.length > 0
  //       ? workPackageSectionData.map((e) => ({
  //           ...e,
  //           value: "<p><br/></p>",
  //           workPackageId: 0,
  //           typeOfWorkId: 0,
  //           id: 0,
  //         }))
  //       : []
  //   );
  //   if (val && !val.__isNew__) {
  //     dispatch(actionSubmitCustomModules(templateId, [val.id]));
  //   }
  // };

  useEffect(() => {
    // console.log("new section data resetting");
    // console.group();
    setState(
      workPackageSectionData.length > 0
        ? workPackageSectionData.map((e) => ({
            ...e,
            value: "<p><br/></p>",
            workPackageId: 0,
            typeOfWorkId: 0,
            id: 0,
          }))
        : []
    );
    // console.log("workPackageSectionData called");
    // console.groupEnd();
  }, [workPackageSectionData]);

  useEffect(() => {
    if (customModulesDataFetchState === APIFetchStatus.FETCHED) {
      if (customModulesSubmitData.length > 0) {
        setState((old) =>
          old.map((e) => {
            const f = customModulesSubmitData.find(
              (x) => x.fieldName === e.fieldName
            );

            return {
              ...e,
              value: f.fieldHtmlDefaultValue ?? f.fieldDefaultValue,
              fieldDefaultValue: f.fieldDefaultValue,
              fieldHtmlDefaultValue: f.fieldHtmlDefaultValue,
              typeOfWorkId: f.typeOfWorkId,
              workPackageId: f.workPackageId,
              id: f.id,
            };
          })
        );

        setIsPublished(
          customModulesSubmitData[0].workPackage.isPublished === null
            ? false
            : customModulesSubmitData[0].workPackage.isPublished
        );
      } else {
        // console.log("length not greater than 0");
      }
    }
    // console.groupEnd();
  }, [customModulesDataFetchState]);

  useEffect(() => {
    setEditedWorkPackage(workPackage?.value ? workPackage.value : "");
  }, [workPackage]);

  useEffect(() => {
    setEditedTypeOfWork(typeOfWork?.value ? typeOfWork.value : "");
  }, [typeOfWork]);

  useEffect(() => {
    if (!editToW) {
      setEditedTypeOfWork(typeOfWork?.value ? typeOfWork.value : "");
    }
  }, [editToW]);

  useEffect(() => {
    if (!editWP) {
      setEditedWorkPackage(workPackage?.value ? workPackage.value : "");
    }
  }, [editWP]);

  useEffect(() => {
    if (
      customDropDown.findIndex((e) => e.typeOfWork === editedTypeOfWork) > -1 &&
      editedTypeOfWork !== typeOfWork.value
    ) {
      setEditedTypeOfWorkError(true);
      setEditedTypeOfWorkErrorMessage("Solution already exists!");
    } else if (editedTypeOfWork.trim().length === 0) {
      setEditedTypeOfWorkError(true);
      setEditedTypeOfWorkErrorMessage("Please assign a valid Solution name!");
    } else {
      setEditedTypeOfWorkError(false);
      setEditedTypeOfWorkErrorMessage("");
    }
  }, [editedTypeOfWork]);

  useEffect(() => {
    const wpF = workPackageList.findIndex((e) => e.value === editedWorkPackage);
    if (isClone && editedWorkPackage === workPackage.value) {
      setEditedWorkPackageErrorMessage("Work Package exists!");
      setEditedWorkPackageError(true);
    } else if (wpF > -1 && editedWorkPackage !== workPackage.value) {
      setEditedWorkPackageErrorMessage("Work Package exists!");
      setEditedWorkPackageError(true);
    } else if (editedWorkPackage.trim().length === 0) {
      setEditedWorkPackageErrorMessage(
        "Please assign a valid Work Package name!"
      );
      setEditedWorkPackageError(true);
    } else {
      setEditedWorkPackageErrorMessage("");
      setEditedWorkPackageError(false);
    }
  }, [editedWorkPackage]);

  const dispatch = useDispatch();
  const customStyles = {
    menu: (base) => ({
      ...base,
      zIndex: "200",
    }),
    control: (base) => ({
      ...base,
      height: 25,
      minHeight: 25,
      minWidth: "145px",
      borderRadius: "0",
    }),
    valueContainer: (base) => ({
      ...base,
      fontSize: "13px",
      top: "0",
      padding: "0px 2px",
    }),
    singleValue: (base) => ({
      ...base,
      padding: "0 0 4px 0",
      // zIndex: "200",
    }),
    option: (base) => ({
      ...base,
      overflowX: "hidden",
      // zIndex: "200",
    }),
  };

  return (
    <>
      <Modal
        size="lg"
        dialogClassName="modal-dialog-scrollable custom-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>
              {isEdit
                ? isEditWorkPackage
                  ? "Edit Custom Module"
                  : "Add Custom Module"
                : isClone
                ? "Clone Custom Module"
                : "Add Custom Module"}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {isEdit ? (
            <>
              <MyRow>
                <SOWFormFieldComponent
                  showEdit
                  edit={editToW}
                  setEdit={setEditToW}
                  onChange={(val) => {
                    setEdit(false);
                    setTow(0);
                    setWp(0);
                    setTypeOfWork(val ?? emptyValue);
                    setWorkPackage(emptyValue);
                    setState(
                      workPackageSectionData.length > 0
                        ? workPackageSectionData.map((e) => ({
                            ...e,
                            value: "<p><br/></p>",
                            workPackageId: 0,
                            typeOfWorkId: 0,
                            id: 0,
                          }))
                        : []
                    );
                  }}
                  value={{
                    value: typeOfWork?.value,
                    label: typeOfWork?.label,
                    id: typeOfWork?.id,
                  }}
                  col={[2, 10]}
                  title="Solution Name"
                  required
                  type="creatable-select"
                  name="typeOfWork"
                  placeholder="Solution Name"
                  list={typeOfWorkList}
                  customStyles={customStyles}
                />
              </MyRow>
              {editToW && (
                <MyRow>
                  <SOWFormFieldComponent
                    value={editedTypeOfWork}
                    name="editedTypeOfWork"
                    col={[2, 10]}
                    title="New Solution Name"
                    type="text"
                    disabled={typeOfWork.id === 0 || typeOfWork.id === ""}
                    onChange={(e) => setEditedTypeOfWork(e.target.value)}
                  />
                </MyRow>
              )}
              <MyRow>
                <SOWFormFieldComponent
                  showEdit
                  edit={editWP}
                  setEdit={setEditWP}
                  onChange={handleWorkPackageChange}
                  value={{
                    value: workPackage?.value,
                    label: workPackage?.label,
                    id: workPackage?.id,
                  }}
                  col={[2, 10]}
                  title="Work Package"
                  required
                  disabled={typeOfWork?.value?.length === 0}
                  type="creatable-select"
                  name="workPackage"
                  list={workPackageList}
                  customStyles={customStyles}
                />
              </MyRow>

              {editWP && (
                <MyRow>
                  <SOWFormFieldComponent
                    value={editedWorkPackage}
                    name="editedWorkPackage"
                    col={[2, 10]}
                    type="text"
                    title="WorkPackage Name"
                    disabled={workPackage.id === 0 || workPackage.id === ""}
                    onChange={(e) => setEditedWorkPackage(e.target.value)}
                  />
                </MyRow>
              )}
            </>
          ) : ( */}
          <>
            <MyRow>
              {editedTypeOfWorkError ? (
                <MyRow>
                  <Col xs={2}></Col>
                  <Col xs={8}>
                    <div className="text-danger md-3">
                      {editedTypeOfWorkErrorMessage}
                    </div>
                  </Col>
                </MyRow>
              ) : (
                <></>
              )}
              <SOWFormFieldComponent
                value={editedTypeOfWork}
                disabled={isClone}
                name="editedTypeOfWork"
                col={[2, 10]}
                title={
                  isEdit || isEditWorkPackage ? "Solution" : "New Solution"
                }
                className={editedTypeOfWorkError ? "is-invalid" : ""}
                type="text"
                // disabled={isEditWorkPackage}
                onChange={(e) => {
                  if (!showError) {
                    setShowError(true);
                  }
                  const val = e.target.value;
                  setEditedTypeOfWork(val);
                }}
              />
            </MyRow>

            <MyRow>
              <SOWFormFieldComponent
                title="Practice Domain"
                type="select"
                name="domain"
                value={domain}
                list={domainList}
                onChange={(e) => setDomain(e.target.value)}
                col={[2, 10]}
                // disabled={isEdit && ((workPackage?.value.length || editedWorkPackage.length) || customModulesDataFetchState === APIFetchStatus.FETCHING)}
              />
            </MyRow>

            <MyRow>
              {editedWorkPackageError ? (
                <MyRow>
                  <Col xs={2}></Col>
                  <Col xs={8}>
                    <div className="text-danger md-3">
                      {editedWorkPackageErrorMessage}
                    </div>
                  </Col>
                </MyRow>
              ) : (
                <></>
              )}
              <SOWFormFieldComponent
                value={editedWorkPackage}
                name="editedWorkPackage"
                className={editedWorkPackageError ? "is-invalid" : ""}
                col={[2, 10]}
                type="text"
                title={isEditWorkPackage ? "WorkPackage" : "New WorkPackage"}
                disabled={
                  editedTypeOfWork.trim().length === 0 || editedTypeOfWorkError
                }
                onChange={(e) => {
                  if (!showError) {
                    setShowError(true);
                  }
                  setEditedWorkPackage(e.target.value);
                }}
              />
            </MyRow>
          </>
          {/* )} */}

          <MyRow>
            <SOWFormFieldComponent
              value={isPublished}
              type="checkbox"
              title="Publish"
              name="isPublished"
              onChange={(e) => setIsPublished((state) => !state)}
            />
          </MyRow>

          {state.map((dd, idx) => {
            return (
              <div key={`${workPackageSectionData}_${idx}`}>
                <TextAreaFormField
                  id={dd.id}
                  name={dd.fieldName}
                  onChange={(val, name) => {
                    console.log({ val, name });
                    setState((old) =>
                      old.map((e) =>
                        e.fieldName === name ? { ...e, value: val } : { ...e }
                      )
                    );
                  }}
                  value={dd.value}
                  readonly={
                    isEdit || isEditWorkPackage
                      ? editedTypeOfWorkError ||
                        editedWorkPackageError ||
                        editedWorkPackage.trim().length === 0
                      : customModulesDataFetchState === APIFetchStatus.FETCHING
                  }
                  isPopup
                />
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
            variant="success"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
            // bsPrefix="btn btn-success new-btn-success btn-sm  pointer"
            // variant="primary"
            type="submit"
            // disabled={
            //   (typeOfWork.trim().length === 0 &&
            //     workPackage.some((e) => e.trim().length === 0)) ||
            //   workPackage.some((e, id) => {
            //     const idx = workPackage.indexOf(e);
            //     if (idx === id) {
            //       return false;
            //     }
            //     return true;
            //   })
            // }
            // disabled={
            //   (isEdit || isEditWorkPackage
            //     ? editedTypeOfWorkError || editedWorkPackageError
            //     : workPackage?.value?.trim().length === 0 ||
            //       customModulesDataFetchState === APIFetchStatus.FETCHING ||
            //       customModulesFetchState === APIFetchStatus.FETCHING) &&
            //   !state.some(
            //     (e) =>
            //       e.value.trim().length > 0 &&
            //       e.value.trim() !== "<p><br/></p>" &&
            //       e.value.trim() !== "<p><br></p>"
            //   )
            // }

            disabled={
              editedTypeOfWorkError ||
              editedWorkPackageError ||
              customModulesDataFetchState === APIFetchStatus.FETCHING ||
              savingClone === APIFetchStatus.FETCHING ||
              customModulesFetchState === APIFetchStatus.FETCHING ||
              !state.some(
                (e) =>
                  e.value.trim().length > 0 &&
                  e.value.trim() !== "<p><br/></p>" &&
                  e.value.trim() !== "<p><br></p>"
              )
            }
            onClick={handleSubmit}
          >
            {customModulesDataFetchState === APIFetchStatus.FETCHING ||
            savingClone === APIFetchStatus.FETCHING ||
            customModulesFetchState === APIFetchStatus.FETCHING ? (
              <Spinner size="sm" animation="border" role="status">
                <span className="sr-only">Submitting...</span>
              </Spinner>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <WorkPackageNameEditModal
        className="parentZIndex"
        show={showModal}
        name={wpName}
        id={wpId}
        showLoading={
          customModulesNameChangedState === APIFetchStatus.FETCHING
            ? true
            : false
        }
        setName={setWpName}
        submitChange={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          dispatch(actionCustomModuleWPChangeName(wpName, wpId));
        }}
        handleClose={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setShowModal(false);
        }}
      /> */}
    </>
  );
};

export default WorkPackageModal;
