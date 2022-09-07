import axios from "axios";
import URLConfig from "../../../URLConfig";
class PricingTabServiceSingleton {
  fetchE3TData = async (country, productLine) => {
    const response = await axios.get(URLConfig.getURL_SOW_GetE3TData(), {
      params: { productLine, country },
    });
    return response?.data ? response.data : [];
  };

  fetchResourceTypeData = async () => {
    const response = await axios.get(
      URLConfig.getURL_SOW_GetE3TResourceDropDown()
    );
    return response?.data ? response?.data : [];
  };

  fetchE3THistoryPricingData = async (sowGeneratedId) => {
    const response = await axios.get(URLConfig.getURL_SOW_GetE3THistoryData(), {
      params: { sowGeneratedId },
    });

    return response?.data ? response?.data : [];
  };
}

const PricingTabService = new PricingTabServiceSingleton();
export default PricingTabService;
