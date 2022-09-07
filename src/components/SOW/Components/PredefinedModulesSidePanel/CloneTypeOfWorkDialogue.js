import { Spinner } from "react-bootstrap";
import { groupBy } from "lodash";
import { memo, useEffect, useMemo, useState } from "react";
import { Accordion, Button, Card, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import ContextAwareToggle from "../../ContextAwareToggle";
import {
  actionModuleSidePanelOpen,
  actionSaveSelectedTypeOfWorkClone,
} from "../../Redux/Actions/ModulesSidePanel";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import TextAreaFormField from "../TextAreaFormField";
import LoadingComponent from "../LoadingComponent";
import { customModulesSavePackage } from "./customModulesSavePackage";
import MyRow from "../MyRow";

const CloneTypeOfWorkDialogue = ({
  templateId,
  show,
  setShow,
  typeOfWorkCloningData,
  solutionHubDropDown,
  typeOfWorkCloningDataFetchState,
  savingClone,
  customDropDown,
  practiceDomainDropDownData,
}) => {
  const dispatch = useDispatch();
  const [workpkgs, setWorkpkgs] = useState([]);
  const [typeOfworkName, setTypeOfworkName] = useState({});
  const [workPackageName, setWorkPackageName] = useState({});
  const [typeOfWorkErrMssg, setTypeOfWorkErrMssg] = useState("");
  const [domain, setDomain] = useState("");
  const [domainList, setDomainList] = useState([]);

  useEffect(() => {
    if (practiceDomainDropDownData?.length) {
      setDomainList(
        practiceDomainDropDownData.map((pr) => {
          return {
            ...pr,
            name: pr.domain,
          };
        })
      );
    }
  }, [practiceDomainDropDownData]);

  useEffect(() => {
    if (typeOfWorkCloningDataFetchState === APIFetchStatus.FETCHED) {
      //find workpackage from solutionHubDropdown
      const f = solutionHubDropDown.find(
        (s) => s.id === typeOfWorkCloningData?.data[0]?.typeOfWorkId
      );
      const ob = {
        ...f,
        workPackages: Object.values(
          groupBy(
            typeOfWorkCloningData?.data?.map((w) => ({
              ...w,
              value: w.fieldDefaultValue,
              name: f?.workPackages.find((f) => w.workPackageId === f.id)?.name,
              displayOrder: f?.workPackages.find(
                (f) => w.workPackageId === f.id
              )?.displayOrder,
            })),
            "workPackageId"
          )
        ),
      };
      setWorkpkgs(ob);
      setTypeOfworkName({ ...f, name: f.typeOfWork });
      //set workPackage names
      typeOfWorkCloningData?.data?.forEach((cl) => {
        const cloned = f?.workPackages.find((w) => cl.workPackageId === w.id);
        setWorkPackageName((prev) => ({
          ...prev,
          [cloned?.id]: cloned?.name,
        }));
      });
    }
  }, [typeOfWorkCloningDataFetchState]);

  const handleClose = () => {
    setShow(false);
    dispatch(actionModuleSidePanelOpen());
  };
  const handleWorkPkgNameChange = (e, workPackage) => {
    setWorkPackageName((prev) => ({
      ...prev,
      [workPackage?.workPackageId]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const finalObj = customModulesSavePackage(
      typeOfworkName,
      workpkgs,
      workPackageName,
      0,
      0,
      domainList.find((e) => e.id === +domain)
    );
    dispatch(actionSaveSelectedTypeOfWorkClone(templateId, finalObj));
    // console.log(JSON.stringify(finalObj));
  };

  // const isSolutionExist = useMemo(() => {
  //   const f = customDropDown.find(
  //     (c) => c.typeOfWork?.trim() === typeOfworkName?.name?.trim()
  //   );
  //   if (f) {
  //     return true;
  //   }
  //   return false;
  // }, [typeOfworkName]);

  useEffect(() => {
    if (savingClone === APIFetchStatus.FETCHED) {
      handleClose();
    }
  }, [savingClone]);

  useEffect(() => {
    if (!typeOfworkName?.name?.trim()) {
      setTypeOfWorkErrMssg("Please give solution name!");
    } else if (
      typeOfWorkCloningData?.typeOfWorkName?.trim() ===
      typeOfworkName?.name?.trim()
    ) {
      setTypeOfWorkErrMssg("Please change solution name!");
    } else {
      const f = customDropDown.find(
        (c) => c.typeOfWork?.trim() === typeOfworkName?.name?.trim()
      );

      if (f) {
        setTypeOfWorkErrMssg("Solution name already exists!");
      } else {
        setTypeOfWorkErrMssg("");
      }
    }
  }, [typeOfworkName]);

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
            <h3 className="float-left">{`Clone ${
              typeOfworkName?.name ?? ""
            }`}</h3>
            &nbsp;
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {typeOfWorkCloningDataFetchState === 1 ? (
            <LoadingComponent />
          ) : (
            <>
              <SOWFormFieldComponent
                onChange={(e) =>
                  setTypeOfworkName((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                readonly={savingClone === APIFetchStatus.FETCHING}
                name={"Solution Name"}
                title="Solution Name"
                value={typeOfworkName?.name}
                type="text"
                noFullWidth
                col={[2, 8]}
                errorText={typeOfWorkErrMssg}
              />
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
              {workpkgs?.workPackages?.map((wp, idx) => {
                return (
                  <Accordion key={wp[0]?.name + "_" + idx}>
                    <Card>
                      <ContextAwareToggle
                        idx={wp[0].id}
                        as="h5"
                        eventKey={`${wp[0].id}`}
                      >
                        {workPackageName[wp[0].workPackageId]}{" "}
                        {/* <span role="button">
                      <i
                        onClick={(_) => handleTypeOfWorkNameChange(_, wp[0])}
                        className="far history-panel-icon-size fa-edit cursor-pointer"
                      />
                    </span> */}
                      </ContextAwareToggle>

                      <Accordion.Collapse
                        eventKey={`${wp[0].id}`}
                        style={{ borderBottom: 0 }}
                      >
                        <>
                          <SOWFormFieldComponent
                            onChange={(e) => handleWorkPkgNameChange(e, wp[0])}
                            readonly={savingClone === APIFetchStatus.FETCHING}
                            name={"Work Package"}
                            title="Work Package"
                            value={wp[0]?.name}
                            type="text"
                            noFullWidth
                            col={[2, 8]}
                          />
                          {wp?.map((dd, idx1) => {
                            return (
                              <div key={`${dd.id}_${idx1}`}>
                                <>
                                  <TextAreaFormField
                                    id={dd.id}
                                    readonly={
                                      savingClone === APIFetchStatus.FETCHING
                                    }
                                    name={dd.fieldName}
                                    onChange={(val, name) => {
                                      setWorkpkgs((old) => ({
                                        ...old,
                                        workPackages: old?.workPackages?.map(
                                          (w) =>
                                            w.map((w1) =>
                                              w1.fieldName === name &&
                                              w1.workPackageId ===
                                                wp[0].workPackageId
                                                ? { ...w1, value: val }
                                                : { ...w1 }
                                            )
                                        ),
                                      }));
                                    }}
                                    value={dd.value}
                                    //   readonly={
                                    //     workPackage?.value?.length === 0 || isSoluHubLoading
                                    //   }
                                    isPopup
                                  />
                                </>
                              </div>
                            );
                          })}
                        </>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                );
              })}
            </>
          )}
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
            type="submit"
            disabled={
              typeOfWorkErrMssg ||
              savingClone === APIFetchStatus.FETCHING ||
              !domain
            }
            onClick={handleSubmit}
          >
            {savingClone === APIFetchStatus.FETCHING ? (
              <Spinner size="sm" animation="border" role="status">
                <span className="sr-only">Submitting...</span>
              </Spinner>
            ) : (
              "Save Changes"
            )}
            {/* Save Changes */}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(CloneTypeOfWorkDialogue);
