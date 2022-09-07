import React, { useContext } from "react";
import { Card, AccordionContext, useAccordionToggle } from "react-bootstrap";

const ContextAwareToggle = ({
  children,
  as,
  eventKey,
  idx,
  handleSectionToggle,
  callback,
}) => {
  var currentEventKey = useContext(AccordionContext);
  const handleToggleClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  const handleClick = () => {
    handleSectionToggle && handleSectionToggle(idx);
    handleToggleClick();
  };

  return (
    <Card.Header as={as} bsPrefix="sow-sectionline" onClick={handleClick}>
      {isCurrentEventKey ? (
        <i className="fas fa-chevron-down fa-xs pr-2" />
      ) : (
        <i className="fas fa-chevron-right fa-xs pr-2" />
      )}
      {children}
    </Card.Header>
  );
};

export default ContextAwareToggle;
