import { Accordion, Card, Button } from "react-bootstrap";
import ContextAwareToggle from "../../ContextAwareToggle";
import { useDispatch } from "react-redux";
import { isTableStateFilled } from "../../Redux/utils/isTableStateFilled";
import { actionDynamicDataFieldsWorkPackageAdd } from "../../Redux/Actions/DynamicDataFields";
import { actionCustomModuleSidePanelOpen } from "../../Redux/Actions/CustomModulesSidePanel";

const DynamicDataAccordian = ({
  title,
  idx,
  children,
  hasButton,
  values,
  name,
  handleSectionToggle,
  sectionObj,
  isView,
}) => {
  const dispatch = useDispatch();
  return (
    <Accordion
      key={title + "_" + idx}
      activeKey={`${sectionObj[idx] ? idx : ""}`}
    >
      <Card>
        <ContextAwareToggle
          idx={idx}
          handleSectionToggle={handleSectionToggle}
          as="h5"
          eventKey={`${sectionObj[idx] ? idx : ""}`}
        >
          {title}
          {hasButton && (
            <Button
              bsPrefix="btn btn-success new-btn-success btn-sm float-right mr-2"
              title=""
              data-testid="AddTableRow"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                // dispatch(actionDynamicDataFieldsWorkPackageAdd(name));
                dispatch(actionCustomModuleSidePanelOpen());
              }}
              disabled={
                values.length === 0
                  ? false
                  : !isTableStateFilled(values[values.length - 1], true) ||
                    isView
              }
            >
              <i className="fas fa-plus fa-xs" />
            </Button>
          )}
        </ContextAwareToggle>

        {/* <hr className="sow-titleline" /> */}
        <Accordion.Collapse
          eventKey={`${sectionObj[idx] ? idx : ""}`}
          style={{ borderBottom: 0 }}
        >
          {children}
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default DynamicDataAccordian;
