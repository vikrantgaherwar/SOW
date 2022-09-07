import { isNumber } from "lodash";

export const PricingFormField = [
  {
    id: 1,
    title: "Travel",
    type: "number",
    precision: 2,
    name: "travel",
  },
  {
    id: 2,
    title: "Software",
    type: "number",
    precision: 2,
    name: "software",
    hasDescription: true,
    descriptionName: "softwareDescription",
    descriptionTitle: "Software Description",
  },
  {
    id: 3,
    title: "Hardware",
    type: "number",
    precision: 2,
    name: "hardware",
    hasDescription: true,
    descriptionName: "hardwareDescription",
    descriptionTitle: "Hardware Description",
  },
  {
    id: 4,
    title: "Third Party",
    type: "number",
    precision: 2,
    name: "thirdParty",
    hasDescription: true,
    descriptionName: "thirdPartyDescription",
    descriptionTitle: "Third Party Description",
  },
  {
    id: 10,
    title: "Total",
    type: "number",
    precision: 2,
    // isPercentage: true,
    name: "total",
  },

  {
    id: 5,
    title: "Risk Reserve Percentage",
    default: "5.00",
    type: "number",
    min: 0,
    max: 100,
    precision: 2,
    // isPercentage: true,
    name: "riskReserve",
  },
  {
    id: 6,
    title: "Total Cost with Risk Reserve",
    type: "number",
    precision: 2,
    name: "totalCostWithRiskReserve",
  },
  {
    id: 7,
    title: "EGM  (%)",
    default: "45.00",
    type: "number",
    min: 0,
    max: 100,
    precision: 2,
    // isPercentage: true,
    name: "egm",
  },
  {
    id: 8,
    title: "TCV",
    type: "number",
    precision: 2,
    // isPercentage: true,
    name: "totalContractValue",
  },
];

export const generateBlankState = () => {
  const ob = {};
  ob["resourceTable"] = [];
  ob["totalResourceCost"] = "0.00";
  PricingFormField.forEach((field) => {
    ob[field.name] = getDefaultFieldValue(
      field.type,
      field.precision,
      field.default
    );
    if (field.hasDescription) {
      ob[field.descriptionName] = getDefaultFieldValue("textarea", 0, "");
    }
  });
  return ob;
};

export const getDefaultFieldValue = (type, precision, defaultVal) => {
  switch (type) {
    case "number":
      if (defaultVal) {
        return defaultVal;
      }
      const x = 0;
      return x.toFixed(precision);
    case "textarea":
      return "";
    default:
      const y = 0;
      return y.toFixed(precision);
  }
};

export const getDefaultResourceTableRow = () => {
  return {
    resourceType: "",
    noOfResources: "0",
    projectDuration: "0",
    workingHours: "",
    cost: "0.00",
  };
};

export const isRecordFilled = (record) => {
  try {
    let val = false;

    const { resourceType, noOfResources, projectDuration, workingHours, cost } =
      record;
    if (resourceType.trim().length > 0) {
      if (noOfResources.trim().length > 0 && parseInt(noOfResources) !== 0) {
        if (
          projectDuration.trim().length > 0 &&
          parseInt(projectDuration) !== 0
        ) {
          if (workingHours.trim().length > 0 && parseInt(workingHours) !== 0) {
            if (cost.trim().length > 0 && parseFloat(cost) > 0) {
              val = true;
            }
          }
        }
      }
    }

    return val;
  } catch (err) {
    return false;
  }
};

export const parseInteger = (str) => {
  try {
    const x = parseInt(str);
    if (isNaN(x)) {
      return 0;
    }
    return x;
  } catch (err) {
    return 0;
  }
};

export const parseFloating = (str) => {
  try {
    if (isNumber(str)) {
      return str;
    }
    const x = parseFloat(str);
    if (isNaN(x)) {
      return 0;
    }
    return x;
  } catch (err) {
    return 0;
  }
};

export const roundDecimal = (floatingNumber, decimal) => {
  const m = Number((Math.abs(floatingNumber) * 100).toPrecision(15));
  return (Math.round(m) / Math.pow(10, decimal)) * Math.sign(floatingNumber);
};

export const e3tStateToSend = (state) => {
  const newState = {
    ...state,
  };

  newState.resourceTable = newState.resourceTable.filter((r) =>
    isRecordFilled(r)
  );

  return newState;
};
