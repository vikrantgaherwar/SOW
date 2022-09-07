import { groupBy, isArray, isNumber } from "lodash";
import {
  calculateDiscount,
  getDefaultResourceTableRow,
  isRecordFilled,
  parseFloating,
  parseInteger,
} from "../../../Components/E3TForm/e3tFormData";
import { Store } from "../../Store";
import {
  calcuateTotalContractValue,
  calculateConsultingCosts,
  calculateCost,
  calculateToolingCosts,
  calculateTotalCost,
  calculateTotalCostWithRiskReserve,
  calculateTotalResourceCost,
  calculateTravelCosts,
} from "../../utils/calculateCost";
import { isTableStateFilled } from "../../utils/isTableStateFilled";
import { actionDynamicDataUpdateE3T } from "../DynamicDataFields";
import {
  actionE3TGetCostingEstimationV2,
  actionE3TGetRemoteSDTs,
  actionShouldEditDataLoadValueChanged,
} from "../E3TData";
import { E3T_DATA_TYPE } from "./e3tDataType";
import { APIFetchStatus } from "../../utils/fetchStatus";
import { E3T_DATA_DATA_TYPE } from "../E3TData/e3tDataDataTypes";

export const actionE3TValueChanged = (name, value, fetch = false) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.VALUE_CHANGED,
      payload: { [name]: value },
    });
    if (!fetch) {
      dispatch(actionCalculateTotalRemoteResource());
      dispatch(actionCalculateTotalOnsiteResource());
    }
  };
};

export const actionE3TSetActualDeliveryMix = (value) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.VALUE_CHANGED,
      payload: { actualDeliveryMix: value },
    });
  };
};

export const actionE3TDiscountChange = () => {
  return (dispatch) => {
    const state = Store.getState();
    const { discount, discountPercentage } = state.e3t;
    dispatch({
      type: E3T_DATA_TYPE.DISCOUNT_CHANGE,
      payload: { discount, discountPercentage: "0.00" },
    });
    // if (discount === "0") {
    //   dispatch({
    //     type: E3T_DATA_TYPE.DISCOUNT_CHANGE,
    //     payload: { discount, discountPercentage: "0.00" },
    //   });
    // } else if (discount === "1") {
    //   dispatch({
    //     type: E3T_DATA_TYPE.DISCOUNT_CHANGE,
    //     payload: {
    //       discount,
    //       discountPercentage:
    //         parseFloating(discountPercentage) > 10.0 ? "10.00" : discountPercentage,
    //     },
    //   });
    // } else if (discount === "2") {
    //   dispatch({
    //     type: E3T_DATA_TYPE.DISCOUNT_CHANGE,
    //     payload: {
    //       discount,
    //       discountPercentage:
    //         parseFloating(discountPercentage) > 20.0 ? "20.00" : discountPercentage,
    //     },
    //   });
    // } else if (discount === "3") {
    //   dispatch({
    //     type: E3T_DATA_TYPE.DISCOUNT_CHANGE,
    //     payload: {
    //       discount,
    //       discountPercentage:
    //         parseFloating(discountPercentage) > 200.0 ? "200.00" : discountPercentage,
    //     },
    //   });
    // }
  };
};

export const actionNewE3TOtherCostRowRemoved = (type) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.VALUE_CHANGED,
      payload: {
        [type]: "0.00",
        [`${type}Description`]: "",
        [`${type}Total`]: "",
        [`${type}Profit`]: "",
      },
    });
    dispatch(actionE3TRevaluateCosting());
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TOtherValueTypeChanged = (newType, oldType) => {
  return (dispatch) => {
    const state = Store.getState();
    const newCost = state.e3t[newType];
    const newDescription = state.e3t[`${newType}Description`];
    const newProfit = state.e3t[`${newType}Profit`];
    const newTotal = state.e3t[`${newType}Total`];

    if (oldType === "") {
      dispatch({
        type: E3T_DATA_TYPE.VALUE_CHANGED,
        payload: {
          [newType]: newCost,
          [`${newType}Description`]: newDescription,
          [`${newType}Profit`]: newProfit,
          [`${newType}Total`]: newTotal,
        },
      });
    } else {
      const oldCost = state.e3t[oldType];
      const oldDescription = state.e3t[`${oldType}Description`];
      const oldProfit = state.e3t[`${oldType}Profit`];
      const oldTotal = state.e3t[`${oldType}Total`];

      dispatch({
        type: E3T_DATA_TYPE.VALUE_CHANGED,
        payload: {
          [newType]: oldCost,
          [`${newType}Description`]: oldDescription,
          [`${newType}Profit`]: oldProfit,
          [`${newType}Total`]: oldTotal,
          [oldType]: newCost,
          [`${oldType}Description`]: newDescription,
          [`${oldType}Profit`]: newProfit,
          [`${oldType}Total`]: newTotal,
        },
      });
    }
    dispatch(actionE3TRevaluateCosting());
  };
};

export const actionE3TRevaluateCosting = () => {
  return (dispatch) => {
    const state = Store.getState();

    const e3t = state.e3t;
    const newTotal = calculateTotalCost(
      e3t.travel,
      e3t.software,
      e3t.hardware,
      e3t.thirdParty,
      e3t.totalResourceCost
    );

    const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
      newTotal,
      e3t.riskReserve
    );

    const newTotalContractValue = calcuateTotalContractValue(
      newTotalWithRiskReserve,
      e3t.egm
    );

    dispatch(
      actionE3TUpdateExpenses(
        newTotal,
        newTotalWithRiskReserve,
        newTotalContractValue
      )
    );

    dispatch(actionNewE3TCalcNewEGMAndFinalPrice());
  };
};

export const actionE3TResouceTableRowChanged = ({ idx, ...rest }) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.RESOURCE_ROW_CHANGED,
      payload: {
        idx,
        row: {
          ...rest,
        },
      },
    });
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TResourceTableDependencyChange = ({
  typeOfWorkId,
  dependency,
}) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.RESOURCE_ROW_DEPENDENCY_CHANGED,
      payload: {
        typeOfWorkId,
        dependency,
      },
    });
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TResourceTableSizingChange = (name, sizing) => {
  return (dispatch) => {
    const state = Store.getState();
    const resourceTable = state.e3t.resourceTable;
    const idx = resourceTable.findIndex(
      (e) => e.typeOfWorkId === parseInteger(name)
    );
    dispatch({
      type: E3T_DATA_TYPE.RESOURCE_ROW_SIZING_CHANGED,
      payload: {
        idx,
        sizing,
      },
    });
  };
};

export const actionE3TResourceTypeChanged = ({ idx, ...rest }) => {
  return (dispatch) => {
    const state = Store.getState();
    const e3tData = state.e3tData;

    const row = { ...rest };
    if (row.remote === "Yes") {
      if (row.resourceType !== "") {
        // const tid = e3tData.e3tRegionalData.find(
        //   (e) => e.resourceType === row.resourceType
        // );
        const rsdt = e3tData.e3tRemoteSTDs.find((e) => e.id === row.sdt);

        const rr = rsdt.sowE3tTsRates.find(
          (e) => e.resourceType === row.resourceType
        );

        row.rate = rr.newRate.toFixed(2);
      }
    } else {
      if (row.resourceType !== "") {
        const rsdt = e3tData.e3tRemoteSTDs.find(
          (e) => e.id === parseInteger(row.sdt)
        );

        const rr = rsdt.sowE3tTsRates.find(
          (e) => e.resourceType === row.resourceType
        );

        row.rate = rr.newRate.toFixed(2);
      }
    }
    dispatch({
      type: E3T_DATA_TYPE.RESOURCE_ROW_CHANGED,
      payload: {
        idx,
        row: {
          ...row,
        },
      },
    });
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TResourceValueChanged = (name, value, index) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.RESOURCE_VALUE_CHANGED,
      payload: { name, value, index },
    });
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3THandleDependencyChange = (value, typeOfWorkId) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.NEWE3T_DEPENDENCY_CHANGED,
      payload: {
        value,
        typeOfWorkId,
      },
    });
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TAddResourceTableRow = (
  typeOfWork,
  workPackage,
  typeOfWorkId,
  workPackageId
) => {
  return (dispatch) => {
    const state = Store.getState();
    dispatch({
      type: E3T_DATA_TYPE.ADD_RESOURCE_TABLE_ROW,
      payload: {
        ...getDefaultResourceTableRow(
          typeOfWork ?? "General",
          workPackage ?? "General",
          typeOfWorkId ?? -999,
          workPackageId ?? -999,
          true,
          parseInteger(state.e3t.selectedCountry)
        ),
      },
    });
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TRemoveResourceTableRow = (index) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.REMOVE_RESOURCE_TABLE_ROW,
      payload: { index },
    });

    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TUpdateExpenses = (
  total,
  totalCostWithRiskReserve,
  totalContractValue
) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.VALUE_CHANGED,
      payload: {
        total,
        totalCostWithRiskReserve,
        totalContractValue,
      },
    });

    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TLoadEditData = (view = false) => {
  return (dispatch) => {
    console.log("E3t Data called");
    const state = Store.getState();
    console.log({
      log: state.logData.e3tLog,
      draft: state.draft.e3tPricingDraftLog,
    });
    if (
      state.logData.e3tLog.length > 0 ||
      state.draft.e3tPricingDraftLog.length > 0
    ) {
      console.log("E3T reached here");
      if (
        state.e3tData.e3tRegionalDataV2FetchState === APIFetchStatus.FETCHED &&
        state.e3tData.e3tRemoteSTDsFetchState === APIFetchStatus.FETCHED
      ) {
        console.log("actionE3TLoadEditData else");

        let e3tLogs =
          state.logData.e3tLog.length > 0
            ? [...state.logData.e3tLog]
            : [...state.draft.e3tPricingDraftLog];

        if (state.e3tData.e3tRegionalDataV2.length > 0) {
          const data = {};

          const f = e3tLogs.find((e) => e.fieldName === "selectedCountry");
          const f2 = state.e3tData.e3tRegionalDataV2.find(
            (e) => e.id === parseInteger(f.fieldValue)
          );

          if (f2) {
          } else {
            console.log({ regional: state.e3tData.e3tRegionalDataV2 });
            e3tLogs = e3tLogs.map((e) =>
              e.fieldName === "selectedCountry"
                ? {
                    ...e,
                    fieldValue: state.e3tData.e3tRegionalDataV2[0]?.id ?? 0,
                  }
                : { ...e }
            );
          }

          console.log({ remoteSDT: state.e3tData.e3tRemoteSTDs });
          e3tLogs.forEach((e) => {
            if (e.fieldName === "resourceTable") {
              const table = JSON.parse(e.tableValue);
              console.log({ table });

              data[e.fieldName] =
                table.length === 0
                  ? []
                  : table.map((e) => {
                      const ob = {};
                      ob["defaultDependency"] = e?.dependency;
                      const keys = Object.keys(e);
                      for (let i = 0; i < keys.length; i++) {
                        if (keys[i] === "sizingEstimate") {
                          ob["sizingEstimate"] = parseInteger(e[keys[i]]);
                        } else if (
                          isNumber(e[keys[i]]) &&
                          keys[i].indexOf("Id") === -1 &&
                          keys[i] !== "sdt"
                        ) {
                          ob[keys[i]] = e[keys[i]].toString();
                        } else if (keys[i] === "sdt") {
                          const va = parseInteger(e[keys[i]]);
                          const fsdt = state.e3tData.e3tRemoteSTDs.find(
                            (x) => x.id === va
                          );
                          if (fsdt) {
                            ob[keys[i]] = e[keys[i]];
                          } else {
                            ob[keys[i]] = state.e3tData.e3tRemoteSTDs[0].id;
                          }
                        } else {
                          console.log({ key: keys[i] });
                          ob[keys[i]] = e[keys[i]];
                        }
                      }
                      return { ...ob };
                    });
            } else {
              console.log({ fieldName: e.fieldName });
              data[e.fieldName] =
                e.fieldName === "tShirtSize"
                  ? parseInteger(e.fieldValue)
                  : e.fieldValue;
            }
          });

          dispatch({
            type: E3T_DATA_TYPE.VALUE_CHANGED,
            payload: {
              ...data,
            },
          });

          // dispatch(actionE3TGetRemoteSDTs());

          if (f2) {
          } else {
            // dispatch(actionE3TRecalculate());
          }

          // dispatch(actionCalculateTotalRemoteResource());
          if (!view) {
            dispatch(actionCalculateTotalRemoteResource());
            dispatch(actionCalculateTotalOnsiteResource());
          }

          console.log({ dd: state.dynamicFields.data.sowTemplateFields });
          const fName = state.dynamicFields.data.sowTemplateFields.find(
            (e) =>
              state.masterDropDown.workPackageSectionData &&
              state.masterDropDown.workPackageSectionData.length > 0 &&
              e.sectionId ===
                state.masterDropDown.workPackageSectionData[0].sectionId
          );
          if (fName) {
            dispatch(
              actionE3TResourceTableCustomWorkPackagesAdd(fName.fieldName)
            );
          }
        }
        dispatch({
          type: "NO DATA",
        });
      } else {
        console.log("actionE3TLoadEditData true");
        console.log({
          e3tRegionalDataV2FetchState:
            state.e3tData.e3tRegionalDataV2FetchState,
          e3tRemoteSTDsFetchState: state.e3tData.e3tRemoteSTDsFetchState,
        });
        dispatch(actionShouldEditDataLoadValueChanged(true));
      }
    } else {
      dispatch({
        type: "NO_E3T",
      });
    }
  };
};

export const actionE3TDataReset = () => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.RESET_DATA,
    });
  };
};

export const actionE3TRecalculate = () => {
  return (dispatch) => {
    const state = Store.getState();
    console.trace();
    if (
      state.e3tData.e3tFxRatesFetchState !== APIFetchStatus.FETCHED &&
      state.e3tData.e3tRemoteSTDsFetchState !== APIFetchStatus.FETCHED
    ) {
      dispatch({
        type: E3T_DATA_DATA_TYPE.E3T_SHOULD_RECALCULATE,
      });
    } else {
      const e3t = state.e3t;
      const newE3T = { ...e3t };
      newE3T.resourceTable = newE3T.resourceTable.map((e) => {
        const newR = { ...e };

        if (newR.remote === "Yes") {
          const sdt = newR.sdt;
          const find = state.e3tData.e3tRemoteSTDs.find((x) => x.id === sdt);

          const findRate = find.sowE3tTsRates.find(
            (x) => x.resourceType === newR.resourceType
          );
          newR.rate = findRate
            ? isNumber(findRate.newRate)
              ? findRate.newRate.toFixed(2)
              : findRate.newRate
            : "0";
        } else {
          let sdt = newR.sdt;
          let find = state.e3tData.e3tRemoteSTDs.find(
            (x) => x.id === parseFloating(sdt)
          );
          if (find === undefined) {
            find = state.e3tData.e3tRemoteSTDs.find(
              (x) =>
                x.id === parseFloating(state.e3tData.e3tRegionalDataV2[0].id)
            );
            newR.sdt = state.e3tData.e3tRegionalDataV2[0].id;
          }

          const findRate = find.sowE3tTsRates.find(
            (x) => x.resourceType === newR.resourceType
          );
          newR.rate = findRate
            ? isNumber(findRate.newRate)
              ? findRate.newRate.toFixed(2)
              : findRate.newRate
            : "0";
        }

        // newR.workingHours = record
        //   ? isNumber(record.workHrsPerDay)
        //     ? record.workHrsPerDay.toFixed(2)
        //     : record.workHrsPerDay
        //   : "0";
        newR.cost = calculateCost(newR);
        return newR;
      });
      // .filter((e) => parseFloating(e.rate) !== 0);
      newE3T.totalResourceCost = calculateTotalResourceCost(
        newE3T.resourceTable
      );
      newE3T.total = calculateTotalCost(
        newE3T.travel,
        newE3T.software,
        newE3T.hardware,
        newE3T.thirdParty,
        newE3T.totalResourceCost
      );
      newE3T.totalCostWithRiskReserve = calculateTotalCostWithRiskReserve(
        newE3T.newTotal,
        newE3T.riskReserve
      );
      newE3T.totalContractValue = calcuateTotalContractValue(
        newE3T.totalCostWithRiskReserve,
        newE3T.egm
      );

      dispatch({
        type: E3T_DATA_TYPE.RECALCULATE,
        payload: newE3T,
      });
      dispatch(actionCalculateTotalRemoteResource());
      dispatch(actionCalculateTotalOnsiteResource());
      if (state.e3tData.e3tShouldRecalculate) {
        dispatch({ type: E3T_DATA_DATA_TYPE.E3T_RECALCULATED });
      }
    }

    // actionDynamicDataUpdateE3T
  };
};

export const actionE3TWorkPackageCosting = (update) => {
  return (dispatch) => {
    try {
      const state = Store.getState();
      const e3tCostingEstimation = state.e3tData.e3tCostingEstimationV2;

      const estimates = e3tCostingEstimation.map((entity) => {
        const row = getDefaultResourceTableRow(
          entity.typeOfWork.typeOfWork,
          entity.workPackage.workPackage,
          entity.typeOfWorkId,
          entity.workPackageId,
          false
        );
        const f = state.e3tData.e3tTshirtSizesV2.find(
          (e) => e.typeOfWorkId === entity.typeOfWorkId && e.priorityOrder === 1
        );
        if (f) {
          row.sizingEstimate = f.id;
        } else {
          row.sizingEstimate = -999;
        }
        // row.sizingEstimate = 0;
        // row.typeOfWorkId = entity.typeOfWorkId;
        // row.workPackageId = entity.workPackageId;
        row.remote = entity.isRemote ? "Yes" : "No";
        const rt = state.e3tData.e3tRegionalData.find(
          (e) => e.id === entity.resourceId
        );

        row.resourceType = rt.resourceType;
        row.sizingEstimate = entity.tshirtId;
        row.workingHours =
          state.e3tData.e3tRegionalData[0].workHrsPerDay.toString();
        row.projectDuration = entity.roleHours.toString();
        row.rate = rt.rate.toFixed(2);
        row.onsitePercentage = entity.onsitePercentage;
        row.remotePecentage = entity.remotePercentage;
        row.noOfResources = "1";
        row.resourceId = entity.resourceId;
        if (row.remote === "Yes") {
          const f = state.e3tData.e3tRemoteSTDs.find(
            (e) => e.countryIso.indexOf("IN") > -1 && e.isRemote === true
          );
          row.sdt = f.id;
          row.workingHours = f.workHrsPerDay.toString();
          const tf = f.sowE3tTsRates.find(
            (e) => e.resourceTypeId === entity.resourceId
          );
          row.rate = tf.newRate.toFixed(2);
        } else {
          let countryIso = state.e3tData.e3tRegionalDataV2[0].countryIso;
          let onSiteSTD = state.e3tData.e3tRemoteSTDs.find(
            (e) => e.countryIso.indexOf(countryIso) > -1 && e.isRemote === null
          );
          row.sdt = onSiteSTD.id;
          row.workingHours = onSiteSTD.workHrsPerDay.toString();
          const tf = onSiteSTD.sowE3tTsRates.find(
            (e) => e.resourceTypeId === entity.resourceId
          );
          row.rate = tf.newRate.toFixed(2);
        }
        row.riskRating = entity?.riskRating;
        row.dependency = entity?.delivery?.fieldDefaultValue;
        row.defaultDependency = entity?.delivery?.fieldDefaultValue;
        row.dependencyName = entity?.delivery?.fieldName;
        row.cost = calculateCost({ ...row });
        return row;
      });
      console.log({ estimates });

      const { totalHours, remoteHours } = estimates.reduce(
        (ob, curr) => {
          return {
            totalHours: ob.totalHours + parseFloating(curr.projectDuration),
            remoteHours:
              curr.remote === "Yes"
                ? ob.remoteHours + parseFloating(curr.projectDuration)
                : ob.remoteHours,
          };
        },
        { totalHours: 0, remoteHours: 0 }
      );

      const actualDeliveryMix = (
        ((remoteHours / totalHours) * 100) |
        0
      ).toFixed(2);

      console.log({ actualDeliveryMix });

      dispatch(actionE3TSetActualDeliveryMix(actualDeliveryMix));
      // if (update) {
      //   console.log({ update });
      //   const tow = estimates[0].typeOfWorkId;
      //   const fIndex = state.e3t.resourceTable.findIndex(
      //     (e) => e.typeOfWorkId === tow
      //   );

      //   const filtered = state.e3t.resourceTable.filter(
      //     (e) => e.typeOfWorkId !== tow
      //   );

      //   console.log({ tow, fIndex, filtered });
      //   const newRT = [
      //     ...filtered.slice(0, fIndex),
      //     ...estimates,
      //     ...filtered.slice(fIndex),
      //   ];

      //   console.log({ newRT });
      // }

      dispatch({
        type: update
          ? E3T_DATA_TYPE.WORKPACKAGE_COSTING_ESTIMATION_UPDATE
          : E3T_DATA_TYPE.WORKPACKAGE_COSTING_ESTIMATION,
        payload: estimates,
      });
      dispatch(actionCalculateTotalRemoteResource());
      dispatch(actionCalculateTotalOnsiteResource());
    } catch (err) {
      dispatch({
        type: "WORKPACKAGE_COSTING_ESTIMATION_FAILED",
      });
    }
  };
};

export const actionE3TUpgradeTshirtSize = () => {
  return (dispatch) => {
    const state = Store.getState();
    const tshirtSize = state.e3t.tShirtSize;
    const workPackages = state.moduleSidePanel.selectedWorkPackages;

    dispatch(actionE3TGetCostingEstimationV2());
  };
};

export const actionE3TCustomWorkPackageRename = (
  typeOfWorkId,
  typeOfWork,
  workPackageId,
  workPackage
) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.NEW_E3T_CUSTOM_WP_RENAME,
      payload: {
        typeOfWorkId,
        typeOfWork,
        workPackageId,
        workPackage,
      },
    });
  };
};

export const actionCalculateTotalRemoteResource = () => {
  return (dispatch) => {
    const state = Store.getState();
    console.log("called");
    const regionalData = state.e3tData.e3tRegionalData;
    const remoteSDT = state.e3tData.e3tRemoteSTDs;
    const fxRates = state.e3tData.e3tFxRates;
    const regionalData2 = state.e3tData.e3tRegionalDataV2;
    const selectedCountry = state.e3t.selectedCountry;

    const resourceTable = state.e3t.resourceTable;
    const e3t = state.e3t;
    const newResourceTable = resourceTable
      .filter((e) => isRecordFilled(e))
      .map((e) => {
        let f = regionalData2.find(
          (x) => x.id === parseFloating(selectedCountry)
        );
        console.log({ f, selectedCountry });
        const rsdtIndia = remoteSDT.find(
          (k) => k.countryIso.indexOf("IN") > -1
        );
        const reg = regionalData.find((k) => k.resourceType === e.resourceType);
        const rates = rsdtIndia.sowE3tTsRates.find(
          (k) => k.resourceTypeId === reg.id
        );

        let onSiteSelectedCountryData = remoteSDT.find(
          (x) => x.id === parseFloating(e.sdt)
        );
        if (onSiteSelectedCountryData === undefined) {
          onSiteSelectedCountryData = state.e3tData.e3tRemoteSTDs.find(
            (x) => x.id === parseFloating(state.e3tData.e3tRegionalDataV2[0].id)
          );
        }
        let onSiteSelectedCountryResource =
          onSiteSelectedCountryData.sowE3tTsRates.find(
            (k) => k.resourceType === e.resourceType
          );

        console.log({ rates });

        if (e.remote === "Yes") {
          const newOb = {
            ...e,
            rate: rates.newPrice.toFixed(2),
            price: rates.newPrice.toFixed(2),
          };
          newOb.cost = calculateCost(newOb);
          console.log({ remote: newOb, cost: newOb.cost });
          return newOb;
        } else {
          console.log({ rates });
          const newOb = {
            ...e,
            rate: onSiteSelectedCountryResource.newPrice.toFixed(2),
            // cccost: rates.newCost.toFixed(2),
            price: onSiteSelectedCountryResource.newPrice.toFixed(2),
          };
          newOb.cost = calculateCost(newOb);

          // if(newOb.cost ===)

          console.log({ newOb });
          return newOb;
        }
      })
      .reduce((total, e) => {
        return total + parseFloating(e.cost);
      }, 0);

    const newTotal = calculateTotalCost(
      e3t.travelTotal,
      e3t.softwareTotal,
      e3t.hardwareTotal,
      e3t.thirdPartyTotal,
      newResourceTable
    );

    console.log({ newResourceTable, newTotal });

    // const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
    //   newTotal,
    //   e3t.riskReserve
    // );

    // const newTotalContractValue = calcuateTotalContractValue(
    //   newTotalWithRiskReserve,
    //   e3t.egm
    // );

    dispatch({
      type: E3T_DATA_TYPE.TOTAL_REMOTE_RESOURCES,
      payload: newTotal,
    });
  };
};

export const actionCalculateTotalOnsiteResource = () => {
  return (dispatch) => {
    const state = Store.getState();

    const regionalData = state.e3tData.e3tRegionalData;
    const regionalData2 = state.e3tData.e3tRegionalDataV2;
    const selectedCountry = state.e3t.selectedCountry;
    const remoteSDT = state.e3tData.e3tRemoteSTDs;
    const fxRates = state.e3tData.e3tFxRates;

    const resourceTable = state.e3t.resourceTable;
    const e3t = state.e3t;
    const newResourceTable = resourceTable
      .filter((e) => isRecordFilled(e))
      .map((e) => {
        let f = regionalData2.find(
          (x) => x.id === parseFloating(selectedCountry)
        );

        console.log({ f, selectedCountry });

        const reg = f.sowE3tTsRates.find(
          (k) => k.resourceType === e.resourceType
        );

        let onSiteSelectedCountryData = remoteSDT.find(
          (x) => x.id === parseFloating(e.sdt)
        );
        if (onSiteSelectedCountryData === undefined) {
          onSiteSelectedCountryData = remoteSDT.find(
            (x) => x.id === parseFloating(state.e3tData.e3tRegionalDataV2[0].id)
          );
        }
        const onSiteSelectedCountryResource =
          onSiteSelectedCountryData.sowE3tTsRates.find(
            (k) => k.resourceType === e.resourceType
          );

        if (e.remote === "No") {
          return {
            ...e,
            rate: onSiteSelectedCountryResource.newPrice.toFixed(2),
            price: onSiteSelectedCountryResource.newPrice.toFixed(2),
            cost: calculateCost({
              ...e,
              rate: onSiteSelectedCountryResource.newPrice.toFixed(2),
              price: onSiteSelectedCountryResource.newPrice.toFixed(2),
            }),
          };
        } else {
          const newOb = {
            ...e,
            rate: reg.price.toFixed(2),
            price: reg.price.toFixed(2),
          };
          // console.log({ newOb });

          newOb.cost = calculateCost(newOb);
          return newOb;
        }
      });
    // console.log(
    //   "🚀 ~ file: index.js ~ line 876 ~ return ~ newResourceTable",
    //   newResourceTable
    // );
    let newResourceTableCost = newResourceTable.reduce((total, e) => {
      return total + parseFloating(e.cost);
    }, 0);

    const newTotal = calculateTotalCost(
      e3t.travelTotal,
      e3t.softwareTotal,
      e3t.hardwareTotal,
      e3t.thirdPartyTotal,
      newResourceTableCost
    );

    // const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
    //   newTotal,
    //   e3t.riskReserve
    // );

    // const newTotalContractValue = calcuateTotalContractValue(
    //   newTotalWithRiskReserve,
    //   e3t.egm
    // );

    dispatch({
      type: E3T_DATA_TYPE.TOTAL_ONSITE_RESOURCES,
      payload: newTotal,
    });

    // "Consulting Services Price": Consulting.toFixed(2),
    //   "Travel and Expense Price": tra.toFixed(2),
    //   "Tooling Software Price": tooling.toFixed(2),
    //   "Pricing Estimate Cost": totalContractValue,
    dispatch(actionNewE3TCalcNewEGMAndFinalPrice());
  };
};

export const actionNewE3TFixDiscountPercentage = () => {
  return (dispatch) => {
    const state = Store.getState();
    const e3t = state.e3t;
    const { maxDiscount } = calculateDiscount(e3t);
    let max = 0;

    if (parseFloating(e3t.discountPercentage) > parseFloating(maxDiscount)) {
      dispatch(
        actionE3TValueChanged(
          "discountPercentage",
          parseFloating(maxDiscount).toFixed(2)
        )
      );
    }
  };
};

export const actionNewE3TCalcNewEGMAndFinalPrice = () => {
  return (dispatch) => {
    const state = Store.getState();
    const e3t = state.e3t;
    let finalPrice;
    const tcv =
      parseFloating(e3t.onsiteTCV) > parseFloating(e3t.remoteTCV)
        ? e3t.onsiteTCV
        : e3t.remoteTCV;
    // const tcv = e3t.remoteTCV;
    if (e3t.discount === "3") {
      finalPrice =
        parseFloating(tcv) * (1 + parseFloating(e3t.discountPercentage) / 100);
    } else {
      finalPrice =
        parseFloating(tcv) * (1 - parseFloating(e3t.discountPercentage) / 100);
    }

    const newEGM =
      ((finalPrice - parseFloating(e3t.totalCostWithRiskReserve)) /
        finalPrice) *
      100;

    // if (newEGM < 35.0) {
    //   const { minPremium, maxDiscount, maxPremium } = calculateDiscount({
    //     ...e3t,
    //     finalPrice,
    //     newEGM: newEGM > 0 ? newEGM : 0.0,
    //   });

    //   if (parseFloating(e3t.discountPercentage) < parseFloating(minPremium)) {
    //     console.log(`egm < 35 : ${newEGM}`);
    //     dispatch(actionE3TValueChanged("discount", "3", true));
    //     dispatch(actionE3TValueChanged("discountPercentage", minPremium, true));
    //     // dispatch(actionNewE3TCalcNewEGMAndFinalPrice());
    //   }
    // } else if (
    //   parseFloating(e3t.discount) !== 3 &&
    //   parseFloating(e3t.discountPercentage) > parseFloating(maxDiscount)
    // ) {
    //   console.log(`egm < 35 : ${newEGM}`);
    //   dispatch(actionE3TValueChanged("discount", "3", true));
    //   dispatch(actionE3TValueChanged("discountPercentage", minPremium, true));
    // } else {
    console.log(`egm else`, {
      newEGM,
      finalPrice,
      totalCostWithRiskReserve: e3t.totalCostWithRiskReserve,
      discountPercentage: e3t.discountPercentage,
    });
    dispatch({
      type: E3T_DATA_TYPE.NEW_EGM_AND_FINAL_PRICE,
      payload: { finalPrice, newEGM: newEGM > 0 ? newEGM : 0.0 },
    });
    dispatch(actionE3TUpdateDynamicData());
    // }

    // "Consulting Services Price": Consulting.toFixed(2),
    //   "Travel and Expense Price": tra.toFixed(2),
    //   "Tooling Software Price": tooling.toFixed(2),
    //   "Pricing Estimate Cost": totalContractValue,
  };
};

export const actionE3TUpdateDynamicData = () => {
  return (dispatch) => {
    const state = Store.getState();
    const newE3T = { ...state.e3t };
    const selectedCountry = state.e3t.selectedCountry;

    const newResourceTable = newE3T.resourceTable
      .filter((e) => isRecordFilled(e))
      .map((e) => {
        if (e.remote === "No") {
          const f = state.e3tData.e3tRegionalDataV2.find(
            (k) => k.id === parseFloating(selectedCountry)
          );
          const reg = f.sowE3tTsRates.find(
            (k) => k.resourceType === e.resourceType
          );
          console.log({ price: reg });
          const newOb = { ...e, rate: reg.price.toFixed(2) };

          newOb.cost = calculateCost(newOb);
          return newOb;
        } else {
          const f = state.e3tData.e3tRegionalDataV2.find(
            (k) => k.id === parseFloating(selectedCountry)
          );
          const reg = f.sowE3tTsRates.find(
            (k) => k.resourceType === e.resourceType
          );
          console.log({ price: reg });
          const newOb = { ...e, rate: reg.price.toFixed(2) };

          newOb.cost = calculateCost(newOb);
          return newOb;
        }
      })
      .filter((e) => parseFloating(e.rate) !== 0)
      .reduce((total, e) => {
        return total + parseFloating(e.cost);
      }, 0)
      .toFixed(2);

    const consulting = newResourceTable;

    const tra = newE3T.travelTotal;

    const tooling = (
      parseFloating(newE3T.finalPrice) -
      parseFloating(tra) -
      parseFloating(consulting)
    ).toFixed(2);

    dispatch(
      actionDynamicDataUpdateE3T(
        state.e3t.resourceTable.length
          ? consulting
          : parseFloating(
              state.dynamicData["Consulting Services Price"]
            ).toFixed(2),
        state.e3t.resourceTable.length
          ? tooling
          : parseFloating(state.dynamicData["Tooling Software Price"]).toFixed(
              2
            ),
        state.e3t.resourceTable.length
          ? tra
          : parseFloating(
              state.dynamicData["Travel and Expense Price"]
            ).toFixed(2),
        state.e3t.resourceTable.length
          ? newE3T.finalPrice
          : parseFloating(state.dynamicData["Pricing Estimate Cost"]).toFixed(
              2
            ),
        state.e3tData?.e3tRegionalData[0]?.fx
      )
    );
  };
};

export const actionNewE3TRemoteChanged = (idx, val) => {
  return (dispatch) => {
    const state = Store.getState();
    const e3tData = state.e3tData;
    const selectedCountry = state.e3t.selectedCountry;
    const resourceTable = state.e3t.resourceTable;
    const row = { ...resourceTable[idx] };
    if (val === "No") {
      row.remote = "No";
      const rsdt = e3tData.e3tRemoteSTDs.find(
        (e) => e.id === parseInteger(selectedCountry)
      );
      row.sdt = rsdt.id;
      if (row.resourceType !== "") {
        const rr = rsdt.sowE3tTsRates.find(
          (e) => e.resourceType === row.resourceType
        );
        row.rate = rr.newRate.toFixed(2);
      }
    } else {
      row.remote = "Yes";

      const rsdt = e3tData.e3tRemoteSTDs.find(
        (e) => e.countryIso.indexOf("IN") > -1 && e.isRemote === true
      );
      row.sdt = rsdt.id;
      if (row.resourceType !== "") {
        // const tid = e3tData.e3tRegionalData.find(
        //   (e) => e.resourceType === row.resourceType
        // );
        // const id = tid.id;

        const rr = rsdt.sowE3tTsRates.find(
          (e) => e.resourceType === row.resourceType
        );
        row.rate = rr.newRate.toFixed(2);
      }
    }

    row.cost = calculateCost(row);

    dispatch({
      type: E3T_DATA_TYPE.NEWE3T_REMOTE_CHANGED,
      payload: {
        idx,
        row,
      },
    });
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionNewE3TSDTChanged = (idx, val) => {
  return (dispatch) => {
    const state = Store.getState();
    const e3tData = state.e3tData;
    const resourceTable = state.e3t.resourceTable;
    const row = { ...resourceTable[idx] };

    row.sdt = val;
    if (row.resourceType !== "") {
      // const tid = e3tData.e3tRegionalData.find(
      //   (e) => e.resourceType === row.resourceType
      // );
      // const id = tid.id;

      const rsdt = e3tData.e3tRemoteSTDs.find((e) => e.id === row.sdt);

      const sdtRates = rsdt.sowE3tTsRates.find(
        (e) => e.resourceType === row.resourceType
      );
      row.rate = sdtRates.newRate.toFixed(2);
    }

    row.cost = calculateCost(row);

    dispatch({
      type: E3T_DATA_TYPE.NEWE3T_SDT_CHANGED,
      payload: { idx, row },
    });
    dispatch(actionCalculateTotalRemoteResource());
    dispatch(actionCalculateTotalOnsiteResource());
  };
};

export const actionE3TResourceTableCustomWorkPackagesAdd = (name) => {
  return (dispatch) => {
    const state = Store.getState();
    const customModulesDynamicData = state.dynamicData[name]
      .filter((e) => e[0].sectionName)
      .map((e) => e[0]);

    const customModulesE3T = groupBy(
      state.e3t.resourceTable.filter((e) => e.custom),
      "workPackageId"
    );

    // const newE3T = [];

    const newE3T = customModulesDynamicData
      .map((e) => {
        if (customModulesE3T[e.workPackageId]) {
          return [...customModulesE3T[e.workPackageId]];
        } else {
          return getDefaultResourceTableRow(
            e.typeOfWork,
            e.workPackage,
            e.typeOfWorkId,
            e.workPackageId,
            true,
            parseInteger(state.e3t.selectedCountry)
          );
        }
      })
      .filter((e) => e !== null);
    console.log({ newE3T: newE3T.flat() });

    // dispatch({
    //   type: "SOMETHING",
    // });

    dispatch({
      type: E3T_DATA_TYPE.NEW_E3T_CUSTOM_WP_ADDED,
      payload: newE3T.flat(),
    });
  };
};

export const actionE3TResourceTableWPAdd = (
  name,
  typeOfWork,
  workPackage = []
) => {
  console.trace();
  return (dispatch) => {
    const state = Store.getState();
    const f = state.dynamicData[name].filter((e) => {
      return isArray(e) && e[0].typeOfWork === typeOfWork;
    });

    const res = f
      .map((e) => {
        return e[0];
      })
      .map((e) => {
        console.log({ find: f, filtered: e });
        const b = getDefaultResourceTableRow(
          e.typeOfWork,
          e.workPackage,
          e.typeOfWorkId,
          e.workPackageId,
          true
        );
        return b;
      });

    console.log({ res });

    dispatch({
      type: E3T_DATA_TYPE.NEW_E3T_WP_ADD,
      payload: res,
    });
  };
};

export const actionE3TResourceTableRiskRatingChanged = (
  payload_workId_packageId_riskRating
) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_TYPE.RESOURCE_ROW_RISK_RATING_CHANGED,
      payload: payload_workId_packageId_riskRating,
    });
  };
};
