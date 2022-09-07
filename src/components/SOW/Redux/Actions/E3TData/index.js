import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import URLConfig from "../../../URLConfig";
import { Store } from "../../Store";
import {
  actionE3TDataReset,
  actionE3TLoadEditData,
  actionE3TRecalculate,
  actionE3TWorkPackageCosting,
} from "../E3T";
import { E3T_DATA_DATA_TYPE } from "./e3tDataDataTypes";
import { E3TDataToken } from "./E3TDataToken";
import { calculateConversion } from "../../utils/calculateCost";
import { setDefaultSDT } from "../../utils/getdefaultSDT";
import { E3T_DATA_TYPE } from "../E3T/e3tDataType";
import { parseFloating } from "../../../Components/E3TForm/e3tFormData";
import { uniq, uniqBy } from "lodash";
import { parseInteger } from "../../../PricingTab/PricingFormFields";

export const actionE3TRegionalDataCountryChanged = (id) => {
  return (dispatch) => {
    const state = Store.getState();
    const e3tData = state.e3tData;
    const findIndex = e3tData.e3tRegionalDataV2.findIndex((e) => e.id === id);
    const data = e3tData.e3tRegionalDataV2;
    const arr = data[findIndex].sowE3tTsRates.map((row) => {
      const findResource = state.e3tData.e3tResourceDropDown.find(
        (f) => f.id === row.resourceTypeId
      );
      const ob = {};
      ob["id"] = row.resourceTypeId;
      ob["sdt"] = data[findIndex]["sdtLookup"];
      ob["resourceType"] = findResource.resourceType;
      ob["jobCode"] = row.jobCode;
      ob["displayOrder"] = uuidv4();
      ob["rate"] = row["rate"];
      ob["fx"] = data[findIndex]["fx"];
      ob["workHrsPerDay"] = 7.5;
      ob["workHrsPerMo"] = 7.5 * 20;
      return ob;
    });
    // .filter((e) => parseFloating(e.rate) !== 0);
    dispatch({
      type: E3T_DATA_DATA_TYPE.REGIONAL_DATA_FETCHED,
      payload: {
        e3tRegionalData: arr,
        e3tResourceDropDown: e3tData.e3tResourceDropDown,
      },
    });
    dispatch({
      type: E3T_DATA_TYPE.VALUE_CHANGED,
      payload: {
        selectedCountry: id,
      },
    });
    dispatch(actionE3TRecalculate());
  };
};

export const actionE3TFetchRegionalData = (c, pL, edit, only) => {
  return async (dispatch) => {
    // if (country && productLine) {
    // console.trace("actionE3TFetchRegionalData");
    const state = Store.getState();
    try {
      dispatch({
        type: E3T_DATA_DATA_TYPE.REGIONAL_DATA_FETCHING,
      });

      let country = c;
      let productLine = pL;

      if (country === "") {
        country = state.masterData.country;
      }
      if (productLine === "") {
        const state = Store.getState();
        productLine = state.customerData.productLine;
      }

      const url = URLConfig.getURL_SOW_GetE3TDataV2();

      if (country.length > 2) {
        const state = Store.getState();
        const f = state.masterDropDown.countryDropDownData.find(
          (e) => e.name === country
        );
        country = f ? f.id : country;
      }

      const res = await axios.get(url, {
        params: { productLine, countryCode: country },
        cancelToken: E3TDataToken.token.token,
      });

      const url2 = URLConfig.getURL_SOW_GetE3TResourceDropDown();
      const resourceRes = await axios.get(url2);

      const data = res.data;
      if (data && data.length > 0) {
        const arr = data[0].sowE3tTsRates.map((row) => {
          const findResource = resourceRes.data.find(
            (f) => f.id === row.resourceTypeId
          );
          const ob = {};
          ob["id"] = row.resourceTypeId;
          ob["sdt"] = data[0]["sdtLookup"];
          ob["resourceType"] = findResource.resourceType;
          ob["jobCode"] = row.jobCode;
          ob["displayOrder"] = uuidv4();
          ob["rate"] = row["rate"];
          ob["price"] = row["price"];
          ob["fx"] = data[0]["fx"];
          ob["workHrsPerDay"] = 7.5;
          // row.sowE3tTsRates[0]["masterCountry"]["workHrsPerDay"];
          ob["workHrsPerMo"] = 7.5 * 20;
          // row.sowE3tTsRates[0]["masterCountry"]["workHrsPerMo"];
          return ob;
        });
        // .filter((k) => parseFloating(k.rate) !== 0);

        dispatch({
          type: E3T_DATA_DATA_TYPE.REGIONAL_DATA_V2_FETCHED,
          payload: res.data.map((k) => {
            return {
              ...k,
              sowE3tTsRates: k.sowE3tTsRates.map((z) => {
                const f = resourceRes.data.find(
                  (l) => l.id === z.resourceTypeId
                );
                return { ...z, resourceType: f.resourceType };
              }),
            };
          }),
        });

        dispatch({
          type: E3T_DATA_TYPE.VALUE_CHANGED,
          payload: {
            selectedCountry: res.data[0].id,
          },
        });
        dispatch({
          type: E3T_DATA_DATA_TYPE.REGIONAL_DATA_FETCHED,
          payload: {
            e3tRegionalData: arr,
            e3tResourceDropDown: resourceRes.data,
          },
        });

        if (edit) {
          // dispatch(actionE3TLoadEditData());
          console.log({
            fn: "actionE3TFetchRegionalData",
            shouldLoadEditData: state.e3tData.shouldLoadEditData,
          });
          if (state.e3tData.shouldLoadEditData) {
            dispatch(actionShouldEditDataLoadValueReset());
            dispatch(actionE3TLoadEditData());
          }
          console.log({ fx: arr[0].fx });
          dispatch(actionE3TGetFxRates([], true));
          // dispatch(actionE3TGetRemoteSDTs(true));
        }
        if (only) {
          console.log({ only });
        } else {
          if (res.data.length === 0) {
            dispatch({
              type: E3T_DATA_DATA_TYPE.FXRATES_DATA_FETCHED,
              payload: [],
            });
            dispatch({
              type: E3T_DATA_DATA_TYPE.TSHIRTSIZE_DATA_FETCHED,
              payload: [],
            });
            dispatch({
              type: E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FETCHED,
              payload: [],
            });
          } else {
            if (edit) {
            } else {
              dispatch(actionE3TGetFxRates([]));
            }
            // dispatch(actionE3TGetTShirtSizes());
          }
        }
      } else {
        dispatch({
          type: E3T_DATA_DATA_TYPE.REGIONAL_DATA_V2_FETCHED,
          payload: [],
        });

        dispatch({
          type: E3T_DATA_TYPE.VALUE_CHANGED,
          payload: {
            selectedCountry: "",
          },
        });
        dispatch({
          type: E3T_DATA_DATA_TYPE.REGIONAL_DATA_FETCHED,
          payload: {
            e3tRegionalData: [],
            e3tResourceDropDown: [],
          },
        });
        dispatch({
          type: E3T_DATA_DATA_TYPE.FXRATES_DATA_FETCHED,
          payload: [],
        });
        dispatch({
          type: E3T_DATA_DATA_TYPE.TSHIRTSIZE_DATA_FETCHED,
          payload: [],
        });
        dispatch({
          type: E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FETCHED,
          payload: [],
        });
      }
      // dispatch(actionE3TRecalculate());
    } catch (err) {
      console.error(err);
      dispatch({
        type: E3T_DATA_DATA_TYPE.REGIONAL_DATA_FETCH_FAILED,
      });
    }
  };
};

export const actionE3TGetRemoteSDTs = (edit) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FETCHING,
      });
      const state = Store.getState();
      const url = URLConfig.getURL_SOW_GetRemoteSDTs();
      const ProductLine = state.customerData.productLine;
      const res = await axios.get(url, { params: { ProductLine } });
      if (res.data && res.data.length > 0) {
        const state = Store.getState();
        const thisCountryFx = state.e3tData.e3tRegionalData[0].fx;
        const tf = state.e3tData.e3tFxRates.find(
          (e) => e.isocode === thisCountryFx
        );

        const newData = res.data.map((z) => {
          const tfx = state.e3tData.e3tFxRates.find((e) => e.isocode === z.fx);

          // console.log({ tfx });
          return {
            ...z,
            sowE3tTsRates: z.sowE3tTsRates.map((x) => {
              const rf = state.e3tData.e3tResourceDropDown.find(
                (k) => k.id === x.resourceTypeId
              );
              return {
                ...x,
                resourceType: rf.resourceType,
                newRate: calculateConversion(x.rate, tf, tfx),
                newPrice: calculateConversion(x.price, tf, tfx),
              };
            }),
          };
        });
        dispatch({
          type: E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FETCHED,
          payload: newData,
        });
        setDefaultSDT(newData);

        if (edit) {
          // dispatch(actionE3TLoadEditData());
        }
      } else {
        dispatch({
          type: E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FETCHED,
          payload: res.data,
        });
      }
      if (state.e3tData.e3tShouldRecalculate) {
        dispatch(actionE3TRecalculate());
      }

      dispatch(actionCheckCallEditData());
    } catch (err) {
      console.log(err);
      dispatch({
        type: E3T_DATA_DATA_TYPE.REMOTESTD_DATA_FAILED,
      });
    }
  };
};

export const actionCheckCallEditData = () => {
  return (dispatch) => {
    const state = Store.getState();
    if (state.e3tData.shouldLoadEditData) {
      console.log({
        fn: "actionE3TFetchRemoteSDTs",
        shouldLoadEditData: state.e3tData.shouldLoadEditData,
      });
      dispatch(actionE3TLoadEditData());
    }
  };
};

export const actionE3TGetTShirtSizes = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: E3T_DATA_DATA_TYPE.TSHIRTSIZE_DATA_FETCHING,
      });
      const url = URLConfig.getURL_SOW_GetTShirtSizes();
      const res = await axios.get(url);
      dispatch({
        type: E3T_DATA_DATA_TYPE.TSHIRTSIZE_DATA_FETCHED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: E3T_DATA_DATA_TYPE.TSHIRTSIZE_DATA_FAILED,
      });
    }
  };
};

export const actionE3TGetFxRates = (fx, edit) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: E3T_DATA_DATA_TYPE.FXRATES_DATA_FETCHING,
      });
      const url = URLConfig.getURL_SOW_GetFxRates();
      const res = await axios.post(url, fx);
      dispatch({
        type: E3T_DATA_DATA_TYPE.FXRATES_DATA_FETCHED,
        payload: res.data,
      });
      dispatch(actionE3TGetRemoteSDTs(edit));
    } catch (err) {
      dispatch({
        type: E3T_DATA_DATA_TYPE.FXRATES_DATA_FAILED,
      });
    }
  };
};

export const actionE3TDataDataReset = () => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_DATA_TYPE.E3T_DATA_RESET,
    });
  };
};

export const actionE3TGetCostingEstimation = (tshirtId, selectedWrkPkgs) => {
  return async (dispatch) => {
    try {
      const state = Store.getState();

      console.log("actionE3TGetCostingEstimation called");
      dispatch({
        type: E3T_DATA_DATA_TYPE.COSTING_ESTIMATION_FETCHING,
      });
      const url = URLConfig.getURL_SOW_GetCostingEstimation();
      const res = await axios.post(url, {
        tshirtId,
        workPackageIds: selectedWrkPkgs,
      });

      dispatch(
        actionE3TGetTShirtSizesV2(state.moduleSidePanel.selectedTypeOfWork)
      );

      dispatch({
        type: E3T_DATA_DATA_TYPE.COSTING_ESTIMATION_FETCHED,
        payload: res.data,
      });

      dispatch(actionE3TWorkPackageCosting());
    } catch (err) {
      dispatch({
        type: E3T_DATA_DATA_TYPE.COSTING_ESTIMATION_FAILED,
      });
    }
  };
};

export const actionE3TRegionalDataReset = () => {
  return (dispatch) => {
    E3TDataToken.cancelToken();
    dispatch(actionE3TDataReset());
    dispatch({
      type: E3T_DATA_DATA_TYPE.REGIONAL_DATA_RESET,
    });
  };
};

export const actionE3TGetTShirtSizesV2 = (typeOfWorkIds = [], getCosting) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: E3T_DATA_DATA_TYPE.TSHIRTSIZEV2_DATA_FETCHING,
      });
      const url = URLConfig.getURL_SOW_GetTShirtSizesV2();
      const res = await axios.post(url, {
        typeOfWorkIds,
      });
      dispatch({
        type: E3T_DATA_DATA_TYPE.TSHIRTSIZEV2_DATA_FETCHED,
        payload: res.data,
      });

      if (getCosting) {
        dispatch(actionE3TGetCostingEstimationV2());
      }
    } catch (err) {
      dispatch({
        type: E3T_DATA_DATA_TYPE.TSHIRTSIZEV2_DATA_FAILED,
      });
    }
  };
};

export const actionE3TGetCostingEstimationV2 = (
  update = false,
  name = "999",
  sizing = "999"
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: E3T_DATA_DATA_TYPE.COSTING_ESTIMATIONV2_FETCHING,
      });
      const state = Store.getState();

      let selectedWrkPkgs;
      let typeOfWorkIds;
      let size;

      selectedWrkPkgs = state.moduleSidePanel.selectedWorkPackages;
      typeOfWorkIds = state.moduleSidePanel.selectedTypeOfWork;

      if (update) {
        const resourceTable = state.e3t.resourceTable;
        const idx = resourceTable.findIndex(
          (e) => e.typeOfWorkId === parseInteger(name)
        );
        const typeOfWork = resourceTable[idx].typeOfWorkId;
        const wp = resourceTable
          .filter((e) => e.typeOfWorkId === typeOfWork)
          .map((e) => e.workPackageId);

        typeOfWorkIds = [typeOfWork];
        selectedWrkPkgs = wp;
        size = [
          {
            tshirtId: sizing,
            typeOfWorkId: typeOfWork,
          },
        ];
      } else {
        size = typeOfWorkIds
          .filter((e) => {
            const f = state.e3tData.e3tTshirtSizesV2.find(
              (k) => k.typeOfWorkId === e
            );
            if (f) {
              return true;
            }
            return false;
          })
          .map((e) => {
            const f = state.e3tData.e3tTshirtSizesV2.find(
              (k) => k.typeOfWorkId === e && k.priorityOrder === 1
            );
            console.log({ size: f, e, rt: state.e3t.resourceTable });

            return {
              tshirtId: f.id,
              typeOfWorkId: e,
            };
          });
      }

      const url = URLConfig.getURL_SOW_GetCostingEstimationV2();
      const res = await axios.post(url, {
        typeOfWorkIds,
        workPackageIds: selectedWrkPkgs,
        typeAndSize: size,
      });

      console.log({ costing: res.data });

      dispatch({
        type: E3T_DATA_DATA_TYPE.COSTING_ESTIMATIONV2_FETCHED,
        payload: res.data,
      });
      dispatch(actionE3TWorkPackageCosting(update));
    } catch (err) {
      console.log(err);
      dispatch({
        type: E3T_DATA_DATA_TYPE.COSTING_ESTIMATIONV2_FAILED,
      });
    }
  };
};

export const actionShouldEditDataLoadValueChanged = (value = false) => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_DATA_TYPE.E3T_EDIT_DATA_CHANGED,
      payload: value,
    });
  };
};

export const actionShouldEditDataLoadValueReset = () => {
  return (dispatch) => {
    dispatch({
      type: E3T_DATA_DATA_TYPE.E3T_EDIT_DATA_RESET,
    });
  };
};
