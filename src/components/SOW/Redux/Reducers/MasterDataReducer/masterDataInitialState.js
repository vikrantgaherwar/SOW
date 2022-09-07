import { selectMasterFormData } from "../../../Components/MasterDataForm/selectOpportunityData";
import { APIFetchStatus } from "../../utils/fetchStatus";

export const getMasterDataInitialState = () => {
  const ob = { ...getMasterDefaultData() };
  ob["oppId"] = "";
  ob["oppIdFetched"] = false;
  ob["countryDropdownDataFetchState"] = APIFetchStatus.BOOTED;

  return ob;
};

export const getMasterDefaultData = () => {
  const ob = {};
  selectMasterFormData.forEach((e) => {
    ob[e.name] = "";
  });
  return ob;
};
