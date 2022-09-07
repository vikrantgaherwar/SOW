import { Card, Accordion } from "react-bootstrap";
// import ContextAwareToggle from "../ContextAwareToggle";
import ModulesAccordionContextAware from "../Components/PredefinedModulesSidePanel/ModulesAccordionContextAware";

const ModuleSubPackages = (props) => {
  // console.log({ ModuleSubPackages: props });

  return (
    <Accordion className="over_flow">
      {props.selectedTypeOfWork.map((selectedId, idx) => {
        const selectedWorkOb = props.solutionHubDropdown.find(
          (e) => e.id === selectedId
        );
        const selectedWork = selectedWorkOb.typeOfWork;
        return (
          <Card key={`subpackages_dropdown_${selectedWork}`}>
            <ModulesAccordionContextAware eventKey={idx.toString()}>
              {selectedWork}
            </ModulesAccordionContextAware>

            <Accordion.Collapse eventKey={idx.toString()}>
              <Card.Body>
                {props.modulesOb[selectedWork].map((sel, idx) => (
                  <div
                    key={`${sel.id}_${idx}_sub_selection`}
                    className="form-check py-2 d-flex flex-row align-items-center"
                  >
                    <input
                      checked={props.selectedWorkPackages.indexOf(sel.id) > -1}
                      onChange={() => {
                        props.selectedWorkPackages.indexOf(sel.id) === -1
                          ? props.setSelectedWorkPackages((state) => [
                              ...state,
                              sel.id,
                            ])
                          : props.setSelectedWorkPackages((state) =>
                              state.filter((s) => s !== sel.id)
                            );
                      }}
                      type="checkbox"
                      className="mr-2"
                      id={`${sel.id}_${idx}_selection`}
                    />
                    <label
                      className={`form-check-label  clear_background submodule_label ${
                        props.selectedWorkPackages.indexOf(sel.id) > -1
                          ? "type_of_work_selected"
                          : ""
                      }`}
                      htmlFor={`${sel.id}_${idx}_selection`}
                    >
                      {sel.workPackage}
                    </label>
                  </div>
                ))}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      })}
    </Accordion>
  );
};

export default ModuleSubPackages;
