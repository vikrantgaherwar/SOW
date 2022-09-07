import { parseFloating } from "../E3TForm/e3tFormData";

export const otherCostState = () => {
  return {
    type: "",
    description: "",
    cost: "0.00",
    profit: "0.00",
    total: "0.00",
  };
};

export const E3TOtherCostsSelectOptions = [
  "Travel",
  "Software",
  "Hardware",
  "Third Party",
];

export const e3tOtherCostIsTableRowFilled = (row) => {
  try {
    if (
      E3TOtherCostsSelectOptions.includes(row.type) &&
      (parseFloating(row.cost) > 0 || row.description.trim().length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
