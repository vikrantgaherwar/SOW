import { useEffect } from "react";

const ModuleNamesList = ({
  modules,
  modulesOb,
  solutionHubDropdown,
  selectedTypeOfWork,
  setSelectedTypeOfWork,
  setSelectedWorkPackages,
}) => {
  const getId = (mod) => {
    const find = solutionHubDropdown.find((ele) => ele.typeOfWork === mod);
    return find?.id;
  };

  return (
    <div className="d-flex flex-column">
      {modules.map((mod, index) => (
        <div
          key={`${mod}_${index}_selection`}
          className="form-check py-2 d-flex flex-row align-items-center"
        >
          <input
            checked={selectedTypeOfWork.indexOf(getId(mod)) > -1}
            onChange={() => {
              const id = getId(mod);

              if (selectedTypeOfWork.indexOf(id) === -1) {
                //new type of work
                const newState = [...selectedTypeOfWork, id];
                const selectedIdWorkPackages = solutionHubDropdown
                  .find((dd) => dd.id === id)
                  ["sowSolutionHubWorkPackages"].map((e) => e.id);

                // console.log({ newState, selectedIdWorkPackages });
                setSelectedTypeOfWork(newState);
                setSelectedWorkPackages((state) => {
                  const nArr = new Set([...state, ...selectedIdWorkPackages]);
                  return [...nArr];
                });
              } else {
                //removing existing type of work
                setSelectedTypeOfWork((state) => state.filter((s) => s !== id));
                setSelectedWorkPackages((state) =>
                  state.filter((s) => !modulesOb[mod].some((e) => e.id === s))
                );
              }
              // selectedTypeOfWork.indexOf(id) === -1
              //   ? setSelectedTypeOfWork((state) => [...state, id])
              //   : setSelectedTypeOfWork((state) =>
              //       state.filter((s) => s !== id)
              //     );
            }}
            type="checkbox"
            className="mr-2"
            id={`${mod}_${index}_selection`}
          />
          <label
            className={`form-check-label clear_background submodule_header ${
              selectedTypeOfWork.indexOf(getId(mod)) > -1
                ? "type_of_work_selected"
                : ""
            }`}
            htmlFor={`${mod}_${index}_selection`}
          >
            {mod}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ModuleNamesList;
