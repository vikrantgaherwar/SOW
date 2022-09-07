import { Accordion } from "react-bootstrap";
import HistoryData from "./HistoryData";
import moment from "moment";
import HistoryChildData from "./HistoryData/HistoryChildData";
/* Single history component */
const HistoryRow = ({ onClick, listItem, onChildClick, dontShow }) => {
  /* render single history row */
  return (
    // <div className="history-content">
    <Accordion key={listItem.id} className="history-content">
      {/* render single history data */}
      {dontShow ? (
        <>
          <div
            key={`${listItem.createdBy}_${listItem.id}`}
            className="text-font d-flex align-items-center child-history-content"
          >
            <div className="col-9">
              <ul className="pl-0 m-0">
                <li>
                  <strong>
                    <a title={`View`} className="pointer" onClick={onClick}>
                      {listItem.templateOutputName}
                    </a>
                  </strong>
                </li>
                <li>
                  Created :{" "}
                  {moment(listItem.createdDate, moment.ISO_8601)
                    .format("YYYY-MM-DD#HH:mm")
                    .replace("#", " at ")}
                  &nbsp; Modified :{" "}
                  {moment(listItem.modifiedDate, moment.DATETIME_LOCAL)
                    .format("YYYY-MM-DD#HH:mm")
                    .replace("#", " at ")}
                </li>
                <li>Status : {listItem?.sowStatusNavigation?.statusName}</li>
              </ul>
            </div>
            {/* <div className="col-2 p-0 d-flex">
              <h6 title={`Clone`} className="childCopyIcon" onClick={(e) => {}}>
                <i className="far history-panel-icon-size fa-clone" />
              </h6>
            </div> */}
          </div>
        </>
      ) : (
        <HistoryData onClick={onClick} listItem={listItem} idx={listItem.id} />
      )}

      <Accordion.Collapse
        eventKey={`${listItem.id}`}
        // style={{ borderBottom: 0, borderTop: "0.5px solid black" }}
      >
        {/* render single child history data */}
        {dontShow ? (
          <></>
        ) : (
          <HistoryChildData onChildClick={onChildClick} id={listItem.id} />
        )}
      </Accordion.Collapse>
    </Accordion>
    // </div>
  );
};

export default HistoryRow;
