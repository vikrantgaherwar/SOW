import { Accordion } from "react-bootstrap";
import HistoryChildData from "../../HistorySidePanel/HistoryData/HistoryChildData";
import VersionRow from "./VersionRow";
/* Single history component */
const SharedDataRow = ({ onClick, listItem, onChildClick }) => {
  /* render single history row */
  return (
    // <div className="history-content">
    <Accordion key={listItem.id} className="history-content">
      {/* render single history data */}
      <VersionRow onClick={onClick} listItem={listItem} idx={listItem.id} />
      <Accordion.Collapse
        eventKey={`${listItem.id}`}
        // style={{ borderBottom: 0, borderTop: "0.5px solid black" }}
      >
        {/* render single child history data */}
        <HistoryChildData onChildClick={onChildClick} id={listItem.id} />
      </Accordion.Collapse>
    </Accordion>
    // </div>
  );
};

export default SharedDataRow;
