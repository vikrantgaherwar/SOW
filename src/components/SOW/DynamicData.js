import React, { useEffect, useState, Fragment, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";
import update from "immutability-helper";
import { useDrop } from "react-dnd";

import {
  Col,
  Row,
  Card,
  Form,
  Modal,
  Button,
  Spinner,
  Accordion,
  Container,
} from "react-bootstrap";
import {
  map,
  ceil,
  find,
  some,
  each,
  last,
  trim,
  split,
  reduce,
  filter,
  groupBy,
  indexOf,
  orderBy,
  isEmpty,
  includes,
  cloneDeep,
  camelCase,
} from "lodash";
// import URLConfig from "../URLConfig";
import DynamicTable from "./DynamicTable";
import { CustomButton, CustomTextField } from "../ui";
import label from "../../assets/label.json";
import ContextAwareToggle from "./ContextAwareToggle";
import {
  ACCOUNT_NAME,
  OPP_ID,
  PREVIEW,
  PRICING,
  SOW_TEMPLATE,
  STANDARD,
} from "./Constants";
import {
  getWorkPackageRowItem,
  checkPredefinedModulesAdd,
  checkPredefinedModulesRemove,
  getSkuTableValue,
} from "./dynamicData.support";
import DynamicRadioCheck from "./DynamicRadioCheck";
import DraftTextField from "./DraftTextField";
import DnDAccordian from "./DnDAccordian";
import HelperText from "./HelperText";
import { parseFloating } from "./PricingTab/PricingFormFields";

const DynamicData = ({
  loader,
  isEdit,
  baseData,
  setLoader,
  uploadFile,
  e3tFormState,
  e3TRegionalData,
  setBaseData,
  setActiveKey,
  standardFields,
  templateFields,
  generatePreview,
  solutionHubData,
  setTemplateFields,
  transactionLogData,
  solutionHubLogData,
  setSolutionHubData,
  workPackageSectionData,
  predefinedModuleLogData,
  setWorkPkgSectionDataLoadedCount,
  workPkgSectionDataLoadedCount,
  setWorkPkgRowCount,
  workPkgRowCount,
  solutionHubDataLoading,
  setWorkPkgRowId,
  workPkgRowId,
  selectedWorkPackages,
  skuSelectedValue,
  sections,
  setSections,
}) => {
  const addSingleWorkPkgToken = axios.CancelToken.source();
  const [errorData, setErrorData] = useState({});
  const [dynamicFields, setDynamicFields] = useState([]);
  const [dynamicSections, setDynamicSections] = useState([]);
  const [dynamicTableFields, setDynamicTableFields] = useState({});

  const [solutionHubSections, setSolutionHubSections] = useState({});
  const [orderSolutionHubSections, setOrderSolutionHubSections] = useState({});

  const [workPkgTitleDialogueOpen, setWorkPkgTitleDialogueOpen] = useState({
    open: false,
    selectedIndex: null,
  });
  const [workPkgTitleDialogueText, setworkPkgTitleDialogueText] = useState("");

  useEffect(() => {
    if (standardFields[SOW_TEMPLATE]) {
      setTemplateFields(setDefaultValues(templateFields));
    }
  }, [standardFields[SOW_TEMPLATE], transactionLogData]);

  /* only for add functionality */
  // useEffect(() => {
  //   if (
  //     standardFields[SOW_TEMPLATE] &&
  //     workPackageSectionData.length > 0 &&
  //     !isEdit &&
  //     isEmpty(solutionHubData)
  //   ) {
  //     getDynamicWorkPkgInputField();
  //   }
  // }, []);

  // const fetchDynamicFields = async (templateId) => {
  //   setLoader(true);
  //   const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetDynamicFields";
  //   try {
  //     const res = await axios.get(URL, { params: { templateId } });
  //     if (res?.data) {
  //       setBaseData(res.data);
  //     }
  //     if (res?.data?.sowTemplateFields) {
  //       setTemplateFields(
  //         // Set Default Values
  //         setDefaultValues(res.data.sowTemplateFields)
  //       );
  //     }
  //     if (res?.data?.sowSections) {
  //       setSections(orderBy([...res.data.sowSections], ["displayOrder"]));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  const setDefaultValues = (fields) => {
    return map(fields, (field) => {
      if (!field?.value) {
        if (isEdit) {
          // OPP ID Carry Forward
          if (includes(field.fieldName, "Opportunity Id")) {
            return { ...field, value: standardFields[OPP_ID] };
          }

          if (includes(field.fieldName, "Opportunity Id")) {
            return { ...field, value: standardFields[OPP_ID] };
          }
          if (includes(field.fieldName, "Currency")) {
            return {
              ...field,
              value:
                e3TRegionalData[0]["sowE3tTsRates"][0]["masterCountry"]["fx"],
            };
          }

          if (includes(field.fieldName, "Consulting Services Price")) {
            const totalResourceCost = parseFloating(
              e3tFormState.totalResourceCost
            );
            const egm = parseFloating(e3tFormState.egm);
            const risk = parseFloating(e3tFormState.riskReserve);

            const total =
              (totalResourceCost * (1 + risk / 100)) / (1 - egm / 100);
            return {
              ...field,
              value: total.toFixed(2),
            };
          }

          if (includes(field.fieldName, "Travel and Expense Price")) {
            const travel = parseFloating(e3tFormState.travel);
            const egm = parseFloating(e3tFormState.egm);
            const risk = parseFloating(e3tFormState.riskReserve);

            const total = (travel * (1 + risk / 100)) / (1 - egm / 100);

            return {
              ...field,
              value: total.toFixed(2),
            };
          }

          if (includes(field.fieldName, "Tooling Software Price")) {
            const hardware = parseFloating(e3tFormState.hardware);
            const software = parseFloating(e3tFormState.software);
            const thirdParty = parseFloating(e3tFormState.thirdParty);
            const egm = parseFloating(e3tFormState.egm);
            const risk = parseFloating(e3tFormState.riskReserve);

            const total =
              ((hardware + software + thirdParty) * (1 + risk / 100)) /
              (1 - egm / 100);
            return {
              ...field,
              value: total.toFixed(2),
            };
          }

          if (includes(field.fieldName, "Pricing Estimate Cost")) {
            const total = parseFloating(e3tFormState.totalContractValue);
            return {
              ...field,
              value: total.toFixed(2),
            };
          }

          // Account Name Carry Forward as Customer Name
          if (includes(field.fieldName, "Customer Name")) {
            return { ...field, value: standardFields[ACCOUNT_NAME] };
          }
          const matchingLog = find(
            transactionLogData,
            (data) => field.id === data.fieldId
          );
          if (matchingLog?.tableValue) {
            return {
              ...field,
              tableValue: JSON.parse(matchingLog?.tableValue, function (k, v) {
                if (isNaN(k) && k !== camelCase(k)) {
                  this[camelCase(k)] = v;
                } else {
                  return v;
                }
              }),
            };
          } else {
            return { ...field, value: matchingLog?.fieldValue };
          }
        } else {
          // OPP ID Carry Forward
          if (includes(field.fieldName, "Opportunity Id")) {
            return { ...field, value: standardFields[OPP_ID] };
          }
          /* Add sku table rows when selected from standard data */
          if (
            includes(field.fieldName, "SKU Table") &&
            field.templateId === 15
          ) {
            return {
              ...field,
              tableValue: getSkuTableValue(skuSelectedValue, field, fields),
            };
          }
          if (includes(field?.fieldName, "Currency") && e3TRegionalData) {
            return {
              ...field,
              value: e3TRegionalData[0]?.sowE3tTsRates[0]?.masterCountry?.fx,
            };
          }

          if (
            includes(field?.fieldName, "Consulting Services Price") &&
            e3tFormState
          ) {
            const totalResourceCost = parseFloating(
              e3tFormState?.totalResourceCost
            );
            const egm = parseFloating(e3tFormState?.egm);
            const risk = parseFloating(e3tFormState?.riskReserve);

            const total =
              totalResourceCost * (1 + risk / 100) * (1 + egm / 100);
            return {
              ...field,
              value: total.toFixed(2),
            };
          }

          if (
            includes(field.fieldName, "Travel and Expense Price") &&
            e3tFormState
          ) {
            const travel = parseFloating(e3tFormState?.travel);
            const egm = parseFloating(e3tFormState?.egm);
            const risk = parseFloating(e3tFormState?.riskReserve);

            const total = travel * (1 + risk / 100) * (1 + egm / 100);

            return {
              ...field,
              value: total.toFixed(2),
            };
          }

          if (
            includes(field.fieldName, "Tooling Software Price") &&
            e3tFormState
          ) {
            const hardware = parseFloating(e3tFormState?.hardware);
            const software = parseFloating(e3tFormState?.software);
            const thirdParty = parseFloating(e3tFormState?.thirdParty);
            const egm = parseFloating(e3tFormState?.egm);
            const risk = parseFloating(e3tFormState?.riskReserve);

            const total =
              (hardware + software + thirdParty) *
              (1 + risk / 100) *
              (1 + egm / 100);
            return {
              ...field,
              value: total.toFixed(2),
            };
          }

          if (
            includes(field.fieldName, "Pricing Estimate Cost") &&
            e3tFormState
          ) {
            const total = parseFloating(e3tFormState?.totalContractValue);
            return {
              ...field,
              value: total.toFixed(2),
            };
          }
          // Account Name Carry Forward as Customer Name
          if (includes(field.fieldName, "Customer Name")) {
            return { ...field, value: standardFields[ACCOUNT_NAME] };
          }
          // Prepared By autofill with LoggedIn User
          if (includes(field.fieldName, "Prepared By")) {
            return { ...field, value: Cookies.get("name") };
          }
          // Validity Date Add 90 days
          if (includes(field.fieldName, "Validity Date")) {
            return {
              ...field,
              value: moment().add(90, "days").format("YYYY-MM-DD").toString(),
            };
          }
          switch (field.contentControlType) {
            case "file":
              return { ...field };
            case "date":
              return {
                ...field,
                value: moment().format("YYYY-MM-DD").toString(),
              };
            case "table": {
              if (!field?.tableValue) {
                if (field?.fieldDefaultValue) {
                  return {
                    ...field,
                    tableValue: JSON.parse(
                      field.fieldDefaultValue,
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
            }
            case "textarea": {
              if (field?.fieldHtmlDefaultValue) {
                return { ...field, value: field.fieldHtmlDefaultValue };
              }
            }
            default:
              if (trim(field.fieldDefaultValue)) {
                return { ...field, value: field.fieldDefaultValue };
              }
          }
        }
        return { ...field };
      }
      return { ...field };
    });
  };

  const checkError = (id, value) => {
    setErrorData((prevState) => {
      if (prevState[id]) delete prevState[id];
      return { ...prevState };
    });

    if (isEmpty(value)) {
      setErrorData((prevState) => ({ ...prevState, [id]: true }));
    }
  };

  const handleHTMLChange = (value, id) => {
    setTemplateFields((templateFields) => {
      templateFields = map(templateFields, (item) => {
        if (item.id === id) {
          return { ...item, value };
        }
        return { ...item };
      });
      return templateFields;
    });
  };

  const handleChange = (event, id) => {
    const { value } = event.target;
    checkError(id, value);
    setTemplateFields((templateFields) => {
      templateFields = map(templateFields, (item) => {
        if (item.id === id) {
          return { ...item, value };
        }
        return { ...item };
      });
      return templateFields;
    });
  };

  const handleFileChange = (event, id) => {
    const file = event.target.files[0];
    setTemplateFields((templateFields) => {
      templateFields = map(templateFields, (item) => {
        if (item.id === id) {
          return { ...item, file: file };
        }
        return { ...item };
      });
      return templateFields;
    });
  };

  const handleFileUpload = async (file, id) => {
    try {
      const fileName = await uploadFile(file);
      if (fileName) {
        setTemplateFields((templateFields) => {
          templateFields = map(templateFields, (item) => {
            if (item.id === id) {
              return { ...item, value: fileName };
            }
            return { ...item };
          });
          return templateFields;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unlinkedFields = filter(
      templateFields,
      (item) => item.sectionId === null && item.tableId === null
    );
    setDynamicFields(unlinkedFields);

    const sectionLinkedFields = filter(
      templateFields,
      (item) => item.sectionId
    );

    const sectionWithLinkedFields = reduce(
      sections,
      (acc, section) => {
        const sectionRelatedFields = filter(
          sectionLinkedFields,
          (item) => item.sectionId === section.id
        );
        if (sectionRelatedFields.length > 0) {
          return [...acc, { ...section, sectionFields: sectionRelatedFields }];
        }
        return acc;
      },
      []
    );
    setDynamicSections(sectionWithLinkedFields);

    const tableColumns = reduce(
      templateFields,
      (acc, field) => {
        if (field.sectionId === null && field.tableId !== null) {
          const existingColumns = acc[field.tableId] || [];
          return { ...acc, [field.tableId]: [...existingColumns, field] };
        }
        return acc;
      },
      {}
    );
    setDynamicTableFields(tableColumns);
  }, [sections, templateFields]);

  const dynamicFormControl = (item) => {
    if (item) {
      switch (item.contentControlType) {
        case "textarea":
          return (
            <Col>
              <Form.Group as={Row} controlId={item.fieldName}>
                <Col sm={3}>
                  <Form.Label>
                    <strong>{item.fieldName}</strong>
                  </Form.Label>
                </Col>
                <Col sm={9}>
                  {/* <Form.Control
                    // size="sm"
                    as="textarea"
                    rows={4}
                    name={item.fieldName}
                    placeholder={`[${item.fieldName}]`}
                    value={item.value || ""}
                    onChange={(e) => handleChange(e, item.id)}
                  />
                  {errorData[item.id] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )} */}
                  <DraftTextField
                    dynamicField={item}
                    handleChange={handleHTMLChange}
                  />
                  <HelperText displayText={item.helperText} />
                </Col>
              </Form.Group>
            </Col>
          );
        case "file":
          return (
            <Col>
              <Form.Group as={Row} controlId={item.fieldName}>
                <Col sm={3}>
                  <Form.Label>
                    <strong>{item.fieldName}</strong>
                  </Form.Label>
                </Col>
                <Col sm={7}>
                  <Form.File
                    size="sm"
                    name={item.fieldName}
                    onChange={(e) => handleFileChange(e, item.id)}
                  />
                  {item.fieldDefaultValue && !item.value && (
                    <div>{last(split(item.fieldDefaultValue, "\\"))}</div>
                  )}
                  {item.value && <div>{last(split(item.value, "\\"))}</div>}
                  {errorData[item.id] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                  <HelperText displayText={item.helperText} />
                </Col>
                <Col sm={2}>
                  <Button
                    bsPrefix="btn btn-success btn-sm action-button"
                    onClick={() => handleFileUpload(item.file, item.id)}
                    disabled={!Boolean(item?.file?.name)}
                  >
                    Upload
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          );
        case "table":
          return (
            <DynamicTable
              item={item}
              dynamicTableFields={dynamicTableFields}
              setTemplateFields={setTemplateFields}
            />
          );
        case "radiotable":
          return (
            <DynamicRadioCheck
              item={item}
              dynamicTableFields={dynamicTableFields}
              setTemplateFields={setTemplateFields}
            />
          );
        default:
          return (
            <Col>
              <Form.Group as={Row} controlId={item.fieldName}>
                <Col sm={3}>
                  <Form.Label>
                    <strong>{item.fieldName}</strong>
                  </Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Control
                    size="sm"
                    name={item.fieldName}
                    type={item.contentControlType}
                    value={item.value || ""}
                    placeholder={`[${item.fieldName}]`}
                    onChange={(e) => handleChange(e, item.id)}
                  />
                  <HelperText displayText={item.helperText} />
                  {errorData[item.id] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                </Col>
              </Form.Group>
            </Col>
          );
      }
    } else {
      return <Col />;
    }
  };

  const dynamicSolutionHubFormControl = (item) => {
    if (item) {
      switch (item.fieldType) {
        case "textarea":
          return (
            <Col>
              <Form.Group as={Row} controlId={item.fieldName}>
                <Col sm={3}>
                  <Form.Label>
                    <strong>{item.fieldName}</strong>
                  </Form.Label>
                </Col>
                <Col sm={9}>
                  {/* <Form.Control
                    as="textarea"
                    rows={3}
                    name={item.fieldName}
                    placeholder={`[${item.fieldName}]`}
                    value={item.value || ""}
                    onChange={(e) => handleSolutionHubDataChange(e, item)}
                  />
                  {errorData[item.id] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )} */}
                  <DraftTextField
                    dynamicField={item}
                    handleChange={handleSolutionHubDataHTMLChange}
                  />
                  <HelperText displayText={item.helperText} />
                </Col>
              </Form.Group>
            </Col>
          );
        default:
          return (
            <Col>
              <Form.Group as={Row} controlId={item.fieldName}>
                <Col sm={3}>
                  <Form.Label>
                    <strong>{item.fieldName}</strong>
                  </Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Control
                    size="sm"
                    name={item.fieldName}
                    type={item.fieldType}
                    value={item.value || ""}
                    placeholder={`[${item.fieldName}]`}
                    onChange={(e) => handleSolutionHubDataChange(e, item)}
                  />
                  <HelperText displayText={item.helperText} />
                  {errorData[item.id] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                </Col>
              </Form.Group>
            </Col>
          );
      }
    } else {
      return <Col />;
    }
  };

  const handleSolutionHubDataHTMLChange = (value, id) => {
    setSolutionHubData((work) => {
      return map(work, (item) => {
        if (item.id === id) {
          return { ...item, value };
        }
        return { ...item };
      });
    });
  };

  const handleSolutionHubDataChange = (event, obj) => {
    const { value } = event.target;
    setSolutionHubData((work) => {
      return map(work, (item) => {
        if (item.id === obj.id) {
          return { ...item, value };
        }
        return { ...item };
      });
    });
    // checkError(id, value);
    // setTemplateFields((templateFields) => {
    //   templateFields = map(templateFields, (item) => {
    //     if (item.id === id) {
    //       return { ...item, value };
    //     }
    //     return { ...item };
    //   });
    //   return templateFields;
    // });
  };

  const checkErrors = (errorData = {}) => {
    const existingErrorData = errorData;

    map(templateFields, (item) => {
      if (!item.value && !item.fieldDefaultValue) {
        existingErrorData[item.id] = true;
      }
    });

    setErrorData({ ...existingErrorData });
  };

  const handleSaveAndPreview = () => {
    // checkErrors();
    if (!some(errorData, (item) => item === true)) {
      generatePreview();
      setActiveKey(PREVIEW);
    }
  };

  useEffect(() => {
    if (
      !isEmpty(solutionHubData) &&
      !isEmpty(solutionHubLogData) &&
      (!isEmpty(predefinedModuleLogData) || !isEmpty(selectedWorkPackages)) &&
      isEdit &&
      workPkgSectionDataLoadedCount === 0
      // !initLoad
    ) {
      setWorkPkgSectionDataLoadedCount((prevState) => prevState + 1);
      const newSolutionHubData = [];
      each(solutionHubLogData, (logItem) => {
        const matchingItem = find(
          solutionHubData,
          (data) => data.id === logItem.sowSolutionHubDataId
        );
        newSolutionHubData.push({
          ...matchingItem,
          value: logItem.fieldValue,
        });
      });
      setSolutionHubData(newSolutionHubData);
    } else if (
      !isEmpty(solutionHubLogData) &&
      !isEmpty(workPackageSectionData) &&
      isEmpty(predefinedModuleLogData) &&
      isEdit &&
      workPkgSectionDataLoadedCount === 0
      // !initLoad
    ) {
      if (
        solutionHubLogData[0]?.workPackageSectionDataId &&
        solutionHubLogData[0]?.sectionName
      ) {
        setWorkPkgSectionDataLoadedCount((prevState) => prevState + 1);
        let customWorkPackageData = [];
        const groupBySectionName = groupBy(
          solutionHubLogData,
          (item) => item.sectionName
        );
        let tempWorkPkgRowId = workPkgRowId;
        let tempWorkPkgRowCount = workPkgRowCount;
        each(groupBySectionName, (group) => {
          each(cloneDeep(workPackageSectionData), (item) => {
            const matchingLog = find(
              group,
              (data) => item.id === data.workPackageSectionDataId
            );
            customWorkPackageData.push({
              ...getWorkPackageRowItem(
                item,
                matchingLog.workPackageId,
                "",
                tempWorkPkgRowCount
              ),
              sectionName: matchingLog?.sectionName,
              value: matchingLog?.fieldValue,
            });
            tempWorkPkgRowId =
              matchingLog.workPackageId > tempWorkPkgRowId
                ? matchingLog.workPackageId
                : tempWorkPkgRowId;
          });
          tempWorkPkgRowCount += 1;
        });
        setWorkPkgRowCount(tempWorkPkgRowCount);
        setWorkPkgRowId(tempWorkPkgRowId + 1);
        setSolutionHubData(customWorkPackageData);
      }
    } else if (
      /* for add functionality to set default values */
      isEmpty(selectedWorkPackages) &&
      isEmpty(solutionHubData) &&
      workPkgRowCount === 1
    ) {
      getDynamicWorkPkgInputField();
    }
  }, [
    solutionHubData,
    solutionHubLogData,
    workPackageSectionData,
    predefinedModuleLogData,
  ]);

  // Solution Hub
  useEffect(() => {
    if (!isEmpty(solutionHubData)) {
      const groupSolutionHubBySection = groupBy(
        solutionHubData,
        (item) => item.sectionId
      );
      setSolutionHubSections(groupSolutionHubBySection);

      each(groupSolutionHubBySection, (section, id) => {
        let sortedSolutionHubWorkPackageIds = [];
        each(section, (item) => {
          sortedSolutionHubWorkPackageIds = [
            ...new Set([
              ...sortedSolutionHubWorkPackageIds,
              item.workPackageId,
            ]),
          ];
        });
        setOrderSolutionHubSections((prevState) => ({
          ...prevState,
          [id]: [...sortedSolutionHubWorkPackageIds],
        }));

        const groupByworkPackageId = groupBy(
          section,
          (item) => item.workPackageId
        );

        let newValue = "";

        if (groupByworkPackageId) {
          each(groupByworkPackageId, (groupItem) => {
            newValue +=
              `${groupItem[0]?.typeOfWork} (${groupItem[0]?.workPackage})` +
              "\n";
            each(groupItem, (item) => {
              if (item.value) {
                newValue += item.fieldName + "\n";
                newValue += item.value + "\n";
              }
            });
          });
        }

        if (newValue) {
          setTemplateFields((templateFields) =>
            map(templateFields, (item) => {
              if (item.sectionId == id) {
                return { ...item, value: newValue };
              }
              return { ...item };
            })
          );
        }
      });
    }
  }, [solutionHubData]);

  /* get dynamic work package input fields */
  const getDynamicWorkPkgInputField = () => {
    setSolutionHubData((prevState) => [
      ...prevState,
      ...each(cloneDeep(workPackageSectionData), (item) => {
        getWorkPackageRowItem(item, workPkgRowId, label, workPkgRowCount);
      }),
    ]);
    setWorkPkgRowCount((prevState) => prevState + 1);
    setWorkPkgRowId((prevState) => prevState + 1);
  };

  /* fetch single row for work package details */
  const handleAddWorkPackageRow = async (
    templateId,
    add,
    index,
    cancelToken
  ) => {
    if (add) {
      getDynamicWorkPkgInputField();
    } else {
      const temp = [...solutionHubData];
      const filteredItems = filter(temp, (item) => {
        return item.workPackageId !== +index;
      });
      setSolutionHubData(filteredItems);
    }
  };

  /* set input field of work package section */
  const handleWorkPkgInputChange = (e) => {
    setworkPkgTitleDialogueText(e.target.value);
  };

  /* save edited text in work pkg object */
  const saveEditedTextInWorkPkgInput = () => {
    /* set input field of work package section */
    if (workPkgTitleDialogueText) {
      setSolutionHubData((prevState) =>
        map(prevState, (item) => {
          if (item.workPackageId === +workPkgTitleDialogueOpen.selectedIndex) {
            item.sectionName = workPkgTitleDialogueText;
          }
          return { ...item };
        })
      );
      /* close dialogue after save */
      closeWorkPkgTitleDialogue();
    }
  };

  /* open work package details title edit dialogue */
  const openWorkPkgTitleDialogue = (workPack, index) => {
    setWorkPkgTitleDialogueOpen((prevState) => ({
      ...prevState,
      open: true,
      selectedIndex: index,
    }));
    setworkPkgTitleDialogueText(workPack[0].sectionName);
  };

  /* close edit modal */
  const closeWorkPkgTitleDialogue = () => {
    setWorkPkgTitleDialogueOpen((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  /* return empty or filled workPackage input field */
  const getTitlleInputForWorkPkgRow = (value) => {
    if (value[0]?.typeOfWork) {
      return `${value[0]?.typeOfWork} (${value[0]?.workPackage})`;
    }
    return `${value[0]?.sectionName}`;
  };

  // DnD

  const findAccordian = useCallback(
    (workPackageId, sectionId) => {
      const data = find(
        orderSolutionHubSections[sectionId],
        (item) => item === workPackageId
      );
      const index = indexOf(orderSolutionHubSections[sectionId], data);
      return {
        data,
        index,
      };
    },
    [solutionHubData, orderSolutionHubSections]
  );

  const moveAccordian = useCallback(
    (workPackageId, atIndex, sectionId) => {
      const { data, index } = findAccordian(workPackageId, sectionId);
      const newOrder = update(orderSolutionHubSections[sectionId], {
        $splice: [
          [index, 1],
          [atIndex, 0, data],
        ],
      });

      setSolutionHubData((prevState) => {
        let newSolutionHubData = [];
        const groupByworkPackageId = groupBy(
          prevState,
          (item) => item.workPackageId
        );
        each(newOrder, (id) => {
          const workPack = groupByworkPackageId[id];
          each(workPack, (item) => {
            newSolutionHubData = [...newSolutionHubData, item];
          });
        });
        return [...newSolutionHubData];
      });
    },
    [
      findAccordian,
      solutionHubData,
      setSolutionHubData,
      orderSolutionHubSections,
    ]
  );

  const [, drop] = useDrop(() => ({ accept: "accordian" }));

  // Main Return
  return (
    <Container bsPrefix="container container-fluid mt-4">
      {loader || solutionHubDataLoading ? (
        <div className="d-flex flex-column align-items-center">
          <div className="p-2">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
          <div className="p-2">Loading...</div>
        </div>
      ) : (
        <>
          <Container bsPrefix="container sow-container">
            {/* Dynamic Form */}
            <Form noValidate>
              {/* sectionUnlinkedFields */}
              {map(
                [...Array(ceil(dynamicFields.length / 2)).keys()],
                (item, idx) => {
                  const index = item * 2;
                  return (
                    <Row key={idx}>
                      {dynamicFormControl(dynamicFields[index])}
                      {dynamicFormControl(dynamicFields[index + 1])}
                    </Row>
                  );
                }
              )}

              {/* sectionLinkedFields */}
              {map(dynamicSections, (section, idx) => {
                if (solutionHubSections[section.id]) {
                  const groupByworkPackageId = groupBy(
                    solutionHubSections[section.id],
                    (item) => item.workPackageId
                  );
                  return (
                    <Fragment key={section.id}>
                      {checkPredefinedModulesAdd(
                        solutionHubSections[section.id]
                      ) && (
                        <CustomButton
                          classNames="btn btn-success ml-1 btn-sm action-button pointer addWorkPkgRowBtn"
                          onClickFn={() =>
                            handleAddWorkPackageRow(
                              section.templateId,
                              1,
                              addSingleWorkPkgToken.token
                            )
                          }
                          content={<i className="fas fa-plus fa-xs" />}
                          title={label.addWorkPkgBtnTitle}
                        />
                      )}
                      <Accordion defaultActiveKey={`${idx}`}>
                        <Card>
                          <ContextAwareToggle as="h5" eventKey={`${idx}`}>
                            {section.sectionName}
                          </ContextAwareToggle>
                          {/* <hr className="sow-titleline" /> */}
                          <Accordion.Collapse
                            eventKey={`${idx}`}
                            style={{ borderBottom: 0, marginLeft: "12px" }}
                          >
                            <Card.Body bsPrefix="card-body p-2">
                              <div ref={drop}>
                                {map(
                                  orderSolutionHubSections[section.id],
                                  (id, index) => {
                                    const workPack = groupByworkPackageId[id];
                                    return (
                                      <Fragment key={workPack[0].workPackageId}>
                                        {checkPredefinedModulesRemove(
                                          solutionHubData,
                                          solutionHubSections,
                                          section,
                                          workPack
                                        ) && (
                                          <CustomButton
                                            classNames="btn btn-success ml-1 btn-sm action-button pointer float-right"
                                            onClickFn={() =>
                                              handleAddWorkPackageRow(
                                                null,
                                                0,
                                                index
                                              )
                                            }
                                            content={
                                              <i className="fas fa-minus fa-xs" />
                                            }
                                            title={label.addWorkPkgBtnTitle}
                                          />
                                        )}
                                        <DnDAccordian
                                          id={id}
                                          sectionId={section.id}
                                          moveAccordian={moveAccordian}
                                          findAccordian={findAccordian}
                                        >
                                          <Accordion
                                          // defaultActiveKey={`${index}`}
                                          >
                                            <ContextAwareToggle
                                              as="h6"
                                              eventKey={`${index}`}
                                            >
                                              {getTitlleInputForWorkPkgRow(
                                                workPack
                                              )}
                                              &nbsp;&nbsp;&nbsp;
                                              {checkPredefinedModulesAdd(
                                                solutionHubSections[section.id]
                                              ) && (
                                                <i
                                                  style={{ cursor: "pointer" }}
                                                  className="fas fa-pen fa-sm"
                                                  onClick={() =>
                                                    openWorkPkgTitleDialogue(
                                                      workPack,
                                                      workPack[0].workPackageId
                                                    )
                                                  }
                                                  title="Edit Section Title"
                                                />
                                              )}
                                            </ContextAwareToggle>
                                            <Accordion.Collapse
                                              eventKey={`${index}`}
                                              style={{ borderBottom: 0 }}
                                            >
                                              <Card.Body>
                                                {map(workPack, (item, id) => {
                                                  return (
                                                    <Row key={id}>
                                                      {dynamicSolutionHubFormControl(
                                                        item
                                                      )}
                                                    </Row>
                                                  );
                                                })}
                                              </Card.Body>
                                            </Accordion.Collapse>
                                          </Accordion>
                                        </DnDAccordian>
                                      </Fragment>
                                    );
                                  }
                                )}
                              </div>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </Fragment>
                  );
                }
                return (
                  <Accordion key={section.id} defaultActiveKey={`${idx}`}>
                    <Card>
                      <ContextAwareToggle as="h5" eventKey={`${idx}`}>
                        {section.sectionName}
                      </ContextAwareToggle>
                      {/* <hr className="sow-titleline" /> */}
                      <Accordion.Collapse
                        eventKey={`${idx}`}
                        style={{ borderBottom: 0 }}
                      >
                        <Card.Body>
                          {map(section.sectionFields, (item, idx) => {
                            return (
                              <Row key={idx}>{dynamicFormControl(item)}</Row>
                            );
                          })}
                          <HelperText displayText={section.helperText} />
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                );
              })}
            </Form>
          </Container>

          <Row>
            <Col>
              <Button
                bsPrefix="btn btn-success btn-sm float-right action-button"
                onClick={handleSaveAndPreview}
              >
                {isEdit ? "Update & Preview" : "Save & Preview"}
              </Button>
              <Button
                bsPrefix="btn btn-success btn-sm float-right mr-2 btn-warning"
                onClick={() =>
                  setActiveKey(
                    // Need to Remove this later
                    process.env.REACT_APP_ENV === "UAT" ? PRICING : STANDARD
                  )
                }
              >
                Previous
              </Button>
            </Col>
          </Row>

          <Modal
            show={workPkgTitleDialogueOpen.open}
            onHide={closeWorkPkgTitleDialogue}
          >
            <Modal.Header closeButton>
              <Modal.Title>{label.workPkgDialogueTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={10}>
                  <CustomTextField
                    name={workPkgTitleDialogueText}
                    size="sm"
                    placeholder={label.workPkgDetailsPlaceHolder}
                    value={workPkgTitleDialogueText}
                    onChangeFn={(e) => handleWorkPkgInputChange(e)}
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    bsPrefix="btn btn-success btn-sm action-button"
                    disabled={!workPkgTitleDialogueText}
                    onClick={saveEditedTextInWorkPkgInput}
                  >
                    {label.saveBtnLbl}
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default DynamicData;
