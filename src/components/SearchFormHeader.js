import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap";
import DocumentsAutoSuggest from "./DocumentsAutoSuggest";
import AccountNameAutoSuggest from "./AccountNameAutoSuggest";
import URLConfig from "./URLConfig";
import PowerSearchIn from "./PowerSearch/index";
import WCloudIcon from "../img/word-cloud-icon.png";
import WordCloud from "./WordCloud";
import ServiceContactInformation from "./ServiceContactInformation";
import sowIcon from "../img/sow-automation.png";
import TrackingService from "./TrackingService";
import FlyerTool from "./FlyerTool";

class SearchFormHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    searchText: "",
    customerID: "",
    showRefineSearch: false,
    fineSearch: "",
    searchType: "",
    accountNameValue: "",
    showRefineToggleButton: false,
    showwordcloud: false,
    advancedSearch: false,
  };

  toggleRefineSearch = () => {
    this.setState((prevState) => ({
      showRefineSearch: !prevState.showRefineSearch,
    }));
  };
  setActiveFilter = (filter) => {
    this.setState({ searchType: filter });
  };
  onFineSearchChange = (e) => {
    let fineSearch = e.target.value;
    this.setState({ fineSearch, customerID: fineSearch });
    this.identifySearchType(fineSearch);
  };
  isNumber = (str) => {
    var reg = new RegExp("^[0-9]+$");
    return reg.test(str);
  };
  identifySearchType = (fineSearch) => {
    var hasNumber = /\d/;
    if (fineSearch.length > 2) {
      if (this.isNumber(fineSearch) && fineSearch.length < 10) {
        this.setState({ searchType: "ST ID" });
      } else if (fineSearch.toUpperCase().indexOf("PR-") === 0) {
        this.setState({ searchType: "PR ID" });
      } else if (
        fineSearch.toUpperCase().indexOf("OPP") === 0 ||
        fineSearch.toUpperCase().indexOf("OPE") === 0
      ) {
        this.setState({ searchType: "OPP ID" });
      } else if (
        URLConfig.get_countryCode().indexOf(
          fineSearch.substring(0, 2).toUpperCase()
        ) !== -1 &&
        fineSearch.indexOf("-") === 3
      ) {
        this.setState({ searchType: "WBS ID" });
      } else if (
        (fineSearch.length === 10 || fineSearch.length === 12) &&
        fineSearch.includes("-") === false &&
        !this.isNumber(fineSearch) &&
        hasNumber.test(fineSearch)
      ) {
        this.setState({ searchType: "Serial ID" });
      } else if (
        fineSearch.length === 12 &&
        fineSearch.includes("-") === false &&
        this.isNumber(fineSearch)
      ) {
        this.setState({ searchType: "Service Agreement Id" });
      } else {
        this.setState({
          searchType: "Account Name",
          accountNameValue: fineSearch,
        });
      }
    }
    if (fineSearch.length === 0) {
      this.setState({ searchType: "", accountNameValue: "" });
    }
  };
  fireCustomerCapsuleSearch = () => {
    const { onCustomerSubmit } = this.props;
    const { onSubmit } = this.props;
    this.props.setActiveFilterAndValue(
      this.state.searchType,
      this.state.fineSearch
    );
    const CustID = this.state.customerID
      .trim()
      .replace(/[#?&@]/g, " ")
      .toUpperCase()
      .split(".")[0];

    //Validations
    if (this.state.searchType && this.state.searchType === "OPP ID") {
      if (this.state.fineSearch.trim().length !== 14) {
        toast.error("Please enter valid Opportunity ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (this.state.searchType && this.state.searchType === "WBS ID") {
      if (this.state.fineSearch.trim().length !== 9) {
        toast.error("Please enter valid WBS ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (this.state.searchType && this.state.searchType === "ST ID") {
      let re = new RegExp("^[0-9]*$");
      if (!this.state.fineSearch.match(re)) {
        toast.error("Please enter valid ST ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (this.state.searchType && this.state.searchType === "PR ID") {
      if (!this.state.fineSearch.trim().startsWith("PR-")) {
        toast.error("Please enter valid PR ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (
      this.state.searchType &&
      this.state.searchType === "Account Name"
    ) {
      let re = new RegExp("/^([0-9]|[a-z])+([0-9a-z]+)$/i");
      if (
        !this.state.accountNameValue.match(re) &&
        this.state.accountNameValue.trim().length < 10
      ) {
        toast.error("Please enter valid Account Name", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (this.state.searchType && this.state.searchType === "Serial ID") {
      if (this.state.fineSearch.trim().length < 12) {
        if (this.state.fineSearch.trim().length < 10) {
          toast.error("Please enter valid Serial Number ID ", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
      }
    }

    if (
      this.state.searchType &&
      (this.state.searchType === "OPP ID" || this.state.searchType === "WBS ID")
    ) {
      const Config = URLConfig.GetSearchKeyByOppID(
        this.state.fineSearch.trim()
      );

      axios(Config).then((res) => {
        if (res?.data && res?.data?.response) {
          if (this.state.searchText === "")
            this.setState({ searchText: res.data.response });
          //this.getCustDetails();
          onCustomerSubmit(
            this.state.fineSearch
              .trim()
              .replace(/[#?&@]/g, " ")
              .toUpperCase()
              .split(".")[0]
          );
          onSubmit(this.state.searchText.replace(/[#?&@]/g, " "));
        } else if (res?.data && res?.data?.error) {
          toast.error(res.data.error, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
      });
    } else if (this.state.searchType === "Serial ID") {
      onCustomerSubmit(this.state.fineSearch);
    } else {
      const CustID =
        this.state.searchType === "Account Name"
          ? this.state.accountNameValue
          : this.state.fineSearch
              .trim()
              .replace(/[#?&@]/g, " ")
              .toUpperCase()
              .split(".")[0];

      setTimeout(() => {
        onCustomerSubmit(CustID);
        if (this.state.searchText.trim() === "") {
          const { ResetKnowledgeAndRefCapsule } = this.props;
          ResetKnowledgeAndRefCapsule();
        } else {
          onSubmit(this.state.searchText.replace(/[#?&@]/g, " "));
        }
      }, 1000);
      //this.state.searchText&&this.doSearch(this.state.searchText.replace(/[#?&@]/g, " "));
    }
  };

  fireSearch = (e) => {
    this.props.setActiveFilterAndValue(
      this.state.searchType,
      this.state.fineSearch
    );
    if (e.keyCode === 13) {
      // Enter key
      this.fireCustomerCapsuleSearch();
    }
  };

  ClearSearch = () => {
    this.setState({
      searchText: "",
      customerID: "",
      fineSearch: "",
      searchType: "",
      accountNameValue: "",
    });
  };

  ClearFreeSearch = () => {
    this.setState({
      searchText: "",
    });
  };

  componentDidMount() {
    const accountNameValue =
      this.props.activeFilter === "Account Name"
        ? this.props.CustomerIDValue
        : "";
    const searchType = this.props.activeFilter;
    const fineSearch =
      this.props.activeFilter != "Account Name"
        ? this.props.CustomerIDValue
        : "";
    const showRefineToggleButton = this.props.CustomerIDValue.trim() === "";
    this.setState({
      searchText: this.props.searchText,
      accountNameValue,
      searchType,
      fineSearch,
      showRefineToggleButton,
      showRefineSearch: !showRefineToggleButton,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      this.setState({ searchText: this.props.searchText });
    }
    // if (
    //   // this.props.searchText !== prevProps.searchText &&
    //   // this.props.activeFilter === "Account Name"
    //   this.props.activeFilter === "Account Name" &&
    //   prevProps.CustomerIDValue !== this.props.CustomerIDValue
    // ) {
    //   this.setState({ searchText: this.props.searchText });
    //   const accountNameValue =
    //     this.props.activeFilter === "Account Name"
    //       ? this.props.CustomerIDValue
    //       : "";
    //   const searchType = this.props.activeFilter;
    //   const fineSearch =
    //     this.props.activeFilter != "Account Name"
    //       ? this.props.CustomerIDValue
    //       : "";
    //   const showRefineToggleButton = this.props.CustomerIDValue.trim() === "";
    //   this.setState(
    //     {
    //       accountNameValue,
    //       searchType,
    //       fineSearch,
    //       showRefineToggleButton,
    //       showRefineSearch: !showRefineToggleButton,
    //     },
    //     () => {
    //       this.fireAccountNameSearch(accountNameValue);
    //     }
    //   );
    // }
    //commented by AMS
    // if (
    //   this.props.activeFilter === "Account Name" &&
    //   prevProps.CustomerIDValue !== this.props.CustomerIDValue
    // ) {
    //   const accountNameValue =
    //     this.props.activeFilter === "Account Name"
    //       ? this.props.CustomerIDValue
    //       : "";
    //   const searchType = this.props.activeFilter;
    //   const fineSearch =
    //     this.props.activeFilter != "Account Name"
    //       ? this.props.CustomerIDValue
    //       : "";
    //   const showRefineToggleButton = this.props.CustomerIDValue.trim() === "";
    //   //the following code base is required for insights
    //   this.setState(
    //     {
    //       accountNameValue,
    //       searchType,
    //       fineSearch,
    //       showRefineToggleButton,
    //       showRefineSearch: !showRefineToggleButton,
    //     },
    //     () => {
    //       this.fireAccountNameSearch(accountNameValue);
    //     }
    //   );
    // }

    //code by AMS:  rearranging the state update
    if (
      this.props.activeFilter === "Account Name" &&
      prevProps.CustomerIDValue !== this.props.CustomerIDValue
    ) {
      const showRefineToggleButton = this.props.CustomerIDValue.trim() === "";
      this.setState(
        {
          accountNameValue: this.props.CustomerIDValue,
          fineSearch: this.props.CustomerIDValue,
          searchType: this.props.activeFilter,
          showRefineToggleButton,
          showRefineSearch: true,
        },
        () => this.fireAccountNameSearch(this.props.CustomerIDValue)
      );
    }
  }

  updateAccountNameSearchKey = (accountNameValue) => {
    if (accountNameValue.length != 0) {
      this.setState({ accountNameValue, fineSearch: accountNameValue });
      this.identifySearchType(accountNameValue);
    } else {
      this.setState(
        {
          accountNameValue: "",
          fineSearch: "",
          searchType: "",
          customerID: "",
        },
        () => {
          this.fineSearchInput.focus();
        }
      );
    }
    this.props.isClose(false);
  };

  updateSearchKey = (searchText) => {
    var refineSearch = this.state.accountNameValue
      ? this.state.accountNameValue
      : this.state.fineSearch;
    this.setState({ searchText: searchText });
    this.props.isClose(false);
    this.setState({ fineSearch: refineSearch });
  };

  doSearch = (searchText) => {
    this.setState({ advancedSearch: false });
    const { onSubmit } = this.props;
    if (searchText.trim() === "") {
      return;
    }
    if (this.state.searchType !== "") {
      this.fireCustomerCapsuleSearch();
      return;
    }
    if (this.state.searchType === "") {
      const { ResetCustomerCapsule } = this.props;
      ResetCustomerCapsule();
    }
    onSubmit(searchText);
  };

  doAdvancedSearch = (searchText) => {
    this.setState({ advancedSearch: true });
    const { onSubmit } = this.props;
    if (this.state.searchText.trim() === "") {
      return;
    }
    if (this.state.searchType !== "") {
      this.fireCustomerCapsuleSearch();
      return;
    }
    if (this.state.searchType === "") {
      const { ResetCustomerCapsule } = this.props;
      ResetCustomerCapsule();
    }
    onSubmit(this.state.searchText);
  };

  doPowerSearch = (searchText) => {
    const { ResetCustomerCapsule } = this.props;
    const { ResetKnowledgeAndRefCapsule } = this.props;
    if (searchText == "") {
      ResetKnowledgeAndRefCapsule();
      ResetCustomerCapsule();
      this.setState({
        searchText: "",
        customerID: "",
        fineSearch: "",
        searchType: "",
        accountNameValue: "",
      });
    }
    this.setState({ searchText }, () => {
      this.doAdvancedSearch(searchText);
    });
  };
  // updateInputValue = (evt) => {
  //   this.setState({
  //     searchText: evt.target.value,
  //   });
  // };

  fireAccountNameSearch = (searchId) => {
    if (searchId) {
      this.props.setActiveFilterAndValue(this.state.searchType, searchId);
      this.setState({ customerID: searchId });
      setTimeout(() => {
        this.props.onCustomerSubmit(searchId);
        if (this.state.searchText.trim() === "") {
          const { ResetKnowledgeAndRefCapsule } = this.props;
          ResetKnowledgeAndRefCapsule();
        } else {
          const { onSubmit } = this.props;
          onSubmit(this.state.searchText.replace(/[#?&@]/g, " "));
        }
      }, 1000);
    }
  };

  resetRefineSearch = () => {
    this.setState(
      { accountNameValue: "", fineSearch: "", searchType: "" },
      () => {
        if (this.fineSearchInput) this.fineSearchInput.focus();
      }
    );
  };
  doWordCloudSearch = (searchText) => {
    this.TrackingService = new TrackingService();
    this.TrackingService.LogWordCountlinkClick(
      Cookies.get("empnumber"),
      searchText,
      true
    );
    let oldstate = this.state.searchText;
    oldstate = oldstate.replace(/"/g, "");
    oldstate = oldstate.trim().split("+");
    var array = [];
    for (var i = 0; i < oldstate.length; i++) {
      array[i] = '"' + oldstate[i] + '"';
    }
    oldstate = array.join("+");
    let newstate = oldstate + '+"' + searchText.trim() + '"';
    this.setState({ searchText: newstate, showwordcloud: false });
    const { onSubmit } = this.props;
    if (this.state.searchText.trim() === "") {
      return;
    }
    if (this.state.searchType !== "") {
      this.fireCustomerCapsuleSearch();
      return;
    }
    if (this.state.searchType === "") {
      const { ResetCustomerCapsule } = this.props;
      ResetCustomerCapsule();
    }
    onSubmit(this.state.searchText);
  };

  ClearAdvSearch = () => {
    // this.setState({
    //   fineSearch: "",
    //   accountNameValue: "",
    // });
    this.setState(
      {
        fineSearch: "",
        accountNameValue: "",
        searchType: "",
        customerID: "",
      },
      () => this.props.resetRefinedSearch()
    );
  };

  ClearAdvnSearch = () => {
    // this.setState({
    //   accountNameValue: "",
    //   fineSearch: "",
    // });
    this.setState(
      {
        fineSearch: "",
        accountNameValue: "",
        searchType: "",
        customerID: "",
      },
      () => this.props.resetRefinedSearch()
    );
  };

  render() {
    const searchType = this.props.activeFilter;
    return (
      <>
        <div
          className="col-4 pr-1"
          id="SearchAutoSuggestions"
          onClick={() => console.log("CLICKED")}
        >
          <DocumentsAutoSuggest
            fireSearch={this.doSearch}
            value={this.state.searchText}
            onSearchValueChange={this.updateSearchKey}
            //isClose = {this.SurveyClose}
            //() => this.SurveyClose
          />
          {this.state.searchText !== "" ? (
            <span
              className="clearsearch"
              title="Clear"
              onClick={this.ClearFreeSearch}
              translate="no"
            >
              X
            </span>
          ) : (
            ""
          )}
        </div>
        <PowerSearchIn
          fireSearch={this.doPowerSearch}
          advancedSearch={this.state.advancedSearch}
          searchterm={this.state.searchText}
        />
        {this.state.showRefineToggleButton && (
          <button
            id="btnRefineSearch"
            className="btn btn-link fontx10"
            onClick={this.toggleRefineSearch}
            style={{ marginTop: "-4px", marginLeft: "-16px" }}
          >
            Refine Search
          </button>
        )}
        {!this.state.showRefineToggleButton && (
          <label
            className="mt-1 pl-2 fontx10"
            onClick={this.resetRefineSearch}
            style={{ marginLeft: "-16px" }}
          >
            Refine Search
          </label>
        )}
        {this.state.showRefineSearch && (
          <div className="col-4 pr-1 " id="SearchOppID">
            {this.state.searchType &&
            this.state.searchType === "Account Name" ? (
              <>
                <AccountNameAutoSuggest
                  fireSearch={this.fireAccountNameSearch}
                  value={this.state.accountNameValue}
                  onSearchValueChange={this.updateAccountNameSearchKey}
                  setActiveFilterAndValue={this.props.setActiveFilterAndValue}
                  searchType={this.state.searchType}
                />
                {this.state.accountNameValue != "" ? (
                  <span
                    className="clearsearch sright"
                    title="Clear"
                    onClick={this.ClearAdvnSearch}
                    translate="no"
                  >
                    X
                  </span>
                ) : (
                  ""
                )}
              </>
            ) : (
              <>
                <input
                  onChange={this.onFineSearchChange}
                  value={this.state.fineSearch}
                  className="form-control form-control-sm search-boxes"
                  type="text"
                  title="Sales Territory ID / Project ID / PSA Project ID / Opportunity ID / Account Name / Serial No / SAID."
                  placeholder={
                    "Sales Territory ID / Project ID / PSA Project ID / Opportunity ID / Account Name / Serial No / SAID."
                  }
                  onKeyUp={this.fireSearch}
                  ref={(elem) => (this.fineSearchInput = elem)}
                  autoFocus
                />
                {this.state.fineSearch != "" ? (
                  <span
                    className="clearsearch sright"
                    title="Clear"
                    onClick={this.ClearAdvSearch}
                    translate="no"
                  >
                    X
                  </span>
                ) : (
                  ""
                )}
              </>
            )}
            {/* <label>{this.state.searchType}</label> */}
          </div>
        )}

        <div title="Solution 360" className="sowbtn">
          <img
            className="sow-icon pointer"
            src={sowIcon}
            alt="Solution 360"
            onClick={() => {
              if (!this.TrackingService) {
                this.TrackingService = new TrackingService();
              }
              this.TrackingService.LogSowClick(Cookies.get("empnumber"));

              this.props.history.push("/sow");
            }}
          />
        </div>

        {/* <FlyerTool right="145px" /> */}

        <a
          // href="#"
          className="float"
          title="Word Cloud"
          onClick={() => this.setState({ showwordcloud: true })}
        >
          <img
            src={WCloudIcon}
            className="brief-case-after-results pointer ml-2"
            onClick={() => this.setState({ showwordcloud: true })}
          />
        </a>
        {this.state.searchText && (
          <ServiceContactInformation searchText={this.state.searchText} />
        )}
        <Modal show={this.state.showwordcloud} size="lg" id="wordcloudModal">
          <button
            type="button"
            className="close"
            style={{ marginLeft: "98%" }}
            onClick={() => this.setState({ showwordcloud: false })}
            translate="no"
          >
            x
          </button>

          <Modal.Body>
            <WordCloud
              searchText={this.state.searchText}
              onCloudSubmit={this.doWordCloudSearch}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default SearchFormHeader;
