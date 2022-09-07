import moment from "moment";
import { useContext } from "react";
import { HistoryChild } from "../HistoryChildProvider";
import HistoryLoader from "../HistoryLoader";

/* child history data */
const HistoryChildData = ({ id, onChildClick }) => {
  const { data, loader } = useContext(HistoryChild);

  /* currying function to handle passed argument with input */
  const handleClick = (type, id) => (e) => {
    e.preventDefault();
    onChildClick(type, id);
  };
  /* render child of single row history data */
  return (
    <>
      {loader && loader[id] ? (
        <HistoryLoader />
      ) : (
        data[id] &&
        data[id].length &&
        data[id]
          .filter((e) => e.id !== id)
          .map((listItem, index) => (
            <div
              key={`${listItem.newName}_${listItem.id}_${index}`}
              className="text-font d-flex align-items-center child-history-content"
            >
              <div className="col-9">
                <ul className="pl-0 m-0">
                  <li>
                    <strong>
                      <a
                        title={`View`}
                        className="pointer"
                        onClick={handleClick(0, listItem.id)}
                      >
                        {listItem.newName}
                      </a>
                    </strong>
                    <br />
                    Created :{" "}
                    {moment(listItem.createdDate, moment.ISO_8601)
                      .format("YYYY-MM-DD#HH:mm")
                      .replace("#", " at ")}
                  </li>
                </ul>
              </div>
              <div className="col-2 p-0 d-flex">
                <h6
                  title={`Clone`}
                  className="childCopyIcon"
                  onClick={handleClick(2, listItem.id)}
                >
                  <i className="far history-panel-icon-size fa-clone" />
                </h6>
              </div>
            </div>
          ))
      )}
    </>
  );
};

export default HistoryChildData;
