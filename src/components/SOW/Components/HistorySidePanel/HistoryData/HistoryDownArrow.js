import React, { useContext } from "react";
import { AccordionContext, useAccordionToggle } from "react-bootstrap";
/* toggle single row onclick */
const HistoryDownArrow = ({ eventKey, onClick }) => {
  const handleToggleClick = useAccordionToggle(eventKey);
  const currentEventKey = useContext(AccordionContext);

  const isCurrentEventKey = currentEventKey === eventKey;
  /* render single row toggle */

  return (
    <div onClick={handleToggleClick}>
      {isCurrentEventKey ? (
        <i className="fas fa-chevron-up history-panel-icon-size  dropdown_icon_width" />
      ) : (
        <i
          onClick={onClick}
          className="fas fa-chevron-down history-panel-icon-size  dropdown_icon_width"
        />
      )}
    </div>
  );
};

export default HistoryDownArrow;
