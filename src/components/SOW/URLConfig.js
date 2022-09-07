import { CUSTOM_MODULES_SIDE_PANEL_DATA } from "./Redux/Actions/CustomModulesSidePanel/customModulesSidePanelData";

const URLConfig = (() => {
  // const ANPSAPI_DotNet = "https://localhost:44322/";

  const SOW_ANPSAPI = process.env.REACT_APP_SOWANPSAPI;
  // const SOW_ANPSAPI = "https://localhost:44322/";

  const ENV = process.env.REACT_APP_ENV;

  const SOWAPI = process.env.REACT_APP_SOWAPI;

  const SOWDocViewerAPI = process.env.REACT_APP_SOWDOCVIEWERAPI;

  const URL_SOWDocViewer = SOWDocViewerAPI + "Viewer.aspx?file=";
  const getURL_SOWDocViewer = () => URL_SOWDocViewer;

  const URL_SOW_UploadDocument = SOWAPI + "api/SOWFile/UploadDocument";
  const getURL_SOW_UploadDocument = () => URL_SOW_UploadDocument;

  const URL_SOW_GeneratePreview = SOWAPI + "api/SOWGemBox/GeneratePreview_v1";
  const getURL_SOW_GeneratePreview = () => URL_SOW_GeneratePreview;

  const URL_SOW_Admin_Mail = SOW_ANPSAPI + "api/SOWAdminMail/SendMail?sowId=";
  const getURL_SOW_Admin_Mail = () => URL_SOW_Admin_Mail;

  const URL_SOW_UpdateSOW = SOWAPI + "api/SOWGemBox/UpdateSOW_v1";
  const getURL_SOW_UpdateSOW = () => URL_SOW_UpdateSOW;

  const URL_SOW_GenerateSOWPdf = SOWAPI + "api/SOWGemBox/GenerateSOWPdf";
  const getURL_SOW_GenerateSOWPdf = () => URL_SOW_GenerateSOWPdf;

  const URL_SOW_GenerateSOWPdfV2 = SOWAPI + "api/SOWGemBox/GenerateSOWPdfV2";
  const getURL_SOW_GenerateSOWPdfV2 = () => URL_SOW_GenerateSOWPdfV2;

  const getProductLineDropDownURL = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetProductLineDropdown`;

  const getCountryDropDownURL = () =>
    `${SOW_ANPSAPI}api/SOW/GetCountryDropdownV2`;

  const getURL_SOW_GetE3TData = () => `${SOW_ANPSAPI}api/SOWE3T/GetE3TData`;
  const getURL_SOW_GetE3TDataV2 = () => `${SOW_ANPSAPI}api/SOWE3T/GetE3TDataV2`;

  const getURL_SOW_GetCustomModulesV2 = () =>
    `${SOW_ANPSAPI}api/SOW/GetCustomModulesDataV2`;

  const getURL_SOW_GetRemoteSDTs = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetRemoteSDTs_v2`;
  const getURL_SOW_GetTShirtSizes = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetTShirtSizes`;

  const getURL_SOW_GetTShirtSizesV2 = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetTShirtSizesV2`;

  const getURL_SOW_PublishCustomWorkPackage = () =>
    `${SOW_ANPSAPI}api/SOW/PublishCustomModule`;
  const getURL_SOW_GetFxRates = () => `${SOW_ANPSAPI}api/SOWE3T/GetFXRates`;
  const getURL_SOW_GetCostingEstimation = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetCostingEstimation`;

  const getURL_SOW_GetCostingEstimationV2 = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetCostingEstimationV2`;

  const getURL_SOW_GetE3TResourceDropDown = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetResourceTypeDropdown`;

  const getURL_SOW_GetE3THistoryData = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetE3TPricingAndCostingLogData`;

  const getURL_SOW_LatestSOW = () =>
    `${SOW_ANPSAPI}api/SOW/GetLatestVersionSOWGenerated`;

  const SFDCAPI1 = "https://hpedelta.com:5000/";
  const getURL_SFDCAPI1 = () => SFDCAPI1;

  const SFDCAPI2 = "https://hpedelta.com:5003/";
  const getURL_SFDCAPI2 = () => SFDCAPI2;

  const CUSTOM_MODULES_SAVE_UPDATE = `${SOW_ANPSAPI}api/SOW/SaveUpdateCustomModuleV2`;

  const getCustomModulesSaveUpdate = () => CUSTOM_MODULES_SAVE_UPDATE;

  const GetProductLineDropdown_v2 = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetProductLineDropdown_v2`;
  //Customer Capsule
  const ApplyAuth = function (URL) {
    return {
      method: "get",
      url: URL,
      headers: {
        Authorization: "Basic U2ZkY1VzZXI6VTJaa1kzSmxZV1JBTVRJeU1BPT0=",
      },
    };
  };

  const getSOWSFDCUrl = (oppId) => {
    const url = `${SFDCAPI1}services/data/v38.0/sobjects/query?q=Select%20Opportunity_ID__c,%20Account.WorldRegion_Region__c,%20Account.WorldRegion_SubRegion1__c,%20Country__c,%20Account.Name,%20Account.Country_Code__c,%20Business_Group2__c,%20Owner_s_Global_Business_Unit__c,%20Opportunity_Sales_Stage__c,%20Win_Loss_Reason__c,%20SystemModstamp,%20(Select%20OpportunityID__c,%20Business_Group__c,%20GBU__c,%20ProductName__c,%20ProductId__c,%20Product_Line__c,%20SystemModstamp%20from%20OpportunityLineItems%20ORDER%20BY%20SystemModstamp%20desc)%20from%20Opportunity%20where%20Opportunity_ID__c=%27${oppId}%27`;
    return ApplyAuth(url);
  };

  const getSKUListUrl = (servicetype, productLine) => {
    return `https://hpedelta.com:8983/solr/product_hierarchy/select?fl=sku%2csku_description%2cproduct_line%2cservice_type&indent=on&wt=json&rows=1000&fq=service_type:%22${servicetype}%22%20AND%20pl:%22${productLine}%22&q=*:*`;
  };
  const getURLDeltaSOWAPI = () => SOW_ANPSAPI + "api/";
  const getURLDocDepoSOWAPI = () => SOWAPI + "api/";
  const getURL_SkillMapping = () =>
    `${SOW_ANPSAPI}api/SOWSkillMapping/FindSkillMapping`;
  const get_Env = () => ENV;

  const getURL_SOW_GetDrafts = () =>
    `${SOW_ANPSAPI}api/SOW/GetGeneratedSOWDraft`;

  const getURL_SOW_SavePageDraft = () => SOWAPI + `api/SOWGemBox/SaveAsDraft`;

  const getURL_SOW_LoadPageDraft_Customer = () =>
    SOW_ANPSAPI + `api/SOW/GetDraftStandardFieldsLogData`;
  const getURL_SOW_LoadPageDraft_Transaction = () =>
    SOW_ANPSAPI + `api/SOW/GetDraftTransactionLogData`;
  const getURL_SOW_LoadPageDraft_Predefined = () =>
    SOW_ANPSAPI + `api/SOW/GetDraftPredefinedModuleLogData`;
  const getURL_SOW_LoadPageDraft_SolutionHub = () =>
    SOW_ANPSAPI + `api/SOW/GetDraftSolutionHubLogData`;
  const getURL_SOW_LoadPageDraft_CustomModule = () =>
    SOW_ANPSAPI + `api/SOW/GetDraftCustomModulesLog`;
  const getURL_SOW_LoadPageDraft_CustomModuleData = () =>
    SOW_ANPSAPI + `api/SOW/GetDraftCustomModulesLogData`;
  const getURL_SOW_LoadPageDraft_PricingAndCosting = () =>
    SOW_ANPSAPI + `api/SOWE3T/GetDraftE3TPricingAndCostingLogData`;

  return {
    getURL_SOW_LoadPageDraft_Customer,
    getURL_SOW_LoadPageDraft_Transaction,
    getURL_SOW_LoadPageDraft_Predefined,
    getURL_SOW_LoadPageDraft_SolutionHub,
    getURL_SOW_LoadPageDraft_CustomModule,
    getURL_SOW_LoadPageDraft_CustomModuleData,
    getURL_SOW_LoadPageDraft_PricingAndCosting,
    getSOWSFDCUrl,
    getSKUListUrl,
    getURL_SOW_UploadDocument,
    getURL_SOW_GeneratePreview,
    getURL_SOW_Admin_Mail,
    getURL_SOW_GenerateSOWPdf,
    getURL_SOW_UpdateSOW,
    getURL_SOW_GetE3TData,
    getURLDeltaSOWAPI,
    getURL_SOWDocViewer,
    getProductLineDropDownURL,
    getURL_SOW_GetE3THistoryData,
    getURL_SOW_GetE3TResourceDropDown,
    getURL_SOW_LatestSOW,
    getURL_SOW_GenerateSOWPdfV2,
    getURLDocDepoSOWAPI,
    getURL_SOW_GetRemoteSDTs,
    getURL_SOW_GetTShirtSizes,
    getURL_SOW_GetTShirtSizesV2,
    getURL_SOW_GetFxRates,
    getURL_SOW_GetCostingEstimation,
    getURL_SOW_GetCostingEstimationV2,
    getCountryDropDownURL,
    getURL_SOW_GetE3TDataV2,
    getURL_SFDCAPI1,
    getURL_SOW_GetCustomModulesV2,
    getURL_SFDCAPI2,
    getCustomModulesSaveUpdate,
    getURL_SOW_PublishCustomWorkPackage,
    GetProductLineDropdown_v2,
    getURL_SkillMapping,
    get_Env,
    getURL_SOW_GetDrafts,
    getURL_SOW_SavePageDraft,
  };
})();
export default URLConfig;
