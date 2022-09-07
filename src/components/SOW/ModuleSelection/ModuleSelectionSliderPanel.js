import React, { useState, useEffect, useRef, useMemo } from "react";
import ModuleNamesList from "./ModuleNamesList";
import ModulesSearchComponent from "./ModulesSearchComponent";
import ModuleSubPackages from "./ModuleSubPackages";
import ShowLoading from "./ShowLoading";

const ModuleSelectionSliderPanel = (props) => {
  const getModules = () => props.solutionHubDropdown.map((dd) => dd.typeOfWork);
  const modulesOb = useMemo(
    () =>
      props.solutionHubDropdown.reduce((ob, dd) => {
        return { ...ob, [dd.typeOfWork]: dd.sowSolutionHubWorkPackages };
      }, {}),
    [props.solutionHubDropdown]
  );

  const timeoutRef = useRef(null);
  const [myModules, setMyModules] = useState(getModules());
  const [searchQuery, setSearchQuery] = useState(" ");
  const [loading, setLoading] = useState(true);

  const doSearch = () => {
    if (searchQuery.length === 0) {
      setMyModules(getModules());
    } else {
      const modules = getModules();

      let filtered = props.solutionHubDropdown
        .filter(
          (m) =>
            m.typeOfWork.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        )
        .map((e) => e.typeOfWork);

      if (props.showEnabled) {
        const old = [];
        props.solutionHubDropdown.forEach((dd) => {
          if (props.selectedTypeOfWork.indexOf(dd.id) > -1) {
            old.push(dd.typeOfWork);
          }
        });

        filtered = [...filtered, ...old];
      }

      setMyModules(filtered);
      if (searchQuery === " ") {
        setSearchQuery("");
      }
    }
  };

  useEffect(() => {
    if (!props.show) {
      setLoading(true);
    } else if (props.solutionHubDropdownLoaded === true && loading === true) {
      setLoading(false);
      setMyModules(getModules());
    }
  }, [props.solutionHubDropdownLoaded, props.show]);

  useEffect(() => {
    // Debouncing the search.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(doSearch, 300);
  }, [searchQuery]);

  useEffect(() => {
    setTimeout(() => {
      setMyModules(getModules());
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    props.toggle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleSolutionHubApply(props.selectedWorkPackages);
    props.toggle();
  };

  const handleReset = () => {
    props.setSelectedTypeOfWork([]);
    props.setSelectedWorkPackages([]);
  };

  if (loading && props.show) {
    return <ShowLoading />;
  }
  return (
    <>
      {props.show && (
        <div className="module_slider_click" id="sowslide">
          <button
            onClick={handleClose}
            className="close close_button_modules_popup"
            aria-label="Close"
          >
            <span>&times;</span>
          </button>
          <div id="slidersow">
            <div className="col-12 mt-3">
              <h5 className="slider_header">Select from Predefined Modules</h5>
            </div>
          </div>

          <div className="module_selection_grid px-1">
            <div className="grid_modules p-2">
              <ModulesSearchComponent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <ModuleNamesList
                modules={myModules}
                modulesOb={modulesOb}
                solutionHubDropdown={props.solutionHubDropdown}
                selectedTypeOfWork={props.selectedTypeOfWork}
                setSelectedTypeOfWork={props.setSelectedTypeOfWork}
                setSelectedWorkPackages={props.setSelectedWorkPackages}
              />
            </div>
            <div className="grid_selection border-left p-2">
              <ModuleSubPackages
                modulesOb={modulesOb}
                solutionHubDropdown={props.solutionHubDropdown}
                selectedWorkPackages={props.selectedWorkPackages}
                setSelectedWorkPackages={props.setSelectedWorkPackages}
                selectedTypeOfWork={props.selectedTypeOfWork}
              />
              <div className="button-container">
                <button
                  onClick={handleSubmit}
                  className="mr-1 btn btn-success hpe-green-background"
                >
                  Submit
                </button>
                <button onClick={handleReset} className="btn btn-secondary">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModuleSelectionSliderPanel;
