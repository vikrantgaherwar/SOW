import moment from "moment";
import HistoryDownArrow from "../../HistorySidePanel/HistoryData/HistoryDownArrow";

const VersionRow = ({ onClick, listItem }) => {
  /* currying function to handle passed argument with input */
  const handleClick = (type) => (e) => {
    e.preventDefault();
    onClick(listItem.id, type);
  };

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
        {listItem?.sowUserRights?.find((e) => e?.rightsId === 1) && (
          <h6 title={`Edit`} className="editIcon" onClick={handleClick(1)}>
            <i className="far history-panel-icon-size fa-edit" />
          </h6>
        )}
        {listItem?.sowUserRights?.find((e) => e?.rightsId === 5) && (
          <h6 title={`Clone`} className="copyIcon" onClick={handleClick(2)}>
            <i className="far history-panel-icon-size fa-clone" />
          </h6>
        )}
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
    </div>
  );
};

export default VersionRow;
