import axios from "axios";
import { includes, uniq, uniqBy } from "lodash";
import URLConfig from "../../../URLConfig";
import { getRandomWorkPkgID } from "../../../dynamicData.support";
import { Store } from "../../Store";
import { actionDynamicDataSKUEditUpdate } from "../DynamicDataFields";
import { DYNAMIC_DATA_TYPES } from "../DynamicDataFields/dynamicDataType";
import { resetDynamicTableStructure } from "../DynamicDataFields/dynamicTableStructure";
import {
  actionFetchDynamicFields,
  actionResetDynamicFields,
} from "../DynamicFields";
import { actionE3TFetchRegionalData } from "../E3TData";
import { actionMasterDataValueChanged } from "../MasterData";
import { MASTER_DATA_ACTION_TYPES } from "../MasterData/MasterDataType";
import { actionSolutionHubDataReset } from "../SolutionHubData";
import {
  actionFetchSolutionHubDropDownData,
  actionSolutionHubDropDownReset,
} from "../SolutionHubDropDown";
import { MASTER_DROP_DOWN_DATA_ACTION_TYPES } from "./MasterDropDownType";
import {
  pushSectionDataStructure,
  resetSectionDataStructure,
} from "./sectionDataStructure";
import { actionFetchCustomModulesDropdown } from "../CustomModulesSidePanel";
import { actionCustomerDataGetServiceTypes } from "../CustomerData";
import { APIFetchStatus } from "../../utils/fetchStatus";

export const actionMasterDropDownFetchAll = (country, template, edit) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FETCHING,
      });

      const myTemplate = template ?? "10";
      const myCountry = country ?? "Australia";

      // const myCountry =  "Australia";

      const URL1 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetCountryDropdownV2";
      const URL2 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetBusinessDropdown";
      const URL3 =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetContractTermsDropdown";
      const URL4 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetRevRecogDropdown";
      const URL5 =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetPracticeDomainDropdown";
      // const URL5 =
      // URLConfig.getURLDeltaSOWAPI() + "SOW/GetTemplateDropdown/Australia";
      // const URL6 = URLConfig.getProductLineDropDownURL();
      // const URL7 =
      //   URLConfig.getURLDeltaSOWAPI() +
      //   "SOW/GetWorkPackageSectionData/" +
      //   myTemplate;

      const arrPr = [
        axios.get(URL1),
        axios.get(URL2),
        axios.get(URL3),
        axios.get(URL4),
        axios.get(URL5),
        // axios.get(URL5),
        // axios.get(URL6),
        // axios.get(URL7),
      ];
      const res = await Promise.all(arrPr);
      console.log({ res });

      const ob = {};
      ob["countryDropDownData"] = res[0].data.map((e) => ({
        id: e.worldRegionInternalName,
        name: e.countryNameText,
      }));
      ob["businessDropDownData"] = res[1].data.map((d) => d.value);
      ob["contractTermsDropDownData"] = res[2].data.map((d) => d.contractTerm);
      ob["revRecogDropDownData"] = res[3].data
        .sort((a, b) => {
          return a.displayOrder > b.displayOrder ? 1 : -1;
        })
        .map((d) => d.revRecognMethod);

      ob["practiceDomainDropDownData"] = res[4].data;
      // ob["templateFieldDropDownData"] = res[4].data;
      // ob["productLineDropDownData"] = res[5].data;
      // ob["workPackageSectionData"] = res[4].data.map((e) => ({
      //   ...e,
      //   workPackageId: 10000,
      //   workPackageSectionDataId: e.id,
      // }));

      // console.log({ ob });

      // resetSectionDataStructure();
      // const data = ob["workPackageSectionData"];
      // // console.log({ SECTION_DATA_STRUCTURE });
      // for (let i = 0; i < data.length; i++) {
      //   const row = { ...data[i], id: getRandomWorkPkgID() };
      //   row.value = row.value ?? "<p><br></p>";
      //   row["sectionName"] = "Work Package Details";
      //   // SECTION_DATA_STRUCTURE = [...SECTION_DATA_STRUCTURE, row];
      //   pushSectionDataStructure(row);
      // }
      dispatch(actionSolutionHubDataReset());
      if (edit) {
        // dispatch(actionFetchSolutionHubDropDownData(myTemplate, edit));
      } else {
        const state = Store.getState();
        const masterData = state.masterData;
        dispatch({
          type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
          payload: {
            business: masterData.business
              ? masterData.business
              : res[1].data[0],
            country: masterData.country ? masterData.country : "",
            contractTerms: masterData.contractTerms
              ? masterData.contractTerms
              : ob["contractTermsDropDownData"][0],
            revRecog: masterData.revRecog
              ? masterData.revRecog
              : ob["revRecogDropDownData"][0],
            sowTemplate: masterData.sowTemplate
              ? masterData.sowTemplate
              : // : ob["templateFieldDropDownData"][0]["templateInputName"],
                "",
          },
        });
      }

      dispatch({
        type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FETCHED,
        payload: ob,
      });
      const state = Store.getState();
      const productLine = state.customerData.productLine;
      const isClone = state.customerData.isClone;
      const isNew = state.customerData.isNew;

      if (edit) {
      } else if (!isClone && isNew) {
        dispatch(actionCustomerDataGetServiceTypes(productLine, edit, false));
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FAILED,
      });
    }
  };
};

export const actionMasterDropDownSaveProductLineData = (productLines) => {
  return (dispatch) => {
    dispatch({
      type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SAVE_PRODUCTLINE_DATA,
      payload: productLines,
    });
  };
};

export const actionMasterDropDownFetchTemplateField = (
  country,
  businessName,
  edit,
  clone = false
) => {
  return async (dispatch) => {
    console.trace("actionMasterDropDownFetchTemplateField");
    try {
      dispatch({
        type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.TEMPLATE_FIELD_FETCHING,
      });

      let countryName = country;
      let business = businessName;
      const state = Store.getState();
      if (countryName.length === 0) {
        countryName = state.masterData.country;
      }
      console.log({ business, countryName });
      const cn = state.masterDropDown.countryDropDownData.find(
        (e) => e.id === countryName
      );

      if (businessName.length === 0) {
        // const state = Store.getState();
        business = state.masterData.business;
      }
      console.log({ cn, country: state.masterDropDown.countryDropDownData });

      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetTemplateDropdownV2";

      const res = await axios.get(URL, {
        params: { countryName: cn.name, businessName: business },
      });
      const existingTemplateId = state.logData?.latestData?.templateId;

      if (edit) {
        // get template ID
        const state = Store.getState();
        // const id = state.logData.customerLog
        //   ? state.logData.customerLog[0].templateId.toString()
        //   : state.draft.customerDraftLog[0].templateId.toString();

        const id =
          state.draft.draftLogsFetchState === APIFetchStatus.FETCHED &&
          state.draft.customerDraftLog &&
          state.draft.customerDraftLog.length > 0
            ? state.draft.customerDraftLog[0].templateId.toString()
            : state.logData.customerLog[0].templateId.toString();
        // const p = state.logData.customerLog.find(
        //   (e) => e.standardField.fieldName === "productLine"
        // );

        dispatch(actionMasterDataValueChanged("sowTemplate", id));
        dispatch(actionMasterDropDownFetchSectionData(id, true));
        dispatch(actionFetchCustomModulesDropdown(id));
      } else {
        // console.log({ res });
        if (res.data && res.data.length > 0) {
          const id = res.data[0].id.toString();
          console.log({ id });
          const state = Store.getState();
          const nowId = state.masterData.sowTemplate;
          if (clone) {
            dispatch(actionMasterDataValueChanged("sowTemplate", nowId));
          } else {
            if (
              includes(
                res.data.map((e) => e.id),
                existingTemplateId
              )
            ) {
              dispatch(
                actionMasterDataValueChanged("sowTemplate", existingTemplateId)
              );
            } else {
              dispatch(actionMasterDataValueChanged("sowTemplate", id));
            }
            dispatch(actionFetchCustomModulesDropdown(id));
            dispatch(
              actionMasterDropDownFetchSectionData(id, false, id === nowId)
            );
          }
        } else {
          dispatch(actionMasterDataValueChanged("sowTemplate", ""));
          dispatch({
            type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FETCHED,
            payload: [],
          });
        }
      }

      dispatch({
        type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.TEMPLATE_FIELD_FETCHED,
        payload: res.data.map((e) => ({ ...e, name: e.templateInputName })),
      });
      // dispatch(actionMasterDropDownFetchSectionData())
    } catch (err) {
      console.log(err);
      dispatch({
        type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.TEMPLATE_FIELD_FAILED,
      });
    }
  };
};

export const actionMasterDropDownFetchSectionData = (id, edit, dontFetch) => {
  return async (dispatch) => {
    if (dontFetch) {
      dispatch({
        type: "PASS",
        // payload: newArr,
      });
    } else {
      try {
        dispatch({
          type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FETCHING,
        });

        const URL =
          URLConfig.getURLDeltaSOWAPI() + "SOW/GetWorkPackageSectionData";

        const res = await axios.get(URL, { params: { templateId: id } });

        const newArr = res.data.map((e) => ({
          ...e,
          workPackageId: 10000,
          workPackageSectionDataId: e.id,
          value: e.fieldDefaultValue ?? "<p><br></p>",
        }));

        resetSectionDataStructure();
        const data = [...newArr];
        // console.log({ SECTION_DATA_STRUCTURE });
        for (let i = 0; i < data.length; i++) {
          const row = { ...data[i], id: getRandomWorkPkgID() };
          if (row.fieldType === "table") {
            row.tableValue = data.filter((v) => v.fieldName !== row.fieldName);
            console.log({ row });
          } else {
            row.value = row.value ?? "<p><br></p>";
          }
          row["sectionName"] = "Work Package Details";
          // SECTION_DATA_STRUCTURE = [...SECTION_DATA_STRUCTURE, row];
          pushSectionDataStructure(row);
        }
        dispatch({
          type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FETCHED,
          payload: newArr,
        });
        // dispatch(actionFetchCustomModulesDropdown(id));
        if (edit) {
          dispatch(actionFetchDynamicFields(id, true));
        } else {
          // const id = res.data[0].id;
          dispatch(actionFetchDynamicFields(id));
          dispatch(actionFetchSolutionHubDropDownData(id));
        }
      } catch (err) {
        console.log(err);
        dispatch({
          type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FAILED,
        });
      }
    }
  };
};

export const actionMasterDropDownDataReset = () => {
  return (dispatch) => {
    resetSectionDataStructure();
    dispatch({
      type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_RESET,
    });
  };
};

export const actionMasterDropDownDataTemplateChangedNew = (id) => {
  return async (dispatch) => {
    dispatch(actionResetDynamicFields());
    resetSectionDataStructure();
    resetDynamicTableStructure();
    dispatch(actionSolutionHubDropDownReset());

    dispatch(actionMasterDropDownFetchSectionData(id));
  };
};

// export const actionMasterDropDownDataTemplateChanged = (id, clone) => {
//   return async (dispatch) => {
//     try {
//       console.log({ id });
//       dispatch({
//         type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FETCHING,
//       });

//       const state = Store.getState();

//       dispatch(actionResetDynamicFields());
//       resetSectionDataStructure();
//       resetDynamicTableStructure();

//       const URL7 =
//         URLConfig.getURLDeltaSOWAPI() + "SOW/GetWorkPackageSectionData/" + id;

//       const res = await axios.get(URL7);
//       const data = res.data;

//       const ob = {};
//       ob["countryDropDownData"] = state.masterDropDown.countryDropDownData;
//       ob["businessDropDownData"] = state.masterDropDown.businessDropDownData;
//       ob["contractTermsDropDownData"] =
//         state.masterDropDown.contractTermsDropDownData;
//       ob["revRecogDropDownData"] = state.masterDropDown.revRecogDropDownData;
//       ob["templateFieldDropDownData"] =
//         state.masterDropDown.templateFieldDropDownData;
//       ob["productLineDropDownData"] =
//         state.masterDropDown.productLineDropDownData;
//       ob["workPackageSectionData"] = data.map((e) => ({
//         ...e,
//         workPackageId: 10000,
//         workPackageSectionDataId: e.id,
//       }));

//       dispatch({
//         type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FETCHED,
//         payload: ob,
//       });
//       resetSectionDataStructure();
//       const dd = ob["workPackageSectionData"];
//       for (let i = 0; i < dd.length; i++) {
//         const row = { ...dd[i], id: getRandomWorkPkgID() };
//         row.value = row.value ?? "<p><br></p>";
//         row["sectionName"] = "Work Package Details";
//         pushSectionDataStructure(row);
//       }

//       dispatch(actionFetchSolutionHubDropDownData(id));
//       dispatch(actionFetchDynamicFields(id, true));
//       dispatch(actionCustomerDataGetServiceTypes(productLine, edit));
//       // dispatch(
//       //   dispatch(actionCustomerDataGetServiceTypes(productLine, edit));
//       //   // actionMasterDataDropDownFetchSKU(state.customerData.productLine)
//       // );

//       if (clone) {
//       }
//     } catch (err) {
//       console.error( err );
//       dispatch({
//         type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.ALL_DROPDOWN_DATA_FAILED,
//       });
//     }
//   };
// };

// export const actionMasterDataDropDownFetchSKU = (productLine, edit) => {
//   return async (dispatch) => {
//     try {
//       dispatch({ type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FETCHING });
//       const URL =
//         URLConfig.getURLDeltaSOWAPI() + "SOWE3T/GetServiceTypeMappingData";
//       const res = await axios.get(URL, { params: { productLine } });
//       const serviceType = res.data.business.description;
//       const URL2 = URLConfig.getSKUListUrl(serviceType, productLine);

//       const res2 = await axios(URL2);

//       if (res2?.data?.response?.docs) {
//         const skuList = res2?.data?.response?.docs;

//         dispatch({
//           type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FETCHED,
//           payload: skuList.map((e) => ({
//             ...e,
//             value: e.sku,
//             label: `${e.sku}-${e.sku_description}`,
//           })),
//         });

//         if (edit) {
//           const state = Store.getState();

//           const predefSKU = state.customerData.sku
//             .filter((e) => {
//               if (
//                 state.masterDropDown.sku.findIndex((k) => k.sku === e.sku) > -1
//               ) {
//                 return true;
//               }
//               return false;
//             })
//             .map((e) => e.sku);

//           const newSKU = state.dynamicData["SKU Table"].map((e) => {
//             if (predefSKU.indexOf(e["Service Activity"]) > -1) {
//               return { ...e, "Service Activity_isDisabled": true };
//             }
//             return { ...e };
//           });
//           dispatch(actionDynamicDataSKUEditUpdate(newSKU));
//           // console.log({ newSKU });
//         }
//       } else {
//         dispatch({ type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FAILED });
//       }
//     } catch (err) {
//       console.error( err );
//       dispatch({ type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FAILED });
//     }

//     // const
//   };
// };

export const actionSectionDataValueChanged = (value, id) => {
  return (dispatch) => {
    try {
      dispatch({
        type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_VALUE_CHANGED,
        payload: { value, id },
      });
    } catch (err) {
      console.log({ err });
    }
  };
};
