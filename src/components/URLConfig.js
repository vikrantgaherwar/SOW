import Cookies from "js-cookie";

const URLConfig = (() => {
  const EncKey = "ewfWE@#%$rfdsefgdsf";
  const ENV = process.env.REACT_APP_ENV; // "PROD"; // UAT  // LOCAL
  const enableOAuthLogin = ENV === "PROD" || ENV === "UAT" ? true : false;
  const CountryCodes = [
    "CA",
    "AS",
    "MP",
    "GU",
    "UM",
    "US",
    "AR",
    "UY",
    "PY",
    "BR",
    "MX",
    "CO",
    "CL",
    "AQ",
    "GS",
    "FK",
    "VE",
    "PR",
    "BO",
    "EC",
    "PE",
    "BS",
    "BQ",
    "BM",
    "BL",
    "BB",
    "AW",
    "AI",
    "AG",
    "MS",
    "MF",
    "LC",
    "KY",
    "KN",
    "JM",
    "HT",
    "GY",
    "GF",
    "GD",
    "DO",
    "DM",
    "CW",
    "CU",
    "VI",
    "VG",
    "VC",
    "TT",
    "TC",
    "SX",
    "SR",
    "AN",
    "CR",
    "BZ",
    "NI",
    "HN",
    "GT",
    "SV",
    "PA",
    "CK",
    "CC",
    "NF",
    "MH",
    "KI",
    "IO",
    "HM",
    "FM",
    "FJ",
    "CX",
    "WS",
    "VU",
    "TV",
    "TO",
    "TK",
    "SB",
    "PW",
    "PN",
    "PG",
    "NU",
    "NR",
    "AU",
    "NZ",
    "KR",
    "KP",
    "BT",
    "BN",
    "BD",
    "AF",
    "MV",
    "MN",
    "MM",
    "LK",
    "LA",
    "KH",
    "TL",
    "NP",
    "CN",
    "JP",
    "IN",
    "MO",
    "HK",
    "MY",
    "ID",
    "VN",
    "TH",
    "PK",
    "PH",
    "TW",
    "SG",
    "AZ",
    "AM",
    "GE",
    "UZ",
    "TM",
    "TJ",
    "AD",
    "ES",
    "CH",
    "LI",
    "IE",
    "BW",
    "AO",
    "NA",
    "MZ",
    "GH",
    "ZW",
    "UG",
    "TZ",
    "RW",
    "CM",
    "CI",
    "CG",
    "CF",
    "CD",
    "BJ",
    "BI",
    "BF",
    "NE",
    "MW",
    "MR",
    "MQ",
    "ML",
    "LS",
    "LR",
    "KM",
    "GW",
    "GQ",
    "GN",
    "GM",
    "GA",
    "ET",
    "ER",
    "EH",
    "DJ",
    "CV",
    "ZM",
    "TG",
    "TF",
    "TD",
    "SZ",
    "ST",
    "SS",
    "SO",
    "SN",
    "SL",
    "SH",
    "SD",
    "SC",
    "PM",
    "IS",
    "GL",
    "FO",
    "DK",
    "AX",
    "LV",
    "LT",
    "FI",
    "EE",
    "GR",
    "CY",
    "BH",
    "LY",
    "LB",
    "KW",
    "JO",
    "IR",
    "IQ",
    "YE",
    "SY",
    "OM",
    "AE",
    "EG",
    "ZA",
    "SA",
    "QA",
    "BE",
    "LU",
    "XK",
    "BA",
    "AL",
    "MT",
    "MK",
    "ME",
    "MD",
    "XK",
    "NG",
    "MA",
    "KE",
    "HU",
    "CZ",
    "SK",
    "RO",
    "PL",
    "BY",
    "UA",
    "BG",
    "HR",
    "RS",
    "SI",
    "NC",
    "MU",
    "MG",
    "GP",
    "DZ",
    "YT",
    "WF",
    "TN",
    "RE",
    "PF",
    "BV",
    "NO",
    "SJ",
    "IT",
    "VA",
    "SM",
    "MC",
    "FR",
    "JE",
    "IM",
    "GI",
    "GG",
    "GB",
    "IL",
    "PS",
    "KZ",
    "KG",
    "NL",
    "SE",
    "AT",
    "DE",
    "PT",
    "TR",
    "RU",
  ];

  const ANPSAPI_DotNet = process.env.REACT_APP_ANPSAPI;
  // const ANPSAPI_DotNet = "https://localhost:44322/";

  const SOW_ANPSAPI = process.env.REACT_APP_SOWANPSAPI;
  // const SOW_ANPSAPI = "https://localhost:44322/";

  const SOWAPI = process.env.REACT_APP_SOWAPI;

  const FLYER_API = process.env.REACT_APP_FLYERAPI;

  const DocViewerAPI = process.env.REACT_APP_DOCVIEWERAPI;

  const SOWDocViewerAPI = process.env.REACT_APP_SOWDOCVIEWERAPI;

  // const DocViewerAPI =
  //   ENV === "PROD"
  //     ? "https://hpedelta.com/"
  //     : "https://delta.app.hpecorp.net:8543/";
  const FileUploadAPI =
    ENV == "PROD"
      ? "https://delta.app.hpecorp.net:444/"
      : "https://delta.app.hpecorp.net:447/";
  // const FileUploadAPI = "https://localhost:44322/";
  const URL_DocViewer = DocViewerAPI + "Viewer.aspx?file=";
  const getURL_DocViewer = () => URL_DocViewer;

  const URL_SOWDocViewer = SOWDocViewerAPI + "Viewer.aspx?file=";
  const getURL_SOWDocViewer = () => URL_SOWDocViewer;

  const URL_SOW_UploadDocument = SOWAPI + "api/SOWFile/UploadDocument";
  const getURL_SOW_UploadDocument = () => URL_SOW_UploadDocument;

  const URL_SOW_GeneratePreview = SOWAPI + "api/SOWGemBox/GeneratePreview";
  const getURL_SOW_GeneratePreview = () => URL_SOW_GeneratePreview;

  const URL_SOW_UpdateSOW = SOWAPI + "api/SOWGemBox/UpdateSOW";
  const getURL_SOW_UpdateSOW = () => URL_SOW_UpdateSOW;

  const URL_SOW_GenerateSOWPdf = SOWAPI + "api/SOWGemBox/GenerateSOWPdf";
  const getURL_SOW_GenerateSOWPdf = () => URL_SOW_GenerateSOWPdf;

  const URL_SOW_GenerateSOWPdfV2 = SOWAPI + "api/SOWGemBox/GenerateSOWPdfV2";
  const getURL_SOW_GenerateSOWPdfV2 = () => URL_SOW_GenerateSOWPdfV2;

  const getProductLineDropDownURL = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetProductLineDropdown`;

  const getURL_SOW_GetE3TData = () => `${SOW_ANPSAPI}api/SOWE3T/GetE3TData`;

  const getURL_SOW_GetE3TResourceDropDown = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetResourceTypeDropdown`;

  const getURL_SOW_GetE3THistoryData = () =>
    `${SOW_ANPSAPI}api/SOWE3T/GetE3TPricingAndCostingLogData`;

  const getURL_SOW_LatestSOW = () =>
    `${SOW_ANPSAPI}api/SOW/GetLatestVersionSOWGenerated`;

  const AddFeedbackDetails_Url =
    ANPSAPI_DotNet + "api/Feedback/AddFeedbackDetails";
  const getFeedbackTypes_Url = ANPSAPI_DotNet + "api/Feedback/GetFeedbackTypes";
  const getFeedbackCategory_Url =
    ANPSAPI_DotNet + "api/Feedback/GetFeedbackCategory";
  const DataAPIURL = "https://hpedelta.com:8983/";
  const CustomerCapsuleAPI = "https://hpedelta.com:5003/";
  const keywordSearch =
    ANPSAPI_DotNet + "api/UpforArchival/ExpressViewKeyword?keyword=";
  //https://delta.app.hpecorp.net:8983
  const SeismicBriefCaseURL =
    "https://hpedelta.com:8983/solr/seismic_brief/select?fl=title,url,file_type,description,document_type_details,persona_role";
  const URL_ExpressView =
    DataAPIURL +
    `solr/package_content/select?group.field=role&group.limit=50&group=true&indent=on&q={searchTerm}&rows=1000&wt=json`;

  const URL_Suggestions = DataAPIURL + "solr/auto_suggest/suggest?wt=json&q=";
  const URL_AccountNameSuggestions =
    DataAPIURL + "solr/account/suggest?wt=json&q=";

  const fields =
    "id,title,isgoldcollateral,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,industry_segment,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,nda,ndamails_raw,score,isarchived";

  const URL_KnowledgeCapsule =
    DataAPIURL +
    "solr/sharepoint_index/select?defType=edismax&fl=" +
    fields +
    '&group.field=document_type&group=true&indent=on&q={searchterm}&rows=500&wt=json&group.limit=15&fq=scope:"Service Capsule" AND -document_type:"Services" AND -document_type:"Guides" AND -document_type:"Presentations" AND -document_type:"POC" AND -document_type:"Multimedia" AND -document_type:"Internal Trainings"&fq=-file_type:"msg"'; //
  const URL_ReUseCapsule =
    DataAPIURL +
    "solr/sharepoint_index/select?defType=edismax&fl=" +
    fields +
    '&group.field=document_type&group=true&indent=on&q={searchterm}&rows=500&wt=json&group.limit=15&fq=scope:"Reuse"&fq=-file_type:"msg"';
  const URL_HPSE =
    "https://platform.cloud.coveo.com/rest/search/v2?organizationId=hewlettpackardproductioni&access_token=xx63f05bbc-3d96-4168-814b-0cad0eb50589&pipeline=cdp-quantum-pipeline&searchhub=QUANTUM&numberOfResults=30&q={searchterm}&ac=@kmdoctargetoidlist==(5346921)";
  const URL_POC =
    "http://hc4t03687.itcs.hpecorp.net:5000/services/hpe/gss_search?q=";
  const URL_SKU =
    DataAPIURL +
    "solr/product_hierarchy/select?fl=sku%2csku_description%2cEnd_of_Support_Date%2cdocument_type%2curl%2cservice_type%2cdocument%2csdg_url&indent=on&q={searchterm}&wt=json&rows=1000";

  //NK
  // Added {searchterm} in quotes to get exact match
  const URL_ReUseInsight =
    DataAPIURL +
    `solr/insights/select?indent=on&q="{searchterm}"&rows=1000&wt=json&group=true&group.field=Opportunity_Sales_Stage&group.sort=creation_date%20desc&group.limit=500&sort=Opportunity_Sales_Stage%20asc&fq=Account_ST_ID:[%27%27%20TO%20*]`;

  //Customer Capsule
  const URL_Cases =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=select%20Status,%20Count(Id)%20from%20Case%20WHERE%20{AccountID}%27%20group%20by%20Status";
  const URL_Elevated =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=select%20Count(Id)%20from%20Case%20WHERE%20{AccountID}%27%20AND%20Elevated__c=true";
  const URL_Escalated =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=select%20Count(Id)%20from%20Case%20WHERE%20{AccountID}%27%20AND%20IsEscalated=true";
  const URL_Severity =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=select%20Count(Id)%20from%20Case%20WHERE%20{AccountID}%27%20AND%20Severity__c%20=%20%271-CRITICAL-DOWN%27";
  const URL_PSA =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=select%20pse__Project_Phase__c,%20Count(Id)%20from%20pse__Proj__c%20WHERE%20pse__Account__r.{AccountID}%27%20GROUP%20BY%20pse__Project_Phase__c";
  const URL_PSAOverAllStatus =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=select%20PSA_Overall_Status__c,%20Count(Id)%20from%20pse__Proj__c%20WHERE%20pse__Project_Phase__c%20!=%20%27Closed%27%20AND%20pse__Account__r.{AccountID}%27%20GROUP%20BY%20PSA_Overall_Status__c";
  const URL_PSAOverAllStatusNotAvailable =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=select%20PSA_Overall_Status__c,%20Count(Id)%20from%20pse__Proj__c%20WHERE%20pse__Project_Phase__c%20!=%20%27Closed%27%20AND%20pse__Account__r.{AccountID}%27%20AND%20PSA_Overall_Status__c%20NOT%20IN%20(%27Green%27,%20%27Yellow%27,%20%27Red%27)%20GROUP%20BY%20PSA_Overall_Status__c";

  //Raw Data
  const URL_Deployments_RawData =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=Select%20Id,%20Name,%20CreatedDate,%20pse__Account__r.Name,%20pse__Account__r.Focus_Account__c,%20pse__Billing_Type__c,%20pse__End_Date__c,%20pse__Is_Active__c,%20pse__Opportunity__r.Opportunity_ID__c,%20pse__Planned_Hours__c,%20pse__Project_ID__c,%20pse__Project_Phase__c,%20pse__Project_Status__c,%20pse__Project_Type__c,%20pse__Revenue__c,%20pse__Stage__c,%20pse__Start_Date__c,%20pse__Total_Costs__c,%20PSA_Funded__c,%20PSA_Product_Family__c,%20PSA_Overall_Status__c,%20PSA_Project_Creation__c,%20PSA_Location_Country__c,%20PSA_Sold_by_Type__c,%20PSA_Delivery_Type__c,%20pse__Account__r.WorldRegion_Region__c%20from%20pse__Proj__c%20WHERE%20pse__Account__r.{AccountID}%27";
  const URL_Opportunity_RawData =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=Select%20Description,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20Win_Loss_Reason__c,%20Type,%20CreatedDate,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c !='HPE Not Pursued' AND%20{AccountID}%27%20Order%20By%20SystemModstamp%20DESC";

  const URL_OppIDByWbsID =
    DataAPIURL +
    'solr/ppmc/select?fl=wbs_id,opportunity_id,account_name&fq=wbs_id:"{wbsid}"&indent=on&q=*:*&rows=1&wt=json';
  const URL_ActIDByOPP =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=Select%20Country__c,%20Account_Shipping_Country__c,%20Multi_Country_Type__c,%20Account.Name,%20IsPrivate,%20Account.Focus_Account__c,%20Account.Account_ST_ID__c,%20Account.Account_ST_Name__c,%20Account.Top_Parent_ST_ID__c,%20Account.Top_Parent_ST_Name__c,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20IsWon,%20IsClosed,%20CreatedDate,%20Fiscal,%20FiscalYear,%20FiscalQuarter,%20Win_Loss_Reason__c,%20Opportunity_Sales_Stage__c,%20Status__c,%20CloseDate%20from%20Opportunity%20WHERE%20Opportunity_ID__c%20=%20%27{oppid}%27%20";
  const URL_OppDataByActID =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=Select%20Account.Account_ST_Name__c,%20Opportunity_ID__c,%20convertCurrency(Amount),%20IsWon,%20IsClosed,%20Opportunity_Sales_Stage__c%20,%20Status__c%20,IsPrivate%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c !='HPE Not Pursued' AND%20{actid}%27";

  const URL_OppDataBySTID =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=Select%20Account.Name,%20Opportunity_ID__c,%20convertCurrency(Amount),%20IsWon,%20IsClosed,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c !='HPE Not Pursued' AND%20Account.Account_ST_ID__c=%27{actid}%27";
  const URL_OppDataByPRID =
    CustomerCapsuleAPI +
    "services/data/v38.0/sobjects/query2?q=SELECT%20PSA_Location_Country__c,%20pse__Account__r.Name,%20pse__Account__r.Focus_Account__c,%20pse__Account__r.Account_ST_ID__c,%20pse__Account__r.Account_ST_Name__c,%20pse__Account__r.Top_Parent_ST_ID__c,%20pse__Account__r.Top_Parent_ST_Name__c,%20Id,%20pse__Project_ID__c,%20PSA_Overall_Status__c,%20PSA_Financial_Status__c,%20pse__Project_Status__c,%20PSA_Project_Friendly_Name__c%20FROM%20pse__Proj__c%20WHERE%20pse__Project_ID__c%20=%20%27{oppid}%27";
  const URL_AccountIdByAccountName =
    DataAPIURL +
    "solr/account/select?fq=Account_ST_Name:%22{accountname}%22&indent=on&q=*:*&rows=2&wt=json";

  //OAuth
  const URL_OAuth =
    "https://c0050884.itcs.hpecorp.net:4450/Authentication.aspx";
  const URL_OAuth_Uat =
    "https://c0050884.itcs.hpecorp.net:4452/Authentication.aspx";
  const URL_EmployeeAPI = ANPSAPI_DotNet + "api/DeltaUser/DeltaUser/";
  const URL_InstallBase = ANPSAPI_DotNet + "api/installbase/";
  const URL_InstallBaseProduct =
    ANPSAPI_DotNet + "api/InstallBaseProductDetails/";
  const URL_UserFeedBack = ANPSAPI_DotNet + "api/userfeedback";
  const URL_UserBookMark = ANPSAPI_DotNet + "api/userfeedback";
  const URL_UserDocument = ANPSAPI_DotNet + "api/document";
  const URL_UserTracking = ANPSAPI_DotNet + "api/usertracking";
  const URL_SiteFeedback = ANPSAPI_DotNet + "api/sitefeedback";
  const URL_SiteFeedback_Upload = ANPSAPI_DotNet;

  const URL_DeltaAPI = ANPSAPI_DotNet + "api/";

  // Footer Links
  const URL_FooterLinks = CustomerCapsuleAPI + "services/data/anpslinks";

  const GetSearchKeyByOpp =
    CustomerCapsuleAPI + "services/data/v38.0/sobjects/ppmc/query?q=";
  const UploadFile_Url = FileUploadAPI + "api/File/UploadFeedbackDocument";
  const GetContributionMail_URL =
    ANPSAPI_DotNet + "api/FeedbackMail/SendFeedbackMailNotification";
  const AddDeltaDocumentRating =
    URL_DeltaAPI + "Feedback/AddDeltaDocumentRating";
  const GetDeltaDocumentRating = URL_DeltaAPI + "Feedback/GeRatingByUser";
  const GetAllRatings = URL_DeltaAPI + "Feedback/GetAllRatings";
  const AddExpressViewRating = URL_DeltaAPI + "Feedback/AddExpressViewRating";
  const GetExpressViewRatingByUser =
    URL_DeltaAPI + "Feedback/GetExpressViewRatingByUser";
  const GetStarRatingCalculationforExpressView =
    URL_DeltaAPI + "Feedback/GetStarRatingCalculationforExpressView";
  const SaveExpressViewEvent = URL_DeltaAPI + "UserFeedback/SaveExpressView";
  const GetSearchKeyByOppID = (SearchKey) => {
    return ApplyAuth(GetSearchKeyByOpp + SearchKey);
  };

  const GetUserRoles = () => {
    const roles = Cookies.get("roles")?.split(",");
    let Roles = "&fq=";
    roles.forEach((list, index) => {
      if (index === 0) Roles += "persona_role:*" + list + "*";
      else Roles += " OR persona_role:*" + list + "*";
    });
    return Roles;
  };

  const getEncKey = () => {
    return EncKey;
  };
  const getURL_Suggestions = function (searchTerm) {
    return URL_Suggestions.toString() + searchTerm;
  };

  const getURL_AccountNameSuggestions = function (searchTerm) {
    return URL_AccountNameSuggestions.toString() + searchTerm;
  };

  const getURL_UserFeedBack = () => URL_UserFeedBack;

  const getURL_UserBookMark = () => URL_UserBookMark;

  const getURL_UserDocument = () => URL_UserDocument;

  const getURL_SiteFeedBack = () => URL_SiteFeedback;
  const getURL_keywordSearch = () => keywordSearch;

  const getURL_SiteFeedBack_Upload = () => {
    return URL_SiteFeedback_Upload;
  };

  const addSurvey_Url = ANPSAPI_DotNet + "api/Feedback/AddSurvey";

  const getURLURLOppIDByWbsID = function (wbsID) {
    return ApplyAuth(URL_OppIDByWbsID.toString().replace("{wbsid}", wbsID));
  };
  const getURLActIDByOPP = function (opportunity_id) {
    return ApplyAuth(
      URL_ActIDByOPP.toString().replace("{oppid}", opportunity_id)
    );
  };
  const getUrlOppDataByActID = (AccountID) => {
    return ApplyAuth(
      URL_OppDataByActID.toString().replace("{actid}", AccountID)
    );
  };
  const getUrlOppDataBySTID = (AccountID) => {
    return URL_OppDataBySTID.toString().replace("{actid}", AccountID);
  };
  const getUrlOppDataByPRID = (AccountID) => {
    return URL_OppDataByPRID.toString().replace("{oppid}", AccountID);
  };
  const getUrlAccountIdByAccountName = (AccountName) => {
    return URL_AccountIdByAccountName.toString().replace(
      "{accountname}",
      AccountName
    );
  };
  const getURLKnowledgeCapsule = function (searchterm) {
    const roles = GetUserRoles();
    return (
      URL_KnowledgeCapsule.toString().replace("{searchterm}", searchterm) +
      roles
    );
  };
  const getURLReUseCapsule = function (searchterm) {
    const roles = GetUserRoles();
    return (
      URL_ReUseCapsule.toString().replace("{searchterm}", searchterm) + roles
    );
  };
  // NK
  const getURLReUseInsight = (searchterm) => {
    const roles = GetUserRoles();
    return (
      URL_ReUseInsight.toString().replace("{searchterm}", searchterm) + roles
    );
  };

  const getURL_HPSE = function (searchterm) {
    return (
      URL_HPSE.toString().replace("{searchterm}", searchterm) + GetUserRoles()
    );
  };
  const getURL_POC = function (searchterm) {
    return URL_POC.toString() + searchterm + GetUserRoles();
  };

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

  const getURL_Cases = function (AccountID) {
    return ApplyAuth(URL_Cases.toString().replace("{AccountID}", AccountID));
  };
  const getURL_Elevated = function (AccountID) {
    return ApplyAuth(URL_Elevated.toString().replace("{AccountID}", AccountID));
  };
  const getURL_Escalated = function (AccountID) {
    return ApplyAuth(
      URL_Escalated.toString().replace("{AccountID}", AccountID)
    );
  };
  const getURL_Severity = function (AccountID) {
    return ApplyAuth(URL_Severity.toString().replace("{AccountID}", AccountID));
  };
  const getURL_PSA = function (AccountID) {
    return ApplyAuth(URL_PSA.toString().replace("{AccountID}", AccountID));
  };
  const getURL_PSAOverAllStatus = function (AccountID) {
    return ApplyAuth(
      URL_PSAOverAllStatus.toString().replace("{AccountID}", AccountID)
    );
  };
  const getURL_PSAOverAllStatusNotAvailable = function (AccountID) {
    return ApplyAuth(
      URL_PSAOverAllStatusNotAvailable.toString().replace(
        "{AccountID}",
        AccountID
      )
    );
  };
  const getURL_Deployments_RawData = function (AccountID) {
    return URL_Deployments_RawData.toString().replace("{AccountID}", AccountID);
  };
  const getURL_Opportunity_RawData = function (AccountID) {
    return URL_Opportunity_RawData.toString().replace("{AccountID}", AccountID);
  };
  const getURL_OAuth = function (AccountID) {
    return ENV === "PROD" ? URL_OAuth : URL_OAuth_Uat;
  };
  const getURL_EmployeeAPI = function (AccountID) {
    return URL_EmployeeAPI;
  };
  const isOAuthLoginEnabled = () => {
    return enableOAuthLogin;
  };
  const getURLSKU = function (searchterm) {
    return (
      URL_SKU.toString().replace("{searchterm}", searchterm) + GetUserRoles()
    );
  };
  const getURLInstallBaseAPI = function (AccountID) {
    return URL_InstallBase + "" + AccountID;
  };
  const getURLInstallBaseProductAPI = function (AccountID) {
    return URL_InstallBaseProduct + "" + AccountID;
  };

  const getURL_UserTracking = function (AccountID) {
    return URL_UserTracking;
  };
  const getURL_FooterLinks = () => {
    return ApplyAuth(URL_FooterLinks);
  };
  const get_Environment = () => {
    return ENV;
  };
  const get_countryCode = () => {
    return CountryCodes;
  };
  const get_APIHost = () => {
    return DataAPIURL;
  };
  const get_CustomerCapsule_API_Host = () => {
    return CustomerCapsuleAPI;
  };
  const getSeismicBriefCaseProducts = function (searchterm) {
    const url =
      SeismicBriefCaseURL +
      "&fq=document_type_details:%22product%20brief%22&indent=on&q={searchterm}&rows=500&wt=json";
    return url.toString().replace("{searchterm}", searchterm);
  };
  const getSeismicBriefCaseTechnical = function (searchterm) {
    const url =
      SeismicBriefCaseURL +
      "&fq=document_type_details:%22technical%20brief%22&indent=on&q={searchterm}&rows=500&wt=json";
    return url.toString().replace("{searchterm}", searchterm);
  };
  const getSeismicBriefCaseExecutive = function (searchterm) {
    const url =
      SeismicBriefCaseURL +
      "&fq=document_type_details:%22executive%20briefing%22&indent=on&q={searchterm}&rows=500&wt=json";
    return url.toString().replace("{searchterm}", searchterm);
  };
  const getSeismicBriefCaseProgram = function (searchterm) {
    const url =
      SeismicBriefCaseURL +
      "&fq=document_type_details:%22program%20briefcase%22&indent=on&q={searchterm}&rows=500&wt=json";
    return url.toString().replace("{searchterm}", searchterm);
  };
  const getSeismicBriefCaseSolution = function (searchterm) {
    const url =
      SeismicBriefCaseURL +
      "&fq=document_type_details:%22solution%20brief%22&indent=on&q={searchterm}&rows=500&wt=json";
    return url.toString().replace("{searchterm}", searchterm);
  };
  const getSeismicBriefCaseSales = function (searchterm) {
    const url =
      SeismicBriefCaseURL +
      "&fq=document_type_details:%22sales%20briefcase%22&indent=on&q={searchterm}&rows=500&wt=json";
    return url.toString().replace("{searchterm}", searchterm);
  };
  const getSeismicBriefCaseService = function (searchterm) {
    const url =
      SeismicBriefCaseURL +
      "&fq=document_type_details:%22service%20brief%22&indent=on&q={searchterm}&rows=500&wt=json";
    return url.toString().replace("{searchterm}", searchterm);
  };
  const getURLExpressView = (searchTerm) => {
    const roles = GetUserRoles();
    return (
      URL_ExpressView.toString().replace("{searchTerm}", searchTerm) + roles
      // "&fq=persona_role:*Admin*%20OR%20persona_role:*Delivery*%20OR%20persona_role:*Sales*%20OR%20persona_role:*Pursuit*%20"
    );
  };
  const getNugFlixCategorisedVideoData = () => {
    const url =
      "https://hpedelta.com:8983/solr/nugflix/select?group.field=document_type&group.limit=25&group=true&indent=on&q=*:*&rows=500&wt=json&fq=result_type:%22Home%22";
    return url;
  };
  const getNugFlixVideoData = (searchterm) => {
    const url =
      "https://hpedelta.com:8983/solr/nugflix/select?indent=on&q={searchterm}&rows=500&wt=json&fq=-result_type:%22Home%22";
    return url.toString().replace("{searchterm}", searchterm);
  };
  const getNugFlixFeatureBased = () => {
    const url =
      "https://hpedelta.com:8983/solr/nugflix/select?group.field=document_type_details&group.limit=10&group=true&indent=on&q=*:*&rows=500&wt=json&fq=document_type:%22Feature%20Based%22";
    return url;
  };
  const getNugFlixRoleBased = () => {
    const url =
      "https://hpedelta.com:8983/solr/nugflix/select?group.field=document_type_details&group.limit=10&group=true&indent=on&q=*:*&rows=500&wt=json&fq=document_type:%22Role%20Based%22";
    return url;
  };

  const getSOWSFDCUrl = (oppId) => {
    const url = `${CustomerCapsuleAPI}services/data/v38.0/sobjects/query?q=Select%20Opportunity_ID__c,%20Account.WorldRegion_Region__c,%20Account.WorldRegion_SubRegion1__c,%20Country__c,%20Account.Name,%20Business_Group2__c,%20Owner_s_Global_Business_Unit__c,%20Opportunity_Sales_Stage__c,%20Win_Loss_Reason__c,%20SystemModstamp,%20(Select%20OpportunityID__c,%20Business_Group__c,%20GBU__c,%20ProductName__c,%20ProductId__c,%20Product_Line__c,%20SystemModstamp%20from%20OpportunityLineItems%20ORDER%20BY%20SystemModstamp%20desc)%20from%20Opportunity%20where%20Opportunity_ID__c=%27${oppId}%27`;
    return ApplyAuth(url);
  };

  const getFlyerProductServiceURL = () => {
    return `${DataAPIURL}solr/flyer/select?group.field=product_family_en&group.limit=100&group.mincount=1&group=true&indent=on&q=*:*&rows=50&wt=json`;
  };

  const getSKUListUrl = (servicetype, productLine) => {
    return `https://hpedelta.com:8983/solr/product_hierarchy/select?fl=sku%2csku_description%2cproduct_line%2cservice_type&indent=on&wt=json&rows=1000&fq=service_type:%22${servicetype}%22%20AND%20pl:%22${productLine}%22&q=*:*`;
  };

  const getCustomerOpportunityBUUrl = (accountstid) => {
    const url = `${CustomerCapsuleAPI}services/data/v38.0/sobjects/query2?q=Select%20Owner_s_Global_Business_Unit__c,Description,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20Win_Loss_Reason__c,%20Type,%20CreatedDate,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c%20!=%27HPE%20Not%20Pursued%27%20AND%20${accountstid}%27%20Order%20By%20SystemModstamp%20DESC`;
    return ApplyAuth(url);
  };
  const getURLDeltaAPI = () => URL_DeltaAPI;
  const getURLDeltaSOWAPI = () => SOW_ANPSAPI + "api/";
  const getURLDocDepoSOWAPI = () => SOWAPI + "api/";
  const getURLFlyerAPI = () => FLYER_API + "api/";
  const AddFeedbackDetails = () => AddFeedbackDetails_Url;
  const getFeedbackTypesURL = () => getFeedbackTypes_Url;
  const getFeedbackCategoryURL = () => getFeedbackCategory_Url;
  const UploadFeedbackAttachment = function () {
    return UploadFile_Url;
  };
  const AddSurveyDetails = () => addSurvey_Url;
  const GetContributionMail = () => GetContributionMail_URL;
  const DeltaDocumentRating = () => AddDeltaDocumentRating;
  const GetDocRatingByUser = () => GetDeltaDocumentRating;
  const GetAllDocRatings = () => GetAllRatings;
  const getURL_AddExpressViewRating = () => AddExpressViewRating;
  const getURL_GetExpressViewRatingByUser = () => GetExpressViewRatingByUser;
  const getURL_GetStarRatingCalculationforExpressView = () =>
    GetStarRatingCalculationforExpressView;
  const SaveExpressView = () => SaveExpressViewEvent;
  return {
    getEncKey: getEncKey,
    getURLOpportunityIDByWbsID: getURLURLOppIDByWbsID,
    getURLActIDOPP: getURLActIDByOPP,
    getUrlOppDataByActID: getUrlOppDataByActID,
    getURLKnowledgeCapsule: getURLKnowledgeCapsule,
    getURLReUseCapsule: getURLReUseCapsule,
    getURLReUseInsight: getURLReUseInsight,
    getURL_HPSE: getURL_HPSE,
    getURL_POC: getURL_POC,
    getURL_Cases: getURL_Cases,
    getURL_Elevated: getURL_Elevated,
    getURL_Escalated: getURL_Escalated,
    getURL_Severity: getURL_Severity,
    getURL_PSA: getURL_PSA,
    getURL_PSAOverAllStatus: getURL_PSAOverAllStatus,
    getURL_PSAOverAllStatusNotAvailable,
    getURL_Deployments_RawData: getURL_Deployments_RawData,
    getURL_Opportunity_RawData: getURL_Opportunity_RawData,
    getURL_Suggestions: getURL_Suggestions,
    getURL_AccountNameSuggestions: getURL_AccountNameSuggestions,
    getURL_OAuth: getURL_OAuth,
    getURL_EmployeeAPI: getURL_EmployeeAPI,
    isOAuthLoginEnabled: isOAuthLoginEnabled,
    getURLSKU: getURLSKU,
    getURLInstallBaseAPI: getURLInstallBaseAPI,
    getURLInstallBaseProductAPI: getURLInstallBaseProductAPI,
    getURL_UserFeedBack: getURL_UserFeedBack,
    getURL_UserBookMark: getURL_UserBookMark,
    getURL_UserDocument: getURL_UserDocument,
    getURL_UserTracking: getURL_UserTracking,
    getURL_SiteFeedBack: getURL_SiteFeedBack,
    getURL_SiteFeedBack_Upload: getURL_SiteFeedBack_Upload,
    getUrlOppDataBySTID: getUrlOppDataBySTID,
    getUrlOppDataByPRID: getUrlOppDataByPRID,
    getUrlAccountIdByAccountName: getUrlAccountIdByAccountName,
    getURL_FooterLinks: getURL_FooterLinks,
    GetUserRoles: GetUserRoles,
    get_Environment: get_Environment,
    get_countryCode: get_countryCode,
    get_APIHost: get_APIHost,
    get_CustomerCapsule_API_Host,
    getSeismicBriefCaseProducts: getSeismicBriefCaseProducts,
    getSeismicBriefCaseTechnical: getSeismicBriefCaseTechnical,
    getSeismicBriefCaseExecutive: getSeismicBriefCaseExecutive,
    getSeismicBriefCaseProgram: getSeismicBriefCaseProgram,
    getSeismicBriefCaseSolution: getSeismicBriefCaseSolution,
    getSeismicBriefCaseService: getSeismicBriefCaseService,
    getNugFlixVideoData,
    getSeismicBriefCaseSales: getSeismicBriefCaseSales,
    getURLExpressView,
    getURLDeltaAPI,
    GetSearchKeyByOppID,
    ApplyAuth,
    getNugFlixFeatureBased,
    getNugFlixRoleBased,
    getNugFlixCategorisedVideoData,
    getSOWSFDCUrl,
    getSKUListUrl,
    getURL_SOW_UploadDocument,
    getURL_SOW_GeneratePreview,
    getURL_SOW_GenerateSOWPdf,
    getURL_DocViewer,
    getURL_SOW_UpdateSOW,
    getURL_SOW_GetE3TData,
    getURLDeltaSOWAPI,
    getURL_SOWDocViewer,
    getProductLineDropDownURL,
    getURL_SOW_GetE3THistoryData,
    getURL_SOW_GetE3TResourceDropDown,
    AddFeedbackDetails,
    getFeedbackTypesURL,
    getFeedbackCategoryURL,
    UploadFeedbackAttachment,
    GetContributionMail,
    getURL_SOW_LatestSOW,
    getURL_SOW_GenerateSOWPdfV2,
    AddSurveyDetails,
    getURLDocDepoSOWAPI,
    getFlyerProductServiceURL,
    getURLFlyerAPI,
    getURL_keywordSearch,
    DeltaDocumentRating,
    GetDocRatingByUser,
    GetAllDocRatings,
    getURL_AddExpressViewRating,
    getURL_GetExpressViewRatingByUser,
    getURL_GetStarRatingCalculationforExpressView,
    SaveExpressView,
    getCustomerOpportunityBUUrl,
  };
})();
export default URLConfig;
