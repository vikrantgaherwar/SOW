import { Modal, Button, Row, Spinner } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import { useDispatch } from "react-redux";
import { actionDynamicDataSaveUpdateCustomModule } from "../../Redux/Actions/DynamicDataFields";
import TextAreaFormField from "../TextAreaFormField";
import {
  actionCustomWorkPackageClearSubmitData,
  actionSubmitCustomModules,
} from "../../Redux/Actions/CustomModulesSidePanel";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { makeCustomWorkPackagePacket } from "../../Redux/Actions/DynamicDataFields/customWorkPackages";
import MyRow from "../MyRow";
import {
  actionGetSolutionHubData,
  actionModuleSidePanelOpen,
} from "../../Redux/Actions/ModulesSidePanel";
import Cookies from "js-cookie";

const ClonePredefinedModuleDialogue = ({
  workPackageSectionData,
  show,
  setShow,
  customDropDown,
  templateId,
  customModulesFetchState,
  wp,
  tow,
  setTow,
  setWp,
  customModulesDataFetchState,
  customModulesSubmitData,
  cloneSelectedTypeOfWork,
  cloneSelectedWorkPackage,
  solutionHubCloneData,
  solutionHubCloneDataFetchState,
  practiceDomainDropDownData,
  customModulesDomain,
}) => {
  const [typeOfWork, setTypeOfWork] = useState("");
  const [workPackage, setWorkPackage] = useState("");
  const [workPackageList, setWorkPackageList] = useState([]);

  const [typeOfWorkErrorMessage, setTypeOfWorkErrorMessage] = useState("");
  const [workPackageErrorMessage, setWorkPackageErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [edit, setEdit] = useState(false);

  const [editToW, setEditToW] = useState(false);
  const [editWP, setEditWP] = useState(false);

  const [state, setState] = useState([]);
  const [domain, setDomain] = useState("");
  const [domainData, setDomainData] = useState({});
  const [domainList, setDomainList] = useState([]);
  const [isPublished, setIsPublished] = useState(false);

  const typeOfWorkList = useMemo(() => {
    const logedInUser = Cookies.get("name");
    return customDropDown
      .filter((e) => e.createdBy === logedInUser)
      .map((tow) => ({
        value: tow.typeOfWork,
        label: tow.typeOfWork,
        id: tow.id,
      }));
  }, [customDropDown]);

  useEffect(() => {
    setDomain(customModulesDomain);
  }, [customModulesDomain]);

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
    if (cloneSelectedTypeOfWork && cloneSelectedWorkPackage) {
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
      setTypeOfWork(cloneSelectedTypeOfWork?.value);
      dispatch(
        actionGetSolutionHubData(templateId, [cloneSelectedWorkPackage.id])
      );
      /* consider a workpackage always by default new so give id 0 */
      setWorkPackage(cloneSelectedWorkPackage?.value);
    }
  }, [cloneSelectedTypeOfWork, cloneSelectedWorkPackage]);

  useEffect(() => {
    if (
      customDropDown.findIndex(
        (e) =>
          e.typeOfWork?.trim() === typeOfWork?.trim() &&
          Cookies.get("name") !== e.createdBy
      ) > -1
    ) {
      setTypeOfWorkErrorMessage("Solution already exists!");
    } else if (typeOfWork.trim().length === 0) {
      setTypeOfWorkErrorMessage("Please assign a valid Work Package name!");
    } else if (cloneSelectedTypeOfWork?.value?.trim() === typeOfWork?.trim()) {
      setTypeOfWorkErrorMessage("Please change solution name");
    } else {
      setTypeOfWorkErrorMessage("");
    }
  }, [typeOfWork]);

  useEffect(() => {
    const wpExist = customDropDown.find(
      (e) =>
        e.typeOfWork?.trim() === typeOfWork?.trim() &&
        Cookies.get("name") === e.createdBy
    );

    const wpF = wpExist?.workPackages?.findIndex(
      (e) => e.name?.trim() === workPackage?.trim()
    );
    if (wpF > -1) {
      setWorkPackageErrorMessage("Work Package exists!");
    } else if (workPackage.trim().length === 0) {
      setWorkPackageErrorMessage("Please assign a valid Work Package name!");
    } else {
      setWorkPackageErrorMessage("");
    }
  }, [workPackage, typeOfWork]);

  useEffect(() => {
    if (
      solutionHubCloneDataFetchState === APIFetchStatus.FETCHED &&
      solutionHubCloneData.length > 0
    ) {
      setState((old) =>
        old.map((e) => {
          const f = solutionHubCloneData.find(
            (x) => x.fieldName === e.fieldName
          );
          return {
            ...e,
            value: f.fieldHtmlDefaultValue ?? f.fieldDefaultValue,
            fieldDefaultValue: f.fieldDefaultValue,
            fieldHtmlDefaultValue: f.fieldHtmlDefaultValue,
            typeOfWorkId: 0,
            workPackageId: 0,
            id: 0,
          };
        })
      );
    }
  }, [solutionHubCloneDataFetchState]);

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
    setTypeOfWork("");
    setWorkPackage("");
    setWp(0);
    setTow(0);
    setWorkPackageList([]);
    setIsPublished(false);
    setDomain("");
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
    dispatch(actionModuleSidePanelOpen());

    setShow(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const packet = makeCustomWorkPackagePacket(
      typeOfWork,
      workPackage,
      domainData,
      state,
      customDropDown.find((e) => e.typeOfWork === typeOfWork)?.id,
      0,
      isPublished,
      cloneSelectedWorkPackage?.displayOrder
    );
    dispatch(actionDynamicDataSaveUpdateCustomModule(packet));
    setSubmitting(true);
  };

  const isSoluHubLoading = useMemo(() => {
    return (
      solutionHubCloneDataFetchState === APIFetchStatus.FETCHING ||
      customModulesDataFetchState === APIFetchStatus.FETCHING ||
      customModulesFetchState === APIFetchStatus.FETCHING
    );
  }, [
    solutionHubCloneDataFetchState,
    customModulesDataFetchState,
    customModulesFetchState,
  ]);

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

  const handleWorkPackageChange = (val) => {
    setWp(0);
    setWorkPackage(val ?? cloneSelectedWorkPackage);
    if (val?.__isNew__) {
      setState((old) =>
        old.map((e) => ({ ...e, workPackageId: 0, typeOfWorkId: 0, id: 0 }))
      );
    } else {
      dispatch(actionSubmitCustomModules(templateId, [val.id]));
    }
  };

  /*load workPackage section data on wp changes*/
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
      }
    }
  }, [customModulesDataFetchState]);

  const dispatch = useDispatch();

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
            <h3>{"Clone Predefined Module"}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MyRow>
            <SOWFormFieldComponent
              // showEdit={cloneSelectedTypeOfWork?.value !== typeOfWork?.value}
              edit={editToW}
              setEdit={setEditToW}
              onChange={(e) => {
                setEdit(false);
                setTow(0);
                setWp(0);
                setTypeOfWork(e.target.value);
              }}
              value={typeOfWork}
              col={[2, 10]}
              title="Solution Name"
              required
              type="text"
              name="typeOfWork"
              placeholder="Solution Name"
              // list={typeOfWorkList}
              // customStyles={customStyles}
              errorText={typeOfWorkErrorMessage}
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
            />
          </MyRow>

          <MyRow>
            <SOWFormFieldComponent
              // showEdit
              edit={editWP}
              setEdit={setEditWP}
              onChange={(e) => setWorkPackage(e.target.value)}
              value={workPackage}
              col={[2, 10]}
              title="Work Package"
              required
              disabled={typeOfWork?.length === 0}
              type="text"
              name="workPackage"
              errorText={workPackageErrorMessage}
            />
          </MyRow>

          <MyRow>
            <SOWFormFieldComponent
              value={isPublished}
              type="checkbox"
              title="Publish"
              name="isPublished"
              onChange={() => setIsPublished((state) => !state)}
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
                    workPackage?.value?.length === 0 || isSoluHubLoading
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
            disabled={
              isSoluHubLoading ||
              typeOfWorkErrorMessage ||
              workPackageErrorMessage
            }
            onClick={handleSubmit}
          >
            {isSoluHubLoading ? (
              <Spinner size="sm" animation="border" role="status">
                <span className="sr-only">Submitting...</span>
              </Spinner>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClonePredefinedModuleDialogue;
