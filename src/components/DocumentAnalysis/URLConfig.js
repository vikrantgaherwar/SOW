import CryptoJS from "crypto-js";

var URLConfig = (function () {
  //const Domain_URL = "http://localhost:5100/";
  //const Domain_URL = "https://localhost:44322/";

  const ENV = process.env.REACT_APP_ENV; // "PROD"; // UAT  // LOCAL

  const Domain_URL =
    ENV == "PROD"
      ? "https://delta.app.hpecorp.net:444/"
      : "https://delta.app.hpecorp.net:447/";

  const EncKey = "ewfWE@#%$rfdsefgdsf";

  const ReUploadFile_Url =
    Domain_URL +
    "api/File/ReUploadDocument?documentID={DocumentID}&userId={USERID}&oppId={OppID}&category={Category}";
  const GetDocumentDetails_URL =
    Domain_URL + "api/ReUpload/GetDeltaDoumentById/";
  const SearchDocument_Url = Domain_URL + "api/SearchDocument";
  const MyBin_Url = Domain_URL + "api/DocumentAnalysis/GetMyBin/{empID}/mybin";
  const ProjectDocuments_Url =
    Domain_URL + "api/DocumentAnalysis/GetQueueDocuments";
  const PublishedtDocuments_Url =
    Domain_URL + "api/DocumentAnalysis/GetPublishedDocuments/";
  const SharePointCount_Url =
    Domain_URL + "api/SharePointDocuments/GetGroupCount";
  const SharePointDocsByGrp_Url =
    Domain_URL + "api/SharePointDocuments/GetDocumentsByGroup/";
  const EditDocumentDetails_Url =
    Domain_URL + "api/Document/EditDocumentDetails";
  const RejectDocument_Url = Domain_URL + "api/DocumentAnalysis/RejectDocument";
  const ApproveDocument_Url =
    Domain_URL + "api/DocumentAnalysis/ApproveDocument/";
  const AssignDocument_Url =
    Domain_URL + "api/DocumentAnalysis/AssignDocumentToUser";
  const GetMetaDataByDocID_Url =
    Domain_URL + "api/DocumentAnalysis/GetMetaDataDetails/{DocumentID}/";
  const GetPursuitDocuments =
    Domain_URL + "api/PursuitDocuments/GetAllPursuitDocuments/";

  const GetQueuedDocumentsCount_URL =
    Domain_URL + "api/DocumentsQueued/GetDocumentsQueuedCount";
  const GetMyWorkSpaceDocumentsCount_URL =
    Domain_URL + "api/MyWorkSpace/GetMyWorkSpaceDocumentsCount/";

  const GetQueuedDocuments_URL = Domain_URL + "api/DocumentsQueued";
  const GetMyWorkSpaceDocuments_URL = Domain_URL + "api/MyWorkSpace";
  const ChangeStatus_URL = Domain_URL + "api/MyWorkSpace";
  const ContributionMail_URL = Domain_URL + "api/ContibutionMail";
  const document_Url = Domain_URL + "api/DocumentCounts/GetDocumentReport";
  const AllOtherMasterTablesDataURL = Domain_URL + "api/Document/GetAllOtherMasterTablesData"
  var getEncKey = function () {
    return EncKey;
  };

  var Domain = function () {
    return Domain_URL;
  };
  var GetDocumentDetails = function (DocID) {
    return GetDocumentDetails_URL + DocID;
  };
  var ReUploadFile = function (DocID, UserID, OppID, category) {
    return ReUploadFile_Url.replace("{USERID}", UserID)
      .replace("{OppID}", OppID)
      .replace("{DocumentID}", DocID)
      .replace("{Category}", category);
  };
  var SearchDocument = function () {
    return SearchDocument_Url;
  };
  var MyBin = function (empID) {
    return MyBin_Url.replace("{empID}", empID);
  };

  var ProjectDocuments = function () {
    return ProjectDocuments_Url;
  };

  var PublishedDocuments = function (empID) {
    return PublishedtDocuments_Url + empID;
  };

  var SharePointCount = function () {
    return SharePointCount_Url;
  };
  var SharePointDocsByGrp = function (GrpName) {
    return SharePointDocsByGrp_Url + GrpName;
  };
  var EditDocumentDetails = function () {
    return EditDocumentDetails_Url;
  };
  var RejectDocument = function () {
    return RejectDocument_Url;
  };

  var ApproveDocument = function (DocID) {
    return ApproveDocument_Url + DocID;
  };

  var AssignDocument = function () {
    return AssignDocument_Url;
  };

  var GetMetaDataByDocID = function (DocID) {
    return GetMetaDataByDocID_Url.replace("{DocumentID}", DocID);
  };
  var GetPursuitDocumentsURL = function () {
    return GetPursuitDocuments;
  };
  var GetQueuedDocumentsCount = function () {
    return GetQueuedDocumentsCount_URL;
  };

  var GetMyWorkSpaceDocumentsCount = function () {
    return GetMyWorkSpaceDocumentsCount_URL;
  };

  var GetQueuedDocuments = function () {
    return GetQueuedDocuments_URL;
  };
  var GetMyWorkSpaceDocuments = function () {
    return GetMyWorkSpaceDocuments_URL;
  };
  var ChangeStatus_API = function () {
    return ChangeStatus_URL;
  };
  var GetContributionMail_URL = function () {
    return ContributionMail_URL;
  };

  var GetDocument_URL = function () {
    return document_Url;
  };

;
  var GetAllOtherMasterTablesDataURL = function () {
    return AllOtherMasterTablesDataURL;
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
  const ApplyAuth = function (URL) {
    return {
      method: "get",
      url: URL,
      headers: {
        Authorization: "Basic U2ZkY1VzZXI6VTJaa1kzSmxZV1JBTVRJeU1BPT0=",
      },
    };
  };
  return {
    Domain: Domain,
    ReUploadFile: ReUploadFile,
    getEncKey: getEncKey,
    GetDocumentDetails: GetDocumentDetails,
    SearchDocument: SearchDocument,
    MyBin: MyBin,
    ProjectDocuments: ProjectDocuments,
    PublishedDocuments: PublishedDocuments,
    SharePointCount: SharePointCount,
    SharePointDocsByGrp: SharePointDocsByGrp,
    EditDocumentDetails: EditDocumentDetails,
    RejectDocument: RejectDocument,
    ApproveDocument: ApproveDocument,
    AssignDocument: AssignDocument,
    GetMetaDataByDocID: GetMetaDataByDocID,
    GetPursuitDocumentsURL: GetPursuitDocumentsURL,
    GetQueuedDocumentsCount: GetQueuedDocumentsCount,
    GetMyWorkSpaceDocumentsCount: GetMyWorkSpaceDocumentsCount,
    GetQueuedDocuments: GetQueuedDocuments,
    GetMyWorkSpaceDocuments: GetMyWorkSpaceDocuments,
    ChangeStatus_API: ChangeStatus_API,
    GetContributionMail_URL: GetContributionMail_URL,
    handlePreview: handlePreview,
    ApplyAuth,
    GetDocument_URL : GetDocument_URL,
    GetAllOtherMasterTablesDataURL : GetAllOtherMasterTablesDataURL
  };
})();
export default URLConfig;
