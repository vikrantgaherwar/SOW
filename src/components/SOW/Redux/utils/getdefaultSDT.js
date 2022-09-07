import { parseFloating } from "../../Components/E3TForm/e3tFormData";

export let DEFUALT_SDT;

export const setDefaultSDT = (sdtList) => {
  const defaultSdt = sdtList.find(
    (rs) => rs.sdtLookup === "A&PGSDCSCIndia APEX Remote Delivery Center"
  );
  DEFUALT_SDT = defaultSdt;
};

export const getRate = (
  resource,
  id,
  isClone,
  isEdit,
  isView,
  rate,
  newSdt
) => {
  if ((isClone || isEdit || isView) && rate) {
    return parseFloating(rate);
  } else {
    return newSdt.sowE3tTsRates.find((item) =>
      resource.find((ce) => ce[id] === item.resourceTypeId)
    )?.newRate;
  }
};
