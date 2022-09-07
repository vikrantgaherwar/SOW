import URLConfig from "./URLConfig";
import axios from "axios";
import { words } from "lodash";
class TrackingService {
  constructor() {
    this.config = URLConfig;
  }
  async fireApiCall(data) {
    await fetch(this.config.getURL_UserTracking(), {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async fireExpressPackageApiCall(data) {
    let url = URLConfig.SaveExpressView();
    var config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };
    try {
      await axios(config).then(function (response) {
        console.log("API executed");
      });
    } catch (error) {
      console.log(error);
    }
  }

  async LogMainSearch(UserID, SearchStr, isExpress) {
    const data = {
      UserId: UserID,
      type: "Search",
      data: SearchStr,
      host: window.location.href,
      isExpress,
    };
    this.fireApiCall(data);
  }
  async LogSearch(UserID, SearchStr) {
    const data = {
      UserId: UserID,
      type: "Search",
      data: SearchStr,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogAccountSearch(UserID, SearchStr) {
    const data = {
      UserId: UserID,
      type: "AccountSearch",
      data: SearchStr,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogUserLogin(UserID) {
    const data = {
      UserId: UserID,
      type: "Login",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async PageVisit(UserID) {
    const data = {
      UserId: UserID,
      type: "Page_Visit",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async OpenLink(UserID, documentDetails) {
    const data = {
      UserId: UserID,
      type: "Open_Document_Link",
      data: documentDetails.url,
      host: window.location.href,
      FileName: documentDetails.file + "." + documentDetails.file_type,
      Source: documentDetails.doc_source,
    };
    this.fireApiCall(data);
  }
  async LogSowClick(UserID) {
    const data = {
      UserId: UserID,
      type: "SOW_Click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogSowGetInfoClick(UserID, oppId) {
    const data = {
      UserId: UserID,
      type: "SOW_Get_Info",
      data: oppId,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }

  async LogSOWDownload(UserID, sowId, filename) {
    const data = {
      UserId: UserID,
      type: "SOW_PDF_Download",
      data: sowId,
      host: window.location.href,
      FileName: filename,
    };
    this.fireApiCall(data);
  }
  async LogExpressPackageDocView(UserID, PackageName, SearchStr, type) {
    const expressviewdata = {
      UserId: UserID,
      Package: PackageName,
      SearchString: SearchStr,
      isLiked: "false",
      Comments: "",
      host: window.location.href,
      type: type,
    };
    this.fireExpressPackageApiCall(expressviewdata);
  }
  async LogLinksClick(UserID, displayName, Path, URL) {
    const data = {
      UserId: UserID,
      type: "LogFooterLinks_click",
      data: displayName,
      Source: URL,
      host: window.location.href,
      FileName: displayName,
    };
    this.fireApiCall(data);
  }
  async LogFlyerLinkClick(UserID, displayName, Path, URL) {
    const data = {
      UserId: UserID,
      type: "LogFlyer_Link_click",
      data: "",
      Source: Path,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogGamificationModalClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogGamificationOverview_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogGamificationDashboardClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogGamificationDashboard_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogLast15SearchClick(UserID, item) {
    const data = {
      UserId: UserID,
      type: "LogLast15Search_link_click",
      data: item,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogNewDocClick(UserID, item) {
    const data = {
      UserId: UserID,
      type: "LogNewSharedDoc_link_click",
      data: item,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogNewBookMarkClick(UserID, item) {
    const data = {
      UserId: UserID,
      type: "LogBookMark_link_click",
      data: item,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogLanguageChange(UserID, SelectedLanguage) {
    const data = {
      UserId: UserID,
      type: "LogLanguageChange_link_click",
      data: SelectedLanguage,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogHPELifeCycleFlyer(UserID) {
    const data = {
      UserId: UserID,
      type: "LogFlyer_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogDocDepoClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogDocDepo_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogPracticelinkClick(UserID, dom) {
    const data = {
      UserId: UserID,
      type: "LogPractice_link_click",
      data: dom,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogMyProjectlinkClick(UserID, item) {
    const data = {
      UserId: UserID,
      type: "LogMyProject_link_click",
      data: item,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogMyContributionlinkClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogMyContribution_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogFeedbacklinkClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogFeedback_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogKNVideolinkClick(UserID, file) {
    const data = {
      UserId: UserID,
      type: "LogKNVideo_link_click",
      data: file,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogContactInfolinkClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogContactInfo_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogWordCountlinkClick(UserID, searchText) {
    const data = {
      UserId: UserID,
      type: "LogWordCount_link_click",
      data: searchText,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }

  // async LogproductUrlClick(UserID, searchText, url) {
  //   const data = {
  //     UserId: UserID,
  //     type: "LogproductUrl_link_click",
  //     data: searchText,
  //     Source: url,
  //     host: window.location.href,
  //   };
  //   this.fireApiCall(data);
  // }
  // async LogprogramUrlClick(UserID, searchText, url) {
  //   const data = {
  //     UserId: UserID,
  //     type: "LogprogramUrl_link_click",
  //     data: searchText,
  //     Source: url,
  //     host: window.location.href,
  //   };
  //   this.fireApiCall(data);
  // }
  // async LogsalesUrlClick(UserID, searchText, url) {
  //   const data = {
  //     UserId: UserID,
  //     type: "LogsalesUrl_link_click",
  //     data: searchText,
  //     Source: url,
  //     host: window.location.href,
  //   };
  //   this.fireApiCall(data);
  // }
  // async LogserviceUrlClick(UserID, searchText, url) {
  //   const data = {
  //     UserId: UserID,
  //     type: "LogserviceUrl_link_click",
  //     data: searchText,
  //     Source: url,
  //     host: window.location.href,
  //   };
  //   this.fireApiCall(data);
  // }
  // async LogsolutionUrlClick(UserID, searchText, url) {
  //   const data = {
  //     UserId: UserID,
  //     type: "LogsolutionUrl_link_click",
  //     data: searchText,
  //     Source: url,
  //     host: window.location.href,
  //   };
  //   this.fireApiCall(data);
  // }
  async LogSesimicLinkClick(UserID, Sesimiclink, searchText, url) {
    const data = {
      UserId: UserID,
      type: Sesimiclink,
      data: searchText,
      Source: url,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  // async LogexecutiveUrlClick(UserID, searchText, url) {
  //   const data = {
  //     UserId: UserID,
  //     type: "LogexecutiveUrl_link_click",
  //     data: searchText,
  //     Source: url,
  //     host: window.location.href,
  //   };
  //   this.fireApiCall(data);
  // }

  async LogCustomerExperienceDashboard(UserID, href) {
    const data = {
      UserId: UserID,
      type: "LogCustomerExperienceDashboard_link_click",
      data: "",
      Source: href,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogSubmitOneLeadClick(UserID, href) {
    const data = {
      UserId: UserID,
      type: "LogSubmitOneLead_link_click",
      data: "",
      Source: href,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }

  async LogIncidentsClick(UserID, type, IncidentValue) {
    const data = {
      UserId: UserID,
      type: type,
      data: IncidentValue,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }

  async LogOppurtunitiesClick(UserID, type, value) {
    const data = {
      UserId: UserID,
      type: type,
      data: value,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }

  async LogPSAProjectClick(UserID, type, PSAstatus) {
    const data = {
      UserId: UserID,
      type: type,
      data: PSAstatus,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }

  async LogcustomerCapsulefilterClick(UserID, type, selectedate) {
    const data = {
      UserId: UserID,
      type: type,
      data: selectedate,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogsalesLeadClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogsalesLead_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogAPSSurveyClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogAPSSurvey_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogServiceCreditsClick(UserID, type, Creditsvalue) {
    const data = {
      UserId: UserID,
      type: type,
      data: Creditsvalue,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }

  async LogChatbotClick(UserID, msg) {
    const data = {
      UserId: UserID,
      type: "LogChatbot_link_click",
      data: msg,
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
  async LogCapabilityViewExportClick(UserID, msg) {
    const data = {
      UserId: UserID,
      type: "LogCapabilityViewExport_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }

  LogMasterClick;
  async LogMasterClick(UserID) {
    const data = {
      UserId: UserID,
      type: "LogMaster_link_click",
      data: "",
      host: window.location.href,
    };
    this.fireApiCall(data);
  }
}
export default TrackingService;
