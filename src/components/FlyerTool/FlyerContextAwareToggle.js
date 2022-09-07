import React, { useContext } from "react";
import { Card, AccordionContext, useAccordionToggle } from "react-bootstrap";

const FlyerContextAwareToggle = ({ children, as, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);

  const handleToggleClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Card.Header as={as} bsPrefix="flyer-accordian" onClick={handleToggleClick}>
      {isCurrentEventKey ? (
        <i className="fas fa-chevron-down fa-xs pr-2" />
      ) : (
        <i className="fas fa-chevron-right fa-xs pr-2" />
      )}
      {children}
    </Card.Header>
  );
};

export default FlyerContextAwareToggle;
