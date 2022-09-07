import CryptoJS from "crypto-js";

var URLConfig = (function () {
  //const Domain_URL = "http://localhost:5100/";
  //const Domain_URL = "https://localhost:44322/";

  const ENV = process.env.REACT_APP_ENV; // "PROD"; // UAT  // LOCAL

  const Domain_URL =
    ENV == "PROD"
      ? "https://delta.app.hpecorp.net:444/"
      : "https://delta.app.hpecorp.net:447/";

  const FileUploadAPI =
    ENV == "PROD"
      ? "https://hpedelta.com:8085/"
      : "https://delta.app.hpecorp.net:447/";

  const TaggedDocuemnts_Url = Domain_URL + "api/Document/GetOppIDDetails/";
  const UnTaggedDocuemnts_Url =
    Domain_URL + "api/Document/GetUnTaggedDocuments/";

  const EditDocumentDetails_Url =
    Domain_URL + "api/Document/EditDocumentDetails";
  const EditPublishedDocDetails_Url =
    Domain_URL + "api/PublishedDocuments/EditPublishedDocument/";
  const SearchDocsByOppID_Url =
    Domain_URL + "api/Document/GetDocumentsByOppIds/";

  const UploadFile_Url =
    FileUploadAPI +
    "api/File/UploadDocument?userId={USERID}&oppId={OppID}&isDraft={isDraft}";
  const AddDocumentDetails_Url =
    Domain_URL + "api/Document/AddDeltaDocumentDetails?deltaDocumentId=";
  const EncKey = "ewfWE@#%$rfdsefgdsf";

  const DraftsAPI = Domain_URL + "api/Draft/GetDraftDocuments/";
  const PublishedDocsAPI =
    Domain_URL + "api/PublishedDocuments/GetPublishedDocumentsByUser/";
  const UpForArchivalDocAPI =
    Domain_URL + "api/ArchivedDocuments/GetUpForArchivalDocumentsByUser/";
  const MarkAsInProgressAPI = Domain_URL + "api/Draft/MarkAsInprogress/";
  const InActiveDocsAPI =
    Domain_URL + "api/InActiveDocuments/GetInActiveDocuments/";

  const DeleteDraftAPIURL = Domain_URL + "api/Draft/DeleteDraftDocuments/";
  const DeleteDocumentAPIURL = Domain_URL + "api/Document/DeleteDocument/";
  const KnowledgeDocAPIURL =
    Domain_URL + "api/KnowledgeRelatedDocuments/KnowledgeRelatedDocuments/";
  const KnowledgeDraftDocAPIURL=
    Domain_URL + "api/KnowledgeRelatedDocuments/KnowledgeRelatedDraftDocuments/";
  const OpportunityRelatedAPIURL =
    Domain_URL + "api/OpportunityRelatedDocuments/OpportunityRelatedDocuments/";
  const GetPursuitDocuments = Domain_URL + "api/PursuitDocuments/";
  const GetOppDetailsByMail =
    "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=Select%20Id%2c%20Opportunity_ID__c%2c%20owner_email__c%20from%20Opportunity%20where%20owner_email__c%20=%27{Mail}%27%20limit%205";
  const PredictDocCategory = "https://hpedelta.com:5003/api/v1/ml/predict?q=";
  const ChangeStatus_URL = Domain_URL + "api/MyWorkSpace";
  const Approval_Url = Domain_URL + "api/DocumentApproval";
  const ContributionMail_URL =
    Domain_URL + "api/ContibutionMail/SendContributionMails";
  const GetAllDocumentNames_Url = Domain_URL + "api/AllDocDepotDocuments";

  const GetReqForReSubmitInActive_Url = Domain_URL + "api/InActiveDocuments"
  const AllOtherMasterTablesDataURL = Domain_URL + "api/Document/GetAllOtherMasterTablesData";
  // const GetInProgressDocument_Url= Domain_URL +"api/Document/GetInProgressDocument?employeeID=";
  //const GetAllDocumentNames_Url =  "https://localhost:44322/api/AllDocDepotDocuments" ;
  var ApplyAuth = function (URL) {
    return {
      method: "get",
      url: URL,
      headers: {
        Authorization: "Basic U2ZkY1VzZXI6VTJaa1kzSmxZV1JBTVRJeU1BPT0=",
      },
    };
  };
  var getEncKey = function () {
    return EncKey;
  };
  var TaggedDocuemnts = function () {
    return TaggedDocuemnts_Url;
  };
  var EditDocumentDetails = function () {
    return EditDocumentDetails_Url;
  };

  var SearchDocsByOppID = function () {
    return SearchDocsByOppID_Url;
  };
  var UnTaggedDocuemnts = function () {
    return UnTaggedDocuemnts_Url;
  };

  var Domain = function () {
    return Domain_URL;
  };
  var UploadFile = function (UserID, OppID, isDraft) {
    return UploadFile_Url.replace("{USERID}", UserID)
      .replace("{OppID}", OppID)
      .replace("{isDraft}", isDraft);
  };
  var AddDocumentDetails = function () {
    return AddDocumentDetails_Url;
  };
  var DraftAPI = function () {
    return DraftsAPI;
  };
  var PublishedDocAPI = function () {
    return PublishedDocsAPI;
  };
  var GetUpForArchivalDocAPI = function () {
    return UpForArchivalDocAPI;
  };
  var GetMarkAsInProgressAPI = function () {
    return MarkAsInProgressAPI;
  };
  var GetInActiveDocsAPI = function () {
    return InActiveDocsAPI;
  };
  var EditPublishedDocDetailsAPI = function () {
    return EditPublishedDocDetails_Url;
  };
  var GetDraftDeleteAPI = function () {
    return DeleteDraftAPIURL;
  };
  var GetDeleteDocURL = function () {
    return DeleteDocumentAPIURL;
  };
  var GetKnowledgeDocAPIURL = function () {
    return KnowledgeDocAPIURL;
  };
  var GetKnowledgeDocDraftAPIURL=function (){
    return KnowledgeDraftDocAPIURL;
  }
  var GetOpportunityRelatedAPIURL = function () {
    return OpportunityRelatedAPIURL;
  };
  var GetPursuitDocumentsURL = function () {
    return GetPursuitDocuments;
  };
  var GetOppDetailsByMailID = function (mailID) {
    return ApplyAuth(GetOppDetailsByMail.replace("{Mail}", mailID));
  };
  var GetPredictDocCategory = function (docName) {
    return ApplyAuth(PredictDocCategory + docName);
  };
  var ChangeStatus_API = function () {
    return ChangeStatus_URL;
  };
  var DocApproval_API = function () {
    return Approval_Url;
  };
  var GetContributionMail_URL = function () {
    return ContributionMail_URL;
  };
  var handlePreview = function (filepath) {
    var filepath =
      ENV === "PROD"
        ? "F:\\AnPS\\DocDepo\\Publish\\" +
          filepath.replace(/ /g, "%20").split("/").join("\\")
        : "E:\\anpsapi_uat\\" +
          filepath.replace(/ /g, "%20").split("/").join("\\");
    console.log(filepath);
    filepath = CryptoJS.enc.Utf8.parse(filepath);
    filepath = CryptoJS.enc.Base64.stringify(filepath);
    const previewURL =
      ENV === "PROD"
        ? "https://hpedelta.com/Viewer.aspx?file=" + filepath
        : "https://delta.app.hpecorp.net:8543/viewer.aspx?file=" + filepath;
    return previewURL;
  };
  var GetAllDocumentNames = function () {
    return GetAllDocumentNames_Url;
  };
  var GetReqForReSubmitInActive = function () {
    return GetReqForReSubmitInActive_Url;
  }
  // var GetInProgressDocument=function(){
  //     return GetInProgressDocument_Url;
  // }
  var GetAllOtherMasterTablesDataURL = function () {
    return AllOtherMasterTablesDataURL;
  };

  return {
    TaggedDocuemnts: TaggedDocuemnts,
    EditDocumentDetails: EditDocumentDetails,
    // GetInprogressDocument:GetInProgressDocument,
    SearchDocsByOppID: SearchDocsByOppID,
    UnTaggedDocuemnts: UnTaggedDocuemnts,
    Domain: Domain,
    UploadFile: UploadFile,
    AddDocumentDetails: AddDocumentDetails,
    getEncKey: getEncKey,
    DraftAPI: DraftAPI,
    PublishedDocAPI: PublishedDocAPI,
    GetUpForArchivalDocAPI: GetUpForArchivalDocAPI,
    GetMarkAsInProgressAPI: GetMarkAsInProgressAPI,
    GetInActiveDocsAPI: GetInActiveDocsAPI,
    EditPublishedDocDetailsAPI: EditPublishedDocDetailsAPI,
    GetDraftDeleteAPI: GetDraftDeleteAPI,
    GetDeleteDocURL: GetDeleteDocURL,
    GetKnowledgeDocAPIURL: GetKnowledgeDocAPIURL,
    GetKnowledgeDocDraftAPIURL : GetKnowledgeDocDraftAPIURL,
    GetOpportunityRelatedAPIURL: GetOpportunityRelatedAPIURL,
    GetPursuitDocumentsURL: GetPursuitDocumentsURL,
    GetOppDetailsByMailID: GetOppDetailsByMailID,
    GetPredictDocCategory: GetPredictDocCategory,
    ChangeStatus_API: ChangeStatus_API,
    ApplyAuth: ApplyAuth,
    DocApproval_API: DocApproval_API,
    GetContributionMail_URL: GetContributionMail_URL,
    handlePreview: handlePreview,
    GetAllDocumentNames,
    GetReqForReSubmitInActive,
    GetAllOtherMasterTablesDataURL : GetAllOtherMasterTablesDataURL
  };
})();
export default URLConfig;
