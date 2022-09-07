import React, { useContext } from "react";
import {
  Accordion,
  Card,
  AccordionContext,
  useAccordionToggle,
} from "react-bootstrap";

const ModulesAccordionContextAware = ({ children, as, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);

  const handleToggleClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Accordion.Toggle
      className="text-left border-0 py-2 type_of_work_selected submodule_header"
      // eventKey={idx.toString()}
      onClick={handleToggleClick}
    >
      {/* <Card.Header as={as} bsPrefix="sow-sectionline" onClick={handleToggleClick}> */}
      {isCurrentEventKey ? (
        <i className="fas fa-chevron-down fa-xs pr-2 dropdown_icon_width" />
      ) : (
        <i className="fas fa-chevron-right fa-xs pr-2 dropdown_icon_width" />
      )}
      {children}
      {/* </Card.Header> */}
    </Accordion.Toggle>
  );
};

export default ModulesAccordionContextAware;
