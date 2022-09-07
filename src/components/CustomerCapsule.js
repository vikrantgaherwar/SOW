import React, { lazy, Suspense } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import { ConvertTOMillion, sum } from "../utils/math";
import { groupBy } from "../utils/array";
import URLConfig from "./URLConfig";
import CustomerRevenueChart from "./CustomerRevenueChart";
import CustomerOpportunity from "./CustomerOpportunity/index";
import InstallBase from "./InstallBase";
import CXSurvey from "./CXSurvey";
import CCFilters from "../components/CustomerCapsuleFilter/index";
import PrescriptiveSales from "./PrescriptiveSales";
import TrackingService from "./TrackingService";
import logo from "../img/subheader/customer-cap-icon.png";
import tcvcusticon from "../img/projectdetails/tcv-cust-icon.png";
import egmcusticon from "../img/projectdetails/egm-cust-icon.png";
import eacegmcusticon from "../img/projectdetails/eac-egm-cust-icon.png";
import compassprojstatuscusticon from "../img/projectdetails/compass-proj-status-cust-icon.png";
import compassprojstatuscusticonopen from "../img/projectdetails/compass-proj-status-cust-open-icon.png";
import overallprojecthealthicongreen from "../img/projectdetails/overall-project-health-icon-green.png";
import overallprojecthealthiconyellow from "../img/projectdetails/overall-project-health-icon-amber.png";
import overallprojecthealthiconothers from "../img/projectdetails/overall-project-health-icon-others.png";
import overallprojecthealthiconred from "../img/projectdetails/overall-project-health-icon-red.png";
import plcusticon from "../img/projectdetails/pl-cust-icon.png";
import geocusticon from "../img/projectdetails/geo-cust-icon.png";
import countrycusticon from "../img/projectdetails/country-cust-icon.png";
import hanger from "../img/hanger.png";
import ServiceCredits from "./ServiceCredits/ServiceCredits";
import { map, each, find, sumBy } from "lodash";
const OpportunityRawData = lazy(() => import("./OpportunityRawData"));
const DeploymentsRawData = lazy(() => import("./DeploymentsRawData"));
const CasesRawData = lazy(() => import("./CasesRawData"));
const capsuleoneleadurl =
  "https://eronline.das1.global.tslabs.hpecorp.net/ClientExperience/cedashboard.aspx";
const SubmitOneLead =
  "https://hp.lightning.force.com/lightning/o/Lead/new?originalUrl=https%3A%2F%2Fhp--c.visualforce.com%2Fapex%2Fs1_GSDLead_Redirect%3FnavigationLocation%3DLIST_VIEW%26lexiSObjectName%3DLead%26lexiActionName%3Dnew%26sfdc.override%3D1%26vfRetURLInSFX%3D%252F00Q%252Fo&inContextOfRef=1.eyJ0eXBlIjoic3RhbmRhcmRfX29iamVjdFBhZ2UiLCJhdHRyaWJ1dGVzIjp7Im9iamVjdEFwaU5hbWUiOiJMZWFkIiwiYWN0aW9uTmFtZSI6Imxpc3QifSwic3RhdGUiOnsiZmlsdGVyTmFtZSI6IjAwQjFWMDAwMDA5NWhhWFVBUSJ9fQ%3D%3D&count=1";
class CustomerCapsule extends React.Component {
  constructor(props) {
    super(props);
    this.TrackingService = new TrackingService();
    this.state = {
      showClosedCount: false,
      dataPoints: [],
      opened_cases: 0,
      closed_cases: 0,
      elevated_cases: 0,
      escalated_cases: 0,
      severity_cases: 0,
      psa_closed: 0,
      psa_open: 0,
      psa_red: 0,
      psa_green: 0,
      psa_yellow: 0,
      psa_grey: 0,
      revenueData: null,
      detailresultData: null,
      isLoadOppRawData: false,
      isLoadCasesRawData: false,
      isLoadDeploymentsRawData: false,
      OverAllDeliveryMetric: 0,
      OverAllDeliveryCount: 0,
      AccountName: "",
      filters: "",
      countrylist: "",
      CSfilterString: "",
      psadata: "",
      activecredits: 0,
      DeliveredCredits: 0,
      ConvertedNotDeliveredCredits: 0,
    };
  }

  componentDidMount = () => {
    const AccountId = this.props.AccountId;

    this.setState({ AccountId: AccountId });
    const AccountName = this.props.account_name;
    const parentAccountStID = this.props.parentAccountStID;

    this.setState({
      AccountName: AccountName,
      parentAccountStID: parentAccountStID,
    });
    this.getAllData(AccountId);
    if (this.props.parentAccountStID) {
      this.getInstallBase(this.props.parentAccountStID);
    }
    this.resizeAllCapsules();
    setTimeout(() => {
      this.resizeAllCapsules();
    }, 3000);
  };
  surveyClose = () => {
    const { isClose } = this.props;
    isClose(false);
  };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.AccountId !== prevProps.AccountId ||
      this.props.fineSearchValue !== prevProps.fineSearchValue
    ) {
      this.setState({ AllChannelData: null }, () =>
        this.getAllData(this.props.AccountId)
      );
    }
    if (this.props.parentAccountStID !== prevProps.parentAccountStID) {
      this.getInstallBase(this.props.parentAccountStID);
    }

    this.resizeAllCapsules();
    setTimeout(() => {
      this.resizeAllCapsules();
    }, 3000);
  };

  resizeAllCapsules() {
    const ele = document.getElementsByClassName("capsule-container");
    if (ele.length > 2) {
      for (var i = 0; i < ele.length; i++) {
        ele[i].classList.remove("col-6");
        ele[i].classList.add("col-4");
      }
    } else if (ele.length == 1) {
      ele[0].classList.remove("col-6");
      ele[0].classList.remove("col-4");
      ele[0].classList.add("col-12");
    }
    if (ele.length == 2) {
      for (var i = 0; i < ele.length; i++) {
        ele[i].classList.remove("col-4");
        ele[i].classList.remove("col-12");
        ele[i].classList.add("col-6");
      }
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.accID !== state.AccountId) {
  //     //Update all data
  //     state.getAllData(props.accID);
  //     return {
  //       AccountId: props.accID,
  //       AllChannelData: null,
  //       revenueData: null,
  //     };
  //   }
  //   return null;
  // }

  loadOppRawData = (e) => {
    this.setState({ isLoadOppRawData: true, selectedItemForRawData: e });
  };

  closeOppRawData = () => {
    this.setState({ isLoadOppRawData: false });
  };

  loadCasesRawData = (e) => {
    this.setState({ isLoadCasesRawData: true, selectedItemForRawData: e });
  };

  closeCasesRawData = () => {
    this.setState({ isLoadCasesRawData: false });
  };

  loadDeploymentsRawData = (e) => {
    this.setState({
      isLoadDeploymentsRawData: true,
      selectedItemForRawData: e,
    });
  };

  closeDeploymentRawData = () => {
    this.setState({
      isLoadDeploymentsRawData: false,
    });
  };

  toggleView = (e) => {
    const state = !this.state.showClosedCount;
    this.setState({ showClosedCount: state });
  };

  getAllData = (AccountId) => {
    this.getCases(AccountId);
    this.getElevated(AccountId);
    this.getEscalated(AccountId);
    this.getSeverity(AccountId);
    this.getPSA(AccountId);
    this.getPSAOverAllStatus(AccountId);
    this.getPSAOverAllStatusNotAvailable(AccountId);
    this.getCustDetails();
    //this.getDelieveryMetrics();
    this.getCustomerSurveyData(AccountId);
    // this.getInstallBase(this.props.parentAccountStID);
    this.getServiceCreditData(AccountId);
  };
  getServiceCreditData = async (AccountID) => {
    let AccountSTID = AccountID.replace(
      "Account.Account_ST_ID__c%20=%20%27",
      ""
    );
    let securl =
      "https://delta.app.hpecorp.net:8983/solr/service_credit/select?facet.pivot=ProjectId,ActiveCredits&facet.mincount=1&facet=on&fl=ActiveCredits&indent=on&json.facet=%7Bcategories:%7Btype%20:%20terms,limit:1000,field%20:%20Status,facet:%7BSUM%20:%20%22sum(CreditValue)%22%7D%7D%7D&q=Account_ST_ID:%22" +
      AccountSTID +
      "%22&rows=10000&wt=json&fq=-ActiveCredits:0";
    try {
      const res = await axios.get(securl);
      if (res.data) {
        const credits = [
          ...res?.data?.facet_counts?.facet_pivot["ProjectId,ActiveCredits"],
        ];

        let sum = 0;
        const lv1 = credits.map((item1, index) => {
          sum = sum + item1.pivot[0].value;
        });
        this.setState({ activecredits: sum });

        if (res.data.facets.count > 0) {
          if (res.data.facets.categories.buckets.length > 1) {
            if (
              res.data.facets.categories.buckets[0].val ===
              "Converted Not Delivered"
            ) {
              this.setState({
                DeliveredCredits: res.data.facets.categories.buckets[1].SUM,
                ConvertedNotDeliveredCredits:
                  res.data.facets.categories.buckets[0].SUM,
              });
            } else {
              this.setState({
                DeliveredCredits: res.data.facets.categories.buckets[0].SUM,
                ConvertedNotDeliveredCredits:
                  res.data.facets.categories.buckets[1].SUM,
              });
            }
          } else {
            if (
              res.data.facets.categories.buckets[0].val ===
              "Converted Not Delivered"
            ) {
              this.setState({
                DeliveredCredits: 0,
                ConvertedNotDeliveredCredits: 0,
              });
            } else {
              this.setState({
                DeliveredCredits: res.data.facets.categories.buckets[0].SUM,
                ConvertedNotDeliveredCredits: 0,
              });
            }
          }
        } else {
          this.setState({
            DeliveredCredits: 0,
            ConvertedNotDeliveredCredits: 0,
          });
        }
      } else {
        this.setState({
          activecredits: 0,
          DeliveredCredits: 0,
          ConvertedNotDeliveredCredits: 0,
          showServiceCredits: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getInstallBase = (AccountId) => {
    // const AccountId = this.props.parentAccountStID;
    setTimeout(this.GetAllChannelData(AccountId), 500);
  };

  GetAllChannelData(AccountId) {
    this.GetChannelData(AccountId);
    this.GetSalesDirect(AccountId);
    this.GetSalesInDirect(AccountId);
  }

  GetSalesDirect = (AccountId) => {
    axios
      .get(URLConfig.getURLInstallBaseAPI(AccountId) + "/Direct")
      .then((res) => {
        if (res.data.length) {
          this.setState({ SalesDirect: res.data });
        } else {
          console.log("Error while getting Direct Sales Data");
        }
      });
  };

  GetSalesInDirect = (AccountId) => {
    axios
      .get(URLConfig.getURLInstallBaseAPI(AccountId) + "/InDirect")
      .then((res) => {
        if (res.data.length) {
          this.setState({ SalesInDirect: res.data });
        } else {
          console.log("Error while getting Direct Sales Data");
        }
      });
  };

  GetChannelData = (AccountId) => {
    axios.get(URLConfig.getURLInstallBaseAPI(AccountId)).then((res) => {
      if (res.data.length) {
        const data = res.data;
        this.setState({ AllChannelData: data, displayChannelSales: true });
      } else {
        console.log("No Opportunity Raw data found!!");
      }
    });
  };

  getCustDetails = () => {
    if (
      this.props.activeFilter === "OPP ID" ||
      this.props.activeFilter === "WBS ID"
    ) {
      const AccountID = this.props.fineSearchValue;

      const URL =
        "https://hpedelta.com:8983/solr/ppmc/select?fl=*&indent=on&q=%22" +
        AccountID +
        "%22&rows=1&wt=json";
      axios.get(URL).then((res) => {
        if (res.data.response.docs.length) {
          const revenueData = res.data.response.docs[0];
          this.setState({ revenueData, ProjectDetails: "" });
        } else {
          console.log("No Customer Account Data Found!!");
          this.setState({ revenueData: null, ProjectDetails: "" });
        }
      });
    } else if (this.props.activeFilter === "PR ID") {
      // Convert the PRID to Account ST ID
      this.getAccountIDFromPRID(this.props.fineSearchValue);
    }
  };
  getAccountIDFromPRID = (prID) => {
    const serviceURL = URLConfig.getUrlOppDataByPRID(prID);
    axios(URLConfig.ApplyAuth(serviceURL)).then((res) => {
      if (res.data.response.length) {
        const accountID = res.data.response[0].pse__Account__r_Account_ST_ID__c;
        if (accountID) {
          const accID = "Account_ST_ID__c%20=%20%27" + accountID;
          //this.getProjectDetailsForPRID(accID);
          // this.getPSAProductsNServices();
        } else {
          this.setState({ ProjectDetails: "" });
        }
      } else {
        this.setState({ ProjectDetails: "" });
      }
    });
  };
  // getProjectDetailsForPRID = (accountID) => {
  //   console.log(
  //     URLConfig.getURL_Deployments_RawData(
  //       accountID,
  //       this.props.fineSearchValue
  //     )
  //   );
  //   var URL = URLConfig.getURL_Deployments_RawData(
  //     accountID,
  //     this.props.fineSearchValue
  //   );
  //   console.log(URL);
  //   const config = URLConfig.ApplyAuth(URL);
  //   axios(config).then((res) => {
  //     if (res.data.response.length) {
  //       const data = res.data.response[0];

  //       this.setState({ ProjectDetails: data, revenueData: "" });
  //     } else {
  //       this.setState({ ProjectDetails: "", revenueData: "" });
  //     }
  //   });
  // };
  // getPSAProductsNServices = () => {
  //   var URL =
  //     "https://localhost:44322/api/PSAProductsNServices/GetPSAProductsNServices/" +
  //     this.props.fineSearchValue;
  //   // const config = URLConfig.ApplyAuth(URL);
  //   axios(URL).then((res) => {
  //     //console.log(res);
  //     if (res.data.length) {
  //       const data = res.data[0];
  //       this.setState({
  //         PSAProduct: data.productsName,
  //         PSAService: data.servicesName,
  //       });
  //     } else {
  //       this.setState({
  //         PSAProduct: "Not Available",
  //         PSAService: "Not Available",
  //       });
  //     }
  //   });
  // };
  loadUnfilteredData = () => {
    this.getCases(this.props.AccountId);
    this.getElevated(this.props.AccountId);
    this.getEscalated(this.props.AccountId);
    this.getSeverity(this.props.AccountId);
    this.getPSA(this.props.AccountId);
    this.getPSAOverAllStatus(this.props.AccountId);
    this.getPSAOverAllStatusNotAvailable(this.props.AccountId);
    this.getInstallBase(this.props.parentAccountStID);
  };

  getCases(AccountID) {
    axios(URLConfig.getURL_Cases(AccountID)).then((res) => {
      if (res.data.response.length) {
        const CustomerCasesData = res.data.response;
        const closed_cases = CustomerCasesData.filter(
          (O) => O.Status === "Closed"
        )[0].expr0;
        const opened_cases = sum(
          CustomerCasesData.filter((O) => O.Status !== "Closed"),
          "expr0"
        );
        this.setState({ closed_cases });
        this.setState({ opened_cases });
      } else {
        this.setState({ closed_cases: 0 });
        this.setState({ opened_cases: 0 });
      }
    });
  }
  getElevated(AccountID) {
    axios(URLConfig.getURL_Elevated(AccountID)).then((res) => {
      if (res.data.response.length) {
        const elevated_cases = res.data.response[0].expr0;
        this.setState({ elevated_cases });
      } else {
        this.setState({ elevated_cases: 0 });
      }
    });
  }
  getEscalated(AccountID) {
    axios(URLConfig.getURL_Escalated(AccountID)).then((res) => {
      if (res.data.response.length) {
        const escalated_cases = res.data.response[0].expr0;
        this.setState({ escalated_cases });
      } else {
        this.setState({ escalated_cases: 0 });
      }
    });
  }
  getSeverity(AccountID) {
    axios(URLConfig.getURL_Severity(AccountID)).then((res) => {
      if (res.data.response.length) {
        const severity_cases = res.data.response[0].expr0;
        this.setState({ severity_cases });
      } else {
        this.setState({ severity_cases: 0 });
      }
    });
  }

  getPSA(AccountID) {
    axios(URLConfig.getURL_PSA(AccountID.replace("Account.", ""))).then(
      (res) => {
        if (res.data.response.length) {
          const PSAData = res.data.response;
          const psa_closed = sum(
            PSAData.filter((O) => O.pse__Project_Phase__c === "Closed"),
            "expr0"
          );
          const psa_open = sum(
            PSAData.filter((O) => O.pse__Project_Phase__c !== "Closed"),
            "expr0"
          );
          this.setState({ psa_closed });
          this.setState({ psa_open });
        } else {
          this.setState({ psa_closed: 0 });
          this.setState({ psa_open: 0 });
        }
      }
    );
  }
  getPSAOverAllStatus(AccountID) {
    const URL = URLConfig.getURL_PSAOverAllStatus(
      AccountID.replace("Account.", "")
    );
    axios(URL).then((res) => {
      if (res.data.response.length) {
        const PSAData = res.data.response;
        const psa_red = sum(
          PSAData.filter((O) => O.PSA_Overall_Status__c === "Red"),
          "expr0"
        );
        const psa_yellow = sum(
          PSAData.filter((O) => O.PSA_Overall_Status__c === "Yellow"),
          "expr0"
        );
        const psa_green = sum(
          PSAData.filter((O) => O.PSA_Overall_Status__c === "Green"),
          "expr0"
        );
        this.setState({ psa_red });
        this.setState({ psa_yellow });
        this.setState({ psa_green });
      } else {
        this.setState({ psa_red: 0 });
        this.setState({ psa_yellow: 0 });
        this.setState({ psa_green: 0 });
      }
    });
  }
  getPSAOverAllStatusNotAvailable = (AccountID) => {
    const URL = URLConfig.getURL_PSAOverAllStatusNotAvailable(
      AccountID.replace("Account.", "")
    );

    axios(URL).then((res) => {
      if (res.data.response.length) {
        const PSAData = res.data.response;
        const psa_grey = sum(
          PSAData.filter((O) => O.PSA_Overall_Status__c === null),
          "expr0"
        );
        this.setState({ psa_grey });
      } else {
        this.setState({ psa_grey: 0 });
      }
    });
  };
  getDelieveryMetrics() {
    const AccountID = document.getElementById("OppID").value;
    axios
      .get(
        "https://delta.app.hpecorp.net:8983/solr/anps/select?indent=on&q=%22" +
          AccountID +
          "%22&wt=json"
      )
      .then((res) => {
        if (res.data.response.docs.length) {
          this.setState({
            OverAllDeliveryMetric:
              res.data.response.docs[0].q1_overall_satisfaction,
            OverAllDeliveryCount: res.data.response.numFound,
          });
        } else {
          console.log("No cases data found!!");
        }
      });
  }

  renderSwitch(param) {
    switch (param) {
      case "GREEN":
        return overallprojecthealthicongreen;
      case "YELLOW":
        return overallprojecthealthiconyellow;
      case "RED":
        return overallprojecthealthiconred;
      case "undefined":
        return overallprojecthealthiconothers;
      case "Closed":
        return compassprojstatuscusticon;
      case "Active":
        return compassprojstatuscusticonopen;
    }
  }
  showHideDiv = (ele) => {
    // console.log(Cookies.get("empnumber"), "filter");
    // this.TrackingService.LogcustomerCapsulefilterClick(
    //   Cookies.get("empnumber"),
    //   "LogcustomerCapsulefilterClick",
    // );
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
  ResetCCFilters = (props) => {
    const filterApplied = props == false ? false : true;
    this.setState(
      { ForCCFilterRefresh: Date.now(), filters: "", SelectedFilters: null },
      () => {
        if (filterApplied) {
          this.loadUnfilteredData();
          this.getFilteredOpportunityData();
        }
      }
    );
  };
  getCustomerSurveyData = (AccountID) => {
    var AccountID = AccountID.replace("Account.Account_ST_ID__c%20=%20%27", "");
    var URLSurvey =
      URLConfig.getURLDeltaAPI() + "CustomerServey/GetCustomerSurverResults/";
    if (this.state.CSfilterString == "") {
      URLSurvey = URLSurvey + AccountID;
    }
    if (this.state.CSfilterString != "") {
      URLSurvey = URLSurvey + AccountID + this.state.CSfilterString;
    }
    axios.get(URLSurvey).then((res) => {
      if (res.data.length > 0) {
        this.setState({ customerSurveyData: res.data });
      } else {
        this.setState({ customerSurveyData: "" });
      }
    });
  };
  ApplyCCFilter = (filters, countrylist, CSfilterString, SelectedFilters) => {
    if (SelectedFilters.SelectedCountries == "") {
      filters = filters.replace(" AND CreatedDate >=", " CreatedDate >=");
    }

    if (filters == "") {
      this.setState(
        { filters, SelectedFilters, countrylist, CSfilterString },
        () => {
          this.loadUnfilteredData();
          this.getFilteredOpportunityData();
          this.getCustomerSurveyData(this.props.AccountId);
        }
      );
    } else {
      this.setState(
        { filters, SelectedFilters, countrylist, CSfilterString },
        () => {
          this.getFilteredOpportunityData();
          this.getFilteredIncidents(this.state.filters);
          this.getFilteredPSA(this.state.filters);
          this.getFilteredPSAOverallstatus(this.state.filters);
          this.getFilteredInstallBase(
            this.props.parentAccountStID,
            countrylist
          );
          this.getCustomerSurveyData(this.props.AccountId);
        }
      );
    }
  };
  getFilteredInstallBase = (AccountId, countrylist) => {
    this.GetFilteredChannelData(AccountId, countrylist);
    this.GetFilteredSalesDirect(AccountId, countrylist);
    this.GetFilteredSalesInDirect(AccountId, countrylist);
  };

  GetFilteredSalesDirect(AccountId, countrylist) {
    axios
      .get(
        URLConfig.getURLInstallBaseAPI(AccountId) + "/Direct?c=" + countrylist
      )
      .then((res) => {
        if (res.data.length) {
          this.setState({ SalesDirect: res.data });
        } else {
          console.log("Error while getting Direct Sales Data");
        }
      });
  }
  GetFilteredSalesInDirect(AccountId, countrylist) {
    axios
      .get(
        URLConfig.getURLInstallBaseAPI(AccountId) + "/InDirect?c=" + countrylist
      )
      .then((res) => {
        if (res.data.length) {
          this.setState({ SalesInDirect: res.data });
        } else {
          console.log("Error while getting Direct Sales Data");
        }
      });
  }
  GetFilteredChannelData(AccountId, countrylist) {
    axios
      .get(URLConfig.getURLInstallBaseAPI(AccountId) + "?c=" + countrylist)
      .then((res) => {
        if (res.data.length) {
          const data = res.data;
          this.setState({ AllChannelData: data, displayChannelSales: true });
        } else {
          console.log("No Opportunity Raw data found!!");
        }
      });
  }

  getFilteredOpportunityData = () => {
    const { getOpportunityData } = this.props;
    getOpportunityData(this.state.filters);
  };
  getFilteredIncidents = (filterstring) => {
    this.getFilteredcases(filterstring);
    this.getFilteredElevated(filterstring);
    this.getFilteredEscalated(filterstring);
    this.getFilteredseverity(filterstring);
  };
  getFilteredcases = (filterstring) => {
    const casesurl =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20Status,%20Count(Id)%20from%20Case%20WHERE%20" +
      this.props.AccountId +
      "%27%20AND%20" +
      filterstring +
      "%20group%20by%20Status";
    const config = URLConfig.ApplyAuth(casesurl);
    axios(config).then((res) => {
      if (res.data.response.length) {
        const CustomerCasesData = res.data.response;
        const closed_cases = CustomerCasesData.filter(
          (O) => O.Status === "Closed"
        )[0].expr0;
        const opened_cases = sum(
          CustomerCasesData.filter((O) => O.Status !== "Closed"),
          "expr0"
        );
        this.setState({ closed_cases: closed_cases });
        this.setState({ opened_cases: opened_cases });
      } else {
        this.setState({ closed_cases: 0 });
        this.setState({ opened_cases: 0 });
      }
    });
  };

  getFilteredElevated = (filterstring) => {
    const elevurl =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20Count(Id)%20from%20Case%20WHERE%20" +
      this.props.AccountId +
      "%27%20AND%20" +
      filterstring +
      "AND%20Elevated__c=true";
    const config = URLConfig.ApplyAuth(elevurl);

    axios(config).then((res) => {
      if (res.data.response.length > 0) {
        const elevated_cases = res.data.response[0].expr0;
        this.setState({ elevated_cases });
      } else {
        this.setState({ elevated_cases: 0 });
      }
    });
  };

  getFilteredEscalated = (filterstring) => {
    const escURL =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20Count(Id)%20from%20Case%20WHERE%20" +
      this.props.AccountId +
      "%27%20AND" +
      filterstring +
      "AND%20IsEscalated=true";
    const config = URLConfig.ApplyAuth(escURL);
    axios(config).then((res) => {
      if (res.data.response.length > 0) {
        const escalated_cases = res.data.response[0].expr0;
        this.setState({ escalated_cases });
      } else {
        this.setState({ escalated_cases: 0 });
      }
    });
  };

  getFilteredseverity = (filterstring) => {
    const severirtURL =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20Count(Id)%20from%20Case%20WHERE%20" +
      this.props.AccountId +
      "%27%20AND" +
      filterstring +
      "AND%20Severity__c%20=%20%271-CRITICAL-DOWN%27";
    const config = URLConfig.ApplyAuth(severirtURL);

    axios(config).then((res) => {
      if (res.data.response.length > 0) {
        const severity_cases = res.data.response[0].expr0;
        if (severity_cases == "" || severity_cases == "undefined") {
          this.setState({ severity_cases: 0 });
        }
        this.setState({ severity_cases });
      } else {
        this.setState({ severity_cases: 0 });
      }
    });
  };

  getFilteredPSA = (filterstring) => {
    filterstring = filterstring.replace(/Account./g, "pse__Account__r.");
    var psaURL =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20pse__Project_Phase__c,%20Count(Id)%20from%20pse__Proj__c%20WHERE%20pse__Account__r." +
      this.props.AccountId +
      "%27%20AND" +
      filterstring +
      "%20GROUP%20BY%20pse__Project_Phase__c";
    psaURL = psaURL.replace("Account.", "");
    const config = URLConfig.ApplyAuth(psaURL);

    axios(config).then((res) => {
      if (res.data.response.length > 0) {
        const PSAData = res.data.response;
        this.setState({ psadata: PSAData });
        const psa_closed = sum(
          PSAData.filter((O) => O.pse__Project_Phase__c === "Closed"),
          "expr0"
        );
        const psa_open = sum(
          PSAData.filter((O) => O.pse__Project_Phase__c !== "Closed"),
          "expr0"
        );
        this.setState({ psa_closed });
        this.setState({ psa_open });
      } else {
        this.setState({ psa_closed: 0 });
        this.setState({ psa_open: 0 });
      }
    });
  };
  getFilteredPSAOverallstatus = (filterstring) => {
    filterstring = filterstring.replace(/Account./g, "pse__Account__r.");
    var psaOvURL =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20PSA_Overall_Status__c,%20Count(Id)%20from%20pse__Proj__c%20WHERE%20pse__Project_Phase__c%20!=%20%27Closed%27%20AND%20pse__Account__r." +
      this.props.AccountId +
      "%27%20AND" +
      filterstring +
      "%20GROUP%20BY%20PSA_Overall_Status__c";
    psaOvURL = psaOvURL.replace("Account.", "");
    const config = URLConfig.ApplyAuth(psaOvURL);

    axios(config).then((res) => {
      if (res.data.response.length > 0) {
        const PSAData = res.data.response;
        this.setState({ psadata: PSAData });
        const psa_red = sum(
          PSAData.filter((O) => O.PSA_Overall_Status__c === "Red"),
          "expr0"
        );
        const psa_yellow = sum(
          PSAData.filter((O) => O.PSA_Overall_Status__c === "Yellow"),
          "expr0"
        );
        const psa_green = sum(
          PSAData.filter((O) => O.PSA_Overall_Status__c === "Green"),
          "expr0"
        );
        this.setState({ psa_red });
        this.setState({ psa_yellow });
        this.setState({ psa_green });
      } else {
        this.setState({ psa_red: 0 });
        this.setState({ psa_yellow: 0 });
        this.setState({ psa_green: 0 });
      }
    });
  };
  logCustomerExperienceDashboard = (props) => {
    console.log(Cookies.get("empnumber"), props.target.href, "EMp", "href");
    this.TrackingService.LogCustomerExperienceDashboard(
      Cookies.get("empnumber"),
      props.target.href
    );
  };
  logSubmitOneLead = (props) => {
    console.log(Cookies.get("empnumber"), props.target.href, "EMp", "href");
    this.TrackingService.LogSubmitOneLeadClick(
      Cookies.get("empnumber"),
      props.target.href
    );
  };
  render() {
    var dataPoints = [];
    const OpportunityData = this.props.OpportunityData;
    const customerSurveyData = this.props.customerSurveyData;
    var account_name = this.props.account_name;
    if (OpportunityData != null) {
      var groups = Array.from(
        groupBy(
          OpportunityData.filter((O) => O.IsClosed === false),
          (data) => data.Opportunity_Sales_Stage__c
        )
      );
      for (var i = 0; i < groups.length; i++) {
        dataPoints.push({
          label: groups[i][0],
          y: sum(groups[i][1], "Amount"),
          c: groups[i][1].length,
        });
      }
      dataPoints.sort((a, b) => a.label.localeCompare(b.label));
    }
    return (
      <>
        <div
          className="capsule-container col-4 col-4-no-margins occupy-height"
          onChange={this.surveyClose}
          onClick={this.surveyClose}
        >
          <div className="capsules mr-1">
            <div id="sectionheader" className="col-12" align="center">
              <img className="img-fluid" src={logo} width="35px" />
              <span className="pl-3">CUSTOMER </span>
              <span className="pl-2">
                <a
                  href={capsuleoneleadurl}
                  target="_blank"
                  className="capsuleonelead-head"
                  title="Click to open Customer Experience Dashboard"
                  onClick={this.logCustomerExperienceDashboard}
                >
                  <i class="fas fa-external-link-alt" />
                  Customer Experience Dashboard
                </a>
              </span>
              <span className="float-right">
                <a
                  // href="#"
                  className="auto-cursor"
                  data-toggle="tooltip"
                  title="Results provide Project details of the opportunity searched including the customer Account details for the past 4 years. Relevant for users from Sales, Pursuit and Delivery. Refer to individual section for more help."
                >
                  <i className="far fa-question-circle tootipicon pr-2 pt-1" />
                </a>
              </span>
            </div>
            <div className="col-12">
              <div className="card acc-card-base">
                <div className="col-12 p-2">
                  <div className="pt-2 pb-1 pl-1 acc-name">
                    {/*<strong>Account Name:</strong> <br/> */}
                    <span className="ac-name-green">
                      {this.props.account_name}
                      <PrescriptiveSales AccountId={this.props.AccountId} />
                      <i
                        className="fa fa-filter pr-1 pt-1 pl-1 capsulefiltericon ac-name-green pointer"
                        onClick={() => this.showHideDiv("capsulefilterdiv")}
                      />
                    </span>
                  </div>
                  {/*<div  className="fc-acc-name pt-2 pb-1 pl-1"><strong>Focus Account:</strong> <br/><span className="ac-name-green">{account_focus_acc}</span></div> */}
                </div>
                <div className="col-6 pb-1">
                  <div className="onelead-main">
                    <span>
                      {" "}
                      <i class="fas fa-external-link-alt"></i>
                    </span>
                    <span>
                      {
                        <a
                          href={SubmitOneLead}
                          target="_blank"
                          className="capsuleonelead"
                          onClick={this.logSubmitOneLead}
                        >
                          Submit ONELead
                        </a>
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* { this.state.revenueData &&
                  <div className="col-12">
                    <div className="col-12 p-0">
                        <div className="p-2 row">
                          <div className="col-4" title="Total Contract Value">
                              <div className="pl-1 pr-1 col-12">
                                <div className="row tcv-tile">
                                    <div className="col-3 mt-2 p-0 ml-1 icon-rings"><i className="fas fa-coins mt-2 ml-1 pl-1"></i></div>
                                    <div className="col-8 pl-2 pr-0 mt-1 fin-text">
                                      <div>TCV</div>
                                      <div>$ {ConvertTOMillion(this.state.revenueData.pv0_forecast_revenue)}</div>
                                    </div>
                                </div>
                              </div>
                          </div>
                          <div className="col-4">
                              <div className="pl-1 pr-1 col-12">
                                <div className="row tcv-tile" title="Engagement Gross Margin – ((TCV-cost)/TCV)*100">
                                    <div className="col-3 mt-2 p-0 ml-1 icon-rings"><i className="fas fa-percentage mt-2 ml-1 pl-1"></i></div>
                                    <div className="col-8 pl-2 pr-0 mt-1 fin-text">
                                      <div>EGM</div>
                                      <div>{this.state.revenueData.pv0_forecast_egm_per}%</div>
                                    </div>
                                </div>
                              </div>
                          </div>
                          <div className="col-4">
                              <div className="pl-1 pr-1 col-12">
                                <div className="row tcv-tile" title="Estimated at Completion Revenue %">
                                    <div className="col-3 mt-2 p-0 ml-1 icon-rings"><i className="fas fa-file-invoice-dollar mt-2 ml-1 pl-1"></i></div>
                                    <div className="col-8 pl-2 pr-0 mt-1 fin-text">
                                      <div>EAC EGM</div>
                                      <div>{(this.state.revenueData.eac_egm_per)}%</div>
                                    </div>
                                </div>
                              </div>
                          </div>
                        </div>
                    </div>
                </div>
                } */}
            <div id="searchresults" className="searchresults">
              <div className="accordion" id="accordionCust">
                {this.state.revenueData &&
                  (this.props.activeFilter === "OPP ID" ||
                    this.props.activeFilter === "WBS ID") && (
                    <div className="card">
                      <div className="card-header" id="headingProjDetails">
                        <h5 className="mb-0">
                          <button
                            className="btn btn-link btn-full"
                            type="button"
                            data-toggle="collapse"
                            aria-expanded="false"
                            data-target="#custprojdetails"
                            aria-controls="custthree"
                          >
                            Project Details
                          </button>
                        </h5>
                      </div>
                      <div
                        aria-labelledby="headingProjDetails"
                        data-parent="#accordionCust"
                        aria-expanded="false"
                        id="custprojdetails"
                        className="collapse show"
                      >
                        <div className="card-body m-3">
                          <div className="row col pl-0">
                            <div className="col-6 pb-1">
                              <strong>Project ID</strong>:&nbsp;
                              <a
                                target="_blank"
                                className="prid_text_highlight"
                                href={
                                  "https://ppm-hpts.saas.microfocus.com/itg/web/knta/crt/RequestDetail.jsp?REQUEST_ID=" +
                                  this.state.revenueData.request_id
                                }
                              >
                                {this.state.revenueData.wbs_id}
                              </a>
                            </div>
                            {/* <div className="col-6 breakword"> */}
                            {/* <a target='_blank' className="prid_text_highlight" href={"https://ppm-hpts.saas.microfocus.com/itg/web/knta/crt/RequestDetail.jsp?REQUEST_ID="+ this.state.revenueData.request_id }>{this.state.revenueData.wbs_id}
      </a> */}
                            {/* </div> */}
                          </div>

                          <div className="row col pb-1">
                            <div className="">
                              <strong>Project Name:</strong>&nbsp;
                            </div>
                            <div className="">
                              {this.state.revenueData.project_name}
                            </div>
                          </div>
                          <div className="row col">
                            <div className="">
                              <strong>Compass Project Name:</strong>&nbsp;
                            </div>
                            <div className="">
                              {this.state.revenueData.compass_project_name}
                            </div>
                          </div>

                          <div className="row col mb-2 mt-2">
                            <div className="col-4 project_detailstxt_hgl1">
                              <div
                                className="col pl-0"
                                title="Total Contract Value"
                              >
                                <img
                                  className="pr-2"
                                  src={tcvcusticon}
                                  width="25"
                                  height="18"
                                />
                                TCV:
                              </div>
                              <div className="col pl-4">
                                $
                                {ConvertTOMillion(
                                  this.state.revenueData.pv0_forecast_revenue
                                )}
                              </div>
                            </div>
                            <div
                              className="col-4 project_detailstxt_hgl1"
                              title="EGM% = (TCV – Cost)/TCV"
                            >
                              <div className="col pl-0">
                                <img
                                  className="pr-2"
                                  src={egmcusticon}
                                  width="25"
                                  height="18"
                                />
                                EGM:
                              </div>
                              <div className="col pl-4">
                                {this.state.revenueData.pv0_forecast_egm_per}%
                              </div>
                            </div>

                            <div
                              className="col-4 project_detailstxt_hgl1"
                              title="Estimated at Completion Revenue %"
                            >
                              <div className="col pl-0">
                                <img
                                  className="pr-2 pl-0"
                                  src={eacegmcusticon}
                                  width="30"
                                  height="15"
                                />
                                EAC EGM:
                              </div>
                              <div className="col pl-3 ml-3">
                                {this.state.revenueData.eac_egm_per}%
                              </div>
                            </div>
                          </div>

                          <div className="row col mb-3">
                            <div className="row col" align="center">
                              <div className="col-12">
                                <strong>Compass Project Status</strong>
                              </div>
                              <div className="col-12">
                                <img
                                  src={this.renderSwitch(
                                    this.state.revenueData.compass_system_status
                                  )}
                                  width="60"
                                  height="45"
                                />
                              </div>
                            </div>
                            <div className="row col" align="center">
                              <div className="col-12">
                                <strong>Overall Project Health</strong>
                              </div>
                              <div className="col-12">
                                <img
                                  src={this.renderSwitch(
                                    this.state.revenueData
                                      .overall_project_health
                                  )}
                                  width="60"
                                  height="45"
                                />
                              </div>
                            </div>
                          </div>

                          {/* <div className="row col mb-3">
    <div className="col-4 project_detailstxt_hgl1">
    <div className="col pl-0"><img className="pr-2" src={plcusticon} width="25" height="18"/>PL: </div>
    <div className="col pl-4" style={{fontSize:'9px'}}>{this.state.revenueData.product_line}</div></div>
    <div className="col-4 project_detailstxt_hgl1">
    <div className="col pl-0"><img className="pr-2" src={geocusticon} width="25" height="18"/>Geo: </div>
    <div className="col pl-4" style={{fontSize:'9px'}}>{this.state.revenueData.geography}</div></div>
    <div className="col-4 project_detailstxt_hgl1">
    <div className="col pl-0"><img className="pr-2" src={countrycusticon} width="23" height="16"/>Country: </div>
    <div className="col pl-4" style={{fontSize:'9px'}}>{this.state.revenueData.country}</div></div>
  </div> */}

                          <div className="row col mb-3">
                            <div className="col-4 project_detailstxt_hgl1">
                              <div className="col-12 row">
                                <div className="col-1 pl-0">
                                  <img
                                    className="pr-2"
                                    src={plcusticon}
                                    width="25"
                                    height="18"
                                  />
                                </div>
                                <div
                                  className="col-9 pl-2"
                                  style={{ fontSize: "9px" }}
                                >
                                  PL:
                                </div>
                              </div>
                              <div
                                className="col-12 row ml-2"
                                style={{ fontSize: "9px" }}
                                align="center"
                              >
                                {this.state.revenueData.product_line}
                              </div>
                            </div>

                            <div className="col-4 project_detailstxt_hgl1">
                              <div className="col-12 row">
                                <div className="col-1 pl-0">
                                  <img
                                    className="pr-2"
                                    src={geocusticon}
                                    width="25"
                                    height="18"
                                  />
                                </div>
                                <div
                                  className="col-9 pl-2"
                                  style={{ fontSize: "9px" }}
                                >
                                  Geo:
                                </div>
                              </div>
                              <div
                                className="col-12 row ml-2"
                                style={{ fontSize: "9px" }}
                                align="center"
                              >
                                {this.state.revenueData.geography}
                              </div>
                            </div>

                            <div className="col-4 project_detailstxt_hgl1">
                              <div className="col-12 row">
                                <div className="col-1 pl-0">
                                  <img
                                    className="pr-2"
                                    src={countrycusticon}
                                    width="23"
                                    height="16"
                                  />
                                </div>
                                <div
                                  className="col-12 row pl-4"
                                  style={{ fontSize: "9px" }}
                                >
                                  Country:
                                </div>
                              </div>
                              <div
                                className="col-12 row ml-2"
                                style={{ fontSize: "9px" }}
                              >
                                {this.state.revenueData.country}
                              </div>
                            </div>
                          </div>

                          {/* till here */}
                        </div>
                      </div>
                    </div>
                  )}
                {/* project details when the fine search value is a PR ID */}

                {/* {this.state.ProjectDetails && (                 
                  <div className="card">
                    <div className="card-header" id="headingProjDetails">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link btn-full"
                          type="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          data-target="#custprojdetails"
                          aria-controls="custthree"
                        >
                          Project Details
                        </button>
                      </h5>
                    </div>
                    <div
                      aria-labelledby="headingProjDetails"
                      data-parent="#accordionCust"
                      aria-expanded="false"
                      id="custprojdetails"
                      className="collapse show"
                    >
                      <div className="card-body m-3">
                        <div className="row col pl-0">
                          <div className="col-6 pb-1">
                            <strong>Project ID</strong>:&nbsp;
                            <a
                              target="_blank"
                              className="prid_text_highlight"
                              href={
                                "https://ppm-hpts.saas.microfocus.com/itg/web/knta/crt/RequestDetail.jsp?REQUEST_ID=" +
                                this.state.ProjectDetails.pse__Project_ID__c
                              }
                            >
                              {this.state.ProjectDetails.pse__Project_ID__c}
                            </a>
                          </div>
                        
                        </div>

                        <div className="row col pb-1">
                          <div className="">
                            <strong>Project Name:</strong>&nbsp;
                            {this.state.ProjectDetails.Name}
                          </div>
                        </div>
                        <div className="row col mb-2 mt-2">
                          <div
                            className="col-4 project_detailstxt_hgl1"
                            title="Account Name"
                            align="center"
                          >
                            <div className="pralign">Account Name:</div>
                            <div className="prpdalign">
                              {this.state.ProjectDetails.pse__Account__r_Name}
                            </div>
                          </div>
                          <div
                            className="col-4 project_detailstxt_hgl1"
                            title=" Project Creation"
                            align="center"
                          >
                            <div className="pralign pr">Project Creation:</div>
                            <div className="prpdalign">
                              {
                                this.state.ProjectDetails
                                  .PSA_Project_Creation__c
                              }
                            </div>
                          </div>

                          <div
                            className="col-4 project_detailstxt_hgl1"
                            title="PSA Funded"
                            align="center"
                          >
                            <div className="pralign pr">PSA Funded:</div>
                            <div className="prpdalign">
                              {this.state.ProjectDetails.PSA_Funded__c}
                            </div>
                          </div>
                        </div>

                        <div className="row col mb-3">
                          <div className="row col" align="center">
                            <div className="col-12">
                              <strong> Project Status</strong>
                            </div>
                            <div className="col-12">
                              <div className="col-12">
                                <img
                                  src={hanger}
                                  alt=""
                                  width="40"
                                  height="25"
                                />
                              </div>
                              <div className="col-12 pt-3 bgProgress">
                                {
                                  this.state.ProjectDetails
                                    .pse__Project_Status__c
                                }
                              </div>
                            </div>
                          </div>
                          <div className="row col" align="center">
                            <div className="col-12">
                              <strong>Product</strong>
                            </div>
                            <div className="col-12">
                              <div className="col-12">
                                <img
                                  src={hanger}
                                  alt=""
                                  width="40"
                                  height="25"
                                />
                              </div>
                              <div className="col-12 pt-3 bgProgress">
                                {this.state.PSAProduct}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row col mb-3">
                          <div className="col-4 project_detailstxt_hgl1">
                            <div className="pralign">Service:</div>
                            <div className="prpdalign">
                              {this.state.PSAService}
                            </div>
                          </div>

                          <div className="col-4 project_detailstxt_hgl1">
                            <div className="pralign prpd">Geo:</div>
                            <div className="prpdalign">
                              {
                                this.state.ProjectDetails
                                  .pse__Account__r_WorldRegion_Region__c
                              }
                            </div>
                          </div>

                          <div className="col-4 project_detailstxt_hgl1">
                            <div className="pralign prpd">
                              Delivery Country:
                            </div>
                            <div className="prpdalign">
                              {
                                this.state.ProjectDetails
                                  .PSA_Location_Country__c
                              }
                            </div>
                          </div>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                )} */}
                {OpportunityData !== null && (
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <button
                          title="Displays consolidated number of opportunities associated with the customer account by status. Click on pop up icon for more details."
                          className="btn btn-link btn-full collapsed"
                          type="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          data-target="#custone"
                          aria-controls="custone"
                        >
                          Opportunities
                        </button>
                      </h5>
                    </div>

                    <div
                      aria-labelledby="headingOne"
                      data-parent="#accordionCust"
                      aria-expanded="false"
                      id="custone"
                      className="collapse"
                    >
                      <div className="card-body ml-3">
                        <div className="col-12" align="right">
                          <i
                            className="fas fa-external-link-alt"
                            // data-toggle="modal"
                            // data-target="#rawDataModal"
                            onClick={() => {
                              this.loadOppRawData("All");
                            }}
                          />
                        </div>

                        <div className="col-12 row p-1">
                          <div
                            className="col-5 cust-case-open mr-2 ml-4 card"
                            data-toggle="modal"
                            data-target="#revenueGraphModal"
                            // data-target="#BUbifurcationModal"
                          >
                            <div>
                              <i className="fas fa-box-open pr-1" />
                              IN PURSUIT
                            </div>
                            <div>
                              <h4
                                onClick={() => {
                                  this.TrackingService.LogOppurtunitiesClick(
                                    Cookies.get("empnumber"),
                                    "LogOppurtunitiesClick",
                                    "IN PURSUIT"
                                  );
                                }}
                              >
                                {
                                  OpportunityData.filter(
                                    (O) => O.IsClosed === false
                                  ).length
                                }
                              </h4>
                            </div>
                            <div className="revenue-text">
                              Revenue In Pursuit $
                              {ConvertTOMillion(
                                sum(
                                  OpportunityData.filter(
                                    (O) => O.IsClosed === false
                                  ),
                                  "Amount"
                                )
                              )}
                            </div>
                          </div>
                          <div
                            className="col-5 cust-case-closed card"
                            // data-toggle="modal"
                            // data-target="#rawDataModal"
                            onClick={() => {
                              if (
                                OpportunityData.filter(
                                  (O) => O.IsClosed === true
                                ).length > 0
                              )
                                this.loadOppRawData("Closed");
                            }}
                          >
                            <div
                              onClick={() => {
                                this.TrackingService.LogOppurtunitiesClick(
                                  Cookies.get("empnumber"),
                                  "LogOppurtunitiesClick",
                                  "CLOSED"
                                );
                              }}
                            >
                              <i className="fas fa-box pr-1" />
                              CLOSED
                            </div>
                            <div>
                              <h4>
                                {
                                  OpportunityData.filter(
                                    (O) => O.IsClosed === true
                                  ).length
                                }
                              </h4>
                            </div>
                            <div className="revenue-text">
                              Revenue Impact $
                              {ConvertTOMillion(
                                sum(
                                  OpportunityData.filter(
                                    (O) => O.IsClosed === true
                                  ),
                                  "Amount"
                                )
                              )}
                            </div>
                          </div>
                        </div>
                        {/* <div className ={this.state.showClosedCount ? "col-12 row p-1" : "col-12 row p-1 hidden"} >
            <div className="col-5 opp-rev-won mr-2 ml-4 card">
              <div>Won</div>
              <div><h5>{OpportunityData.filter((O) => O.IsClosed === true && O.IsWon === true).length}</h5></div>
              <div className="revenue-text">Revenue ${ConvertTOMillion(sum(OpportunityData.filter((O) => O.IsClosed === true && O.IsWon === true),"Amount"))}</div>
             </div>
              <div className="col-5 opp-rev-lost card">
              <div>Lost</div>
              <div><h5>{OpportunityData.filter((O) => O.IsClosed === true && O.IsWon === false).length}</h5></div>
              <div className="revenue-text">Revenue ${ConvertTOMillion(sum(OpportunityData.filter((O) => O.IsClosed === true && O.IsWon === false),"Amount"))}</div>
              </div>
          </div> */}
                        <div>&nbsp;</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card">
                  <div className="card-header" id="headingTwo">
                    <h5 className="mb-0">
                      <button
                        title="Displays consolidated number of incidents handled for the customer account with the status. Click on pop up icon for more details."
                        className="btn btn-link btn-full collapsed"
                        type="button"
                        data-toggle="collapse"
                        aria-expanded="false"
                        data-target="#custtwo"
                        aria-controls="custtwo"
                      >
                        Incidents
                      </button>
                    </h5>
                  </div>
                  <div
                    aria-labelledby="headingTwo"
                    data-parent="#accordionCust"
                    aria-expanded="false"
                    id="custtwo"
                    className="collapse"
                  >
                    <div className="card-body ml-3 mb-4">
                      <div className="col-12" align="right">
                        <i
                          className="fas fa-external-link-alt"
                          // data-toggle="modal"
                          // data-target="#caseDataModal"
                          onClick={() => {
                            this.loadCasesRawData("ALL");
                          }}
                        />
                      </div>
                      <div className="col-12 row p-1">
                        <div
                          className="col-5 cust-case-open mr-2 ml-4 card"
                          // data-toggle={
                          //   this.state.opened_cases === 0 ? "" : "modal"
                          // }
                          // data-target={
                          //   this.state.opened_cases === 0
                          //     ? ""
                          //     : "#caseDataModal"
                          // }
                          onClick={() => {
                            if (this.state.opened_cases !== 0)
                              this.loadCasesRawData("OPEN");
                            console.log(
                              this.state.opened_cases,
                              "this.state.opened_cases"
                            );
                            this.TrackingService.LogIncidentsClick(
                              Cookies.get("empnumber"),
                              "LogIncidentsClick",
                              "OPEN"
                            );
                          }}
                          style={
                            this.state.opened_cases !== 0
                              ? { cursor: "pointer" }
                              : { cursor: "default" }
                          }
                        >
                          <div>
                            <i className="fas fa-box-open pr-1" />
                            OPEN
                          </div>
                          <div>
                            <h4>{this.state.opened_cases}</h4>
                          </div>
                        </div>
                        <div
                          className="col-5 cust-case-closed card"
                          // data-toggle={
                          //   this.state.closed_cases === 0 ? "" : "modal"
                          // }
                          // data-target={
                          //   this.state.closed_cases === 0
                          //     ? ""
                          //     : "#caseDataModal"
                          // }
                          onClick={() => {
                            if (this.state.closed_cases !== 0)
                              this.loadCasesRawData("Closed");
                            console.log(
                              this.state.closed_cases,
                              "this.state.closed_cases"
                            );
                            this.TrackingService.LogIncidentsClick(
                              Cookies.get("empnumber"),
                              "LogIncidentsClick",
                              "CLOSED"
                            );
                          }}
                          style={
                            this.state.closed_cases !== 0
                              ? { cursor: "pointer" }
                              : { cursor: "default" }
                          }
                        >
                          <div>
                            <i className="fas fa-box pr-1" />
                            CLOSED
                          </div>
                          <div>
                            <h4>{this.state.closed_cases}</h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 row p-1 mb-1">
                        <div
                          className="col-5 cust-case-elevated  mr-2 ml-4 card"
                          // data-toggle={
                          //   this.state.elevated_cases === 0 ? "" : "modal"
                          // }
                          // data-target={
                          //   this.state.elevated_cases === 0
                          //     ? ""
                          //     : "#caseDataModal"
                          // }
                          onClick={() => {
                            if (this.state.elevated_cases !== 0)
                              this.loadCasesRawData("ELEVATED");
                            console.log(
                              this.state.elevated_cases,
                              "this.state.elevated_cases"
                            );
                            this.TrackingService.LogIncidentsClick(
                              Cookies.get("empnumber"),
                              "LogIncidentsClick",
                              "ELEVATED"
                            );
                          }}
                          style={
                            this.state.elevated_cases !== 0
                              ? { cursor: "pointer" }
                              : { cursor: "default" }
                          }
                        >
                          <div>
                            <i className="fas fa-long-arrow-alt-up pr-1" />
                            ELEVATED
                          </div>
                          <div>
                            <h4>{this.state.elevated_cases}</h4>
                          </div>
                        </div>
                        <div
                          className="col-5 cust-case-escalated card"
                          // data-toggle={
                          //   this.state.severity_cases === 0 ? "" : "modal"
                          // }
                          // data-target={
                          //   this.state.severity_cases === 0
                          //     ? ""
                          //     : "#caseDataModal"
                          // }
                          onClick={() => {
                            if (this.state.severity_cases !== 0)
                              this.loadCasesRawData("SEVERITY");
                            console.log(
                              this.state.severity_cases,
                              "this.state.severity_cases"
                            );
                            this.TrackingService.LogIncidentsClick(
                              Cookies.get("empnumber"),
                              "LogIncidentsClick",
                              "SEVERITY"
                            );
                          }}
                          style={
                            this.state.severity_cases !== 0
                              ? { cursor: "pointer" }
                              : { cursor: "default" }
                          }
                        >
                          <div>
                            <i className="fas fa-exclamation-triangle pr-1" />
                            SEVERITY 1
                          </div>
                          <div>
                            <h4>{this.state.severity_cases}</h4>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-10 cust-case-sev1 card sev-margin"
                        // data-toggle={
                        //   this.state.escalated_cases === 0 ? "" : "modal"
                        // }
                        // data-target={
                        //   this.state.escalated_cases === 0
                        //     ? ""
                        //     : "#caseDataModal"
                        // }
                        onClick={() => {
                          if (this.state.escalated_cases !== 0)
                            this.loadCasesRawData("ESCALATED");
                          console.log(
                            this.state.escalated_cases,
                            "this.state.escalated_cases"
                          );
                          this.TrackingService.LogIncidentsClick(
                            Cookies.get("empnumber"),
                            "LogIncidentsClick",
                            "ESCALTED"
                          );
                        }}
                        style={
                          this.state.escalated_cases !== 0
                            ? { cursor: "pointer" }
                            : { cursor: "default" }
                        }
                      >
                        <div>
                          <i className="fas fa-chart-line pr-1" />
                          ESCALATED
                        </div>
                        <div>
                          <h4>{this.state.escalated_cases}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {this.state.psa_closed === 0 &&
                this.state.psa_open === 0 &&
                this.state.psa_green === 0 &&
                this.state.psa_yellow === 0 &&
                this.state.psa_red === 0 ? (
                  ""
                ) : (
                  <div className="card">
                    <div className="card-header" id="headingThree">
                      <h5 className="mb-0">
                        <button
                          title="Displays consolidated number of PSA projects handled for the customer account with the status. Click on pop up icon for more details."
                          className="btn btn-link btn-full collapsed"
                          type="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          data-target="#custthree"
                          aria-controls="custthree"
                        >
                          Projects (PSA)
                        </button>
                      </h5>
                    </div>
                    <div
                      aria-labelledby="headingThree"
                      data-parent="#accordionCust"
                      aria-expanded="false"
                      id="custthree"
                      className="collapse"
                    >
                      <div className="card-body ml-3">
                        <div className="col-12" align="right">
                          <i
                            className="fas fa-external-link-alt"
                            // data-toggle="modal"
                            // data-target="#deploymentModal"
                            onClick={() => {
                              this.loadDeploymentsRawData("All");
                            }}
                          />
                        </div>
                        <div className="col-12 row p-1">
                          <div
                            className="col-5 cust-case-open mr-2 ml-4 card"
                            // data-toggle={
                            //   this.state.psa_open === 0 ? "" : "modal"
                            // }
                            // data-target={
                            //   this.state.psa_open === 0
                            //     ? ""
                            //     : "#deploymentModal"
                            // }
                            onClick={() => {
                              if (this.state.psa_open !== 0)
                                this.loadDeploymentsRawData("OPEN");
                              console.log(
                                this.state.psa_open,
                                "this.state.psa_open"
                              );
                              this.TrackingService.LogPSAProjectClick(
                                Cookies.get("empnumber"),
                                "LogPSAProjectClick",
                                "OPEN"
                              );
                            }}
                          >
                            <div>
                              <i className="fas fa-box-open pr-1" />
                              OPEN
                            </div>
                            <div>
                              <h4 className="m-0">{this.state.psa_open}</h4>
                            </div>
                            {/*<div>
              <i className="far fa-chart-bar float-right"></i>
            </div> */}
                          </div>
                          <div
                            className="col-5 cust-case-closed card"
                            // data-toggle={
                            //   this.state.psa_closed === 0 ? "" : "modal"
                            // }
                            // data-target={
                            //   this.state.psa_closed === 0
                            //     ? ""
                            //     : "#deploymentModal"
                            // }
                            onClick={() => {
                              if (this.state.psa_closed !== 0)
                                this.loadDeploymentsRawData("CLOSED");
                              console.log(
                                this.state.psa_closed,
                                "this.state.psa_closed"
                              );
                              this.TrackingService.LogPSAProjectClick(
                                Cookies.get("empnumber"),
                                "LogPSAProjectClick",
                                "CLOSE"
                              );
                            }}
                          >
                            <div>
                              <i className="fas fa-box pr-1" />
                              CLOSED
                            </div>
                            <div>
                              <h4>{this.state.psa_closed}</h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 row pl-0 pr-0">
                          <div className="col-12 pt-2 pb-1" align="center">
                            <span>
                              <h6>Overall Status (Open)</h6>
                            </span>
                          </div>
                          {/* <div className="col-12 pl-0 pr-0 pt-1 pb-2" align="center" style={{marginLeft:'60px'}}>
              <div className="row p-0" align="center">
                <div className="col-2 psa_overall_green mr-1 ml-0 card">
                <h6 className="m-0">{this.state.psa_green}</h6>
                <span className="fontx9">In Progress</span>
                 </div>
                <div className="col-2 psa_overall_amber mr-1 card">
                <h6 className="m-0">{this.state.psa_yellow}</h6>
                <span className="fontx9">On Hold</span>                  
                </div>
                <div className="col-2 psa_overall_red card mr-1">
                <h6 className="m-0">{this.state.psa_red}</h6>
                <span className="fontx9">Not Started</span> 
                  </div>
                <div className="col-2 psa_overall_grey card">
                <h6 className="m-0">0</h6>
                <span className="fontx9">Not Available</span>
                </div>
              </div>
            </div>    */}

                          <div
                            className=" col-12 pl-0 pr-0 pt-1 pb-2"
                            align="center"
                            style={{ marginLeft: "60px" }}
                          >
                            <div className="row p-0" align="center">
                              <div className="col-2 psa_overall_green cust-case-open mr-1 ml-0 card">
                                <h6 className="m-0">{this.state.psa_green}</h6>
                                <span className="fontx9">In Progress</span>
                              </div>
                              <div className="col-2 psa_overall_amber cust-case-escalated mr-1 card">
                                <h6 className="m-0">{this.state.psa_yellow}</h6>
                                <span className="fontx9">On Hold</span>
                              </div>
                              <div className="col-2 psa_overall_red cust-case-sev1 card mr-1">
                                <h6 className="m-0">{this.state.psa_red}</h6>
                                <span className="fontx9">Not Started</span>
                              </div>
                              <div className="col-2 psa_overall_grey card">
                                <h6 className="m-0">{this.state.psa_grey}</h6>
                                <span className="fontx9">Not Available</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>
                      </div>
                    </div>
                  </div>
                )}

                {this.state.AllChannelData && (
                  <InstallBase
                    AllChannelData={this.state.AllChannelData}
                    parentAccountStID={this.props.parentAccountStID}
                    SalesDirect={this.state.SalesDirect}
                    SalesInDirect={this.state.SalesInDirect}
                    countryfilterlist={this.state.countrylist}
                  />
                )}
                {/* && this.state.customerSurveyData.length !=0 */}
                {this.state.customerSurveyData && (
                  <CXSurvey
                    customerSurveyData={this.state.customerSurveyData}
                  />
                )}
                {this.state.activecredits === 0 &&
                this.state.DeliveredCredits === 0 &&
                this.state.ConvertedNotDeliveredCredits === 0 ? (
                  ""
                ) : (
                  <ServiceCredits AccountId={this.props.AccountId} />
                )}

                {/* <div className="card">
<div className="card-header" id="headingSix">
<h5 className="mb-0">
<button className="btn btn-link btn-full collapsed" type="button" data-toggle="collapse" aria-expanded="false" data-target="#custSix" aria-controls="custSix">Delivery Metrics</button>
</h5>
</div>
<div aria-labelledby="headingSix" data-parent="#accordionCust" aria-expanded="false" id="custSix" className="collapse">
<div className="card-body m-3">
<div className="col-12 row p-0 ml-5" align="center">
  <br/>
                <div className="col-2 psa_overall_green mr-2 ml-0 card">
                  <div>T2</div>
                  <div>{this.state.OverAllDeliveryMetric >= 8 ?this.state.OverAllDeliveryCount: 0}</div>
                </div>
                <div className="col-2 psa_overall_amber mr-2 card">
                <div>MID</div>
                  <div>{this.state.OverAllDeliveryMetric >= 5 && this.state.OverAllDeliveryMetric < 8 ?this.state.OverAllDeliveryCount: 0}</div>
                </div>
                <div className="col-2 psa_overall_red card mr-2"><div>B5</div>
                  <div>{this.state.OverAllDeliveryMetric < 5 ?this.state.OverAllDeliveryCount: 0}</div>
                </div>
                <br/>
            </div>
            </div>
            </div>
            </div> */}
              </div>
            </div>
          </div>
          <CustomerRevenueChart
            dataPoints={dataPoints}
            AccountId={this.props.AccountId}
            filterRawData={this.state.filters}
          />
          <CustomerOpportunity
            AccountSTID={this.props.AccountId}
          ></CustomerOpportunity>
          <CCFilters
            AccountId={this.props.AccountId}
            ApplyCCFilter={this.ApplyCCFilter}
            ResetCCFilters={this.ResetCCFilters}
            key={this.state.ForCCFilterRefresh}
          />

          {this.state.isLoadOppRawData && (
            <Modal
              show={this.state.isLoadOppRawData}
              onHide={this.closeOppRawData}
              dialogClassName="modal-dialog modal-lg full-data-modal"
            >
              <Modal.Header>
                <h5 className="modal-title" id="rawDataModalLabel">
                  Opportunity - {this.state.selectedItemForRawData}
                </h5>
                <button
                  type="button"
                  translate="no"
                  onClick={() => this.closeOppRawData()}
                  class="close"
                  data-dismiss="modal"
                >
                  <i className="fa fa-times" style={{ fontSize: "15px" }}></i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <Suspense fallback={<h1 />}>
                  <OpportunityRawData
                    AccountId={this.props.AccountId}
                    filter={this.state.selectedItemForRawData}
                    filterRawData={this.state.filters}
                  />
                </Suspense>
              </Modal.Body>
            </Modal>
          )}

          {this.state.isLoadCasesRawData && (
            <Modal
              show={this.state.isLoadCasesRawData}
              onHide={this.closeCasesRawData}
              dialogClassName="modal-dialog modal-lg full-data-modal"
            >
              <Modal.Header>
                <h5 className="modal-title" id="caseDataModalLabel">
                  Incidents - {this.state.selectedItemForRawData}
                </h5>
                <button
                  type="button"
                  translate="no"
                  onClick={() => this.closeCasesRawData()}
                  class="close"
                  data-dismiss="modal"
                >
                  <i className="fa fa-times" style={{ fontSize: "15px" }}></i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <Suspense fallback={<h1 />}>
                  <CasesRawData
                    AccountId={this.props.AccountId}
                    filter={this.state.selectedItemForRawData}
                    filterRawData={this.state.filters}
                  />
                </Suspense>
              </Modal.Body>
            </Modal>
          )}

          {this.state.isLoadDeploymentsRawData && (
            <Modal
              show={this.state.isLoadDeploymentsRawData}
              onHide={this.closeDeploymentRawData}
              dialogClassName="modal-dialog modal-lg full-data-modal"
            >
              <Modal.Header>
                <h5 className="modal-title" id="deploymentModalLabel">
                  Projects (PSA) - {this.state.selectedItemForRawData}
                </h5>
                <button
                  type="button"
                  translate="no"
                  onClick={() => this.closeDeploymentRawData()}
                  class="close"
                  data-dismiss="modal"
                >
                  <i className="fa fa-times" style={{ fontSize: "15px" }}></i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <Suspense fallback={<h1 />}>
                  <DeploymentsRawData
                    AccountId={this.props.AccountId}
                    filter={this.state.selectedItemForRawData}
                    filterRawData={this.state.filters}
                  />
                </Suspense>
              </Modal.Body>
            </Modal>
          )}
        </div>
      </>
    );
  }
}
export default CustomerCapsule;
