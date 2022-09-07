import URLConfig from "../../../URLConfig";
import { CUSTOMER_DATA_TYPE } from "./CustomerDataType";
import axios from "axios";
import {
  actionMasterDataOpportunityIdFetched,
  actionMasterDataValueChanged,
} from "../MasterData";
import { Store } from "../../Store";
import { actionE3TFetchRegionalData } from "../E3TData";
import { DYNAMIC_DATA_TYPES } from "../DynamicDataFields/dynamicDataType";
import {
  actionMasterDropDownFetchTemplateField,
  actionMasterDropDownSaveProductLineData,
} from "../MasterDropDown";
import { MASTER_DROP_DOWN_DATA_ACTION_TYPES } from "../MasterDropDown/MasterDropDownType";
import { APIFetchStatus } from "../../utils/fetchStatus";
import { isArray, isNumber, uniq, uniqBy } from "lodash";
import {
  actionCloneSafeSaveCustomerData,
  actionCloneSafeSaveProductLines,
  actionCloneSafeShowModal,
} from "../CloneSafe";
import { MASTER_DATA_ACTION_TYPES } from "../MasterData/MasterDataType";
import { resetAll } from "./../ResetAll";
import { toast } from "react-toastify";

export const actionCustomerDataValueChanged = (name, value) => {
  return (dispatch) => {
    if (name === "accountName") {
      dispatch({
        type: DYNAMIC_DATA_TYPES.FIELDS_CHANGED,
        payload: {
          "Customer Name": value,
        },
      });
    } else if (name === "countryName") {
      dispatch({
        type: DYNAMIC_DATA_TYPES.FIELDS_CHANGED,
        payload: {
          "Country Entity Name": value,
        },
      });
      dispatch({
        type: DYNAMIC_DATA_TYPES.FIELDS_CHANGED,
        payload: {
          Country: value,
        },
      });
    }
    dispatch({
      type: CUSTOMER_DATA_TYPE.VALUE_CHANGED,
      payload: { [name]: value },
    });
  };
};

export const actionFetchCustomerData = (oppId, chain, edit, cl) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CUSTOMER_DATA_TYPE.API_DATA_FETCHING,
      });

      dispatch({
        type: CUSTOMER_DATA_TYPE.NO_RESPONSE_ERROR_HANDLER,
        payload: "",
      });

      const state = Store.getState();
      let clone = cl && !state.cloneSafe.cloneBreak;
      const URL = URLConfig.getSOWSFDCUrl(oppId);

      const res = await axios(URL);
      let data = res.data;

      // console.log({ data });
      dispatch({
        type: CUSTOMER_DATA_TYPE.ISCLONE,
        payload: { new: true, clone },
      });
      const records = data.response.records[0];

      if (records !== undefined || records != null) {
        let country = "";
        let productLine = "";
        let countryName = "";
        let productLineItems_PayLoad = [];
        if (
          records["OpportunityLineItems"] &&
          records["OpportunityLineItems"]["records"] &&
          Array.isArray(records["OpportunityLineItems"]["records"]) &&
          records["OpportunityLineItems"]["records"].length > 0
        ) {
          productLine = records["OpportunityLineItems"]["records"]
            .filter((e) => e.Product_Line__c)[0]
            ["Product_Line__c"]?.split("-")[0]
            .trim();
          productLineItems_PayLoad = uniqBy(
            records["OpportunityLineItems"]["records"]
              .filter((e) => e.Product_Line__c)
              .map((e) => {
                const productLine = e.Product_Line__c; //.split("-")[0].trim(); <-- per SPID 13
                return {
                  ...e,
                  id: productLine,
                  name: productLine,
                };
              }),
            "id"
          );
        } else {
          if (!(edit === true || clone === true)) {
            toast.warn(
              "product line Items were not found for the opportunity id; please choose a product line.",
              {
                position: "bottom-left",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
          const URL = URLConfig.GetProductLineDropdown_v2();
          const response = await axios.get(URL);
          productLineItems_PayLoad = response.data.map((e) => ({
            ...e,
            id: e.productLine + " - " + e.description,
            name: e.productLine + " - " + e.description,
          }));
        }
        if (records.Account?.Country_Code__c) {
          country = records.Account?.Country_Code__c;
        } else {
          dispatch({
            type: CUSTOMER_DATA_TYPE.NO_RESPONSE_ERROR_HANDLER,
            payload: "There is no country code, other things may not work",
          });
          throw Error;
        }
        countryName = records.Country__c;
        dispatch(actionMasterDataOpportunityIdFetched(country, edit));
        if (clone) {
          let newProductLine = "";
          dispatch(actionCloneSafeSaveCustomerData(records));
          const state = Store.getState();
          const business = state.logData.customerLog.find(
            (e) => e.standardField.fieldName === "business"
          );

          const sRes = await axios.post(
            URLConfig.getURLDeltaSOWAPI() +
              "SOWE3T/GetServiceTypeMappingDataList",
            {
              productLines: productLineItems_PayLoad.map((e) =>
                e.id?.split("-")[0].trim()
              ),
              business: business.fieldDefaultValue,
            }
          );
          dispatch(actionCloneSafeSaveProductLines(sRes.data));
          // check

          if (sRes.data && sRes.data.length > 0) {
            const t = sRes.data.find(
              (e) => e.productLine === state.customerData.productLine
            );
            newProductLine = t?.productLine ?? sRes.data[0]?.productLine;

            const rec = state.logData.customerLog.find(
              (e) => e.standardField.fieldName === "country"
            );
            const prevCountryVal = rec.fieldDefaultValue;
            if (prevCountryVal !== country) {
              console.log({ country });
              dispatch(
                actionE3TFetchRegionalData(country, newProductLine, true)
              );
            }
            dispatch({
              type: CUSTOMER_DATA_TYPE.API_DATA_FETCHED,
              payload: {
                accountName: records.Account.Name,
                geo: records.Account.WorldRegion_Region__c,
                countryName,
                country: country,
                // Setting Country Dropdown value
                // country: res.data.response[0].Opportunity__r_Country__c,
                oppId,
                businessName:
                  business.fieldDefaultValue ?? records.Business_Group2__c,
                salesStage: records.Opportunity_Sales_Stage__c,
                winLossReason: records.Win_Loss_Reason__c,
                productLine: newProductLine,
              },
            });
            dispatch(
              actionMasterDropDownSaveProductLineData(productLineItems_PayLoad)
            );
            dispatch({
              type: DYNAMIC_DATA_TYPES.FIELDS_CHANGED,
              payload: {
                "Customer Name": records.Account.Name,
                "Country Entity Name": countryName,
              },
            });
          } else {
            dispatch(actionCloneSafeShowModal("customer-data"));
          }
        } else {
          dispatch({
            type: CUSTOMER_DATA_TYPE.API_DATA_FETCHED,
            payload: {
              accountName: records.Account.Name,
              geo: records.Account.WorldRegion_Region__c,
              countryName,
              country,
              // Setting Country Dropdown value
              // country: res.data.response[0].Opportunity__r_Country__c,
              oppId,
              businessName: records.Business_Group2__c,
              salesStage: records.Opportunity_Sales_Stage__c,
              winLossReason: records.Win_Loss_Reason__c,
              productLine: productLine,
            },
          });
          dispatch(
            actionMasterDropDownSaveProductLineData(productLineItems_PayLoad)
          );
        }

        dispatch(
          actionCustomerDataGetServiceTypes(productLine, edit, false, clone)
        );

        // if (edit) {
        // } else if (!clone) {
        //   dispatch(actionCustomerDataGetServiceTypes(productLine, edit, false));
        // }
        if (!clone) {
          dispatch({
            type: DYNAMIC_DATA_TYPES.FIELDS_CHANGED,
            payload: {
              "Customer Name": records.Account.Name,
              "Country Entity Name": countryName,
            },
          });
        }
        if (chain) {
          if (edit) {
            console.log({ chain });
            dispatch(chain(productLineItems_PayLoad));
          } else {
            console.log({ country, productLine, new: true });
            dispatch(actionE3TFetchRegionalData(country, productLine));
            dispatch(chain());
          }
        } else {
          console.log("no chain");
          if (edit) {
          } else if (!clone) {
            console.log("no edit");

            dispatch(actionE3TFetchRegionalData(country, productLine));
          }
        }
      } else {
        dispatch(resetAll());
        toast.warn("invalid opportunity");
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: CUSTOMER_DATA_TYPE.API_DATA_FAILED,
      });
    }
  };
};

export const actionCustomerDataReset = () => {
  return (dispatch) => {
    dispatch({
      type: CUSTOMER_DATA_TYPE.RESET_DATA,
    });
  };
};

export const actionFetchCustomerDataClone = () => {
  return async (dispatch) => {
    const state = Store.getState();
    const cloneSafe = state.cloneSafe;
    const customerData = cloneSafe.customerData;
    const countryName = customerData.Country__c;
    const country = customerData.Account?.Country_Code__c;
    const productLine = customerData["OpportunityLineItems"]["records"]
      .filter((e) => e.Product_Line__c)[0]
      ["Product_Line__c"]?.split("-")[0]
      .trim();
    dispatch({
      type: CUSTOMER_DATA_TYPE.API_DATA_FETCHED,
      payload: {
        accountName: customerData.Account.Name,
        geo: customerData.Account.WorldRegion_Region__c,
        countryName,
        country,
        // Setting Country Dropdown value
        // country: res.data.response[0].Opportunity__r_Country__c,
        //   oppId,
        businessName: customerData.Business_Group2__c,
        salesStage: customerData.Opportunity_Sales_Stage__c,
        winLossReason: customerData.Win_Loss_Reason__c,
        productLine: productLine,
      },
    });
    let productLineItems_PayLoad = uniqBy(
      customerData["OpportunityLineItems"]["records"]
        .filter((e) => e.Product_Line__c)
        .map((e) => {
          const productLine = e.Product_Line__c; //.split("-")[0].trim(); <-- per SPID 13
          return {
            ...e,
            id: productLine,
            name: productLine,
          };
        }),
      "id"
    );
    dispatch(actionMasterDropDownSaveProductLineData(productLineItems_PayLoad));
    dispatch(actionCustomerDataGetServiceTypes(productLine, false, false));
    dispatch({
      type: DYNAMIC_DATA_TYPES.FIELDS_CHANGED,
      payload: {
        "Customer Name": customerData.Account.Name,
        "Country Entity Name": countryName,
      },
    });
    dispatch(actionE3TFetchRegionalData(country, productLine, false, true));
  };
};

export const actionCustomerDataLoadDraft = (productLineItems_PayLoad) => {
  return (dispatch) => {
    // console.trace("actionCustomerDataLoadEdit")
    const state = Store.getState();
    const customerLogData = state.draft.customerDraftLog;
    let countryRec = customerLogData.find(
      (e) => e.standardField.fieldName === "country"
    );

    let tempId = customerLogData[0].templateId;

    const customerData = {
      accountName: "",
      geo: "",
      SKU: [],
      countryName: "",
      businessName: "",
      salesStage: "",
      winLossReason: "",
      productLine: "",
    };

    customerLogData.forEach((row) => {
      switch (row.standardField.fieldName) {
        case "accountName":
          customerData.accountName = row.fieldDefaultValue;
          break;
        case "geo":
          customerData.geo = row.fieldDefaultValue;
          break;
        case "countryCode":
          customerData.country = row.fieldDefaultValue;
          break;
        case "countryName":
          customerData.countryName = row.fieldDefaultValue;
          break;
        case "businessName":
          customerData.businessName = row.fieldDefaultValue;
          break;
        case "salesStage":
          customerData.salesStage = row.fieldDefaultValue ?? "";
          break;
        case "winLossReason":
          customerData.winLossReason = row.fieldDefaultValue ?? "";
          break;
        case "productLine":
          if (
            isArray(productLineItems_PayLoad) &&
            productLineItems_PayLoad.length > 0
          ) {
            let productLineExistsInDropDownList = productLineItems_PayLoad.some(
              (item) => row.fieldDefaultValue === item.id?.split("-")[0].trim()
            );
            if (productLineExistsInDropDownList) {
              customerData.productLine = row.fieldDefaultValue;
            } else {
              customerData.productLine = "";
              toast.warn(
                "the previous product line does not exist, please select from current product line list.",
                {
                  position: "bottom-left",
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );
            }
          } else {
            customerData.productLine = row.fieldDefaultValue;
          }
          break;
        case "SKU":
          customerData.sku = row.fieldDefaultValue
            ? JSON.parse(row.fieldDefaultValue)
            : [];
          break;
        default:
          break;
      }
    });

    console.log({ tempId });

    // if (tempId === 15) {
    dispatch(actionCustomerDataGetServiceTypes(customerData.productLine, true));
    // }
    console.log({ countryRec });
    dispatch(
      actionE3TFetchRegionalData(
        countryRec.fieldDefaultValue,
        customerData.productLine,
        true
      )
    );

    dispatch({
      type: CUSTOMER_DATA_TYPE.VALUE_CHANGED,
      payload: { ...customerData },
    });
  };
};

export const actionCustomerDataLoadEdit = (productLineItems_PayLoad) => {
  return (dispatch) => {
    // console.trace("actionCustomerDataLoadEdit")
    const state = Store.getState();
    const customerLogData = state.logData.customerLog;
    let countryRec = customerLogData.find(
      (e) => e.standardField.fieldName === "country"
    );

    let tempId = customerLogData[0].templateId;

    const customerData = {
      accountName: "",
      geo: "",
      SKU: [],
      countryName: "",
      businessName: "",
      salesStage: "",
      winLossReason: "",
      productLine: "",
    };

    customerLogData.forEach((row) => {
      switch (row.standardField.fieldName) {
        case "accountName":
          customerData.accountName = row.fieldDefaultValue;
          break;
        case "geo":
          customerData.geo = row.fieldDefaultValue;
          break;
        case "countryCode":
          customerData.country = row.fieldDefaultValue;
          break;
        case "countryName":
          customerData.countryName = row.fieldDefaultValue;
          break;
        case "businessName":
          customerData.businessName = row.fieldDefaultValue;
          break;
        case "salesStage":
          customerData.salesStage = row.fieldDefaultValue ?? "";
          break;
        case "winLossReason":
          customerData.winLossReason = row.fieldDefaultValue ?? "";
          break;
        case "productLine":
          if (
            isArray(productLineItems_PayLoad) &&
            productLineItems_PayLoad.length > 0
          ) {
            let productLineExistsInDropDownList = productLineItems_PayLoad.some(
              (item) => row.fieldDefaultValue === item.id?.split("-")[0].trim()
            );
            if (productLineExistsInDropDownList) {
              customerData.productLine = row.fieldDefaultValue;
            } else {
              customerData.productLine = "";
              toast.warn(
                "the previous product line does not exist, please select from current product line list.",
                {
                  position: "bottom-left",
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );
            }
          } else {
            customerData.productLine = row.fieldDefaultValue;
          }
          break;
        case "SKU":
          customerData.sku = row.fieldDefaultValue
            ? JSON.parse(row.fieldDefaultValue)
            : [];
          break;
        default:
          break;
      }
    });

    console.log({ tempId });

    // if (tempId === 15) {
    dispatch(actionCustomerDataGetServiceTypes(customerData.productLine, true));
    // }
    console.log({ countryRec });
    dispatch(
      actionE3TFetchRegionalData(
        countryRec.fieldDefaultValue,
        customerData.productLine,
        true
      )
    );

    dispatch({
      type: CUSTOMER_DATA_TYPE.VALUE_CHANGED,
      payload: { ...customerData },
    });
  };
};

export const actionCustomerDataResetSKU = () => {
  return (dispatch) => {
    dispatch({
      type: CUSTOMER_DATA_TYPE.RESET_SKU,
    });
  };
};

export const actionCustomerDataRemoveSKUIndex = (index) => {
  return (dispatch) => {
    dispatch({
      type: CUSTOMER_DATA_TYPE.REMOVE_SKU_INDEX,
      payload: { index },
    });
  };
};

export const actionCustomerDataGetServiceTypes = (
  productLine,
  edit,
  changed,
  clone = false
) => {
  return async (dispatch) => {
    try {
      const state = Store.getState();
      if (state.masterDropDown.countryDropDownData.length === 0) {
        dispatch({
          type: "actionCustomerDataGetServiceTypes countryDD not available",
        });
      } else if (state.masterData.country.length === 0) {
        dispatch({
          type: "actionCustomerDataGetServiceTypes country not available",
        });
      } else {
        dispatch({
          type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FETCHING,
        });
        const URL2 =
          URLConfig.getURLDeltaSOWAPI() + "SOWE3T/GetServiceTypeMappingData";
        const res2 = await axios.get(URL2, { params: { productLine } });
        const data = res2.data;
        if (data) {
          // console.trace({ GetServiceTypeMappingData: res2.data });

          const business = res2.data.business.value;

          // if (clone) {
          //   const newState = Store.getState();
          //   const bus = newState.masterData.business;
          //   dispatch(actionMasterDataValueChanged("business", bus));
          //   dispatch(
          //     actionMasterDropDownFetchTemplateField("", bus, edit)
          //   );
          // } else
          if (!changed && !edit) {
            dispatch(actionMasterDataValueChanged("business", business));
            dispatch(
              actionMasterDropDownFetchTemplateField("", business, edit, clone)
            );
          } else if (edit) {
            const logs = state.logData.customerLog.find(
              (e) => e.standardField.fieldName === "business"
            );

            const logs2 = state.draft.customerDraftLog.find(
              (e) => e.standardField.fieldName === "business"
            );

            dispatch(
              actionMasterDropDownFetchTemplateField(
                "",
                logs ? logs["fieldDefaultValue"] : logs2["fieldDefaultValue"],
                edit
              )
            );
          }

          dispatch({
            type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FETCHED,
            payload: res2.data.sowSkuPlMappings.map((e) => ({
              ...e,
              value: e.sku,
              label: `${e.sku}-${e.skuDescription}`,
            })),
          });
        } else {
          console.warn("OPP_ID not found");
          if (!changed && !edit) {
            dispatch(actionMasterDataValueChanged("business", ""));
          }

          if (edit) {
            // const state = Store.getState();
            const businessField = state.logData.customerLog.find(
              (e) => e.standardField.fieldName === "business"
            );
            dispatch(
              actionMasterDropDownFetchTemplateField(
                "",
                businessField.fieldDefaultValue,
                edit
              )
            );
          } else {
            console.log("setting MDD to []", changed, edit);
            // dispatch(actionMasterDropDownFetchTemplateField("", business, edit));
            if (changed) {
              // const state = Store.getState();
              const templateFieldDropDownData =
                state.masterDropDown.templateFieldDataFetchStatus;
              const workPackageSectionDataFetchStatus =
                state.masterDropDown.workPackageSectionDataFetchStatus;
              const skuFetchStatus = state.masterDropDown.skuFetchStatus;

              if (
                templateFieldDropDownData === APIFetchStatus.BOOTED ||
                templateFieldDropDownData === APIFetchStatus.FETCHING
              ) {
                dispatch(actionMasterDataValueChanged("sowTemplate", ""));
                dispatch({
                  type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.TEMPLATE_FIELD_FETCHED,
                  payload: [],
                });
              } else if (
                workPackageSectionDataFetchStatus === APIFetchStatus.BOOTED ||
                workPackageSectionDataFetchStatus === APIFetchStatus.FETCHING
              ) {
                dispatch({
                  type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FETCHED,
                  payload: [],
                });
              } else if (
                skuFetchStatus === APIFetchStatus.BOOTED ||
                skuFetchStatus === APIFetchStatus.FETCHING
              ) {
                dispatch({
                  type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FETCHED,
                  payload: [],
                });
              }
            } else {
              dispatch(actionMasterDataValueChanged("sowTemplate", ""));
              dispatch({
                type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.TEMPLATE_FIELD_FETCHED,
                payload: [],
              });

              dispatch({
                type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SECTION_DATA_FETCHED,
                payload: [],
              });
              dispatch({
                type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FETCHED,
                payload: [],
              });
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: MASTER_DROP_DOWN_DATA_ACTION_TYPES.SKU_LIST_FAILED });
      dispatch({ type: CUSTOMER_DATA_TYPE.API_DATA_FAILED });
    }
  };
};

export const actionCustomerDataProductLineChanged = (productLine) => {
  return (dispatch) => {
    dispatch(actionCustomerDataValueChanged("productLine", productLine));
    dispatch(actionCustomerDataGetServiceTypes(productLine, false, false));
    dispatch(actionE3TFetchRegionalData("", productLine, false, false));
  };
};

export const actionCustomerDataSectionCloneRevert = () => {
  return (dispatch) => {
    const state = Store.getState();
    const customerLogData = state.logData.customerLog;
    const customerData = {
      accountName: "",
      geo: "",
      SKU: [],
      countryName: "",
      businessName: "",
      salesStage: "",
      winLossReason: "",
      productLine: "",
    };
    const masterData = {
      business: "",
      country: "",
      contractTerms: "",
      revRecog: "",
      sowTemplate: "",
      oppId: "",
    };
    //   const ddData = state.masterDropDown.templateFieldDropDownData;

    customerLogData.forEach((row) => {
      switch (row.standardField.fieldName) {
        case "business":
          masterData.business = row.fieldDefaultValue;
          break;
        case "country":
          masterData.country = row.fieldDefaultValue;
          break;
        case "contractTerm":
          masterData.contractTerms = row.fieldDefaultValue;
          break;
        case "oppId":
          masterData.oppId = row.fieldDefaultValue;
          break;
        case "sowTemplate":
          const id = isNumber(row.fieldDefaultValue)
            ? row.fieldDefaultValue.toString()
            : row.fieldDefaultValue;

          // console.log({ id, ddData, d });
          masterData.sowTemplate = id;
          break;
        case "revenueRecognition":
          masterData.revRecog = row.fieldDefaultValue;
          break;
        default:
          break;
      }
    });
    // console.log({ masterData });

    dispatch({
      type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
      payload: { ...masterData },
    });

    customerLogData.forEach((row) => {
      switch (row.standardField.fieldName) {
        case "accountName":
          customerData.accountName = row.fieldDefaultValue;
          break;
        case "geo":
          customerData.geo = row.fieldDefaultValue;
          break;
        case "countryName":
          customerData.countryName = row.fieldDefaultValue;
          break;
        case "businessName":
          customerData.businessName = row.fieldDefaultValue;
          break;
        case "salesStage":
          customerData.salesStage = row.fieldDefaultValue ?? "";
          break;
        case "winLossReason":
          customerData.winLossReason = row.fieldDefaultValue ?? "";
          break;
        case "productLine":
          customerData.productLine = row.fieldDefaultValue;
          break;
        case "SKU":
          customerData.sku = row.fieldDefaultValue
            ? JSON.parse(row.fieldDefaultValue)
            : [];
          break;
        default:
          break;
      }
    });

    dispatch({
      type: CUSTOMER_DATA_TYPE.API_DATA_FETCHED,
      payload: { ...customerData },
    });
  };
};
