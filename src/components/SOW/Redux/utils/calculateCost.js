import {
  parseFloating,
  parseInteger,
} from "../../Components/E3TForm/e3tFormData";

export const calculateCost = ({
  resourceType,
  dependency,
  rate,
  noOfResources,
  projectDuration,
  workingHours,
  remote,
}) => {
  const rateF = parseFloating(rate);
  const noOfResourcesF = parseFloating(noOfResources);
  const projectDurationF = parseFloating(projectDuration);
  const workingHoursF = parseFloating(workingHours);
  const dependencyF =
    parseInteger(dependency) === 0 ? 1 : parseFloating(dependency);
  let costF = rateF * noOfResourcesF * projectDurationF * dependencyF;

  return costF.toFixed(2);
};

export const calculateConversion = (
  rate,
  templateCountryFxOb,
  currCountryFxOb
) => {
  const tcFx = templateCountryFxOb
    ? templateCountryFxOb.baseCurrencyAccountingRate === "USD"
      ? templateCountryFxOb.accountingRates1
      : templateCountryFxOb.accountingRates2
    : 1;
  const cCFx =
    currCountryFxOb.baseCurrencyAccountingRate === "USD"
      ? currCountryFxOb.accountingRates1
      : currCountryFxOb.accountingRates2;

  const newRate = (rate / cCFx) * tcFx;
  // console.log({ rate, cCFx, currCountryFxOb, tcFx });
  return parseFloating(newRate.toFixed(2));
};

export const calculateTotalResourceCost = (rows = []) => {
  return rows
    .reduce((total, row) => total + parseFloating(row.cost), 0)
    .toFixed(2);
};

export const calculateTotalCost = (
  travel,
  software,
  hardware,
  thirdParty,
  totalResourceCost
) => {
  const travelF = parseFloating(travel);
  const softwareF = parseFloating(software);
  const hardwareF = parseFloating(hardware);
  const thirdPartyF = parseFloating(thirdParty);
  const totalResourceCostF = parseFloating(totalResourceCost);

  return (
    travelF +
    softwareF +
    hardwareF +
    thirdPartyF +
    totalResourceCostF
  ).toFixed(2);
};

export const calculateTotalCostWithRiskReserve = (total, riskReserve) => {
  const totalF = parseFloating(total);
  const riskReserveF = parseFloating(riskReserve);
  // const otherCostF = parseFloating(otherCost);
  return (totalF * (1 + riskReserveF / 100)).toFixed(2);
};

export const calcuateTotalContractValue = (totalCostWithRiskReserve, egm) => {
  const totalCostWithRiskReserveF = parseFloating(totalCostWithRiskReserve);
  const egmF = parseFloating(egm);
  return (totalCostWithRiskReserveF / (1 - egmF / 100)).toFixed(2);
};

export const calculateConsultingCosts = (
  totalResourceCost,
  risk,
  egm,
  discountPercentage
) => {
  const totalResourceCostF = parseFloating(totalResourceCost);
  const riskReserveF = parseFloating(risk);
  const egmF = parseFloating(egm);
  const dPF = parseFloating(discountPercentage);

  return (
    ((totalResourceCostF * (1 + riskReserveF / 100)) / (1 - egmF / 100)) *
    (1 - dPF / 100)
  ).toFixed(2);
};

export const calculateConsultingPrice = (totalResourceCost) => {
  const totalResourceCostF = parseFloating(totalResourceCost);
};

export const calculateToolingCosts = (
  hardware,
  software,
  thirdParty,
  risk,
  egm,
  discountPercentage
) => {
  const softwareF = parseFloating(software);
  const hardwareF = parseFloating(hardware);
  const thirdPartyF = parseFloating(thirdParty);

  return (softwareF + hardwareF + thirdPartyF).toFixed(2);
};

export const calculateTravelCosts = (travel, risk, egm, discountPercentage) => {
  const riskReserveF = parseFloating(risk);
  const egmF = parseFloating(egm);
  const travelF = parseFloating(travel);
  const dPF = parseFloating(discountPercentage);

  return travelF.toFixed(2);
};
