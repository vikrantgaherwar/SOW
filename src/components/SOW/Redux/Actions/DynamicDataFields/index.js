import axios from "axios";
import Cookies from "js-cookie";
import { camelCase, groupBy, orderBy } from "lodash";
import moment from "moment";
import URLConfig from "../../../URLConfig";
import { parseFloating } from "../../../Components/E3TForm/e3tFormData";
import { Store } from "../../Store";
import { isWorkPackageFilled } from "../../utils/isWorkPackageFilled";
import { showCustomModules } from "../../utils/showCustomModules";
import { actionCustomerDataRemoveSKUIndex } from "../CustomerData";
import { CUSTOMER_DATA_TYPE } from "../CustomerData/CustomerDataType";
import {
  actionE3TCustomWorkPackageRename,
  actionE3TRecalculate,
  actionE3TResourceTableCustomWorkPackagesAdd,
  actionE3TResourceTableWPAdd,
  actionE3TUpdateDynamicData,
} from "../E3T";
import {
  generateBlankExisitingSectionData,
  generateBlankSectionData,
  resetSectionDataCount,
  setSectionDataCount,
} from "../MasterDropDown/sectionDataStructure";
import { actionFetchSolutionHubDropDownData } from "../SolutionHubDropDown";
import SolHubDropDownTable from "../SolutionHubDropDown/SolHubDropDownTable";
import { DYNAMIC_DATA_TYPES } from "./dynamicDataType";
import {
  getTableStucture,
  resetDynamicTableStructure,
  saveTableStructure,
} from "./dynamicTableStructure";
import {
  actionE3TGetCostingEstimationV2,
  actionE3TGetTShirtSizesV2,
} from "../E3TData";
import {
  actionCustomWorkPackageLoadEditData,
  actionCustomWorkPackageShouldLoadEditValueChanged,
  actionFetchCustomModulesDropdown,
} from "../CustomModulesSidePanel";
import { APIFetchStatus } from "../../utils/fetchStatus";

export const actionDynamicDataFieldsLoadState = (fields, edit) => {
  return (dispatch) => {
    const ob = {};

    const state = Store.getState();
    // const transactionLogData = state.logData?.transactionalLog;
    const secId =
      state.masterDropDown.workPackageSectionData.length > 0
        ? state.masterDropDown.workPackageSectionData["0"]["sectionId"]
        : -999;
    console.log({ secId });

    fields.forEach((row) => {
      let value = row.fieldDefaultValue ? row.fieldDefaultValue.trim() : "";
      let valueHTML = row.fieldHtmlDefaultValue
        ? row.fieldHtmlDefaultValue.trim()
        : "<p><br></p>";
      const name = row.fieldName;
      const sectionId = row.sectionId;
      const type = row.contentControlType;
      /* get transactional saved data and set values */
      // const transactionLogItem = transactionLogData.find(
      //   (item) => item.fieldId === row.id
      // );
      // if (transactionLogItem) {
      //   value = transactionLogItem.fieldValue
      //     ? transactionLogItem.fieldValue.trim()
      //     : "";
      //   valueHTML = transactionLogItem.fieldValue
      //     ? transactionLogItem.fieldValue.trim()
      //     : "<p><br></p>";
      // }
      if ((type === "table" || type === "radiotable") && row.headers) {
        const ob1 = {};

        row.headers.forEach((r) => {
          ob1[r.fieldName] = r.fieldDefaultValue
            ? r.fieldDefaultValue.trim()
            : "";
        });
        // DYNAMIC_TABLE_STRUCTURE[name] = ob1;
        saveTableStructure(name, ob1);
      }

      //   console.log({ DYNAMIC_TABLE_STRUCTURE });
      switch (type) {
        case "text":
          if (name.startsWith("Customer Name")) {
            console.log({ customerData: state.customerData });
            ob[name] = state.customerData.accountName;
          } else if (name.toLowerCase().indexOf("country") > -1) {
            ob[name] = state.customerData.countryName;
          } else if (name === "Opportunity Id") {
            ob[name] = state.masterData.oppId;
          } else if (name === "Category") {
            ob[name] = "Statement of Work ";
          } else if (name.startsWith("Currency")) {
            let curr = "";
            if (state.e3tData) {
              if (state.e3tData.e3tRegionalData[0]) {
                curr = state.e3tData.e3tRegionalData[0].fx;
              }
            }
            ob[name] = curr;
          } else if (name.startsWith("Prepared By")) {
            ob[name] = Cookies.get("name");
          } else if (name.startsWith("Consulting Services Price")) {
            const { riskReserve, egm, totalResourceCost } = state.e3t;
            const risk = parseFloating(riskReserve);
            const e = parseFloating(egm);
            const totalResource = parseFloating(totalResourceCost);
            const t = (totalResource * (1 + risk / 100)) / (1 - e / 100);
            ob[name] = t.toFixed(2);
          } else if (name.startsWith("Travel and Expense Price")) {
            const { riskReserve, egm, travel } = state.e3t;
            const risk = parseFloating(riskReserve);
            const e = parseFloating(egm);
            const tr = parseFloating(travel);
            const t = (tr * (1 + risk / 100)) / (1 - e / 100);
            ob[name] = t.toFixed(2);
          } else if (name.startsWith("Tooling Software Price")) {
            const { riskReserve, egm, software, hardware, thirdParty } =
              state.e3t;
            const risk = parseFloating(riskReserve);
            const e = parseFloating(egm);
            const soft = parseFloating(software);
            const hard = parseFloating(hardware);
            const third = parseFloating(thirdParty);

            const t =
              ((soft + hard + third) * (1 + risk / 100)) / (1 - e / 100);
            ob[name] = t;
          } else if (row.sectionId === secId) {
            // const fieldName = row.

            const dd = state.dynamicFields.data.sowSections.find(
              (e) =>
                e.id ===
                state.masterDropDown.workPackageSectionData[0].sectionId
            );
            const data = generateBlankExisitingSectionData(dd.sectionName);

            // data.sectionName = `${data.sectionName} (1)`;
            ob[name] = showCustomModules(state) ? [] : [];
          } else {
            ob[name] = value.trim();
          }

          break;
        case "date":
          const defaultDate = moment().format("YYYY-MM-DD");
          // console.log({ defaultDate, name, value });

          if (name === "Validity Date" || name === "End Date") {
            ob[name] = moment().add(90, "days").format("YYYY-MM-DD");
          } else {
            ob[name] =
              value.trim().length > 0
                ? value.trim()
                : moment().format("YYYY-MM-DD");
          }
          break;
        case "textarea":
          {
            // const v = valueHTML.trim();
            // if (v === "<p><br/></p>" || v.length === 0) {
            //   ob[name] = EditorState.createEmpty();
            // } else {
            //   const blocksFromHTML = convertFromHTML(valueHTML.trim());
            //   const state = ContentState.createFromBlockArray(
            //     blocksFromHTML.contentBlocks,
            //     blocksFromHTML.entityMap
            //   );
            ob[name] = valueHTML.trim();
          }

          // const blocksFromHTML = convertFromHTML(valueHTML.trim());
          // const state = ContentState.createFromBlockArray(
          //   blocksFromHTML.contentBlocks,
          //   blocksFromHTML.entityMap
          // );
          // const newState = EditorState.createWithContent(state);
          // ob[name] = newState;

          // ob[name] = valueHTML.trim();
          break;
        case "radiotable":
          ob[name] = value;
          break;
        case "table":
          try {
            if (value) {
              const p = JSON.parse(value);
              const req = p.map((e) => {
                const ob = {};
                for (let i = 0; i < e.length; i++) {
                  const { fieldName, value } = e[i];
                  ob[fieldName] = value;
                }
                return ob;
              });
              ob[name] = req;
            } else {
              // console.log({
              //   name,
              //   struct: getTableStucture(name),
              // });
              ob[name] = [getTableStucture(name)];
            }
          } catch (err) {
            ob[name] = [getTableStucture(name)];
          }

          break;
        default:
          return;
      }
    });

    // console.log({ ob });

    dispatch({
      type: DYNAMIC_DATA_TYPES.FIELDS_LOADED,
      payload: ob,
    });
    if (edit) {
      const state = Store.getState();
      dispatch(actionDynamicDataLoadEditData());
      dispatch(
        actionFetchSolutionHubDropDownData(state.masterData.sowTemplate, true)
      );
    }
  };
};

export const actionDynamicDataFieldValueChanged = (name, value) => {
  return (dispatch) => {
    if (name === "Customer Name") {
      dispatch({
        type: CUSTOMER_DATA_TYPE.VALUE_CHANGED,
        payload: { accountName: value },
      });
    } else if (name === "Country Entity Name") {
      dispatch({
        type: CUSTOMER_DATA_TYPE.VALUE_CHANGED,
        payload: {
          countryName: value,
        },
      });
    }
    dispatch({
      type: DYNAMIC_DATA_TYPES.FIELD_VALUE_CHANGED,
      payload: { name, value },
    });
  };
};

export const actionMultpleValueChanged = (name, value) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.FIELD_MULTIPLE_VALUE_CHANGED,
      payload: { name, value },
    });
  };
};

export const actionDynamicDataFieldsTableValueChanged = (
  tableName,
  name,
  value,
  index
) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.TABLE_VALUE_CHANGED,
      payload: { tableName, name, value, index },
    });
  };
};

export const actionDynamicDataFieldsTableRowAdded = (name, index) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.TABLE_ROW_ADDED,
      payload: { name, index },
    });
  };
};

export const actionDynamicDataFieldsTableRowRemoved = (name, index) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.TABLE_ROW_REMOVED,
      payload: { name, index },
    });

    if (name === "SKU Table") {
      dispatch(actionCustomerDataRemoveSKUIndex(index));
    }
  };
};

export const actionDynamicDataFieldsPageLoadUpdate = () => {
  return (dispatch) => {
    const state = Store.getState();
    // Customer Data

    const {
      riskReserve,
      egm,
      totalResourceCost,
      travel,
      hardware,
      software,
      thirdParty,
      totalContractValue,
    } = state.e3t;
    const risk = parseFloating(riskReserve);
    const e = parseFloating(egm);
    const tr = parseFloating(travel);
    const hard = parseFloating(hardware);
    const soft = parseFloating(software);
    const third = parseFloating(thirdParty);
    const totalResource = parseFloating(totalResourceCost);

    const Consulting = (totalResource * (1 + risk / 100)) / (1 - e / 100);
    const tra = (tr * (1 + risk / 100)) / (1 - e / 100);
    const tooling = ((hard + soft + third) * (1 + risk / 100)) / (1 - e / 100);

    const ob = {
      "Customer Name": state.customerData.accountName,
      "Opportunity Id": state.masterData.oppId,
      Currency: state.e3tData.e3tRegionalData[0].fx,
      "Consulting Services Price": Consulting.toFixed(2),
      "Travel and Expense Price": tra.toFixed(2),
      "Tooling Software Price": tooling.toFixed(2),
      "Pricing Estimate Cost": totalContractValue,
    };

    dispatch({
      type: DYNAMIC_DATA_TYPES.FIELDS_PAGE_UPDATE,
      payload: ob,
    });
  };
};

export const actionDynamicDataFieldsPageShouldUpdate = () => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.PAGE_SHOULD_UPDATE,
    });
  };
};

export const actionDynamicDataSaveUpdateCustomModule = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: DYNAMIC_DATA_TYPES.CUSTOM_MODULES_SAVE_UPDATE_FETCHING,
      });

      const f = await axios.post(URLConfig.getCustomModulesSaveUpdate(), data);
      console.log({ data, customModulesSaveUpdate: f.data });

      dispatch({
        type: DYNAMIC_DATA_TYPES.CUSTOM_MODULES_SAVE_UPDATE_FETCHED,
      });
      dispatch(actionFetchCustomModulesDropdown());

      dispatch(
        actionDynamicDataChangeCustomWorkPackageName(
          data.sowCustomModulesTypeOfWork.id,
          data.sowCustomModulesTypeOfWork.typeOfWork,
          data.sowCustomModulesWorkPackage.id,
          data.sowCustomModulesWorkPackage.workPackage
        )
      );

      dispatch(
        actionE3TCustomWorkPackageRename(
          data.sowCustomModulesTypeOfWork.id,
          data.sowCustomModulesTypeOfWork.typeOfWork,
          data.sowCustomModulesWorkPackage.id,
          data.sowCustomModulesWorkPackage.workPackage
        )
      );
    } catch (err) {
      console.log(err);
      dispatch({
        type: DYNAMIC_DATA_TYPES.CUSTOM_MODULES_SAVE_UPDATE_FAILED,
      });
    }
  };
};

export const actionDynamicDataChangeCustomWorkPackageName = (
  typeOfWorkId,
  typeOfWork,
  workPackageId,
  workPackage
) => {
  return (dispatch) => {
    const state = Store.getState();
    const sectionId = state.masterDropDown.workPackageSectionData[0].sectionId;
    const f = state.dynamicFields.data.sowTemplateFields.find(
      (e) => e.sectionId === sectionId
    );
    const name = f.fieldName;

    console.log({
      typeOfWorkId,
      typeOfWork,
      workPackageId,
      workPackage,
      name,
    });

    dispatch({
      type: DYNAMIC_DATA_TYPES.CUSTOM_MODULES_RENAME,
      payload: {
        typeOfWorkId,
        typeOfWork,
        workPackageId,
        workPackage,
        name,
      },
    });
  };
};

export const actionDynamicDataFieldsCustomWorkPackageAdd = () => {
  return (dispatch) => {
    const state = Store.getState();
    const name = state.dynamicFields.data.sowTemplateFields.find(
      (e) =>
        e.sectionId === state.masterDropDown.workPackageSectionData[0].sectionId
    );
    const submitData = state.customModuleSidePanel.customModulesSubmitData;
    const dropDownData = state.customModuleSidePanel.customDropdown;
    const group = submitData.map((e) => {
      const tow = dropDownData.find((k) => k.id === e.typeOfWorkId);
      const wp = tow.sowCustomModulesWorkPackages.find(
        (k) => k.id === e.workPackageId
      );
      return {
        ...e,
        typeOfWork: tow.typeOfWork,
        workPackage: wp.workPackage,
        sectionName: `${tow.typeOfWork} (${wp.workPackage})`,
        value: e.fieldDefaultValue,
      };
    });
    const data = Object.values(groupBy(group, "workPackageId"));
    console.log({ data });

    dispatch({
      type: DYNAMIC_DATA_TYPES.CUSTOM_WORK_PACKAGE_ADD,
      payload: { name: name.fieldName, data },
    });

    const tof = data.reduce(
      (arr, e) =>
        arr.indexOf(e[0].typeOfWork) === -1
          ? [...arr, e[0].typeOfWork]
          : [...arr],
      []
    );

    console.log({ tof });

    dispatch(actionE3TResourceTableCustomWorkPackagesAdd(name.fieldName));

    // tof.forEach((typeOfWork) => {
    //   dispatch(actionE3TResourceTableWPAdd(name.fieldName, typeOfWork, []));
    // });
  };
};

export const actionDynamicDataFieldsWorkPackageAdd = (
  name,
  typeOfWork,
  workPackage
) => {
  return (dispatch) => {
    const state = Store.getState();

    const dd = state.dynamicFields.data.sowSections.find(
      (e) => e.id === state.masterDropDown.workPackageSectionData[0].sectionId
    );
    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_ADD,
      payload: { name, sectionName: dd.sectionName, typeOfWork, workPackage },
    });
  };
};

export const actionDynamicDataFieldsWorkPackageRemove = (id, fieldName) => {
  const state = Store.getState();
  const dd = state.dynamicFields.data.sowSections.find(
    (e) => e.id === state.masterDropDown.workPackageSectionData[0].sectionId
  );

  return (dispatch) => {
    // console.log({ id, fieldName });
    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_REMOVE,
      payload: { id, fieldName, sectionName: dd.sectionName },
    });
  };
};

export const actionDynamicDataFieldChangeWorkPackageName = (
  id,
  fieldName,
  value
) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_NAME_CHANGED,
      payload: { id, fieldName, value },
    });
  };
};

export const actionDynamicDataFieldsWorkPackageUpdate = (
  parentId,
  id,
  fieldName,
  name,
  value
) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_UPDATE,
      payload: { parentId, id, name, value, fieldName },
    });
  };
};

export const actionDynamicDataFieldsApplyWorkPackages = (workPackage) => {
  return async (dispatch) => {
    try {
      /* show loader in work package section on predefined mod select*/
      dispatch({
        type: DYNAMIC_DATA_TYPES.SECTION_DATA_LOADING,
      });
      const state = Store.getState();
      const solutionHubDropDown = state.solutionHubDropDown.dropDown;

      const field = state.dynamicFields.data.sowTemplateFields.find(
        (e) =>
          e.sectionId ===
          state.masterDropDown.workPackageSectionData[0].sectionId
      );

      const wpFieldName = field.fieldName;

      // console.trace("actionDynamicDataFieldsApplyWorkPackages");
      // const templateName = state.masterData.sowTemplate;
      // const temp = state.masterDropDown.templateFieldDropDownData.find(
      //   (e) => e.templateInputName === templateName
      // );

      // const sowTemplateFields = state.dynamicFields.data.sowTemplateFields.map(
      //   (e) => {
      //     const r = { ...e };
      //     if (r.origId) {
      //       r.id = r.origId;
      //       delete r.origId;
      //     }
      //     return r;
      //   }
      // );

      // const templateId = temp.id;
      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetTemplateMapping";
      const templateId = state.masterData.sowTemplate;
      const data = state.moduleSidePanel.selectedTypeOfWork;

      const templateRes = await axios.post(URL, data, {
        params: { templateId },
      });
      const linkMap = {};
      if (templateRes.data) {
        const templateData = templateRes.data;

        templateData.forEach((row) => {
          row.sowTemplateFieldsMappings.forEach((recordRow) => {
            linkMap[recordRow.linkedTemplateFieldId] =
              recordRow.parentTemplateFieldId;
          });
        });

        const dynamicData = {};
        const URL2 =
          URLConfig.getURLDeltaSOWAPI() + "SOW/GetTemplateMappingFields";
        const templateMappingRes = await axios.post(
          URL2,
          templateData.map((e) => e.linkedTemplateId)
        );
        const templateMapping = templateMappingRes.data;
        const fieldsData = {};

        dispatch(
          actionE3TGetTShirtSizesV2(
            state.moduleSidePanel.selectedTypeOfWork,
            true
          )
        );

        templateMapping.forEach((templateMappingRow) => {
          templateMappingRow.sowTemplateFields.forEach((row) => {
            // const thisId = linkMap[row.id];
            if (row.contentControlType === "table") {
              dynamicData[row.fieldName] = JSON.parse(
                row.fieldDefaultValue
              ).map((e) => {
                const ob = {};
                e.map((k) => {
                  ob[k.fieldName.trim()] = k.value ?? "";
                });
                return ob;
              });
            } else if (row.contentControlType === "radioTable") {
              dynamicData[row.fieldName] = row.value;
            } else if (row.tableId === null) {
              const va = row.fieldHtmlDefaultValue
                ? row.fieldHtmlDefaultValue
                : row.fieldDefaultValue;
              dynamicData[row.fieldName] = va ?? "";
            }
          });
        });

        dispatch({
          type: DYNAMIC_DATA_TYPES.FIELDS_CHANGED,
          payload: dynamicData,
        });
      }
      if (workPackage.length === 0) {
        resetSectionDataCount();
        const sectionId =
          state.masterDropDown.workPackageSectionData[0].sectionId;
        const field = state.dynamicFields.fields.find(
          (e) => e.id === sectionId
        );

        const name = field.children[0].fieldName;
        const solHub = state.dynamicData[name];

        let repeat = [];

        solHub.forEach((seg) => {
          if (seg[0].sectionName) {
            // if (isWorkPackageFilled(seg)) {
            //   console.log({ ob: seg, isWorkPackageFilled: true });
            repeat = [...repeat, seg];
            // } else {
            // console.log({ ob: seg, isWorkPackageFilled: false });
          }
        });

        if (repeat.length === 0) {
          const dd = state.dynamicFields.data.sowSections.find(
            (e) =>
              e.id === state.masterDropDown.workPackageSectionData[0].sectionId
          );
          repeat = [];
        }

        dispatch({
          type: DYNAMIC_DATA_TYPES.PREDEFINED_PACKAGE_ADDED,
          payload: {
            workPackages: showCustomModules(state) ? repeat : [],
            fieldName: name,
          },
        });
        /* hide loader*/
        dispatch({
          type: DYNAMIC_DATA_TYPES.SECTION_DATA_LOADED,
        });
      } else {
        const URL3 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubData";
        const solutionHubRes = await axios.post(URL3, workPackage, {
          params: { templateId },
        });

        const solutionHubResponse = solutionHubRes.data;

        const arr = [];
        solutionHubDropDown.forEach((typeOfWork) => {
          typeOfWork.sowSolutionHubWorkPackages.forEach((workPackages) => {
            const filtered = solutionHubResponse.filter(
              (e) => workPackages.id === e.workPackageId
            );

            if (filtered.length > 0) {
              const newOb = filtered.map((e) => {
                if (e.fieldType === "table") {
                  const data = state.dynamicData[wpFieldName].find(
                    (rec) =>
                      rec[0].typeOfWorkId === typeOfWork.id &&
                      rec[0].workPackageId === workPackages.id
                  );
                  console.log({
                    data,
                    typeOfWork: typeOfWork.id,
                    workPackages: workPackages.id,
                  });

                  const tableValue = data
                    ? data[0].tableValue
                    : e.fieldDefaultValue
                    ? JSON.parse(e.fieldDefaultValue, function (k, v) {
                        if (isNaN(k) && k !== camelCase(k)) {
                          this[camelCase(k)] = v;
                        } else {
                          return v;
                        }
                      })
                    : [SolHubDropDownTable.getTableColumns(e.tableId)];

                  console.log({ tableValue });
                  return {
                    ...e,
                    typeOfWork: typeOfWork.typeOfWork,
                    workPackage: workPackages.workPackage,
                    tableValue: data
                      ? data[0].tableValue
                      : e.fieldDefaultValue
                      ? JSON.parse(e.fieldDefaultValue, function (k, v) {
                          if (isNaN(k) && k !== camelCase(k)) {
                            this[camelCase(k)] = v;
                          } else {
                            return v;
                          }
                        })
                      : [SolHubDropDownTable.getTableColumns(e.tableId)],

                    displayOrder: workPackages.displayOrder,
                    priorityOrder: workPackages.priorityOrder,
                  };
                } else {
                  const data = state.dynamicData[wpFieldName].find(
                    (rec) =>
                      rec[0].typeOfWorkId === typeOfWork.id &&
                      rec[0].workPackageId === workPackages.id
                  );
                  // console.log({ data });
                  const data2 = data
                    ? data.find((rec) => rec.id === e.id)
                    : null;
                  // console.log({ data, data2 });
                  return {
                    ...e,
                    typeOfWork: typeOfWork.typeOfWork,
                    workPackage: workPackages.workPackage,
                    value: data2 ? data2.value : e.fieldHtmlDefaultValue,
                    displayOrder: workPackages.displayOrder,
                    priorityOrder: workPackages.priorityOrder,
                  };
                }
              });

              arr.push(newOb.flat());
            }
          });
        });
        const secId = state.masterDropDown.workPackageSectionData[0].sectionId;
        const dynamicField = state.dynamicFields.data.sowTemplateFields.find(
          (e) => e.sectionId === secId
        );

        console.log({ dynamicField });

        const fieldName = dynamicField.fieldName;
        const solHub = state.dynamicData[fieldName];
        let repeat = [];
        solHub.forEach((seg) => {
          if (seg[0].sectionName) {
            if (isWorkPackageFilled(seg)) {
              console.log({ ob: seg, isWorkPackageFilled: true });
              repeat = [...repeat, seg];
            } else {
              console.log({ ob: seg, isWorkPackageFilled: false });
            }

            // repeat = [...repeat, seg];
          }
        });

        const or = arr.map((e) => e[0]);

        const sorted = orderBy(or, [
          "priorityOrder",
          "typeOfWorkId",
          "displayOrder",
        ]);

        const arrr = sorted.map((e) =>
          arr.find((r) => r[0].workPackageId === e.workPackageId)
        );

        repeat = [...arrr, ...repeat];
        // console.log({ arr, sectionName: fieldName, repeat });
        dispatch({
          type: DYNAMIC_DATA_TYPES.PREDEFINED_PACKAGE_ADDED,
          payload: { workPackages: repeat, fieldName },
        });
        /* hide loader*/
        dispatch({
          type: DYNAMIC_DATA_TYPES.SECTION_DATA_LOADED,
        });
        /* reset section count */
        // resetSectionDataCount();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

/* set table data from transactionLog in store */
export const actionDynamicDataLoadEditData = (clone) => {
  return (dispatch) => {
    dispatch(actionCustomWorkPackageLoadEditData());

    const state = Store.getState();

    if (
      state.customModuleSidePanel.customDropDownFetchState !==
      APIFetchStatus.FETCHED
    ) {
      console.log("shouldLoadDynamicData true");

      dispatch(actionCustomWorkPackageShouldLoadEditValueChanged(true));
    } else {
      console.log("shouldLoadDynamicData false");
      const {
        fetchStatus,
        transactionalLog: tl,
        solutionHubLog: sl,
        predefinedLog: pdl,
        customModulesDataLog: cmdl,
      } = state.logData;

      const {
        draftLogsFetchState,
        customerDraftLog,
        transactionalDraftLog,
        predefinedModulesDraftLog,
        solutionHubDraftLog,
        customModulesDraftLog,
        customModulesDataDraftLog,
        e3tPricingDraftLog,
      } = state.draft;

      const transactionalLog =
        fetchStatus === APIFetchStatus.FETCHED ? tl : transactionalDraftLog;
      const solutionHubLog =
        fetchStatus === APIFetchStatus.FETCHED ? sl : solutionHubDraftLog;
      const predefinedLog =
        fetchStatus === APIFetchStatus.FETCHED
          ? pdl
          : predefinedModulesDraftLog;
      const customModulesDataLog =
        fetchStatus === APIFetchStatus.FETCHED
          ? cmdl
          : customModulesDataDraftLog;
      const data = {};
      console.log({
        custom: state.customModuleSidePanel.customDropdown,
        log: state.logData.customModulesDataLog,
      });
      const customModules = Object.values(
        customModulesDataLog
          .map((e) => {
            const t = state.customModuleSidePanel.customDropdown.find(
              (k) => k.id === e.sowCustomModulesData.typeOfWorkId
            );

            console.log({ t, e });
            const w = t.sowCustomModulesWorkPackages.find(
              (k) => k.id === e.sowCustomModulesData.workPackageId
            );
            return {
              ...e.sowCustomModulesData,
              templateId: e.templateId,
              sowCustomModulesDataId: e.sowCustomModulesDataId,
              fieldValue: e.fieldValue,
              createdBy: e.createdBy,
              createdDate: e.createdDate,
              modifiedBy: e.modifiedBy,
              modifiedDate: e.modifiedDate,
              isActive: e.isActive,
              tableValue: e.tableValue,
              sowGeneratedId: e.sowGeneratedId,
              typeOfWork: t.typeOfWork,
              workPackage: w.workPackage,
              sectionName: `${t.typeOfWork} (${w.workPackage})`,
              value: e.fieldValue,
              // workPackageSectionDataId:null
              userId: e.userId,
              displayOrder: e.displayOrder,
            };
          })
          .reduce((ob, curr) => {
            const newOb = { ...ob };
            newOb[curr.workPackageId] = newOb[curr.workPackageId] ?? [];
            newOb[curr.workPackageId] = [...newOb[curr.workPackageId], curr];
            return newOb;
          }, {})
      );
      console.log({ customModules });
      transactionalLog.forEach((row, index) => {
        if (row.field.tableId === null) {
          data[row.field.fieldName.trim()] = row.fieldValue;
        } else if (
          row.field.tableId &&
          row.field.contentControlType === "table"
        ) {
          const val = JSON.parse(row.tableValue);

          data[row.field.fieldName.trim()] = val.map((row) => {
            const ob = {};
            row.map((r) => {
              ob[r.FieldName] = r.value ?? "";
            });
            return ob;
          });

          // console.log({ val, mapped: data[row.field.fieldName.trim()] });

          if (data[row.field.fieldName.trim()].length === 0) {
            data[row.field.fieldName.trim()] = [
              getTableStucture(row.field.fieldName.trim()),
            ];
          }
        } else if (row.field.contentControlTitle === "MSAContent") {
          /* Client agreement - MSA field value */
          data[row.field.fieldName.trim()] = row.fieldValue;
        } else if (
          row.field.tableId &&
          row.field.contentControlType === "radiotable"
        ) {
          data[row.field.fieldName.trim()] = row.fieldValue;
        }
      });
      const ob2 = {};

      const cc = solutionHubLog
        .filter((e) => e.sectionName)
        .map((e) => e.sectionName)
        .reduce((t, c) => {
          if (t.indexOf(c) === -1) {
            return [...t, c];
          }
          return [...t];
        }, []);
      setSectionDataCount(cc.length);
      solutionHubLog.map((e) => {
        if (e.sowSolutionHubData) {
          ob2[e.sowSolutionHubData.workPackageId] =
            ob2[e.sowSolutionHubData.workPackageId] ?? [];

          // const typeOfWorkId = e.sowSolutionHubData.typeOfWorkId;
          // const workPackageId = e.sowSolutionHubData.workPackageId;

          // const field = state.solutionHubDropDown.dropDown.find(
          //   (k) => k.id === e.sowSolutionHubData.typeOfWorkId
          // );

          // const wp = field.sowSolutionHubWorkPackages.find(
          //   (k) => k.id === workPackageId
          // );

          const sowSolutionHubData = e.sowSolutionHubData;
          let cc = 1;
          if (
            sowSolutionHubData &&
            sowSolutionHubData.fieldType &&
            sowSolutionHubData.fieldType === "table"
          ) {
            const { ...rest } = sowSolutionHubData;
            const rec = {
              ...rest,
              tableValue: JSON.parse(e.fieldValue, function (k, v) {
                if (isNaN(k) && k !== camelCase(k)) {
                  this[camelCase(k)] = v;
                } else {
                  return v;
                }
              }),
              // typeOfWork: field.typeOfWork,
              // workPackage: wp.workPackage,
            };
            ob2[e.sowSolutionHubData.workPackageId] = [
              ...ob2[e.sowSolutionHubData.workPackageId],
              rec,
            ];
          } else {
            const rec = {
              ...e.sowSolutionHubData,
              value: e.fieldValue,
              // typeOfWork: field.typeOfWork,
              // workPackage: wp.workPackage,
            };
            ob2[e.sowSolutionHubData.workPackageId] = [
              ...ob2[e.sowSolutionHubData.workPackageId],
              rec,
            ];
          }
        } else {
          const id = e.workPackageSectionDataId;
          const field = state.masterDropDown.workPackageSectionData.find(
            (k) => k.id === id
          );

          const newField = { ...field };
          newField.sectionName = e.sectionName;

          newField.workPackageId = e.workPackageId;
          newField.value = e.fieldValue ?? "<p><br/></p>";
          ob2[e.workPackageId] = ob2[e.workPackageId] ?? [];
          ob2[e.workPackageId] = [...ob2[e.workPackageId], newField];
          // console.log({ sectionName: e.sectionName, newField, e });
        }
      });

      const sectionId =
        state.masterDropDown.workPackageSectionData &&
        state.masterDropDown.workPackageSectionData.length > 0
          ? state.masterDropDown.workPackageSectionData[0].sectionId
          : -999;

      if (sectionId !== -999) {
        const field = state.dynamicFields.data.sowTemplateFields.find(
          (e) => e.sectionId === sectionId
        );
        // customModules.forEach((e) => {
        //   ob2[e.workPackageId] = ob2[e.workPackageId] ?? [];
        //   ob2[e.workPackageId] = [...ob2[e.workPackageId], e];
        // });
        console.log({ ob2 });
        const val = Object.values(ob2);

        const solutionHubLogWp = solutionHubLog
          .map((e) => e.workPackageId)
          .reduce((arr, curr) => {
            if (arr.indexOf(curr) > -1) {
              return arr;
            } else {
              return [...arr, curr];
            }
          }, []);
        // const wppp = solutionHubLogWp.map((e) => ob2[e]);

        data[field.fieldName] = [
          ...solutionHubLogWp.map((e) => ob2[e]),
          ...customModules,
        ].sort((a, b) => (a[0].displayOrder > b[0].displayOrder ? -1 : 1));
      }

      // console.log({ data, ob2, field });

      if (clone) {
        data["Customer Name"] = state.customerData.accountName;
        data["Country Entity Name"] = state.customerData.countryName;
        data["Country"] = state.masterData.country;
        data["Currency"] = state.e3tData.e3tRegionalData[0].fx;
      }

      dispatch({
        type: DYNAMIC_DATA_TYPES.FIELDS_PAGE_UPDATE,
        payload: data,
      });

      if (clone) {
        dispatch(actionE3TRecalculate());
      }
    }
  };
};

export const actionDynamicDataReset = () => {
  return (dispatch) => {
    resetDynamicTableStructure();
    dispatch({
      type: DYNAMIC_DATA_TYPES.FIELDS_RESET,
    });
  };
};

export const actionDynamicDataUpdateE3T = (
  consulting,
  tooling,
  tra,
  totalContractValue,
  currency
) => {
  return async (dispatch) => {
    if (currency) {
      const ob = {
        Currency: currency,
        "Consulting Services Price": consulting,
        "Travel and Expense Price": tra,
        "Tooling Software Price": tooling,
        "Pricing Estimate Cost": totalContractValue,
      };

      dispatch({
        type: DYNAMIC_DATA_TYPES.FIELDS_PAGE_UPDATE,
        payload: ob,
      });
    } else {
      const ob = {
        "Consulting Services Price": consulting,
        "Travel and Expense Price": tra,
        "Tooling Software Price": tooling,
        "Pricing Estimate Cost": totalContractValue,
      };

      dispatch({
        type: DYNAMIC_DATA_TYPES.FIELDS_PAGE_UPDATE,
        payload: ob,
      });
    }
  };
};

export const actionDynamicDataWorkPackageMoved = (name, origId, dropId) => {
  return (dispatch) => {
    // console.log({ name, origId, dropId });

    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_MOVED,
      payload: { name, origId, dropId },
    });
  };
};

export const actionDynamicDataWorkPackageMoveEnd = (
  name,
  sourceIndex,
  destIndex
) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_UPDATE_END,
      payload: { name, sourceIndex, destIndex },
    });
  };
};

export const actionDynamicDataProductLineSKUChanged = (sku, skuList) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.PRODUCTLINE_SKU_CHANGED,
      payload: { sku, skuList },
    });
  };
};

export const actionDynamicDataSKUEditUpdate = (newSKU) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.SKU_EDIT_UPDATE,
      payload: { newSKU },
    });
  };
};

export const actionDynamicDataFieldsEditWorkPackagesUpdated = (name, data) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.EDIT_WORK_PACKAGES_INIT,
      payload: { name, data },
    });
  };
};

export const actionDynamicDataFieldsWorkPackageTableValueChanged = (
  name,
  parentId,
  childId,
  columnId,
  value
) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_TABLE_UPDATE,
      payload: {
        name,
        parentId,
        childId,
        columnId,
        value,
      },
    });
  };
};

export const actionDynamicDataFieldsWorkPackageTableRowAdded = (
  name,
  parentId
) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_TABLE_ROW_ADD,
      payload: {
        name,
        parentId,
      },
    });
  };
};

export const actionDynamicDataFieldsWorkPackageTableRowRemoved = (
  name,
  parentId,
  childId
) => {
  return (dispatch) => {
    dispatch({
      type: DYNAMIC_DATA_TYPES.WORK_PACKAGE_TABLE_ROW_REMOVE,
      payload: {
        name,
        parentId,
        childId,
      },
    });
  };
};
