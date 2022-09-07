import React, { Fragment, useEffect, useState } from "react";
import { map, uniq, each, every, filter, includes } from "lodash";

const SolutionHubDropdown = ({
  selectedTypeOfWork,
  solutionHubDropdown,
  selectedWorkPackages,
  setSelectedTypeOfWork,
  handleSolutionHubApply,
  setSelectedWorkPackages,
}) => {
  const [showSolutionDropdown, setShowSolutionDropdown] = useState(false);

  useEffect(() => {
    const tempSelectedTypeOfWork = [];
    each(solutionHubDropdown, (parent) => {
      if (
        every(
          map(parent.sowSolutionHubWorkPackages, (itm) => itm.id),
          (item) => includes(selectedWorkPackages, item)
        )
      ) {
        tempSelectedTypeOfWork.push(parent.id);
      }
    });
    setSelectedTypeOfWork(tempSelectedTypeOfWork);
  }, [selectedWorkPackages]);

  const handleParentCheckChange = (event, parent) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedWorkPackages((prevState) =>
        uniq([
          ...prevState,
          ...map(parent.sowSolutionHubWorkPackages, (item) => item.id),
        ])
      );
    } else {
      setSelectedWorkPackages((prevState) =>
        filter(
          prevState,
          (item) =>
            !includes(
              map(parent.sowSolutionHubWorkPackages, (itm) => itm.id),
              item
            )
        )
      );
    }
  };

  const handleChildCheckChange = (event, childId, parent) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedWorkPackages((prevState) => uniq([...prevState, childId]));
    } else {
      setSelectedWorkPackages((prevState) =>
        filter(prevState, (item) => item !== childId)
      );
    }
  };

  return (
    <div className="col-4">
      <div
        className="form-control form-control-sm pointer"
        onClick={() => {
          setShowSolutionDropdown((prevState) => !prevState);
        }}
      >
        Select from Predefined Modules
        <i className="fas fa-chevron-down float-right" />
      </div>

      {showSolutionDropdown && (
        <div
          className="accordion"
          id="accordionSOW"
          style={{
            position: "absolute",
            width: "100%",
            maxWidth: "350px",
            border: "solid 1px #ccc",
            zIndex: "100",
            backgroundColor: "#FFF !important",
          }}
        >
          <div className="card">
            <div
              className="p-0"
              align="right"
              style={{ position: "relative", zIndex: "1", width: "100%" }}
            >
              <i
                className="far fa-check-circle btn btn-sm btn-success mt-1 mb-1 mr-1 pointer hw"
                onClick={() => {
                  handleSolutionHubApply(selectedWorkPackages);
                  setShowSolutionDropdown(false);
                }}
              />

              <i
                className="far fa-times-circle btn btn-sm btn-danger mt-1 mb-1 mr-2 pointer hw"
                onClick={() => {
                  setSelectedWorkPackages([]);
                  handleSolutionHubApply([]);
                  setShowSolutionDropdown(false);
                }}
              />
            </div>

            {map(solutionHubDropdown, (work, idx) => {
              if (work?.sowSolutionHubWorkPackages?.length > 0)
                return (
                  <Fragment key={work.id}>
                    <div id={"heading" + idx}>
                      <h5 className="mb-0">
                        <input
                          type="checkbox"
                          className="ml-2 mt-1 inputclass"
                          checked={includes(selectedTypeOfWork, work.id)}
                          onChange={(e) => handleParentCheckChange(e, work)}
                        />
                        <button
                          className="btn btn-link collapsed pl-1"
                          type="button"
                          data-toggle="collapse"
                          data-target={"#collapse" + idx}
                          aria-expanded="false"
                          aria-controls={"collapse" + idx}
                        >
                          {work.typeOfWork}
                        </button>
                      </h5>
                    </div>

                    <div
                      id={"collapse" + idx}
                      className="collapse"
                      aria-labelledby={"heading" + idx}
                      data-parent="#accordionSOW"
                      style={{ borderBottom: "none" }}
                    >
                      {map(work.sowSolutionHubWorkPackages, (item) => (
                        <div className="card-body ml-3 pb-1" key={item.id}>
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={includes(selectedWorkPackages, item.id)}
                            onChange={(e) =>
                              handleChildCheckChange(e, item.id, work)
                            }
                          />
                          {item.workPackage}
                        </div>
                      ))}
                    </div>
                  </Fragment>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionHubDropdown;
