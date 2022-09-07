import { Accordion, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  actionGetCloneSelectedTypeOfWork,
  actionModuleSidePanelClose,
  actionSetTowWp,
  actionSubmitCloneSelectedTypeOfWork,
} from "../../Redux/Actions/ModulesSidePanel";
import ModulesAccordionContextAware from "./ModulesAccordionContextAware";

const SubModules = ({
  templateId,
  selected,
  selectedTypeOfWork,
  workPackages,
  handleChange,
  isView,
  setShow,
  setShowTowModal,
}) => {
  const dispatch = useDispatch();

  const onCloneClick = (e, tow) => {
    e.preventDefault();
    dispatch(actionSetTowWp(selectedTypeOfWork, tow));
    setShow(true);
    dispatch(actionModuleSidePanelClose());
  };

  const handleTypeOfWorkClone = (e, tow) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTowModal(true);
    dispatch(actionModuleSidePanelClose());
    // const selectedTypeOfWork = typeOfWork.id;
    const selectedWorkPackages = tow.workPackages
      .filter((wp) => workPackages.indexOf(wp.id) > -1)
      .map((e) => e.id);

    dispatch(
      actionSubmitCloneSelectedTypeOfWork(
        templateId,
        tow.typeOfWork,
        selectedWorkPackages
      )
    );
    // dispatch(
    //   actionGetCloneSelectedTypeOfWork({
    //     ...typeOfWork,
    //     workPackages: typeOfWork?.workPackages.filter(
    //       (t) => workPackages.indexOf(t.id) > -1
    //     ),
    //   })
    // );
  };
  return (
    <>
      <Accordion className="over_flow">
        {selected.map((s, index) => (
          <Card key={`${s.typeOfWork}_index`}>
            <ModulesAccordionContextAware eventKey={index.toString()}>
              {s.typeOfWork}
              <span
                style={{ paddingLeft: "1em", cursor: "pointer" }}
                title={`Clone`}
                onClick={(e) => handleTypeOfWorkClone(e, s)}
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
                    </label>
                    <span
                      style={{ paddingLeft: "1em", cursor: "pointer" }}
                      title={`Clone`}
                      // className="copyIcon"
                      onClick={(e) => onCloneClick(e, sel)}
                    >
                      <i className="far history-panel-icon-size fa-clone" />
                    </span>
                  </div>
                ))}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </>
  );
};

export default SubModules;
