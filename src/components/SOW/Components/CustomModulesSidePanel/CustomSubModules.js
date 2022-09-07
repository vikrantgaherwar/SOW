import { Accordion, Button, Card } from "react-bootstrap";
import ModulesAccordionContextAware from "./ModulesAccordionContextAware";
import { useDispatch } from "react-redux";
import {
  actionCustomModuleSidePanelClose,
  actionGetCustomMainModulesData,
} from "../../Redux/Actions/CustomModulesSidePanel";
import Cookies from "js-cookie";

const CustomSubModules = ({
  templateId,
  selected,
  workPackages,
  handleChange,
  setId,
  isView,
  setShow,
  setEditModalShow,
  setTow,
  setIsEdit,
  setIsEditWorkPackage,
  originalDropDown,
  setModalType,
  setWp,
  setName,
  setShowMainCloneModal,
  setIsClone,
}) => {
  const dispatch = useDispatch();
  const newSelected = selected.map((e) => {
    const f = originalDropDown.find((x) => x.id === e.id);
    console.log({ f });
    return { ...e, editAllowed: f.createdBy === Cookies.get("name") };
  });

  const handleMainModuleClone = (e, selectedModule) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMainCloneModal(true);
    dispatch(actionCustomModuleSidePanelClose());
    const wpIds = selectedModule.workPackages.map((e) => e.id);
    dispatch(
      actionGetCustomMainModulesData(
        templateId,
        wpIds,
        selectedModule.typeOfWork
      )
    );
  };

  return (
    <Accordion className="over_flow">
      {newSelected.map((s, index) => (
        <Card key={`${s.typeOfWork}_index`}>
          <ModulesAccordionContextAware eventKey={index.toString()}>
            {s.typeOfWork}
            {s.editAllowed && (
              <>
                <i
                  style={{ cursor: "pointer" }}
                  className="ml-3 fa fa-plus-square"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsEdit(true);
                    setIsClone(() => false);
                    setIsEditWorkPackage(false);
                    setTow(s.id);
                    setShow(true);
                    dispatch(actionCustomModuleSidePanelClose());
                  }}
                  title="Add Work Package"
                />
              </>
            )}
            <span
              style={{ paddingLeft: "1em", cursor: "pointer" }}
              title={`Clone`}
              onClick={(e) => handleMainModuleClone(e, s)}
            >
              <i className="far history-panel-icon-size fa-clone" />
            </span>
          </ModulesAccordionContextAware>
          <Accordion.Collapse eventKey={index.toString()}>
            <Card.Body>
              {s.workPackages.map((sel, idx) => (
                <div
                  key={`${sel.id}_${idx}_sub_selection`}
                  className="form-check py-2 d-flex flex-row align-items-center"
                >
                  <input
                    checked={workPackages.indexOf(sel.id) > -1}
                    disabled={isView}
                    onChange={() => {
                      handleChange(sel.id);
                    }}
                    type="checkbox"
                    className="mr-2"
                    id={`${sel.id}_${idx}_selection`}
                  />
                  <label
                    className={`form-check-label  clear_background submodule_label ${
                      workPackages.indexOf(sel.id) > -1
                        ? "type_of_work_selected"
                        : ""
                    }`}
                    htmlFor={`${sel.id}_${idx}_selection`}
                  >
                    {sel.name}
                    {s.editAllowed && (
                      <>
                        <i
                          style={{ cursor: "pointer" }}
                          className="pl-2 fas fa-pen fa-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsEdit(true);
                            setIsClone(false);
                            setIsEditWorkPackage(true);
                            setTow(s.id);
                            setWp(sel.id);
                            setShow(true);
                            dispatch(actionCustomModuleSidePanelClose());
                          }}
                          title="Edit Work Package"
                        />
                      </>
                    )}
                    <span
                      style={{ paddingLeft: "1em", cursor: "pointer" }}
                      title={`Clone`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsEdit(false);
                        setIsClone(true);
                        setIsEditWorkPackage(true);
                        setTow(s.id);
                        setWp(sel.id);
                        setShow(true);
                        dispatch(actionCustomModuleSidePanelClose());
                      }}
                    >
                      <i className="far history-panel-icon-size fa-clone" />
                    </span>
                  </label>
                </div>
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
};

export default CustomSubModules;
