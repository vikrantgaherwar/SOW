import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { actionCustomWorkPackagePublish } from "../../Redux/Actions/CustomModulesSidePanel";
import { parseInteger } from "../E3TForm/e3tFormData";

const CustomTypeOfWorkList = ({
  customDropDown,
  selectedTypeOfWork,
  setSelectedTypeOfWork,
  isView,
}) => {
  const [isDisabled, setIsDisabled] = useState({});
  const dispatch = useDispatch();

  const handlePublishClicked = (id) => (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      dispatch(actionCustomWorkPackagePublish(id, true));
    }
  };

  const handleUnPublishClicked = (id) => (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      dispatch(actionCustomWorkPackagePublish(id, false));
    }
  };
  return (
    <div className="d-flex flex-column pt-1">
      {customDropDown.map((tow, index) => (
        <div
          key={`${tow.id}_${tow.typeOfWork}_${index}_selection`}
          className="form-check py-2 d-flex flex-row align-items-center"
        >
          <div className="view-grid grid-column w-100">
            <input
              checked={selectedTypeOfWork.indexOf(tow.id) > -1}
              onChange={(e) => {
                setIsDisabled((prev) => ({
                  ...prev,
                  [tow.typeGrouping]: {
                    selectedId: tow.id,
                    checked: e.target.checked,
                  },
                }));
                setSelectedTypeOfWork(tow.id);
              }}
              type="checkbox"
              disabled={
                isView ||
                (isDisabled[tow.typeGrouping]?.checked &&
                  tow.typeGrouping > 0 &&
                  isDisabled[tow.typeGrouping]?.selectedId !== tow.id)
              }
              className="mr-2"
              id={`${tow.id}_${tow.typeOfWork}_${index}_selection`}
            />
            <label
              className={`form-check-label clear_background submodule_header
                 ${
                   selectedTypeOfWork.indexOf(tow.id) > -1
                     ? "type_of_work_selected"
                     : ""
                 }
                `}
              htmlFor={`${tow.id}_${tow.typeOfWork}_${index}_selection`}
            >
              {tow.typeOfWork}
            </label>
            {tow.createdBy === Cookies.get("name") ? (
              tow.isPublished ? (
                // <></>
                <i
                  role="button"
                  title="Un Publish"
                  onClick={handleUnPublishClicked(tow.id)}
                  className={`fas fa-times icon-large-size little-right  ${
                    selectedTypeOfWork.indexOf(tow.id) > -1
                      ? "type_of_work_selected"
                      : ""
                  }`}
                />
              ) : (
                // <i
                //   role="button"
                //   onClick={handlePublishClicked(tow.id)}
                //   className="ml-3 fa fa-cloud-upload-alt"
                // />
                <i
                  role="button"
                  name={tow.id}
                  title="Publish"
                  onClick={handlePublishClicked(tow.id)}
                  className={`fa fa-cloud-upload-alt icon-large-size  ${
                    selectedTypeOfWork.indexOf(tow.id) > -1
                      ? "type_of_work_selected"
                      : ""
                  }`}
                  // className="fa fa-cloud-upload-alt icon-large-size"
                  // className="ml-3 fas fa-arrow-alt-square-up"
                />
              )
            ) : (
              <div />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomTypeOfWorkList;
