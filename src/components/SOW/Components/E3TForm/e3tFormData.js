import { isNumber } from "lodash";

export const PricingFormField = [
  {
    id: 1,
    title: "Travel",
    type: "number",
    precision: 2,
    name: "travel",
    hasDescription: true,
    descriptionName: "travelDescription",
    descriptionTitle: "Travel Description",
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
    title: "Total Cost",
    type: "number",
    readonly: true,
    precision: 2,
    // isPercentage: true,
    name: "total",
  },

  {
    id: 5,
    title: "Risk Reserve %",
    default: "5.00",
    type: "number",
    min: 0,
    max: 100,
    precision: 2,
    // isPercentage: true,
    name: "riskReserve",
  },

  {
    id: 10,
    title: "Total",
    type: "number",
    readonly: true,
    precision: 2,
    // isPercentage: true,
    name: "total",
  },
  {
    id: 6,
    title: "Total Cost with Risk Reserve",
    type: "number",
    precision: 2,
    readonly: true,
    name: "totalCostWithRiskReserve",
  },
  {
    id: 7,
    title: "EGM  (%)",
    default: "35.00",
    type: "number",
    min: 0,
    max: 100,
    precision: 2,
    readonly: true,
    // isPercentage: true,
    name: "egm",
  },
  {
    id: 8,
    title: "TCV",
    type: "number",
    readonly: true,
    precision: 2,
    // isPercentage: true,
    name: "totalContractValue",
  },
  {
    id: 9,
    title: "Currency",
    type: "text",
    readonly: true,
    precision: 2,
    // isPercentage: true,a
    name: "currency",
  },

  // {
  //   id: 10,
  //   title: "Remote Pricing",
  //   type: "text",
  //   readonly: true,
  //   precision: 2,
  //   // isPercentage: true,
  //   name: "remoteTCV",
  // },
  {
    id: 11,
    title: "Onsite Pricing",
    type: "text",
    readonly: true,
    precision: 2,
    // isPercentage: true,
    name: "onsiteTCV",
  },
  {
    id: 12,
    title: "Non Standard Assumption",
    type: "textarea",
    readonly: false,
    precision: 0,
    name: "nonStandardAssumption",
  },
  {
    id: 13,
    title: "Discount",
    type: "text",
    readonly: false,
    precision: 0,
    name: "discount",
  },
  {
    id: 14,
    title: "Discount %",
    type: "number",
    readonly: false,
    precision: 2,
    name: "discountPercentage",
  },
  {
    id: 15,
    title: "New EGM",
    type: "number",
    readonly: false,
    precision: 2,
    name: "newEGM",
  },
  {
    id: 16,
    title: "Final Price",
    type: "number",
    readonly: false,
    precision: 2,
    name: "finalPrice",
  },
];

export const generateBlankState = () => {
  const ob = {};
  ob["tShirtSize"] = 1;
  ob["nonStandardAssumption"] = "";
  ob["resourceTable"] = [];
  ob["totalResourceCost"] = "0.00";
  ob["travelTotal"] = "0.00";
  ob["travelProfit"] = "35.00";
  ob["hardwareTotal"] = "0.00";
  ob["hardwareProfit"] = "35.00";
  ob["softwareTotal"] = "0.00";
  ob["softwareProfit"] = "35.00";
  ob["thirdPartyTotal"] = "0.00";
  ob["thirdPartyProfit"] = "35.00";

  ob["remoteDeliveryMix"] = "0.00";
  ob["actualDeliveryMix"] = "0.00";
  // ob["priceWithRiskReserve"] = "0.00";
  ob["selectedCountry"] = "";
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

export const getDefaultResourceTableRow = (
  typeOfWork,
  workPackage,
  typeOfWorkId,
  workPackageId,
  custom = true,
  sdt = ""
) => {
  return {
    typeOfWorkId: typeOfWorkId ?? -999,
    workPackageId: workPackageId ?? -999,
    typeOfWork: typeOfWork ?? "General",
    workPackage: workPackage ?? "General",
    remote: "No",
    sdt: sdt,
    dependency: "1",
    dependencyName: "",
    resourceType: "",
    remotePecentage: "0",
    onsitePercentage: "0",
    rate: "0",
    noOfResources: "1",
    projectDuration: "0",
    workingHours: "",
    cost: "0.00",
    riskRating: "Low",
    sizingEstimate: -999,
    custom,
  };
};

export const isRecordFilled = (record) => {
  try {
    let val = false;

    const {
      remote,
      sdt,
      resourceType,
      noOfResources,
      rate,
      projectDuration,
      workingHours,
      cost,
    } = record;

    if (resourceType.trim().length > 0) {
      if (noOfResources.trim().length > 0 && parseFloating(noOfResources) > 0) {
        if (
          projectDuration.trim().length > 0 &&
          parseFloating(projectDuration) > 0
        ) {
          if (workingHours.trim().length > 0 && parseInt(workingHours) !== 0) {
            return true;
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

export const e3tClearEmptyResourceTable = (state) => {
  const newState = {
    ...state,
  };

  newState.resourceTable = newState.resourceTable.filter((r) =>
    isRecordFilled(r)
  );

  return newState;
};

export const calculateDiscount = (e3t) => {
  let maxDiscount = 0;
  let maxPremium = 0;
  let minPremium = 0;

  const tcv =
    parseFloating(e3t.onsiteTCV) > parseFloating(e3t.remoteTCV)
      ? e3t.onsiteTCV
      : e3t.remoteTCV;

  switch (e3t.discount) {
    case "0":
      maxDiscount = 0;
      maxPremium = 0;
      break;
    case "1":
      maxDiscount = 10;
      maxPremium = 0;
      break;
    case "2":
      maxDiscount = 20;
      maxPremium = 0;
      break;
    case "3":
      maxDiscount = 0;
      maxPremium = 200;
      break;
    default:
      maxDiscount = 0;
      maxPremium = 0;
  }
  console.log({ maxDiscount });

  const maxAllowedDiscount = parseFloating(
    (
      (1 -
        parseFloating(e3t.totalCostWithRiskReserve) /
          (parseFloating(tcv) * (1 - 35 / 100))) *
      100
    ).toFixed(2)
  );
  console.log({ maxAllowedDiscount });
  if (maxAllowedDiscount < 0.0) {
    minPremium = Math.abs(maxAllowedDiscount).toFixed(2);
    return { maxDiscount: 0, maxPremium: 200, minPremium };
  }
  maxDiscount = Math.min(maxDiscount, maxAllowedDiscount);
  return { maxDiscount, maxPremium, minPremium: 0.0 };
};
