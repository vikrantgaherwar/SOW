import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import {
  map,
  each,
  find,
  trim,
  filter,
  orderBy,
  isEmpty,
  includes,
  camelCase,
  isNumber,
} from "lodash";
import { saveAs } from "file-saver";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tabs, Tab, Row, Col } from "react-bootstrap";

import Header from "./Header";
// import Footer from "./Footer";
import Preview from "./Preview";
import URLConfig from "../URLConfig";
import DynamicData from "./DynamicData";
import PricingData from "./PricingData";
import StandardData from "./StandardData";
import ModuleSelectionSlider from "./ModuleSelection/ModuleSelectionSlider";
import ModuleSelectionSliderPanel from "./ModuleSelection/ModuleSelectionSliderPanel";
import {
  DYNAMIC,
  PREVIEW,
  SOW_TEMPLATE,
  STANDARD,
  PRICING,
  OPP_ID,
  ACCOUNT_NAME,
} from "./Constants";
import PricingTab from "./PricingTab/PricingTab";
import {
  generateBlankState,
  getDefaultResourceTableRow,
  parseFloating,
} from "./PricingTab/PricingFormFields";
import PricingTabService from "./PricingTab/Service";
import { mapDataToArray } from "./PricingTab/utils/dataMapper";
import { round } from "../../utils/math";
import "./AxiosUtils";
import { getSkuTableValue } from "./dynamicData.support";
export const ResourceTypeSelectionContext = React.createContext();

const SOW = (props) => {
  /* handle resourceType selection */
  const [isResourceTypeSelected, setResourceTypeSelected] = useState(false);
  const signal = axios.CancelToken.source();
  const [activeKey, setActiveKey] = useState(STANDARD);
  const [standardLoader, setStandardLoader] = useState(true);
  const [pricingLoader, setPricingLoader] = useState(false);
  const [dynamicLoader, setDynamicLoader] = useState(true);
  const [previewLoader, setPreviewLoader] = useState(true);

  const [baseData, setBaseData] = useState({});
  const [solutionHubDropdown, setSolutionHubDropdown] = useState([]);
  const [solutionHubDropdownLoaded, setSolutionHubDropdownLoaded] =
    useState(false);
  const [standardFields, setStandardFields] = useState({});
  const [templateFields, setTemplateFields] = useState([]);

  const [selectedWorkPackages, setSelectedWorkPackages] = useState([]);
  const [selectedTypeOfWork, setSelectedTypeOfWork] = useState([]);
  const [solutionHubData, setSolutionHubData] = useState([]);

  const [generatedSOW, setGeneratedSOW] = useState({});
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [isEdit, setIsEdit] = useState(false);
  const [standardFieldsLogData, setStandardFieldsLogData] = useState([]);
  const [transactionLogData, setTransactionLogData] = useState([]);
  const [solutionHubLogData, setSolutionHubLogData] = useState([]);
  const [predefinedModuleLogData, setPredefinedModuleLogData] = useState([]);
  const [workPackageSectionData, setWorkPackageSectionData] = useState([]);

  const [templateMapping, setTemplateMapping] = useState([]);
  const [templateMappingFields, setTemplateMappingFields] = useState([]);

  const [showSlider, setShowSlider] = useState(false);
  const [generatedSOWHistory, setGeneratedSOWHistory] = useState([]);

  const [showModuleSliderPanel, setShowModuleSliderPanel] = useState(false);

  const [initLoad, setInitLoad] = useState(false);
  const [solutionHubDataLoading, setSolutionHubDataLoading] = useState(false);

  const [e3tFormState, setE3TFormState] = useState(generateBlankState());
  const [e3TResourceDropDown, setE3TResourceDropDown] = useState([]);

  const [e3TRegionalData, setE3TRegionalData] = useState([]);
  const e3tFormPreviousState = useRef(generateBlankState());
  const previousTemplateRef = useRef(-1);
  const e3tFormKeysRef = useRef(
    Object.keys(e3tFormState).filter(
      (k) =>
        [
          "softwareDescription",
          "hardwareDescription",
          "thirdPartyDescrption",
          "resourceTable",
        ].indexOf(k) === -1
    )
  );

  /* handle work package section data multiple renderings restriction*/
  const [workPkgSectionDataLoadedCount, setWorkPkgSectionDataLoadedCount] =
    useState(0);
  /* counter for number of workPackage rows added*/
  const [workPkgRowCount, setWorkPkgRowCount] = useState(1);
  /* row id to group by according to different workPkgId's*/
  const [workPkgRowId, setWorkPkgRowId] = useState(10000);
  const [skuSelectedValue, setSKUSelectedValue] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (standardFields[SOW_TEMPLATE]) {
      fetchDynamicFields(standardFields[SOW_TEMPLATE]);
    }
  }, [standardFields[SOW_TEMPLATE], transactionLogData]);

  const fetchDynamicFields = async (templateId) => {
    setDynamicLoader(true);
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetDynamicFields";
    try {
      const res = await axios.get(URL, { params: { templateId } });
      if (res?.data) {
        setBaseData(res.data);
      }
      if (res?.data?.sowTemplateFields) {
        setTemplateFields(
          // Set Default Values
          res.data.sowTemplateFields
          // setDefaultDynamicFieldValues(res.data.sowTemplateFields)
        );
      }
      if (res?.data?.sowSections) {
        setSections(orderBy([...res.data.sowSections], ["displayOrder"]));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDynamicLoader(false);
    }
  };

  useEffect(() => {
    fetchGeneratedSOWHistory(signal.token);
    fetchE3TResourceDropDown();
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  useEffect(() => {
    if (standardFields[SOW_TEMPLATE]) {
      const id = isNumber(standardFields[SOW_TEMPLATE])
        ? standardFields[SOW_TEMPLATE]
        : parseInt(standardFields[SOW_TEMPLATE]);

      if (
        id !== previousTemplateRef.current &&
        previousTemplateRef.current !== -1
      ) {
        // reset
        setSelectedTypeOfWork([]);
        setSelectedWorkPackages([]);
      }

      previousTemplateRef.current = id;
      fetchSolutionHubDropdown(standardFields[SOW_TEMPLATE]);
      fetchWorkPackageSectionData(standardFields[SOW_TEMPLATE]);
    }
  }, [standardFields[SOW_TEMPLATE]]);

  useEffect(() => {
    const { resourceTable } = e3tFormState;
    if (resourceTable.length === 0) {
      setE3TFormState((state) => {
        return { ...state, resourceTable: [] };
      });
    }
  }, [e3tFormState.resourceTable]);

  useEffect(() => {
    setShowModuleSliderPanel(false);
  }, [activeKey]);

  useEffect(() => {
    const newState = { ...e3tFormState };
    const {
      totalResourceCost,
      hardware,
      software,
      travel,
      thirdParty,
      riskReserve,
      egm,
    } = newState;
    let shouldCalc = false;
    e3tFormKeysRef.current.forEach((k) => {
      if (e3tFormState[k] !== e3tFormPreviousState.current[k]) {
        // do calc
        shouldCalc = true;
      }
    });
    if (shouldCalc) {
      const total =
        parseFloating(totalResourceCost) +
        parseFloating(hardware) +
        parseFloating(software) +
        parseFloating(travel) +
        parseFloating(thirdParty);

      const risk = parseFloating(riskReserve);
      const eg = parseFloating(egm);

      const totalCostWithRiskReserve = total * (1 + risk / 100);
      newState.total = total.toFixed(2);
      newState.totalCostWithRiskReserve = totalCostWithRiskReserve.toFixed(2);
      const denominator = 1 - eg / 100;

      const tcvF = totalCostWithRiskReserve / denominator;
      const tcv = round(tcvF, 2);
      newState.totalContractValue = tcv.toFixed(2);

      setE3TFormState(newState);
    }
    e3tFormPreviousState.current = { ...newState };
  }, [e3tFormState]);

  useEffect(() => {
    const id = props?.match?.params["id"];
    if (id) {
      setIsEdit(true);
      /* make initload false to get predefinedLogs*/
      setInitLoad(false);
      fetchStandardFieldsLogData(id);
      fetchTransactionLogData(id);
      fetchSolutionHubLogData(id);
      fetchE3THistoryData(id);
    } else {
      setIsEdit(false);
      setStandardFieldsLogData([]);
      setTransactionLogData([]);
      setSolutionHubLogData([]);
    }
    setSelectedWorkPackages([]);
  }, [props.match.params["id"]]);

  useEffect(() => {
    const id = props?.match?.params["id"];
    if (
      isEdit &&
      standardFields[SOW_TEMPLATE] &&
      !isEmpty(solutionHubDropdown) &&
      !initLoad
    ) {
      fetchPredefinedModuleLogData(id, signal.token);
      setInitLoad(true);
    }
    /* solutionHubLog when loads then check for latest predefinedModules*/
  }, [
    isEdit,
    solutionHubLogData,
    solutionHubDropdown,
    standardFields[SOW_TEMPLATE],
  ]);

  useEffect(() => {
    if (templateMapping.length > 0 && templateMappingFields.length > 0) {
      each(templateMapping, (item) => {
        each(item.sowTemplateFieldsMappings, (mapping) => {
          const parentId = mapping.parentTemplateFieldId;
          const linkedId = mapping.linkedTemplateFieldId;
          const linkedTemplateField = find(
            templateMappingFields,
            (template) => item.linkedTemplateId === template.id
          );
          const linkedField = find(
            linkedTemplateField?.sowTemplateFields,
            (field) => field.id === linkedId
          );
          setTemplateFields((templateFields) =>
            map(templateFields, (field) => {
              if (field.id === parentId) {
                switch (field.contentControlType) {
                  case "table": {
                    if (linkedField?.fieldDefaultValue) {
                      return {
                        ...field,
                        tableValue: JSON.parse(
                          linkedField.fieldDefaultValue,
                          function (k, v) {
                            if (isNaN(k) && k !== camelCase(k)) {
                              this[camelCase(k)] = v;
                            } else {
                              return v;
                            }
                          }
                        ),
                      };
                    }
                    return { ...field, tableValue: [] };
                  }
                  case "textarea": {
                    if (linkedField?.fieldHtmlDefaultValue) {
                      return {
                        ...field,
                        value: linkedField?.fieldHtmlDefaultValue,
                      };
                    }
                  }
                  default: {
                    if (trim(linkedField?.fieldDefaultValue)) {
                      return { ...field, value: linkedField.fieldDefaultValue };
                    }
                  }
                }
                return { ...field, value: linkedField.fieldDefaultValue };
              }
              return { ...field };
            })
          );
        });
      });
    }
  }, [templateMapping, templateMappingFields]);

  const fetchE3TResourceDropDown = async () => {
    try {
      const res = await PricingTabService.fetchResourceTypeData();
      setE3TResourceDropDown(
        map(res, (r) => ({
          id: r.id,
          resourceType: r.resourceType,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchE3THistoryData = async (id) => {
    try {
      const res = await PricingTabService.fetchE3THistoryPricingData(id);

      if (res && res.length > 0) {
        const ob = {};
        each(res, (rec) => {
          if (rec["fieldName"] === "resourceTable") {
            ob[rec["fieldName"]] = JSON.parse(rec["tableValue"]);
          } else {
            ob[rec["fieldName"]] = rec["fieldValue"];
          }
        });

        setE3TFormState(ob);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchE3TRegionalData = async (country, productLine) => {
    try {
      const res = await PricingTabService.fetchE3TData(country, productLine);
      setE3TRegionalData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSolutionHubDropdown = async (templateId) => {
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubDropdown";
    try {
      const res = await axios.get(URL, {
        params: {
          templateId,
          // Need to Remove this later
          prodFlag: `${process.env.REACT_APP_ENV === "PROD" ? "1" : "0"}`,
        },
      });
      if (res?.data) {
        setSolutionHubDropdown(processSolutionHubDropdownData(res.data));
        setSolutionHubDropdownLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const processSolutionHubDropdownData = (solutionHubDropdownData) => {
    return orderBy(
      filter(
        map(solutionHubDropdownData, (work) => {
          if (work?.sowSolutionHubWorkPackages?.length > 0) {
            return {
              ...work,
              sowSolutionHubWorkPackages: filter(
                work.sowSolutionHubWorkPackages,
                (item) => item?.sowSolutionHubData?.length > 0
              ),
            };
          }
          return { ...work };
        }),
        (item) => item?.sowSolutionHubWorkPackages?.length > 0
      ),
      ["displayOrder"]
    );
  };

  const fetchGeneratedSOWHistory = async () => {
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetGeneratedSOWHistory";
    const createdBy = Cookies.get("name");
    try {
      const res = await axios.get(URL, { params: { createdBy } });
      if (res?.data) {
        setGeneratedSOWHistory(orderBy(res.data, ["id"], ["desc"]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStandardFieldsLogData = async (sowGeneratedId) => {
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetStandardFieldsLogData";
    try {
      const res = await axios.get(URL, { params: { sowGeneratedId } });
      if (res?.data) {
        setStandardFieldsLogData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransactionLogData = async (sowGeneratedId) => {
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetTransactionLogData";
    try {
      const res = await axios.get(URL, { params: { sowGeneratedId } });
      if (res?.data) {
        setTransactionLogData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPredefinedModuleLogData = async (sowGeneratedId) => {
    const URL =
      URLConfig.getURLDeltaSOWAPI() + "SOW/GetPredefinedModuleLogData";
    try {
      const res = await axios.get(URL, { params: { sowGeneratedId } });
      if (
        res?.data?.predefinedModuleSelectedValue &&
        JSON.parse(res?.data?.predefinedModuleSelectedValue).length > 0
      ) {
        const parsedValue = JSON.parse(
          res?.data?.predefinedModuleSelectedValue,
          function (k, v) {
            if (isNaN(k) && k !== camelCase(k)) {
              this[camelCase(k)] = v;
            } else {
              return v;
            }
          }
        );
        /* reset count to reset solutionHubData */
        setWorkPkgSectionDataLoadedCount(() => 0);
        setPredefinedModuleLogData(parsedValue);
        setSelectedWorkPackages(parsedValue);
        getSolutionHubData(parsedValue);

        let tow = [];

        solutionHubDropdown.forEach((dd) => {
          const workPackages = dd.sowSolutionHubWorkPackages;

          workPackages.forEach((workPackage) => {
            if (parsedValue.indexOf(workPackage.id) > -1) {
              tow = tow.indexOf(dd.id) > -1 ? tow : [...tow, dd.id];
            }
          });
        });

        setSelectedTypeOfWork(tow);

        // setSelectedTypeOfWork(tow)

        // fetchSolutionHubData(
        //   standardFields[SOW_TEMPLATE],
        //   parsedValue
        // );
      } else {
        /* reset count to reset solutionHubData */
        setWorkPkgSectionDataLoadedCount(() => 0);
        setWorkPkgRowCount(() => 1);
        setWorkPkgRowId(() => 10000);
        /* reset predefinedModuleLogData for change detection for solutionHubData change in dynamic.js*/
        setPredefinedModuleLogData(() => []);
        /* reset solutionHubDropdown */
        setSelectedTypeOfWork(() => []);
        setSelectedWorkPackages(() => []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSolutionHubLogData = async (sowGeneratedId) => {
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubLogData";
    try {
      const res = await axios.get(URL, { params: { sowGeneratedId } });
      if (res?.data) {
        setSolutionHubLogData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWorkPackageSectionData = async (templateId) => {
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetWorkPackageSectionData";
    try {
      const res = await axios.get(URL, { params: { templateId } });
      if (res?.data) {
        setWorkPackageSectionData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSolutionHubApply = (selectedWorkPackages = []) => {
    if (isEmpty(selectedWorkPackages)) {
      setWorkPkgRowCount(() => 1);
      setWorkPkgRowId(() => 10000);
    }
    getSolutionHubData(selectedWorkPackages);
    fetchTemplateMapping(standardFields[SOW_TEMPLATE]);
  };

  const getSolutionHubData = (selectedWorkPackages) => {
    let newSolutionHubData = [];
    each(solutionHubDropdown, (item) => {
      each(item?.sowSolutionHubWorkPackages, (workpack) => {
        if (includes(selectedWorkPackages, workpack?.id)) {
          each(workpack?.sowSolutionHubData, (data) => {
            newSolutionHubData = [
              ...newSolutionHubData,
              {
                ...data,
                priorityOrder: workpack.priorityOrder,
                displayOrder: workpack.displayOrder,
                workPackage: workpack?.workPackage,
                typeOfWork: item?.typeOfWork,
              },
            ];
          });
        }
      });
    });
    setWorkPkgSectionDataLoadedCount(() => 0);
    setSolutionHubData(
      setDefaultValues([
        ...orderBy(newSolutionHubData, [
          "priorityOrder",
          "typeOfWorkId",
          "displayOrder",
        ]),
      ])
    );
  };

  useEffect(() => {
    if (standardFields.country && standardFields.productLine) {
      fetchE3TRegionalData(standardFields.country, standardFields.productLine);
    }
  }, [standardFields.country, standardFields.productLine]);

  useEffect(() => {
    setE3TFormState(generateBlankState());
    e3tFormPreviousState.current = generateBlankState();
  }, [standardFields[OPP_ID]]);

  // const fetchSolutionHubData = async (
  //   templateId,
  //   selectedWorkPackages,
  // ) => {
  //   setSolutionHubDataLoading(true);
  //   const URL =
  //     URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubData";
  //   const data = [...selectedWorkPackages];
  //   try {
  //     const res = await axios.post(URL, data, { params: {templateId} });
  //     if (res?.data) {
  //       /* reset count for work package section data with updated solutionHub Data */
  //       setWorkPkgSectionDataLoadedCount(() => 0);

  //       setSolutionHubData(setDefaultValues([...res.data]));
  //       setSolutionHubDataLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setSolutionHubDataLoading(false);
  //   }
  // };

  const setDefaultValues = (data) => {
    return map(data, (field) => {
      // if (isEdit && predefinedModuleLogData.length > 0) {
      //   const matchingLog = find(
      //     solutionHubLogData,
      //     (data) => field.id === data.sowSolutionHubDataId
      //   );
      //   // if (matchingLog?.tableValue) {
      //   //   return { ...field, value: matchingLog.tableValue };
      //   // } else {
      //   return { ...field, value: matchingLog?.fieldValue };
      //   // }
      // } else {
      if (field?.fieldDefaultValue || field?.fieldHtmlDefaultValue) {
        switch (field?.fieldType) {
          case "file":
            return { ...field };
          case "textarea": {
            if (field?.fieldHtmlDefaultValue) {
              return { ...field, value: field.fieldHtmlDefaultValue };
            }
          }
          default:
            return { ...field, value: field?.fieldDefaultValue };
        }
      }
      return { ...field };
      // }
    });
  };

  const fetchTemplateMapping = async (templateId) => {
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetTemplateMapping";
    const data = [...selectedTypeOfWork];
    try {
      const res = await axios.post(URL, data, { params: { templateId } });
      if (res?.data) {
        setTemplateMapping([...res.data]);
        fetchTemplateMappingFields(
          map(res.data, (item) => item.linkedTemplateId),
          signal.token
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const fetchTemplateMappingFields = async (linkedTemplateIds, cancelToken) => {
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetTemplateMappingFields";
    const data = [...linkedTemplateIds];
    try {
      const res = await axios.post(URL, data, { cancelToken });
      if (res?.data) {
        setTemplateMappingFields([...res.data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const uploadFile = async (file) => {
    const URL = URLConfig.getURL_SOW_UploadDocument();
    try {
      const fileData = new FormData();
      fileData.append("files", file);
      const fileUploadRes = await axios.post(URL, fileData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      if (fileUploadRes?.data?.length > 0) {
        return fileUploadRes.data[0];
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const generatePreview = async () => {
    const id = props?.match?.params["id"];
    setPreviewLoader(true);
    setGeneratedSOW({});

    const data = {
      ...baseData,
      createdBy: Cookies.get("name"),
      sowTemplateField: [...templateFields],
      standardField: { ...standardFields },
      predefinedModuleSelectedValue: JSON.stringify(selectedWorkPackages),
      solutionHubData: [...solutionHubData],
      e3tFormState: mapDataToArray(e3tFormState),
    };

    const URL = isEdit
      ? URLConfig.getURL_SOW_UpdateSOW() + "/" + id
      : URLConfig.getURL_SOW_GeneratePreview();
    try {
      const res = await axios.post(URL, data, { cancelToken: signal.token });
      if (res?.data) {
        setGeneratedSOW(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchGeneratedSOWHistory();
      setPreviewLoader(false);
    }
  };

  const downloadGeneratedSOW = async () => {
    setDownloadLoader(true);
    const URL = URLConfig.getURL_SOW_GenerateSOWPdf();
    const data = { ...generatedSOW };
    try {
      const res = await axios.post(URL, data, {
        cancelToken: signal.token,
        responseType: "blob",
        onDownloadProgress: (progressEvent) =>
          setDownloadProgress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          ),
      });
      if (res?.data) {
        saveAs(
          res.data,
          `${data.templateOutputName.split(".").slice(0, -1).join(".")}.pdf`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDownloadLoader(false);
      setDownloadProgress(0);
    }
  };

  const handleSliderClick = () => {
    setShowModuleSliderPanel(false);
    setShowSlider((prevState) => !prevState);
  };

  const toggleModuleSliderPanel = () => {
    setShowSlider(false);
    setShowModuleSliderPanel((prevState) => !prevState);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Header />

      <div id="sowslider" className="slider_pos">
        {activeKey === DYNAMIC && (
          <ModuleSelectionSlider
            visible={activeKey === DYNAMIC}
            toggleSlider={toggleModuleSliderPanel}
          />
        )}
        {/* <div
          onClick={handleSliderClick}
          className="slider_text mt-1 mb-1 pt-2 pb-2 slider-pop"
        >
          SOW History
        </div> */}
      </div>

      <ModuleSelectionSliderPanel
        solutionHubDropdownLoaded={solutionHubDropdownLoaded}
        selectedTypeOfWork={selectedTypeOfWork}
        solutionHubDropdown={solutionHubDropdown}
        selectedWorkPackages={selectedWorkPackages}
        setSelectedTypeOfWork={setSelectedTypeOfWork}
        handleSolutionHubApply={handleSolutionHubApply}
        setSelectedWorkPackages={setSelectedWorkPackages}
        show={showModuleSliderPanel}
        toggle={toggleModuleSliderPanel}
        showEnabled={true}
      />

      {showSlider && (
        <div
          className="slider_click"
          style={{ top: `${activeKey === DYNAMIC ? "145px" : "80px"}` }}
          id="sowslide"
        >
          <div id="slidersow">
            <div className="col-12 mt-3">
              <h5 className="slider_header">SOW History</h5>
            </div>

            <div className="col-12 slider_content">
              {map(generatedSOWHistory, (item) => (
                <div className="col-12 p-0 mt-2" key={item.id}>
                  <div className="col-12 slider_contentheader">
                    <div className="col-12 p-0 mt-2">
                      <ul className="list-unstyled">
                        <li>
                          <strong>
                            <a
                              className="pointer"
                              onClick={() => {
                                handleSliderClick();
                                props.history.push(`/sow-old/${item.id}`);
                              }}
                            >
                              {item.templateOutputName}
                            </a>
                          </strong>
                        </li>
                        <li>
                          Created Date:{" "}
                          {moment(item.createdDate, moment.ISO_8601).format(
                            "YYYY-MM-DD"
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container pt-3">
        <Row bsPrefix="row mb-2">
          <Col sm={8}>
            <h4>Solution 360 (POC)</h4>
          </Col>
          {/* {activeKey === DYNAMIC && (
            <SolutionHubDropdown
              selectedTypeOfWork={selectedTypeOfWork}
              solutionHubDropdown={solutionHubDropdown}
              selectedWorkPackages={selectedWorkPackages}
              setSelectedTypeOfWork={setSelectedTypeOfWork}
              handleSolutionHubApply={handleSolutionHubApply}
              setSelectedWorkPackages={setSelectedWorkPackages}
            />
          )} */}
        </Row>
        <hr className="sow-titleline" />
        <Tabs
          id="controlled-tab-example"
          activeKey={activeKey}
          // onSelect={(selectedKey) => setActiveKey(selectedKey)}
        >
          <Tab
            eventKey={STANDARD}
            title={
              <>
                <i
                  className="fas fa-database mr-2"
                  style={{ color: "#0d5265" }}
                />
                Customer Data
              </>
            }
          >
            <StandardData
              isEdit={isEdit}
              loader={standardLoader}
              setActiveKey={setActiveKey}
              setLoader={setStandardLoader}
              standardFields={standardFields}
              setStandardFields={setStandardFields}
              standardFieldsLogData={standardFieldsLogData}
              setSKUSelectedValue={setSKUSelectedValue}
              skuSelectedValue={skuSelectedValue}
            />
          </Tab>
          {/* Need to Remove this later */}
          {process.env.REACT_APP_ENV === "UAT" && (
            <Tab
              eventKey={PRICING}
              title={
                <>
                  <i className="fas fa-calculator" /> Pricing &amp; Costing
                </>
              }
            >
              <ResourceTypeSelectionContext.Provider
                value={{ setResourceTypeSelected }}
              >
                <PricingTab
                  loader={pricingLoader}
                  setActiveKey={setActiveKey}
                  formState={e3tFormState}
                  setFormState={setE3TFormState}
                  resourceDropDownData={e3TResourceDropDown}
                  regionalData={e3TRegionalData}
                  isResourceTypeSelected={isResourceTypeSelected}
                />
              </ResourceTypeSelectionContext.Provider>
            </Tab>
          )}
          <Tab
            eventKey={DYNAMIC}
            title={
              <>
                <i className="fas fa-server mr-2" />
                Dynamic Data
              </>
            }
          >
            {activeKey === DYNAMIC && (
              <DynamicData
                isEdit={isEdit}
                baseData={baseData}
                sections={sections}
                setSections={setSections}
                loader={dynamicLoader}
                uploadFile={uploadFile}
                setBaseData={setBaseData}
                setActiveKey={setActiveKey}
                setLoader={setDynamicLoader}
                standardFields={standardFields}
                templateFields={templateFields}
                solutionHubData={solutionHubData}
                generatePreview={generatePreview}
                setTemplateFields={setTemplateFields}
                transactionLogData={transactionLogData}
                solutionHubLogData={solutionHubLogData}
                setSolutionHubData={setSolutionHubData}
                workPackageSectionData={workPackageSectionData}
                predefinedModuleLogData={predefinedModuleLogData}
                e3tFormState={e3tFormState}
                e3TRegionalData={e3TRegionalData}
                setWorkPkgSectionDataLoadedCount={
                  setWorkPkgSectionDataLoadedCount
                }
                workPkgSectionDataLoadedCount={workPkgSectionDataLoadedCount}
                setWorkPkgRowCount={setWorkPkgRowCount}
                workPkgRowCount={workPkgRowCount}
                solutionHubDataLoading={solutionHubDataLoading}
                setWorkPkgRowId={setWorkPkgRowId}
                workPkgRowId={workPkgRowId}
                selectedWorkPackages={selectedWorkPackages}
                skuSelectedValue={skuSelectedValue}
              />
            )}
          </Tab>
          <Tab
            eventKey={PREVIEW}
            title={
              <>
                <i className="fas fa-eye mr-2" />
                Preview
              </>
            }
          >
            {activeKey === PREVIEW && (
              <Preview
                isEdit={isEdit}
                loader={previewLoader}
                setActiveKey={setActiveKey}
                generatedSOW={generatedSOW}
                setLoader={setPreviewLoader}
                downloadLoader={downloadLoader}
                downloadProgress={downloadProgress}
                downloadGeneratedSOW={downloadGeneratedSOW}
              />
            )}
          </Tab>
        </Tabs>
      </div>
      {/* <Footer /> */}
    </DndProvider>
  );
};

export default SOW;
