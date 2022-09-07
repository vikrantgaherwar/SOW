import moment from "moment";
import HistoryDownArrow from "./HistoryDownArrow";
/* single row history data */
const HistoryData = ({ onClick, listItem }) => {
  /* currying function to handle passed argument with input */
  const handleClick = (type) => (e) => {
    e.preventDefault();
    onClick(listItem.id, type);
  };

  /* render single row history data */
  return (
    <div className="text-font d-flex align-items-center">
      <div className="col-9">
        <ul className="list-unstyled m-0">
          <li>
            <strong>
              <a title={`View`} className="pointer" onClick={handleClick(0)}>
                {listItem.newName}
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
        </ul>
      </div>
      <div className="col-2 p-0 d-flex">
        <h6 title={`Edit`} className="editIcon" onClick={handleClick(1)}>
          <i className="far history-panel-icon-size fa-edit" />
        </h6>
        <h6 title={`Clone`} className="copyIcon" onClick={handleClick(2)}>
          <i className="far history-panel-icon-size fa-clone" />
        </h6>
        <h6 title={`Share`} className="copyIcon" onClick={handleClick(4)}>
          <i className="fas history-panel-icon-size fa-share-alt" />
        </h6>
      </div>
      {listItem?.hasSowVersions && (
        <div className="p-2">
          <h6 title="Versions" className="addIcon">
            <HistoryDownArrow
              eventKey={`${listItem.id}`}
              onClick={handleClick(3)}
            />
          </h6>
        </div>
      )}
    </div>
  );
};

export default HistoryData;
