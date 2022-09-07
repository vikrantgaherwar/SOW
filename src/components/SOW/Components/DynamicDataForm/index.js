import { Fragment, useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  actionDynamicDataFieldsTableValueChanged,
  actionDynamicDataFieldValueChanged,
  actionMultpleValueChanged,
} from "../../Redux/Actions/DynamicDataFields";
import { showCustomModules } from "../../Redux/utils/showCustomModules";
import DynamicDataAccordian from "../DynamicDataAccordian";
import DynamicDataFormFields from "../DynamicDataFormFields";
import WorkPackageSection from "../WorkPackageSection";
import LoadingComponent from "../LoadingComponent";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";

const DynamicDataForm = ({ isView }) => {
  const {
    fields,
    state,
    sectionData,
    showCustomModule,
    wpPkgSectionDataLoad,
    e3tCostingEstimationFetchState,
    resourceTableLength
  } = useSelector((state) => ({
    fields: state.dynamicFields.fields,
    sectionData: state.masterDropDown.workPackageSectionData,
    state: state.dynamicData,
    showCustomModule: showCustomModules(state),
    wpPkgSectionDataLoad: state.dynamicData.wpSectionDataLoad,
    e3tCostingEstimationFetchState: state.e3tData.e3tCostingEstimationFetchState,
    resourceTableLength: state.e3t.resourceTable.length
  }));
  
  const dispatch = useDispatch();
  const [sectionObj, setSectionObj] = useState({});
  const [collapse, setCollapse] = useState(false);
  const [collapseIndex, setCollapseIndex] = useState(0);

  const handleFieldChange = useCallback((name, value) => {
    dispatch(actionDynamicDataFieldValueChanged(name, value));
  });

  const handleMultipleFieldChange = useCallback((name, value) => {
    dispatch(actionMultpleValueChanged(name, value));
  });

  useEffect(() => {
    var index = 0;
    fields.map((f) => {
      if (f.sectionName) {
        setSectionObj((prevState) => ({ ...prevState, [f.id]: false }));
        if (index === 0) {
          index = f.id;
          setCollapseIndex(f.id);
        }
      }
    });
  }, [fields]);

  const handleSectionToggle = (id) => {
    setSectionObj((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleTableValueChange = useCallback(
    (tableName, fieldName, value, id) => {
      dispatch(
        actionDynamicDataFieldsTableValueChanged(
          tableName,
          fieldName,
          value,
          id
        )
      );
    }
  );

  const handleToggleExpandCollapse = (e) => {
    const toggleCollapse = !collapse;
    setCollapse(toggleCollapse);
    fields.map((f) => {
      if (f.sectionName) {
        setSectionObj((prevState) => ({
          ...prevState,
          [f.id]: toggleCollapse,
        }));
      }
    });
  };

  // console.log("sectionObj", sectionObj);

  useEffect(() => {
    if (e3tCostingEstimationFetchState === APIFetchStatus.FETCHING) {
      toast.success("Pricing and Costing changed !");
    }
  }, [e3tCostingEstimationFetchState]);
  return (
    <>
      {fields.map((field, index) => {
        if (field.sectionName) {
          return (
            <Fragment key={`${field.id}_${field.sectionName}`}>
              {field.id == collapseIndex && (
                <div className="col-md-12 text-right sticky-top">
                  <Button
                    bsPrefix="btn btn-success btn-sm action-button"
                    onClick={handleToggleExpandCollapse}
                    title={collapse ? "Collapse All" : "Expand All"}
                  >
                    {collapse ? (
                      <>
                        <i className="fas fa-chevron-down fa-xs pr-1" />
                        Collapse All
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chevron-right fa-xs pr-1" />
                        Expand All
                      </>
                    )}
                  </Button>
                </div>
              )}
              <DynamicDataAccordian
                isView={isView}
                handleSectionToggle={handleSectionToggle}
                sectionObj={sectionObj}
                idx={field.id}
                key={`${field.id}_${field.sectionName}`}
                title={field.sectionName}
                hasButton={
                  showCustomModule === false
                    ? false
                    : sectionData.length > 0
                    ? field.id === sectionData[0].sectionId
                    : false
                }
                values={state[field.children[0]["fieldName"]]}
                name={field.children[0]["fieldName"]}
              >
                <Fragment key={`dynamic-data-${index}-${field.sectionName}`}>
                  {/* <PageTitle title={field.sectionName} small /> */}

                  {wpPkgSectionDataLoad === APIFetchStatus.FETCHING &&
                  sectionData.length > 0 &&
                  sectionData[0] &&
                  field.id === sectionData[0].sectionId ? (
                    <LoadingComponent />
                  ) : field.id === sectionData[0]?.sectionId ? (
                    <WorkPackageSection
                      isView={isView}
                      child={field.children[0]}
                      value={state[field.children[0]["fieldName"]]}
                    />
                  ) : (
                    <>
                      {field.children.map((child, idx) => {
                        return (
                          <DynamicDataFormFields
                            isView={isView}
                            {...child}
                            value={state[child.fieldName]}
                            resourceTableLength={resourceTableLength}
                            key={`dynamic-data-${index}-${child.fieldName}-${idx}`}
                            handleFieldChange={handleFieldChange}
                            handleTableValueChange={handleTableValueChange}
                            handleMultipleFieldChange={
                              handleMultipleFieldChange
                            }
                          />
                        );
                      })}
                    </>
                  )}

                  {field.helperText && (
                    <>
                      <p
                        className="text-muted border-top mt-2 pt-2"
                        dangerouslySetInnerHTML={{ __html: field.helperText }}
                      />
                    </>
                  )}
                </Fragment>
              </DynamicDataAccordian>
            </Fragment>
          );
        }

        return (
          <DynamicDataFormFields
            {...field}
            isView={isView}
            value={state[field.fieldName]}
            state={state}
            key={`dynamic-data-${index}-${field.fieldName}`}
            handleFieldChange={handleFieldChange}
            handleTableValueChange={handleTableValueChange}
          />
        );
      })}
      <ToastContainer />
    </>
  );
};

export default DynamicDataForm;
