import {
  generateBlankState,
  getDefaultResourceTableRow,
  parseFloating,
} from "../../../Components/E3TForm/e3tFormData";
import { E3T_DATA_TYPE } from "../../Actions/E3T/e3tDataType";
import {
  calcuateTotalContractValue,
  calculateCost,
  calculateTotalCost,
  calculateTotalCostWithRiskReserve,
  calculateTotalResourceCost,
} from "../../utils/calculateCost";

import { parseInteger } from "../../../Components/E3TForm/e3tFormData";

const initialState = generateBlankState();

const E3TReducer = (state = initialState, action) => {
  switch (action.type) {
    case E3T_DATA_TYPE.VALUE_CHANGED: {
      return { ...state, ...action.payload };
    }

    case E3T_DATA_TYPE.RESOURCE_VALUE_CHANGED: {
      const resourceTable = state.resourceTable.map((row, index) => {
        let newRow = { ...row };
        if (index === action.payload.index) {
          newRow[action.payload.name] = action.payload.value;
          newRow["cost"] = calculateCost(newRow);
        }
        return newRow;
      });

      const totalResourceCost = calculateTotalResourceCost(resourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );

      return {
        ...state,
        resourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
        discount: "0",
        discountPercentage: "0.00",
      };
    }
    case E3T_DATA_TYPE.ADD_RESOURCE_TABLE_ROW:
      return {
        ...state,
        resourceTable: [...state.resourceTable, action.payload],
      };
    case E3T_DATA_TYPE.RESOURCE_ROW_DEPENDENCY_CHANGED: {
      // const ob = state.resourceTable[action.payload.idx];
      // ob.dependency = action.payload.dependency;
      const newResourceTable = state.resourceTable.map((e) => {
        if (e.typeOfWorkId === action.payload.typeOfWorkId) {
          return {
            ...e,
            cost: calculateCost({
              ...e,
              dependency: e.dependency === "0" ? 1 : action.payload.dependency,
            }),
            dependency: e.dependency === "0" ? "0" : action.payload.dependency,
          };
        } else {
          return e;
        }
      });

      const totalResourceCost = calculateTotalResourceCost(newResourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        "0.00"
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        totalResourceCost,
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );
      return {
        ...state,
        resourceTable: newResourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }

    case E3T_DATA_TYPE.RESOURCE_ROW_SIZING_CHANGED: {
      const ob = state.resourceTable[action.payload.idx];
      console.log({ sizing: action.payload.sizing });
      ob.sizingEstimate = action.payload.sizing;

      const newResourceTable = state.resourceTable.map((e) => {
        if (
          e.workPackageId === ob.workPackageId &&
          e.typeOfWorkId === ob.typeOfWorkId
        ) {
          const ob = { ...e, sizingEstimate: action.payload.sizing };

          ob.cost = calculateCost(ob);

          return { ...e, sizingEstimate: action.payload.sizing };
        }
        return e;
      });

      const totalResourceCost = calculateTotalResourceCost(newResourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );
      return {
        ...state,
        resourceTable: newResourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }

    case E3T_DATA_TYPE.REMOVE_RESOURCE_TABLE_ROW: {
      const resourceTable =
        state.resourceTable.length < 2
          ? []
          : state.resourceTable.filter(
              (_, index) => index !== action.payload.index
            );
      const totalResourceCost = calculateTotalResourceCost(resourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        "0.00"
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        totalResourceCost,
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );

      return {
        ...state,
        resourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }

    case E3T_DATA_TYPE.RECALCULATE:
      return { ...action.payload };

    case E3T_DATA_TYPE.RESOURCE_ROW_CHANGED: {
      const resourceTable = state.resourceTable.map((row, idx) => {
        if (idx === action.payload.idx) {
          return { ...action.payload.row };
        }
        return row;
      });
      const totalResourceCost = calculateTotalResourceCost(resourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );

      return {
        ...state,
        resourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }

    case E3T_DATA_TYPE.RESET_DATA:
      return { ...initialState };
    case E3T_DATA_TYPE.WORKPACKAGE_COSTING_ESTIMATION: {
      const rt = state.resourceTable.filter((e) => e.custom);
      console.log({ rt });
      const resourceTable = [...action.payload, ...rt];
      const totalResourceCost = calculateTotalResourceCost(resourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );

      return {
        ...state,
        discount: "0",
        discountPercentage: "0.00",
        resourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }

    case E3T_DATA_TYPE.WORKPACKAGE_COSTING_ESTIMATION_UPDATE: {
      if (action.payload.length === 0) {
        return { ...state };
      }
      const tof = action.payload[0].typeOfWorkId;
      const fIndex = state.resourceTable.findIndex(
        (e) => e.typeOfWorkId === tof
      );

      const filtered = state.resourceTable.filter(
        (e) => e.typeOfWorkId !== tof
      );
      const newRT = [
        ...filtered.slice(0, fIndex),

        ...action.payload,

        ...filtered.slice(fIndex),
      ];

      const totalResourceCost = calculateTotalResourceCost(newRT);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );

      return {
        ...state,
        resourceTable: newRT,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }
    case E3T_DATA_TYPE.TOTAL_REMOTE_RESOURCES:
      return {
        ...state,
        remoteTCV: action.payload,
      };

    case E3T_DATA_TYPE.TOTAL_ONSITE_RESOURCES:
      return {
        ...state,
        onsiteTCV: action.payload,
      };
    case E3T_DATA_TYPE.NEWE3T_REMOTE_CHANGED: {
      const resourceTable = state.resourceTable.map((e, eid) => {
        if (eid === action.payload.idx) {
          return action.payload.row;
        }
        return e;
      });

      const totalResourceCost = calculateTotalResourceCost(resourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );

      return {
        ...state,
        resourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }

    case E3T_DATA_TYPE.NEW_E3T_CUSTOM_WP_RENAME: {
      const { typeOfWorkId, typeOfWork, workPackageId, workPackage } =
        action.payload;

      console.log({ payload: action.payload });
      const newResourceTable = state.resourceTable.map((e) => {
        if (
          e.workPackageId === workPackageId &&
          e.typeOfWorkId === typeOfWorkId
        ) {
          return { ...e, workPackage, typeOfWork };
        }
        return e;
      });

      console.log({ rt: state.resourceTable, newResourceTable });

      // console.log({ newResourceTable });
      return { ...state, resourceTable: newResourceTable };
    }

    case E3T_DATA_TYPE.NEWE3T_DEPENDENCY_CHANGED: {
      const resourceTable = state.resourceTable.map((e) => {
        if (e.typeOfWorkId === action.payload.typeOfWorkId) {
          e.dependency =
            parseInteger(e.dependency) > 0 ? action.payload.value : "0";
          e.cost = calculateCost(e);
        }
        return e;
      });
      const totalResourceCost = calculateTotalResourceCost(resourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );

      return {
        ...state,
        resourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }

    case E3T_DATA_TYPE.NEWE3T_SDT_CHANGED: {
      const resourceTable = state.resourceTable.map((e, eid) => {
        if (eid === action.payload.idx) {
          return action.payload.row;
        }
        return e;
      });

      const totalResourceCost = calculateTotalResourceCost(resourceTable);
      const newTotal = calculateTotalCost(
        state.travel,
        state.software,
        state.hardware,
        state.thirdParty,
        totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        state.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        state.egm
      );

      return {
        ...state,
        resourceTable,
        totalResourceCost,
        total: newTotal,
        totalCostWithRiskReserve: newTotalWithRiskReserve,
        totalContractValue: newTotalContractValue,
      };
    }

    case E3T_DATA_TYPE.NEW_E3T_CUSTOM_WP_ADDED: {
      return {
        ...state,
        // discount: parseFloating(state.discount) > 0 ? state.discount : "0",
        // discountPercentage:
        //   parseFloating(state.discountPercentage) > 0
        //     ? state.discountPercentage
        //     : "0.00",
        resourceTable: [
          ...state.resourceTable.filter(
            (e) => !e.custom || e.typeOfWork === "General"
          ),
          ...action.payload,
        ],
      };
    }

    case E3T_DATA_TYPE.NEW_E3T_WP_ADD: {
      return {
        ...state,
        resourceTable: [...state.resourceTable, ...action.payload],
      };
    }

    case E3T_DATA_TYPE.NEW_EGM_AND_FINAL_PRICE: {
      return {
        ...state,
        finalPrice: action.payload.finalPrice.toFixed(2),
        newEGM: action.payload.newEGM.toFixed(2),
      };
    }
    case E3T_DATA_TYPE.RESOURCE_ROW_RISK_RATING_CHANGED: {
      const newResourceTable = state.resourceTable.map((e) => {
        if (
          e.workPackageId === action.payload.workPackageId &&
          e.typeOfWorkId === action.payload.typeOfWorkId
        ) {
          return { ...e, riskRating: action.payload.riskRating };
        }
        return e;
      });
      return {
        ...state,
        resourceTable: newResourceTable,
      };
    }
    case E3T_DATA_TYPE.DISCOUNT_CHANGE: {
      return {
        ...state,
        discount: action.payload.discount,
        discountPercentage: action.payload.discountPercentage,
      };
    }
    default:
      return state;
  }
};

export default E3TReducer;
