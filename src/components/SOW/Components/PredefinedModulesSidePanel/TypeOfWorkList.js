import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { actionSetTowDisabled } from "../../Redux/Actions/ModulesSidePanel";

const TypeOfWorkList = ({
  solutionHubDropDown,
  selectedTypeOfWork,
  setSelectedTypeOfWork,
  isView,
  isEditable,
  towDisabled,
}) => {
  // const [isDisabled, setIsDisabled] = useState({});
  useEffect(() => {
    if (isEditable) {
      solutionHubDropDown
        .filter((f) => selectedTypeOfWork.indexOf(f.id) > -1)
        .map((tow) => {
          dispatch(actionSetTowDisabled({ tow, checked: true }));
        });
    }
  }, []);
  const dispatch = useDispatch();
  return (
    <div className="d-flex flex-column pt-1">
      {solutionHubDropDown.map((tow, index) => (
        <div
          key={`${tow.id}_${tow.typeOfWork}_${index}_selection`}
          className="form-check py-2 d-flex flex-row align-items-center"
        >
          <input
            checked={selectedTypeOfWork.indexOf(tow.id) > -1}
            onChange={(e) => {
              // setIsDisabled((prev) => ({
              //   ...prev,
              //   [tow.typeGrouping]: {
              //     selectedId: tow.id,
              //     checked: e.target.checked,
              //   },
              // }));
              dispatch(
                actionSetTowDisabled({ tow, checked: e.target.checked })
              );
              setSelectedTypeOfWork(tow.id);
            }}
            type="checkbox"
            disabled={
              isView ||
              (towDisabled[tow.typeGrouping]?.checked &&
                tow.typeGrouping > 0 &&
                towDisabled[tow.typeGrouping]?.selectedId !== tow.id)
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

            {/* <i
              role="button"
              className="pl-3 far history-panel-icon-size fa-clone"
              onClick={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }

                console.log({ tow });
              }}
            /> */}
          </label>
        </div>
      ))}
    </div>
  );
};

export default TypeOfWorkList;
