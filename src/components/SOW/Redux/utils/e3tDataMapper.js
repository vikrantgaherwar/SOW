import { parseFloating } from "../../Components/E3TForm/e3tFormData";
import { parseInteger } from "../../PricingTab/PricingFormFields";
import { isTableStateFilled } from "./isTableStateFilled";

const showUSD = [
  "totalCostWithRiskReserve",
  "onsiteTCV",
  "finalPrice",
  "remoteTCV",
  "otherCosts",
  "total",
];

const getUSD = (value, fx, fxRates) => {
  const f = fxRates.find((e) => e.isocode === fx);
  const rate = f
    ? f?.baseCurrencyAccountingRate === "USD"
      ? f?.accountingRates1
      : f?.accountingRates2
    : 1;
  return (parseFloating(value) / rate).toFixed(2);
};

// export const e3tMapDataToArray = (ob, fx, fxRates) => {
//   const arr = [];

//   Object.keys(ob).forEach((key) => {
//     if (key.indexOf("Table") > -1) {
//       arr.push({
//         fieldName: key,
//         // tableValue: ob[key]
//         //   .map((e) => ({
//         //     ...e,
//         //     dependency:
//         //       ob[key].find((d) => parseInteger(d.dependency) > 0).dependency ??
//         //       "0",
//         //   }))
//         //   .filter((t) => (t.cost ? t.cost !== "0.00" : true)),
//         tableValue: ob[key].filter((t) => (t.cost ? t.cost !== "0.00" : true)),
//       });
//     } else {
//       if (showUSD.indexOf(key) > -1 && fx !== "USD") {
//         arr.push({
//           fieldName: `${key}USD`,
//           fieldValue: getUSD(ob[key], fx, fxRates),
//         });
//       }
//       arr.push({
//         fieldName: key,
//         fieldValue: ob[key],
//       });
//     }
//   });

//   return arr;
// };

export const e3tMapDataToArray = (ob, fx, fxRates) => {
  const arr = [];

  const newOB = {};
  Object.keys(ob).forEach((key) => {
    if (key.indexOf("Table") > -1) {
      newOB[key] = {
        fieldName: key,
        tableValue: ob[key].filter((t) => (t.cost ? t.cost !== "0.00" : true)),
      };
      // arr.push({
      //   fieldName: key,
      //   // tableValue: ob[key]
      //   //   .map((e) => ({
      //   //     ...e,
      //   //     dependency:
      //   //       ob[key].find((d) => parseInteger(d.dependency) > 0).dependency ??
      //   //       "0",
      //   //   }))
      //   //   .filter((t) => (t.cost ? t.cost !== "0.00" : true)),
      //   tableValue: ob[key].filter((t) => (t.cost ? t.cost !== "0.00" : true)),
      // });
    } else {
      if (showUSD.indexOf(key) > -1 && fx !== "USD") {
        newOB[`${key}USD`] = {
          fieldName: `${key}USD`,
          fieldValue: getUSD(ob[key], fx, fxRates),
        };
        // arr.push({
        //   fieldName: `${key}USD`,
        //   fieldValue: getUSD(ob[key], fx, fxRates),
        // });
      }
      newOB[`${key}`] = {
        fieldName: key,
        fieldValue: ob[key],
      };
      arr.push({
        fieldName: key,
        fieldValue: ob[key],
      });
    }
  });

  return Object.values(newOB);
};

const checkTableFilled = (arr) => arr.filter((e) => isTableStateFilled(e));
