import React from "react";
import "bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import bootbox, { dialog } from "bootbox";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import includes from "lodash/includes";
import some from "lodash/some";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import SearchForm from "./SearchForm";
import HeaderForm from "./HeaderForm";
import KnowledgeCapsule from "./KnowledgeCapsule";
import ReUseList from "./ReUseList";
import CustomerCapsule from "./CustomerCapsule";
import URLConfig from "./URLConfig";
import logo from "../img/loading-icon-animated.gif";
import adeltamodel from "../img/adeltamodel.png";
import briefCaseInnerlogo from "../img/suitcase-btn.jpg";
import briefCaselogo from "../img/suitcaseiocn-nobg.png";
import sowIcon from "../img/sow-automation.png";
import chatflash from "../img/chatflash.png";
import TrackingService from "./TrackingService";
import UseFulLinks from "./UseFullLinks";
import DocumentDepo from "./DocumentDepo/DocumentDepo";
import Tips from "./Tips";
import DocAnalysis from "./DocumentAnalysis";
import Filters from "./Filters";
import FilterTags from "./Filters/FilterTags";
import SearchFormHeader from "./SearchFormHeader";
import SeismicBriefcase from "./SeismicBriefcase";
import PracticeDropdown from "./PracticeDropdown";
import { UserContext } from "../UserContext";
import ProjectDropdown from "./ProjectDropdown";
import HeaderCounts from "./HeaderCounts";
import campignimage from "../img/homepage-slides1.jpg";
import KMNuggets from "../components/KMNuggets";
import Maintainance from "./Maintainance/UnscheduledMaintainance";
import { withRouter } from "react-router";
import feedback from "../img/feedback.png";
import Feedback from "./Feedback/Feedback";
import Modal from "react-bootstrap/Modal";
import Chatbot from "./ChatBot";
import Surveys from "./Feedback/Survey";
import FlyerTool from "./FlyerTool";
import Archive from "./Filters/Archive";
import Marquee from "react-easy-marquee";
import CampaignBanner from "./CampaignBanners";
class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    window.callbackPursuit = this;
    this.state = {
      hasTouched: false,
      openSurvey: true,
      SurveySearchItem: "",
      SurveySearchResult: false,
      searchTerm: "",
      CustomerID: "",
      AccountID: "",
      serviceData: null,
      reuseDate: null,
      insightData: null,
      POCList: null,
      hpseData: null,
      SKUData: null,
      CustomerOpportunityData: null,
      account_name: null,
      filterData: [],
      filters: "&fq=-isarchived:True",
      isLoading: true,
      isRefreshText: false,
      SearchInitiated: false,
      toggleDocDepo: false,
      MasterData: null,
      isDeltaUser: true,
      showDocAnalysisModule: false,
      key: Math.random(),
      activeFilter: "",
      fineSearchValue: "",
      isMovedAlready: false,
      createdFromDate: new Date(),
      createdToDate: new Date(),
      publishedFromDate: new Date(),
      publishedToDate: new Date(),
      lastModifiedFromDate: new Date(),
      lastModifiedToDate: new Date(),
      ForFilterRefresh: Date.now(),
      SelectedFilters: null,
      tooltipshow: true,
      showOutageTemplate: false,
      AccountSTID: "",
      maxScore: {
        guidesMaxScore: {
          item: "Guides",
          score: "",
          subitem: "",
        },
        presentationsMaxScore: {
          item: "Presentation",
          score: "",
          subitem: "",
        },
        servicesMaxScore: {
          item: "Services",
          score: "",
          subitem: "",
        },
        otherservicesMaxScore: {
          item: "Other Services",
          score: "",
          subitem: "",
        },
        multimediaMaxScore: {
          item: "Multimedia",
          score: "",
          subitem: "",
        },
        reuseMaxScore: {
          item: "Reuse",
          score: "",
          subitem: "",
        },
        trainingsMaxScore: {
          item: "Internal Trainings",
          score: "",
          subitem: "",
        },
        templatesMaxScore: {
          item: "Templates",
          score: "",
          subitem: "",
        },
      },
      peopleCapsuleData: null,
      showFeedbackform: false,
      hardClearValue: "",
      daysleft: 0,
    };
    this.ClearAFilter = React.createRef();
    this.ClearSearch = React.createRef();
  }

  processPursuitDocument = (PursuitDoc) => {
    //alert(DocumentName);
    const ISInDocDepo = this.state.toggleDocDepo;
    if (!ISInDocDepo) {
      this.setState({ PursuitDoc }, () => {
        this.toggleDocDepoFun();
      });
    } else {
      document.getElementsByClassName("Doc-Depo-Heading")[0].click();
    }
  };

  setActiveFilter = (selectedFilter, searchIdValue) => {
    this.setState({
      activeFilter: selectedFilter,
      fineSearchValue: searchIdValue,
    });
  };

  getAllMasterData = () => {
    const URL = URLConfig.getURLDeltaAPI() + "Document/GetAllMasterTablesData";
    axios.get(URL).then((res) => {
      this.setState({ MasterData: res.data });
    });
  };
  componentWillMount = () =>{
    this.TrackingService = new TrackingService();
    var urlParams = new URLSearchParams(window.location.search);
    var searchTerm = urlParams.get("q");
    this.setState({searchTerm}, ()=>{
      this.InitiateSearch(searchTerm);
    })
  }
  componentDidMount = () => {
    this.getAllMasterData();
    document.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
      },
      false
    );
    this.blinkMe();
    this.getRemainingDays();
  };
  blinkMe = () => {
    setTimeout(() => {
      this.setState({ tooltipshow: false });
    }, 5000);
    return false;
  };
  getRemainingDays = () => {
    var countDownDate = new Date("Apr 16, 2022 00:00:00").getTime();
    var now = new Date().getTime();
    var timeleft = countDownDate - now;
    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    this.setState({ daysleft: days });
  };
  getgetAccountIDByServiceAgreementId = (searchTerm) => {
    const URL =
      "https://delta.app.hpecorp.net:8983/solr/service_credit/select?fl=SAID,Account_ST_ID,Account_ST_Name,AccountName,Top_Parent_ST_ID,Top_Parent_ST_Name&fq=SAID:%22" +
      searchTerm +
      "%22&indent=on&q=*:*&rows=1&wt=json";

    axios(URL).then((res) => {
      if (res?.data?.response?.docs?.length) {
        const AccountID =
          "Account.Account_ST_ID__c%20=%20%27" +
          res?.data?.response?.docs[0].Account_ST_ID;
        if (AccountID) {
          this.setState({ AccountID });
          this.getOpportunityDataByAccountIDSTID(AccountID);
        }
      } else {
        toast.error("Customer Details not Available", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };
  onCustomerSearchFormSubmit = (searchTerm) => {
    debugger;
    //searchTerm = encodeURI(searchTerm);
    this.TrackingService.LogAccountSearch(Cookies.get("empnumber"), searchTerm);
    try {
      this.setState({ SurveySearchItem: searchTerm });
      if (this.state.activeFilter && this.state.activeFilter === "OPP ID") {
        this.getAccountID(searchTerm);
        this.MoveSearchElements();
      } else if (
        this.state.activeFilter &&
        this.state.activeFilter === "WBS ID"
      ) {
        this.getOpportunityIDByWbsID(searchTerm);
        this.MoveSearchElements();
      } else if (
        this.state.activeFilter &&
        this.state.activeFilter === "ST ID"
      ) {
        const accID = "Account.Account_ST_ID__c%20=%20%27" + searchTerm;
        this.setState({ AccountID: accID });
        this.getOpportunityDataByAccountIDSTID(accID);
      } else if (
        this.state.activeFilter &&
        this.state.activeFilter === "PR ID"
      ) {
        this.getAccountIDByPRID(searchTerm);
      } else if (
        this.state.activeFilter &&
        this.state.activeFilter === "Service Agreement Id"
      ) {
        this.getgetAccountIDByServiceAgreementId(searchTerm);
      } else if (
        this.state.activeFilter &&
        this.state.activeFilter === "Serial ID"
      ) {
        const serialidurl =
          URLConfig.getURLDeltaAPI() + "SearchSerialNumber/" + searchTerm;

        axios(serialidurl).then((res) => {
          if (res.data.account_ST_ID) {
            const rawacid = res.data.account_ST_ID;
            const AccountID =
              "Account.Account_ST_ID__c%20=%20%27" + res.data.account_ST_ID;
            const ProductName = res.data.product_Name;

            this.setState(
              {
                AccountID: AccountID,
                ProductName: ProductName === "null" ? "" : ProductName,
                searchTerm: ProductName,
                // parentAccountStID: 474737,
              },
              () => this.getOpportunityDataByAccountIDSTID(AccountID),
              this.getparentSTID(rawacid),
              this.onSearchFormSubmit(ProductName),
              this.MoveSearchElements()
            );
          } else {
            toast.error("Account Details not Available", {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        });
      } else if (
        this.state.activeFilter &&
        this.state.activeFilter === "Account Name"
      ) {
        this.getAccountIdByAccountName(searchTerm);
      }
    } catch (error) {
      this.setState({ showOutageTemplate: true, isLoading: false });
      console.log("cant load cc");
    }
  };

  getparentSTID = (rawacid) => {
    const pstidURL =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20Asset_Serial_Number__c,%20Account.Name,%20Account.Account_ST_ID__c,%20Account.Top_Parent_ST_ID__c%20from%20Case%20where%20Account.Account_ST_ID__c%20=%20%27" +
      rawacid +
      "%27%20limit%201";
    const config = URLConfig.ApplyAuth(pstidURL);
    axios(config).then((response) => {
      if (response?.data?.response?.length) {
        const parentAccountStID =
          response.data.response[0].Account_Top_Parent_ST_ID__c == null
            ? response.data.response[0].Account_Account_ST_ID__c
            : response.data.response[0].Account_Top_Parent_ST_ID__c;
        this.setState({
          parentAccountStID: parentAccountStID,
        });
      }
    });
  };

  getAccountIdByAccountName = (searchTerm) => {
    this.setState({
      isLoading: true,
      isRefreshText: false,
    });
    const accountName = encodeURIComponent(searchTerm);

    const serviceURL = URLConfig.getUrlAccountIdByAccountName(accountName);
    this.setState({ account_name: searchTerm });
    axios(URLConfig.ApplyAuth(serviceURL)).then((res) => {
      if (res.data.response.docs.length) {
        const accountID = res.data.response.docs[0].Account_ST_ID;
        const accID = "Account.Account_ST_ID__c%20=%20%27" + accountID;
        this.setState({ AccountID: accID }, () =>
          this.getparentSTID(accountID)
        );
        this.getOpportunityDataByAccountIDSTID(accID);
      } else {
        this.setState({
          AccountID: "",
          isLoading: false,
          isRefreshText: false,
          CustomerOpportunityData: null,
          SurveySearchResult: false,
        });
        toast.error("Customer Details not Available", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  getAccountIDByPRID = (prID) => {
    this.setState({
      isLoading: true,
      isRefreshText: false,
    });
    const serviceURL = URLConfig.getUrlOppDataByPRID(prID);
    axios(URLConfig.ApplyAuth(serviceURL)).then((res) => {
      if (res?.data?.response?.length) {
        const accountID = res.data.response[0].pse__Account__r_Account_ST_ID__c;
        if (accountID) {
          const accID = "Account.Account_ST_ID__c%20=%20%27" + accountID;
          this.setState({ AccountID: accID });

          this.getOpportunityDataByAccountIDSTID(accID);
        } else {
          this.setState({
            isLoading: false,
            isRefreshText: false,
          });
          toast.error(
            "Account ST ID unavailable for the entered PR ID. Unable to load the customer capsule ",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      } else {
        this.setState({
          isLoading: false,
          isRefreshText: false,
        });
        toast.error("Please enter valid PR ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  getOpportunityIDByWbsID = (wbsID) => {
    const serviceURL = URLConfig.getURLOpportunityIDByWbsID(wbsID);
    this.setState({
      isLoading: true,
      isRefreshText: false,
    });

    //Timer for long run

    axios(serviceURL).then((res) => {
      if (res?.data?.response?.docs?.length) {
        const opportunity_id = res.data.response.docs[0].opportunity_id;
        this.getAccountID(opportunity_id);
      } else {
        this.setState({
          AccountID: "",
          isLoading: false,
          isRefreshText: false,
        });
      }
    });
  };

  getAccountID = (OpportunityID) => {
    this.setState({ CustomerID: OpportunityID });
    const serviceUrl = URLConfig.getURLActIDOPP(OpportunityID);

    axios(serviceUrl).then((res) => {
      if (res?.data?.response[0]?.IsPrivate === true) {
        toast.error(
          "Entered customer identifier marked for NDA. Unable to load customer capsule",
          {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "info",
            className: "ndatoast",
          }
        );
      } else {
        if (res?.data?.response?.length) {
          const AccountID =
            "Account.Account_ST_ID__c%20=%20%27" +
            res.data.response[0].Account_Account_ST_ID__c;
          const parentAccountStID =
            res.data.response[0].Account_Top_Parent_ST_ID__c == null
              ? res.data.response[0].Account_Account_ST_ID__c
              : res.data.response[0].Account_Top_Parent_ST_ID__c;
          this.setState({ parentAccountStID: parentAccountStID });
          this.setState({ AccountID: AccountID });
          this.getOpportunityDataByAccountID(AccountID);
          this.getAccountDetails(res.data.response[0]);
        } else {
          this.setState({ AccountID: "" });
          this.setState({
            isLoading: false,
            isRefreshText: false,
          });
          toast.error(
            "Account ST ID unavailable. Unable to load customer capsule",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      }
    });
  };

  getAccountDetails = (accountDetails) => {
    this.setState({
      isLoading: true,
      isRefreshText: false,
    });
    this.setState(
      { account_name: accountDetails.Account_Account_ST_Name__c },
      () => {
        this.closeLoaderHandler();
      }
    );
  };
  closeLoaderHandler = () => {
    this.setState({
      isLoading: false,
      isRefreshText: false,
    });
  };
  getOpportunityDataByAccountID = (AccountID) => {
    const serviceUrl = URLConfig.getUrlOppDataByActID(AccountID);
    axios(serviceUrl).then((res) => {
      if (res.data.response.length) {
        document.getElementsByTagName("body")[0].click();
        const CustomerOpportunityData = res.data.response;
        this.setState({
          CustomerOpportunityData: CustomerOpportunityData,
          isLoading: false,
          isRefreshText: false,
        });
      } else {
        this.setState({
          isLoading: false,
          isRefreshText: false,
        });
      }
    });
  };

  getOpportunityDataByAccountIDSTID = (AccountID) => {
    this.setState({
      isLoading: true,
      isRefreshText: false,
    });
    const serviceUrl = URLConfig.getUrlOppDataByActID(AccountID);
    axios(serviceUrl).then((res) => {
      if (res.data.response.length) {
        this.MoveSearchElements();
        document.getElementsByTagName("body")[0].click();
        const CustomerOpportunityData = res.data.response;
        CustomerOpportunityData[0].Account_Account_ST_Name__c &&
          this.setState({
            account_name: CustomerOpportunityData[0].Account_Account_ST_Name__c,
          });
        setTimeout(() => {
          this.setState({ SurveySearchResult: true });
        }, 4000);

        this.setState({
          CustomerOpportunityData: CustomerOpportunityData,
          isLoading: false,
          isRefreshText: false,
        });
      } else {
        this.setState({
          AccountID: "",
          isLoading: false,
          isRefreshText: false,
          CustomerOpportunityData: null,
          SurveySearchResult: false,
        });
        toast.error("Customer Details not Available", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  MoveSearchElements = () => {
    debugger;
    this.setState({ SearchInitiated: true, isMovedAlready: true });

    if (
      document.getElementById("SearchAutoSuggestionsPrimary")?.children.length
    ) {
      document.getElementsByClassName("main-container")[0].hidden = true;
      document.getElementsByClassName("header-logo-only-hp")[0].hidden = true;
      if (
        document
          .getElementsByClassName("header-logo-with-anps")[0]
          .classList.contains("display-none")
      )
        document
          .getElementsByClassName("header-logo-with-anps")[0]
          .classList.toggle("display-none");
      document.body.classList.toggle("body-grey-background");
      if (document.getElementsByClassName("usefullinks")[0])
        document.getElementsByClassName("usefullinks")[0].hidden = true;
      if (
        document
          .getElementsByClassName("search-base")[0]
          .classList.contains("display-none")
      )
        document
          .getElementsByClassName("search-base")[0]
          .classList.toggle("display-none");
    }
  };

  refreshDocDepo = () => {
    this.setState({ key: Math.random() });
  };

  onSearchFormSubmit = (
    searchTerm,
    filters = this.state.filters,
    SelectedFilters = this.state.SelectedFilters
  ) => {
    if (searchTerm !== this.state.searchTerm) {
      this.setState(
        {
          isLoading: true,
          isRefreshText: false,
          searchTerm,
          ForFilterRefresh: Date.now(),
          filterData: [],
          SelectedFilters: SelectedFilters,
          filters: filters,
          SurveySearchItem: searchTerm,
        },
        () => {
          this.CheckEneteredLanguage(searchTerm);
        }
      );
    } else {
      this.setState(
        { isLoading: true, isRefreshText: false, searchTerm },
        () => {
          this.CheckEneteredLanguage(searchTerm);
        }
      );
    }
  };

  CheckEneteredLanguage = (searchTerm) => {
    const UserLang = Cookies.get("UserLang");
    if (UserLang === undefined) {
      this.InitiateSearch(searchTerm);
    } else if (UserLang === "en") {
      this.InitiateSearch(searchTerm);
    } else {
      const config = URLConfig.ApplyAuth(
        "https://hpedelta.com:5003/services/translator/query?q=" +
          searchTerm +
          "&to_lang=en"
      );
      axios(config).then((res) => {
        if (res.data.response) {
          this.InitiateSearch(res.data.response);
        }
      });
    }
  };

  InitiateSearch = (searchTerm) => {
    try {
      var CustomerCapsuleLoading = false;
      this.TrackingService.LogSearch(Cookies.get("empnumber"), searchTerm);
      !this.state.isMovedAlready && this.MoveSearchElements();
      //searchTerm = encodeURIComponent(searchTerm);
      searchTerm = searchTerm.replace(/[#?&@]/g, " ");
      const URL =
        URLConfig.getURLKnowledgeCapsule(encodeURIComponent(searchTerm)) +
        this.state.filters;
      axios
        .get(URL)
        .then((res) => {
          const serviceData = res.data.grouped.document_type.groups;
          this.processGroupFilters(serviceData);
          if (!CustomerCapsuleLoading) {
            this.setState({
              serviceData,
              isLoading: false,
            });
            if (serviceData.length > 0) {
              setTimeout(() => {
                this.setState({ SurveySearchResult: true });
              }, 2000);

              this.getopenSurvey();
            }
          } else {
            this.setState({ serviceData });
          }
          if (res.data.grouped.document_type.groups.length > 0) {
            this.setState((prevState) => ({
              maxScore: {
                ...prevState.maxScore,
                otherservicesMaxScore: {
                  score: res.data.grouped.document_type.groups[0].doclist
                    .maxScore
                    ? res.data.grouped.document_type.groups[0].doclist.maxScore
                    : "",
                  item: "Other Services",
                  subitem: res.data.grouped.document_type.groups[0].groupValue
                    ? res.data.grouped.document_type.groups[0].groupValue
                    : "",
                },
              },
            }));
          }
        })
        .catch((err) => {console(err)});

      axios
        .get(URLConfig.getURL_HPSE(searchTerm) + this.state.filters)
        .then((res) => {
          const hpseData = res.data.results;
          this.setState({ hpseData });
        });
      axios
        .get(URLConfig.getURLSKU(searchTerm) + this.state.filters)
        .then((res) => {
          if (res.data.response) {
            const SKUData = res.data.response.docs;
            this.setState({ SKUData });
          }
        });
      const URLGuides =
        URLConfig.get_APIHost() +
        "solr/sharepoint_index/select?defType=edismax&fl=id,title,isgoldcollateral,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,nda,ndamails_raw,score,isarchived&group.field=document_type_details&group=true&indent=on&q=" +
        searchTerm +
        "&rows=500&wt=json&group.limit=15&fq=scope:%22Service%20Capsule%22&fq=document_type:%22Guides%22" +
        (this.state.filters.indexOf('&fq=nda:"True"') === -1
          ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
          : "") +
        this.state.filters;
      axios.get(URLGuides).then((res) => {
        if (res.data.grouped) {
          this.setState({ GuidesData: res.data.grouped.document_type_details });
          this.processGroupFilters(
            res.data.grouped.document_type_details.groups
          );
        }
        if (res.data.grouped.document_type_details.groups.length > 0) {
          this.setState((prevState) => ({
            maxScore: {
              ...prevState.maxScore,
              guidesMaxScore: {
                score:
                  res.data.grouped.document_type_details.groups[0].doclist
                    .maxScore,
                item: "Guides",
                subitem:
                  res.data.grouped.document_type_details.groups[0].groupValue,
              },
            },
          }));
        }
      });
      //Multimedia with Sub categories
      const URLMultiMedium =
        URLConfig.get_APIHost() +
        "solr/sharepoint_index/select?defType=edismax&fl=id,title,isgoldcollateral,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,nda,ndamails_raw,score,isarchived&group.field=document_type_details&group=true&indent=on&q=" +
        searchTerm +
        "&rows=500&wt=json&group.limit=15&fq=scope:%22Service%20Capsule%22&fq=document_type:%22Multimedia%22" +
        (this.state.filters.indexOf('&fq=nda:"True"') === -1
          ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
          : "") +
        this.state.filters;
      axios.get(URLMultiMedium).then((res) => {
        if (res.data.grouped) {
          this.setState({
            MultiMediumData: res.data.grouped.document_type_details,
          });
          this.processGroupFilters(
            res.data.grouped.document_type_details.groups
          );
        }
        if (res.data.grouped.document_type_details.groups.length > 0) {
          this.setState((prevState) => ({
            maxScore: {
              ...prevState.maxScore,
              multimediaMaxScore: {
                score:
                  res.data.grouped.document_type_details.groups[0].doclist
                    .maxScore,
                item: "MultiMedia",
                subitem:
                  res.data.grouped.document_type_details.groups[0].groupValue,
              },
            },
          }));
        }
      });
      // Internal Trainings
      const URLTrainings =
        URLConfig.get_APIHost() +
        "solr/sharepoint_index/select?defType=edismax&fl=id,title,isgoldcollateral,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,nda,ndamails_raw,score,isarchived&group.field=document_type_details&group=true&indent=on&q=" +
        searchTerm +
        '&rows=500&wt=json&group.limit=15&fq=scope:%22Service%20Capsule%22&fq=document_type:%22Internal%20Trainings%22&fq=document_type_details:("Saba", "Other Trainings")' +
        (this.state.filters.indexOf('&fq=nda:"True"') === -1
          ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
          : "") +
        URLConfig.GetUserRoles() +
        this.state.filters;
      axios.get(URLTrainings).then((res) => {
        if (res.data.grouped) {
          this.setState({
            TrainingsData: res.data.grouped.document_type_details,
          });
          this.processGroupFilters(
            res.data.grouped.document_type_details.groups
          );
        }
        if (res.data.grouped.document_type_details.groups.length > 0) {
          this.setState((prevState) => ({
            maxScore: {
              ...prevState.maxScore,
              trainingsMaxScore: {
                score:
                  res.data.grouped.document_type_details.groups[0].doclist
                    .maxScore,
                item: "Internal Trainings",
                subitem:
                  res.data.grouped.document_type_details.groups[0].groupValue,
              },
            },
          }));
        }
      });

      const URLPresentations =
        URLConfig.get_APIHost() +
        "solr/sharepoint_index/select?defType=edismax&fl=id,title,isgoldcollateral,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,nda,ndamails_raw,score,isarchived&group.field=document_type_details&group=true&indent=on&q=" +
        searchTerm +
        "&rows=500&wt=json&group.limit=15&fq=scope:%22Service%20Capsule%22&fq=document_type:%22Presentations%22" +
        (this.state.filters.indexOf('&fq=nda:"True"') === -1
          ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
          : "") +
        this.state.filters;

      axios.get(URLPresentations).then((res) => {
        if (res.data.grouped) {
          this.setState({
            PresentationsData: res.data.grouped.document_type_details,
          });
          this.processGroupFilters(
            res.data.grouped.document_type_details.groups
          );
        }
        if (res.data.grouped.document_type_details.groups.length > 0) {
          this.setState((prevState) => ({
            PresentationsData: res.data.grouped.document_type_details,
            maxScore: {
              ...prevState.maxScore,
              presentationsMaxScore: {
                score:
                  res.data.grouped.document_type_details.groups[0].doclist
                    .maxScore,
                item: "Presentation",
                subitem:
                  res.data.grouped.document_type_details.groups[0].groupValue,
              },
            },
          }));
        }
      });

      const URLServices =
        URLConfig.get_APIHost() +
        "solr/sharepoint_index/select?defType=edismax&fl=id,title,isgoldcollateral,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,description,go_to_market,service_name,service_type,nda,ndamails_raw,score,isarchived&group.field=document_type_details&group=true&indent=on&q=" +
        searchTerm +
        "&rows=500&wt=json&group.limit=15&fq=scope:%22Service%20Capsule%22&fq=document_type:%22Services%22" +
        (this.state.filters.indexOf('&fq=nda:"True"') === -1
          ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
          : "") +
        this.state.filters;
      axios.get(URLServices).then((res) => {
        if (res.data.grouped) {
          this.setState({
            ServicesData: res.data.grouped.document_type_details,
          });
          this.processGroupFilters(
            res.data.grouped.document_type_details.groups
          );
        }
        if (res.data.grouped.document_type_details.groups.length > 0) {
          this.setState((prevState) => ({
            maxScore: {
              ...prevState.maxScore,
              servicesMaxScore: {
                score:
                  res.data.grouped.document_type_details.groups[0].doclist
                    .maxScore,
                item: "Services",
                subitem:
                  res.data.grouped.document_type_details.groups[0].groupValue,
              },
            },
          }));
        }
      });

      // const URLMultimedia =
      //   URLConfig.get_APIHost() +
      //   "solr/sharepoint_index/select?defType=edismax&fl=id,title,isgoldcollateral,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,nda,ndamails_raw,score,isarchived&group.field=document_type_details&group=true&indent=on&q=" +
      //   searchTerm +
      //   '&rows=500&wt=json&group.limit=15&fq=scope:%22Service%20Capsule%22&fq=document_type:%22Multimedia%22' +
      //   (this.state.filters.indexOf("&fq=nda:\"True\"") === -1 ? "&fq=-nda:%22True%22" : "") +
      //   URLConfig.GetUserRoles() +
      //   this.state.filters;
      // axios.get(URLMultimedia).then((res) => {
      //   if (res.data.grouped) {
      //     this.setState((prevState) => ({
      //       MultimediaData: res.data.grouped.document_type_details,
      //       maxScore: {
      //         ...prevState.maxScore,
      //         multimediaMaxScore: {
      //           score: res.data.grouped.document_type_details.groups[0].doclist
      //             .maxScore
      //             ? res.data.grouped.document_type_details.groups[0].doclist
      //                 .maxScore
      //             : "",
      //           item: "Multimedia",
      //         },
      //       },
      //     }));
      //     this.processGroupFilters(res.data.grouped.document_type_details.groups);
      //   }
      // });

      // NK
      // ReUseInsight
      if (!searchTerm.includes("unique_file")) {
        let cleanSearchTerm = searchTerm;
        const index = cleanSearchTerm.indexOf("+");
        if (index > 0) cleanSearchTerm = cleanSearchTerm.substring(0, index);

        axios
          .get(
            URLConfig.getURLReUseInsight(cleanSearchTerm) +
              this.state.filters.replace("&fq=-isarchived:True", "")
          )
          .then(({ data }) => {
            if (data.grouped && data.grouped.Opportunity_Sales_Stage) {
              this.setState({
                insightData: data.grouped.Opportunity_Sales_Stage,
              });
            } else {
              this.setState({ insightData: null });
            }
          });
      } else {
        this.setState({ insightData: null });
      }

      axios
        .get(
          URLConfig.getURLReUseCapsule(searchTerm) +
            (this.state.filters.indexOf('&fq=nda:"True"') === -1
              ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
              : "") +
            this.state.filters
        )
        .then((res) => {
          if (res.data.grouped && res.data.grouped.document_type.groups) {
            const reuseDate = res.data.grouped.document_type.groups;
            this.setState({ reuseDate: reuseDate });
            if (res.data.grouped.document_type.groups.length > 0) {
              this.setState((prevState) => ({
                maxScore: {
                  ...prevState.maxScore,
                  reuseMaxScore: {
                    score:
                      res.data.grouped.document_type.groups[0].doclist.maxScore,
                    item: "Reuse",
                    subitem:
                      res.data.grouped.document_type.groups[0].groupValue,
                  },
                },
              }));
            }

            this.processGroupFilters(reuseDate);
          }
        });
      // For Templates Category Under Reference Capsule
      const templatesURL =
        "https://hpedelta.com:8983/solr/sharepoint_index/select?facet.pivot=document_type,document_type_details,document_type_level3,document_type_level4&facet=on&fl=file,score,document_type,document_type_details,document_type_level3,document_type_level4&fq=document_type:%22Templates%22%20AND%20scope:%22Reuse%22&indent=on&q=" +
        searchTerm +
        "&rows=1&wt=json" +
        (this.state.filters.indexOf('&fq=nda:"True"') === -1
          ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
          : "") +
        this.state.filters;
      axios.get(templatesURL).then((res) => {
        if (res.data.response.numFound > 0) {
          this.setState({
            TemplatesData:
              res?.data?.facet_counts?.facet_pivot[
                "document_type,document_type_details,document_type_level3,document_type_level4"
              ][0]?.pivot,
            TotalCount: res?.data?.response?.numFound,
          });

          this.setState((prevState) => ({
            maxScore: {
              ...prevState.maxScore,
              templatesMaxScore: {
                score: res.data.response.maxScore,
                item: "Templates",
                subitem: res.data.response.docs[0].document_type_details,
              },
            },
          }));
        } else {
          this.setState({
            TemplatesData: [],
            TotalCount: res?.data?.response?.numFound,
          });
        }
      });

      //This is for EOC under Service section for only fill filters data..
      const URLEOC =
        URLConfig.get_APIHost() +
        "solr/sharepoint_index/select?fl=id,title,isgoldcollateral,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,document_type_level3,nda,ndamails_raw,score&fq=scope:%22Service%20Capsule%22%20AND%20document_type_details:%22Education%20and%20MoC%22%20AND%20document_type:%22Services%22&group.field=document_type_level3&group.limit=10&group.mincount=1&group=true&indent=on&q=" +
        searchTerm +
        "&rows=500&wt=json" +
        (this.state.filters.indexOf('&fq=nda:"True"') === -1
          ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
          : "") +
        this.state.filters;
      axios.get(URLEOC).then((res) => {
        if (res.data.grouped && res.data.grouped.document_type_level3) {
          this.processGroupFilters(
            res.data.grouped.document_type_level3.groups
          );
        }
      });
      const url =
        URLConfig.get_APIHost() +
        "solr/sharepoint_index/select?fq=document_type:%22POC%22&indent=on&q=" +
        searchTerm +
        "&wt=json&rows=500" +
        (this.state.filters.indexOf('&fq=nda:"True"') === -1
          ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
          : "") +
        this.state.filters;
      axios.get(url).then((res) => {
        if (res.data.response && res.data.response.docs) {
          this.setState({
            POCList: res.data.response.docs,
          });
          this.processFilters(res.data.response.docs);
        }
      });
    } catch (error) {
      this.setState({ showOutageTemplate: true, isLoading: false });
      console.log("sorry cant load");
    }
  };
  homeredirect = () => {
    window.location.href = window.location.href;
  };
  showDocDepo = () => {
    this.setState({ showDocAnalysisModule: false });
  };
  resetResults = () => {
    // window.location.href = window.location.href;
    this.setState(
      {
        searchTerm: "",
        CustomerID: "",
        AccountID: "",
        serviceData: null,
        reuseDate: null,
        POCList: null,
        hpseData: null,
        SKUData: null,
        CustomerOpportunityData: null,
        account_name: null,
        filterData: [],
        filters: "&fq=-isarchived:True",
        activeFilter: "",
        fineSearchValue: "",
        isRefreshText: false,
        SelectedFilters: null,
      },
      () => {
        this.ClearSearch.current.ClearSearch();
      }
    );
  };
  useCustomPrompt = () => {
    var box = bootbox.dialog({
      title: "Reset?",
      message:
        "This will reset the current search so that you can start fresh.Do you want to continue?",
      className: "smallDesign",
      buttons: {
        cancel: {
          label: "No Thanks",
        },
        confirm: {
          label: "Reset",
          className: "btn-danger",
          callback: () => {
            this.resetResults();
            this.resetPopup();
          },
        },
      },
    });
    box
      .find(".modal-content")
      .css({ border: "4px solid #01a982", "font-size": "15px" });
  };
  resetPopup = () => {
    this.setState({ isRefreshText: true });
  };
  resetRefinedSearch = () => {
    this.setState({
      CustomerID: "",
      // AccountID: "",
      // CustomerOpportunityData: null,
      // account_name: null,
      activeFilter: "",
      fineSearchValue: "",
    });
  };

  toggleDocDepoFun = () => {
    this.MoveSearchElements();
    this.TrackingService.LogDocDepoClick(Cookies.get("empnumber"), true);
    // console.log(Cookies.get("empnumber"), "DocDepo");
    this.setState((prevState) => ({ toggleDocDepo: !prevState.toggleDocDepo }));
  };

  showDocAnalysys = () => {
    this.setState({ showDocAnalysisModule: true });
  };

  showHideDiv = (ele) => {
    var srcElement = document.getElementById(ele);
    if (srcElement != null) {
      if (srcElement.style.display == "block") {
        srcElement.style.display = "none";
      } else {
        srcElement.style.display = "block";
      }
      return false;
    }
  };

  showHideDivProjects = (ele) => {
    var srcElement = document.getElementById(ele);
    if (srcElement != null) {
      if (srcElement.style.display == "block") {
        srcElement.style.display = "none";
      } else {
        srcElement.style.display = "block";
      }
      return false;
    }
  };

  UpdateRoles = (Roles) => {
    var DefaultRoles = Cookies.get("roles")?.split(",");
    DefaultRoles = DefaultRoles.filter(
      (x) =>
        x === "Admin" ||
        x === "Analyst" ||
        x === "Process" ||
        x === "Specialist"
    );
    Roles = Roles.concat(DefaultRoles);
    if (Roles.length > 0) Cookies.set("roles", Roles.join(","));
    else Cookies.set("roles", "Guest");
    //Re-initiate Search
    if (this.state.searchTerm !== "")
      this.onSearchFormSubmit(this.state.searchTerm);
  };

  ApplyFilter = (
    filters = this.state.filters,
    SelectedFilters = this.state.SelectedFilters
  ) => {
    this.setState({ filters, SelectedFilters }, () => {
      if (this.state.searchTerm !== "") {
        this.onSearchFormSubmit(this.state.searchTerm);
      }
    });
  };
  // ApplyFilter = (
  //   filters = this.state.filters,
  //   SelectedFilters = this.state.SelectedFilters
  // ) => {
  //   this.setState({ filters, SelectedFilters }, () => {
  //     if (this.state.searchTerm !== "")
  //       this.onSearchFormSubmit(this.state.searchTerm);
  //   });
  // };
  ResetFilters = () => {
    const FilterAppliedEarlier =
      this.state.filters !== "&fq=-isarchived:True" ? true : false;
    this.setState(
      {
        ForFilterRefresh: Date.now(),
        filters: "&fq=-isarchived:True",
        SelectedFilters: null,
      },
      () => {
        if (FilterAppliedEarlier && this.state.searchTerm !== "")
          this.onSearchFormSubmit(this.state.searchTerm);
      }
    );
  };

  ClearFilter = (FilterName) => {
    if (this.ClearAFilter.current && this.ClearAFilter.current.ClearAFilter) {
      this.ClearAFilter.current.ClearAFilter(FilterName);
    } else {
      this.setState({ hardClearValue: FilterName });
    }
  };

  processGroupFilters = (docsByGroups) => {
    var filterData = this.state.filterData;
    docsByGroups.map((value) => {
      value.doclist.docs.map((value) => {
        filterData.push(value);
      });
    });
    this.setState({ filterData });
  };

  processFilters = (Docs) => {
    var filterData = this.state.filterData;
    Docs.map((value) => {
      filterData.push(value);
    });
    this.setState({ filterData });
  };

  getOpportunityData = (props) => {
    this.setState({ isLoading: true, isRefreshText: false });
    if (props == "") {
      this.getOpportunityDataByAccountIDSTID(this.state.AccountID);
    } else {
      var stid = this.state.AccountID.replace(
        "Account.Account_ST_ID__c%20=%20%27",
        ""
      );
      const OPPURL =
        "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=Select%20Account.Account_ST_Name__c,%20Opportunity_ID__c,%20convertCurrency(Amount),%20IsWon,%20IsClosed,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c !='HPE Not Pursued' AND%20Account.Account_ST_ID__c=%27" +
        stid +
        "%27 AND IsPrivate=false %20 AND %20" +
        props;

      const config = URLConfig.ApplyAuth(OPPURL);
      axios(config).then((res) => {
        if (res.data) {
          if (res.data.response.length) {
            this.MoveSearchElements();
            document.getElementsByTagName("body")[0].click();
            const CustomerOpportunityData = res.data.response;
            CustomerOpportunityData[0].Account_Account_ST_Name__c &&
              this.setState({
                account_name:
                  CustomerOpportunityData[0].Account_Account_ST_Name__c,
              });

            this.setState({
              CustomerOpportunityData: CustomerOpportunityData,
              isLoading: false,
              isRefreshText: false,
            });
          } else {
            this.setState({
              AccountID: "",
              isLoading: false,
              isRefreshText: false,
              CustomerOpportunityData: null,
              SurveySearchResult: false,
            });
            toast.error("Customer Details not Available", {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        }
      });
    }
  };

  getopenSurvey = () => {
    this.setState({ openSurvey: true });
  };

  closeSurvey = () => {
    this.setState({ openSurvey: false });
  };
  ResetCustomerCapsule = () => {
    if (this.state.AccountID !== "") {
      this.setState({ AccountID: "" });
    }
  };

  ResetKnowledgeAndRefCapsule = () => {
    this.setState({
      ForFilterRefresh: Date.now(),
      filterData: [],
      SelectedFilters: null,
      filters: "&fq=-isarchived:True",
      reuseDate: null,
      serviceData: null,
    });
  };
  showFeedback = () => {
    console.log(Cookies.get("empnumber"), "Feedback");
    this.setState({
      showFeedbackform: !this.state.showFeedbackform,
    });
    this.TrackingService.LogFeedbacklinkClick(Cookies.get("empnumber"), true);
  };
  onFeedbackFormClose = () => {
    this.setState({
      showFeedbackform: !this.state.showFeedbackform,
    });
    toast.success("Thank you for submitting your feedback", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  logMyContribution = () => {
    // console.log(Cookies.get("empnumber"), "LogMyContribution");
    this.TrackingService.LogMyContributionlinkClick(
      Cookies.get("empnumber"),
      true
    );
  };
  handleGamiPointsModal = (flag) => {
    this.setState({
      hasTouched: flag,
    });
  };
  render() {
    const Roles = Cookies.get("roles")?.split(",");
    // test comment
    return (
      <>
        <UserContext.Consumer>
          {([user, dispatch]) => {
            return (
              <HeaderForm
                user={user}
                dispatch={dispatch}
                SearchInitiated={this.state.SearchInitiated}
                updateRoles={this.UpdateRoles}
                onSubmit={this.onSearchFormSubmit}
                hasTouched={this.state.hasTouched}
                handleGamiPointsModal={this.handleGamiPointsModal}
              />
            );
          }}
        </UserContext.Consumer>
        {this.state.showOutageTemplate && <Maintainance />}
        {!this.state.toggleDocDepo && !this.state.showOutageTemplate && (
          <>
            <div className="col-12 p-1 search-base">
              <div className="row col-12 pr-0 mr-0">
                {this.state.filterData.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-link ml-2 p-1"
                    value="Show/Hide"
                    onClick={() => this.showHideDiv("divMsg")}
                  >
                    <i className="fa fa-filter" />
                  </button>
                )}
                
                  <SearchFormHeader
                    onSubmit={this.onSearchFormSubmit}
                    searchText={this.state.searchTerm}
                    activeFilter={this.state.activeFilter}
                    CustomerIDValue={this.state.fineSearchValue}
                    onCustomerSubmit={this.onCustomerSearchFormSubmit}
                    setActiveFilterAndValue={this.setActiveFilter}
                    ResetCustomerCapsule={this.ResetCustomerCapsule}
                    ResetKnowledgeAndRefCapsule={
                      this.ResetKnowledgeAndRefCapsule
                    }
                    resetRefinedSearch={this.resetRefinedSearch}
                    ref={this.ClearSearch}
                    history={this.props.history}
                    isClose={this.closeSurvey}
                  />
                
                <div className="ml-0">
                  {!this.state.toggleDocDepo && (
                    <span title="Click to reset current search.">
                      <i
                        className="fas fa-sync-alt reset-btn"
                        onClick={() => this.useCustomPrompt()}
                      />
                    </span>
                  )}
                </div>
                {this.state.isDeltaUser && (
                  <div
                    className="pr-0 ml-2 doc-depo-icon"
                    title="My Documents"
                    align="right"
                    style={{
                      marginRight: "13px",
                    }}
                  >
                    <img
                      className="brief-case-after-results pointer"
                      src={briefCaseInnerlogo}
                      alt="home"
                      onClick={this.toggleDocDepoFun}
                    />
                  </div>
                )}
                {this.state.isDeltaUser && (
                  <div
                    className="pr-0 ml-2 home_Icon"
                    title="Home"
                    align="right"
                  >
                    <i className="fas fa-home" onClick={this.homeredirect} />
                  </div>
                )}
              </div>
              {((this.state.serviceData != null &&
                this.state.POCList != null) ||
                this.state.CustomerOpportunityData != null) &&
                this.state.SelectedFilters != null && (
                  <FilterTags
                    filters={this.state.SelectedFilters}
                    ClearFilter={this.ClearFilter}
                  />
                )}
            </div>
            {/* Feedback Icon */}
            {this.state.filterData.length == 0 &&
              this.state.serviceData === null &&
              this.state.AccountID === "" &&
              !this.state.isRefreshText &&
              !this.state.toggleDocDepo && (
                <>
                  {/* <div className="feedbackIcon">
                  <div
                    id="feedbackiconcontainer"
                    title="Submit Your Feedback"
                    className="feedbackbtn"
                    onClick={this.showFeedback}
                  >
                    <img
                      className="brief-case pointer"
                      src={feedback}
                      alt="Feedback Image"
                    />
                  </div>
                </div> */}
                  <div
                    id="help"
                    title="Submit Your Feedback"
                    style={{ color: "#FFF", cursor: "pointer" }}
                    className="help"
                    onClick={this.showFeedback}
                  >
                    Feedback
                  </div>
                  {URLConfig.get_Environment() === "UAT" && <Chatbot></Chatbot>}
                </>
              )}

            {this.state.SurveySearchResult && this.state.openSurvey && (
              <Surveys
                AccountId={this.state.AccountID}
                account_name={this.state.account_name}
                searchTerm={this.state.SurveySearchItem}
                isSurvey={this.state.openSurvey}
                isClose={this.closeSurvey}
              />
            )}
          </>
        )}
        {!this.state.toggleDocDepo &&
          // this.state.filterData.length > 0 &&
          this.state.serviceData !== null && (
            <Filters
              ApplyFilter={this.ApplyFilter}
              filters={this.state.filters}
              SelectedFilters={this.state.SelectedFilters}
              filterData={this.state.filterData}
              key={this.state.ForFilterRefresh}
              ResetFilters={this.ResetFilters}
              ref={this.ClearAFilter}
              hardClearValue={this.state.hardClearValue}
            />
          )}

        {this.state.MasterData &&
          this.state.toggleDocDepo &&
          !this.state.showDocAnalysisModule && (
            <DocumentDepo
              homeredirect={this.homeredirect}
              refreshDocDepo={this.refreshDocDepo}
              MasterData={this.state.MasterData}
              showDocAnalysys={this.showDocAnalysys}
              enableDocAnalysis={this.state.showDocAnalysisModule}
              PursuitDoc={this.state.PursuitDoc}
              key={this.state.key}
            />
          )}
        {!this.state.MasterData &&
          this.state.toggleDocDepo &&
          !this.state.showDocAnalysisModule && (
            <div className="text-center">
              <img className="loading-img" src={logo} alt="loading"></img>
            </div>
          )}
        {this.state.showDocAnalysisModule && (
          <DocAnalysis
            MasterData={this.state.MasterData}
            homeredirect={this.homeredirect}
            showDocDepo={this.showDocDepo}
          />
        )}
        {(this.state.serviceData !== null ||
          this.state.CustomerOpportunityData !== null) &&
          !this.state.toggleDocDepo &&
          !this.state.showOutageTemplate && (
            <div className="container-fluid container-results">
              <div className="col-12 occupy-height">
                <div className="row row-padding-fix occupy-height">
                  {this.state.serviceData?.length === 0 &&
                    this.state.CustomerOpportunityData === null &&
                    !this.state.toggleDocDepo &&
                    this.state.reuseDate?.length === 0 &&
                    this.state.hpseData?.length === 0 &&
                    this.state.AccountID == "" && (
                      <div className="pt-5 mx-auto">
                        <button className="centerDiv shadow">
                          <div className="titlealign">No Results Found</div>
                          <div>
                            <b>
                              Modify the keyword (or) expand to include archived
                              documents
                            </b>
                            <div>
                              {/* <i className="fas fa-check-circle fa-lg text-success"></i> */}
                              <Archive
                                ApplyFilter={this.ApplyFilter}
                                value={
                                  this.state.SelectedFilters
                                    ? this.state.SelectedFilters
                                        .SelectedShowArchivedDocs
                                    : ""
                                }
                                ref={this.ClearArchivedDocs}
                              />
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  {this.state.serviceData !== null &&
                    this.state.POCList != null && (
                      <KnowledgeCapsule
                        selectedFilters={this.state.SelectedFilters}
                        docs={this.state.serviceData}
                        hpse={this.state.hpseData}
                        Presentations={this.state.PresentationsData}
                        GuidesData={this.state.GuidesData}
                        ServicesData={this.state.ServicesData}
                        SKUData={this.state.SKUData}
                        searchTerm={this.state.searchTerm}
                        //MultimediaData={this.state.MultimediaData}
                        MultimediaData={this.state.MultiMediumData}
                        POCList={this.state.POCList}
                        TrainingsData={this.state.TrainingsData}
                        filters={this.state.filters}
                        relevancyScore={this.state.maxScore}
                        isClose={this.closeSurvey}
                      />
                    )}
                  {this.state.reuseDate !== null &&
                    this.state.reuseDate.length > 0 && (
                      <ReUseList
                        selectedFilters={this.state.SelectedFilters}
                        docs={this.state.reuseDate}
                        filters={this.state.filters}
                        insightData={this.state.insightData}
                        setActiveFilterAndValue={this.setActiveFilter}
                        relevancyScore={this.state.maxScore}
                        searchTerm={this.state.searchTerm}
                        isClose={this.closeSurvey}
                        AccountId={this.state.AccountID}
                        // onCustomerSubmit={this.onCustomerSearchFormSubmit}
                      />
                    )}
                  {this.state.AccountID !== "" && (
                    <CustomerCapsule
                      OpportunityData={this.state.CustomerOpportunityData}
                      AccountId={this.state.AccountID}
                      account_name={this.state.account_name}
                      activeFilter={this.state.activeFilter}
                      fineSearchValue={this.state.fineSearchValue}
                      getOpportunityData={this.getOpportunityData}
                      parentAccountStID={this.state.AccountID.replace(
                        "Account.Account_ST_ID__c%20=%20%27",
                        ""
                      )}
                      isClose={this.closeSurvey}
                    />
                  )}
                  <SeismicBriefcase
                    searchText={this.state.searchTerm}
                    openFedback={this.getopenSurvey}
                  />
                </div>
              </div>
            </div>
          )}

       

        <ToastContainer />
        {this.state.isLoading && (
          <div className="text-center">
            <img className="loading-img" src={logo} alt="loading"></img>
          </div>
        )}
        <Tips />
        <ToastContainer />
        {this.state.isRefreshText && !this.state.toggleDocDepo && (
          <div>
            <button className="designbuttton">
              <div className="titlealign">Reset is complete</div>
              <div>
                <b>New Session is created.You can start your search again</b>
                <div>
                  <i className="fas fa-check-circle fa-lg text-success"></i>
                </div>
              </div>
            </button>
          </div>
        )}

        <footer
          className={
            (!this.state.toggleDocDepo &&
              this.state.serviceData != null &&
              this.state.POCList != null) ||
            this.state.CustomerOpportunityData !== null
              ? "footer-after-results"
              : ""
          }
        >
          {this.state.serviceData == null &&
            this.state.CustomerOpportunityData == null &&
            !this.state.toggleDocDepo && (
              <>
                <div
                  id="usefullinks"
                  className="container-fluid mt-5 col-12 usefullinks "
                >
                  <UseFulLinks />
                </div>

                <div
                  className="container-fluid text-center text-md-left"
                  style={{ paddingTop: "15px" }}
                >
                  <div className="row" style={{ paddingTop: "15px" }}>
                    <div className="col-md-4 mt-md-0 mt-3"></div>

                    <hr className="clearfix w-100 d-md-none pb-3" />

                    <div className="col-md-4 mb-md-0 mb-3">
                      <p>
                        © Copyright {new Date().getFullYear()} Hewlett Packard
                        Enterprise Pvt. Ltd.
                      </p>
                    </div>

                    <div className="col-md-4 mb-md-0 mb-3" align="right">
                      Works best with Chrome.
                    </div>
                  </div>
                </div>
              </>
            )}

          {((this.state.serviceData != null && this.state.POCList != null) ||
            this.state.CustomerOpportunityData != null) &&
            !this.state.toggleDocDepo && (
              <>
                <div
                  id="usefullinks"
                  className="container-fluid mt-5 col-12 usefullinks-after-results"
                >
                  <UseFulLinks />
                </div>
                {/* <div className="text-center">
                <p>© Copyright 2020 Hewlett Packard Enterprise Pvt. Ltd.</p>
                <p>
                  Works best with Chrome and Firefox.
                </p>
              </div> */}
                <div className="row  col-12">
                  <div className="row col-12">
                    <div className="col-md-4 mt-md-0 mt-3"></div>

                    <hr className="clearfix w-100 d-md-none pb-3" />

                    <div className="col-md-4 mb-md-0 mb-3">
                      <p>
                        © Copyright {new Date().getFullYear()} Hewlett Packard
                        Enterprise Pvt. Ltd.
                      </p>
                    </div>

                    <div className="col-md-4 mb-md-0 mb-3" align="right">
                      Works best with Chrome.
                    </div>
                  </div>
                </div>
              </>
            )}
        </footer>
      </>
    );
  }
}
export default withRouter(SearchResults);
