import React, { Component, Fragment } from "react";
import _ from "lodash";
import axios from "axios";
import CustomerCapsuleFilter from "./CustomerCapsuleGeoFilter";
import CustomerCapsuleDateRange from "./CustomerCapsuleDateRange";
import TrackingService from "../TrackingService";
import Cookies from "js-cookie";
class CCFilters extends Component {
  constructor(props) {
    super(props);
    this.TrackingService = new TrackingService();
    this.state = {
      AccountId: this.props.AccountId,
      filterData: [],
      filterString: "",
      countrylist: "",
      CSfilterString: "",
      accountstid: "",
      filterApplied: false,
      SelectedCCFilters: {
        SelectedCountries: "",
        SelectedCCapsuleCreatedDates: "",
      },
    };
    this.ClearCCDates = React.createRef();
  }
  componentDidUpdate(prevProps) {
    if (this.props.AccountId !== prevProps.AccountId) {
      this.setState({ filterString: "" });
    }
  }
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
  OnCCGeoChange = (SelectedCountries) => {
    let SelectedCCFilters = this.state.SelectedCCFilters;
    SelectedCCFilters.SelectedCountries = SelectedCountries;
    console.log("SelectedCountries", SelectedCountries);
    this.setState({ SelectedCCFilters });
    console.log("SelectedCountries-1", SelectedCCFilters.SelectedCountries);
  };
  OnCCapsuleCreatedDateChange = (SelectedCreatedDates) => {
    let SelectedCCFilters = this.state.SelectedCCFilters;
    SelectedCCFilters.SelectedCCapsuleCreatedDates = SelectedCreatedDates;
    this.setState({ SelectedCCFilters });
    console.log(
      "SelectedCountries-date",
      SelectedCCFilters.SelectedCCapsuleCreatedDates
    );
    this.TrackingService.LogcustomerCapsulefilterClick(
      Cookies.get("empnumber"),
      "LogcustomerCapsulefilterClick",
      SelectedCCFilters.SelectedCCapsuleCreatedDates
    );
  };
  formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-") + "T00:00:00Z";
  };
  formatCSDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("/");
  };

  UpdateCCFilters = (isUpdateAndApply) => {
    var filterString = "";
    var countrylist = "";
    var CSfilterString = "";
    let selectedCountries = document.querySelectorAll(
      "input[name=geocountry]:checked"
    );
    for (var i = 0; i < selectedCountries.length; i++) {
      if (i == 0) {
        filterString +=
          "Account.Country_Code__c='" + selectedCountries[i].value + "'";
        countrylist += "'" + selectedCountries[i].value + "'";
      } else {
        filterString +=
          " OR Account.Country_Code__c='" + selectedCountries[i].value + "'";
        countrylist += ",'" + selectedCountries[i].value + "'";
      }
    }
    if (filterString != "") {
      filterString = "(" + filterString + ")";
    }
    // For customer survey filtering

    let selectedCSCountries = document.querySelectorAll(
      "input[name=geocountryname]:checked"
    );
    for (var i = 0; i < selectedCSCountries.length; i++) {
      if (i == 0) {
        CSfilterString += "?cName=" + selectedCSCountries[i].value;
      } else {
        CSfilterString += "," + selectedCSCountries[i].value;
      }
    }
    // For Fiscal Year Filtering
    let isCreatedDateChanged =
      document.querySelectorAll("input[name=createdToDateCC]")[0] !== undefined
        ? document.querySelectorAll("input[name=createdToDateCC]")[0].value
        : [];
    if (isCreatedDateChanged == "true") {
      var css_dt = this.formatCSDate(
        new Date(
          document.getElementsByClassName("creation_date_startCC")[0].value
        )
      );
      var cse_dt = this.formatCSDate(
        new Date(
          document.getElementsByClassName("creation_date_endCC")[0].value
        )
      );

      if (this.state.SelectedCCFilters.SelectedCountries != "") {
        CSfilterString += "&sDate=" + css_dt + "&eDate=" + cse_dt;
      } else {
        CSfilterString += "?sDate=" + css_dt + "&eDate=" + cse_dt;
      }

      var s_dt = this.formatDate(
        new Date(
          document.getElementsByClassName("creation_date_startCC")[0].value
        )
      );
      var e_dt = this.formatDate(
        new Date(
          document.getElementsByClassName("creation_date_endCC")[0].value
        )
      );

      if (this.state.SelectedCCFilters.SelectedCountries != "") {
        filterString +=
          " AND CreatedDate >= " + s_dt + " AND CreatedDate <= " + e_dt;
      } else {
        filterString +=
          " AND CreatedDate >= " + s_dt + " AND CreatedDate <= " + e_dt;
      }
    }

    this.setState({ filterString });
    this.setState({ countrylist });
    this.setState({ CSfilterString });
    this.setState({ filterApplied: false });

    return filterString;
  };
  ApplyCCFilters = () => {
    this.showHideDiv("capsulefilterdiv");
    this.setState({ filterApplied: true }, () => {
      const { ApplyCCFilter } = this.props;
      ApplyCCFilter(
        this.state.filterString,
        this.state.countrylist,
        this.state.CSfilterString,
        this.state.SelectedCCFilters,
        this.state.filterApplied
      );
      console.log(
        "Applied FIler",
        this.state.countrylist,
        this.state.SelectedCCFilters
      );
      this.TrackingService.LogcustomerCapsulefilterClick(
        Cookies.get("empnumber"),
        "LogcustomerCapsulefilterClick",
        this.state.countrylist +
          " and " +
          this.state.SelectedCCFilters.SelectedCCapsuleCreatedDates
      );
    });
  };
  ClearAllCCFilters = () => {
    var SelectedCCFilters = {
      SelectedCountries: "",
      SelectedCCapsuleCreatedDates: "",
    };
    this.setState({ SelectedCCFilters });
    const { ResetCCFilters } = this.props;
    ResetCCFilters(this.state.filterApplied);
  };
  render() {
    return (
      <Fragment>
        <div id="capsulefilterdiv" className="capsulefiltermain">
          <Fragment>
            <div className="row accordion" id="customercapsule_accordion">
              <div className="col-12">
                <div
                  className="mt-1 mb-1 mr-3 float-right close-btn-fliter"
                  onClick={() => this.showHideDiv("capsulefilterdiv")}
                  translate="no"
                >
                  x
                </div>
              </div>
            </div>
            <div className="col-12 mb-2">
              <div className="row">
                <div className="col-6">
                  <div className="filter-heading">Filter By</div>
                </div>
                <div className="col-6">
                  {this.state.filterString != "" ? (
                    <button
                      className="btn btn-sm btn-success ccapplybtn mr-0 float-right"
                      onClick={this.ApplyCCFilters}
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-success ccapplybtn mr-0 float-right"
                      disabled
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 ml-0 mt-2">
              <div className="pl-1 pr-1 clear-all-filters">
                {this.state.filterString != "" && (
                  <a
                    className="clear-all-filters"
                    onClick={this.ClearAllCCFilters}
                  >
                    Clear All
                  </a>
                )}
              </div>
            </div>
            <CustomerCapsuleFilter
              AccountId={this.props.AccountId}
              UpdateCCFilters={this.UpdateCCFilters}
              OnCCGeoChange={this.OnCCGeoChange}
              ApplyCCFilters={this.ApplyCCFilters}
            ></CustomerCapsuleFilter>

            <CustomerCapsuleDateRange
              AccountId={this.props.AccountId}
              UpdateCCFilters={this.UpdateCCFilters}
              OnCCapsuleCreatedDateChange={this.OnCCapsuleCreatedDateChange}
              ref={this.ClearCCDates}
            ></CustomerCapsuleDateRange>
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

export default CCFilters;
