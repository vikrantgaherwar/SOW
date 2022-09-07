import React, { Component } from "react";
import axios from "axios";
import { map, uniq, cloneDeep } from "lodash";
import Cookies from "js-cookie";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import TrackingService from "../TrackingService";

import LOCALIZATION from "./localization";
import BusinessGroup from "./BusinessGroup";
import DocumentFilters from "./DocumentFilters";
import MarketPlace from "./MarketPlace";
import DateRange from "./DateRange";
import AssetCreator from "./AssetCreator";
import DataSource from "./DataSource";
import StrategicAlliances from "./StrategicAlliances";
import GoldCollateral from "./GoldCollateral";
import NDAOnly from "./NDAOnly";
import ArchivedDocs from "./ArchivedDocs";
import IndustrySegment from "./IndustrySegment";
//import BusinessSegment from './BusinessSegment'
// import Product from "./Product";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.TrackingService = new TrackingService();
    this.state = {
      filterData: [],
      service_type: [],
      filterString: "&fq=-isarchived:True",
      geoData: [],
      SelectedFilters: {
        SelectedLanguages: "",
        SelectedCountries: "",
        SelectedDocSource: "",
        SelectedDisclouser: "",
        SelectedFileTypes: "",
        SelectedCreatedDates: "",
        SelectedPublishedDates: "",
        SelectedModifiedDates: "",
        SelectedServiceType: "",
        SelectedOnRecommendedBy: "",
        SelectedInitiative: "",
        SelectedGoldCollateral: false,
        IsNDAOnly: false,
        SelectedShowArchivedDocs: false,
        SelectedResearchVendors: "",
        SelectedCompetitors: "",
      },
    };
    this.ClearDocSources = React.createRef();
    this.ClearIndustrySegment = React.createRef();
    this.ClearLocalization = React.createRef();
    this.ClearDocumentFilters = React.createRef();
    this.ClearFileTypes = React.createRef();
    this.ClearDates = React.createRef();
    this.ClearBusinessGroup = React.createRef();
    this.ClearGoldCollateral = React.createRef();
    this.ClearNDAOnly = React.createRef();
    this.ClearArchivedDocs = React.createRef();
    this.ClearMarketPlace = React.createRef();
  }

  componentDidMount = () => {
    this.setState((prevState) => ({
      SelectedFilters: {
        ...prevState.SelectedFilters,
        ...this.props.SelectedFilters,
      },
    }));
    this.CheckUserHaveNDADocuments();
    axios
      .get("https://delta.app.hpecorp.net:444/api/GeoRegion/GetAllGeoRegions")
      .then((res) => {
        if (res.data) {
          this.setState({ geoData: res.data });
        }
      });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.hardClearValue !== prevProps.hardClearValue &&
      this.props.hardClearValue
    ) {
      this.ClearAFilter(this.props.hardClearValue);
    }
  }

  CheckUserHaveNDADocuments = () => {
    debugger;
    var searchKey = document
      .getElementsByClassName("react-autosuggest__input")[0]
      .value.replace(/[#?&@]/g, " ");
    if (searchKey.indexOf("unique_file") === 0) {
      // searchKey = eval(searchKey);
    }
    if (searchKey.indexOf('"') === 0) {
      searchKey = searchKey.substring(1, searchKey.length - 1);
    }
    axios
      .get(
        "https://hpedelta.com:8983/solr/sharepoint_index/select?defType=edismax&fl=id,title,nda,ndamails_raw,score,isarchived&group.field=document_type_details&group=true&indent=on&q=" +
          searchKey +
          "&rows=500&wt=json&group.limit=15&fq=persona_role:*Admin*&fq=-isarchived:True&fq=nda:%22True%22&fq=ndamails_raw:*" +
          Cookies.get("mail") +
          "*"
      )
      .then((res) => {
        debugger;
        if (res.data) {
          this.setState({
            ndamails_raw: res.data.grouped.document_type_details.matches,
          });
        }
      });
  };

  // componentDidUpdate(prevProps) {
  //   if (prevProps.SelectedFilters !== this.props.SelectedFilters) {
  //     this.setState((prevState) => ({
  //       SelectedFilters: {
  //         ...prevState.SelectedFilters,
  //         ...this.props.SelectedFilters,
  //       },
  //     }));
  //   }
  // }

  ClearAFilter = (FilterType) => {
    if (FilterType === "doc_source")
      this.ClearDocSources.current.ClearDocSources();
    else if (FilterType === "industry_segment")
      this.ClearIndustrySegment.current.ClearIndustrySegment();
    else if (FilterType === "language" || FilterType === "geo")
      this.ClearLocalization.current.ClearLocalization(FilterType);
    else if (FilterType === "disclosure_level" || FilterType === "file_type")
      this.ClearDocumentFilters.current.ClearDocumentFilters(FilterType);
    else if (
      FilterType === "CreatedDate" ||
      FilterType === "PublishDate" ||
      FilterType === "ModifiedDate"
    )
      this.ClearDates.current.ClearDates(FilterType);
    else if (
      FilterType === "ServiceType" ||
      FilterType === "RecommendedBy" ||
      FilterType === "AlignedInitiative"
    )
      this.ClearBusinessGroup.current.ClearBusinessGroup(FilterType);
    else if (FilterType === "GoldCollateral")
      this.ClearGoldCollateral.current.ClearGoldCollateral();
    else if (FilterType === "NDAOnly") this.ClearNDAOnly.current.ClearNDAOnly();
    else if (FilterType === "ArchivedDocs") {
      this.ClearArchivedDocs.current.ClearArchivedDocs();
    } else if (
      FilterType === "reserach_vendors" ||
      FilterType === "competitors"
    ) {
      this.ClearMarketPlace.current.ClearMarketPlace(FilterType);
    }
  };

  showHideDiv = (ele) => {
    var srcElement = document.getElementById(ele);
    if (srcElement !== null) {
      if (srcElement.style.display == "block") {
        srcElement.style.display = "none";
      } 
      else {
        srcElement.style.display = "block";
      }
      return false;
    }
  };

  UpdateFilters = (isUpdateAndApply) => {
    let filterString = "&fq=-isarchived:True";
    // let filterString = "";
    // let filterString = this.props.filters;
    let selectedCountries = document.querySelectorAll(
      "input[name=country]:checked"
    );
    for (let i = 0; i < selectedCountries.length; i++) {
      if (i === 0)
        filterString += '&fq=country:"' + selectedCountries[i].value + '"';
      else filterString += ' OR country:"' + selectedCountries[i].value + '"';
    }
    let selectedLangs = document.querySelectorAll(
      "input[name=language]:checked"
    );
    for (let i = 0; i < selectedLangs.length; i++) {
      if (i === 0)
        filterString += '&fq=language_s:"' + selectedLangs[i].value + '"';
      else filterString += ' OR language_s:"' + selectedLangs[i].value + '"';
    }

    //Business Group
    let recommended_by = document.querySelectorAll(
      "input[name=recommended_by]:checked"
    );
    for (let i = 0; i < recommended_by.length; i++) {
      if (i == 0)
        filterString += '&fq=recommended_by:"' + recommended_by[i].value + '"';
      else
        filterString += ' OR recommended_by:"' + recommended_by[i].value + '"';
    }

    let alligned_initiative = document.querySelectorAll(
      "input[name=alligned_initiative]:checked"
    );
    for (let i = 0; i < alligned_initiative.length; i++) {
      if (i === 0)
        filterString +=
          '&fq=alligned_initiative:"' + alligned_initiative[i].value + '"';
      else
        filterString +=
          ' OR alligned_initiative:"' + alligned_initiative[i].value + '"';
    }
    let service_type = document.querySelectorAll(
      "input[name=service_type]:checked"
    );
    for (let i = 0; i < service_type.length; i++) {
      if (i === 0)
        filterString += '&fq=service_type:"' + service_type[i].value + '"';
      else filterString += ' OR service_type:"' + service_type[i].value + '"';
    }

    let rating = document.querySelectorAll("input[name=rating]:checked");
    for (let i = 0; i < rating.length; i++) {
      if (i === 0) filterString += '&fq=rating:"' + rating[i].value + '"';
      else filterString += ' OR rating:"' + rating[i].value + '"';
    }

    let disclosure_level = document.querySelectorAll(
      "input[name=disclosure_level]:checked"
    );
    for (let i = 0; i < disclosure_level.length; i++) {
      if (i === 0)
        filterString +=
          '&fq=disclosure_level:"' + disclosure_level[i].value + '"';
      else
        filterString +=
          ' OR disclosure_level:"' + disclosure_level[i].value + '"';
    }

    let file_type = document.querySelectorAll("input[name=file_type]:checked");
    for (let i = 0; i < file_type.length; i++) {
      if (i === 0) filterString += '&fq=file_type:"' + file_type[i].value + '"';
      else filterString += ' OR file_type:"' + file_type[i].value + '"';
    }
    //Market Place

    let competitors_covered = document.querySelectorAll(
      "input[name=competitors_covered]:checked"
    );
    for (let i = 0; i < competitors_covered.length; i++) {
      if (i === 0)
        filterString +=
          '&fq=competitors_covered:"' + competitors_covered[i].value + '"';
      else
        filterString +=
          ' OR competitors_covered:"' + competitors_covered[i].value + '"';
    }

    let research_vendors = document.querySelectorAll(
      "input[name=research_vendors]:checked"
    );
    for (let i = 0; i < research_vendors.length; i++) {
      if (i === 0)
        filterString +=
          '&fq=research_vendors:"' + research_vendors[i].value + '"';
      else
        filterString +=
          ' OR research_vendors:"' + research_vendors[i].value + '"';
    }

    let doc_source = document.querySelectorAll(
      "input[name=doc_source]:checked"
    );
    for (let i = 0; i < doc_source.length; i++) {
      if (i == 0)
        filterString += '&fq=doc_source:"' + doc_source[i].value + '"';
      else filterString += ' OR doc_source:"' + doc_source[i].value + '"';
    }

    let industry_segment = document.querySelectorAll(
      "input[name=industry_segment]:checked"
    );
    for (let i = 0; i < industry_segment.length; i++) {
      if (i == 0)
        filterString +=
          '&fq=industry_segment:"' + industry_segment[i].value + '"';
      else
        filterString +=
          ' OR industry_segment:"' + industry_segment[i].value + '"';
    }

    let technology_partners = document.querySelectorAll(
      "input[name=technology_partners]:checked"
    );
    for (let i = 0; i < technology_partners.length; i++) {
      if (i === 0)
        filterString +=
          '&fq=technology_partners:"' + technology_partners[i].value + '"';
      else
        filterString +=
          ' OR technology_partners:"' + technology_partners[i].value + '"';
    }

    let system_integrators = document.querySelectorAll(
      "input[name=system_integrators]:checked"
    );
    for (let i = 0; i < system_integrators.length; i++) {
      if (i === 0)
        filterString +=
          '&fq=system_integrators:"' + system_integrators[i].value + '"';
      else
        filterString +=
          ' OR system_integrators:"' + system_integrators[i].value + '"';
    }
    let product_line = document.querySelectorAll(
      "input[name=product_line]:checked"
    );
    for (let i = 0; i < product_line.length; i++) {
      if (i === 0)
        filterString += '&fq=product_line:"' + product_line[i].value + '"';
      else filterString += ' OR product_line:"' + product_line[i].value + '"';
    }

    let asset_creator = document.querySelectorAll(
      "input[name=asset_creator]:checked"
    );
    for (let i = 0; i < asset_creator.length; i++) {
      if (i === 0)
        filterString += '&fq=asset_creator:"' + asset_creator[i].value + '"';
      else filterString += ' OR asset_creator:"' + asset_creator[i].value + '"';
    }

    let isCreatedDateChanged =
      document.querySelectorAll("input[name=createdToDate]")[0] !== undefined
        ? document.querySelectorAll("input[name=createdToDate]")[0].value
        : [];
    if (isCreatedDateChanged == "true") {
      const s_dt = this.formatDate(
        new Date(
          document.getElementsByClassName("creation_date_start")[0].value
        )
      );
      const e_dt = this.formatDate(
        new Date(document.getElementsByClassName("creation_date_end")[0].value)
      );
      filterString += "&fq=creation_date:[" + s_dt + " TO " + e_dt + "]";
    }
    let isPublishedDateChanged =
      document.querySelectorAll("input[name=publishedToDate]")[0] !== undefined
        ? document.querySelectorAll("input[name=publishedToDate]")[0].value
        : [];
    if (isPublishedDateChanged == "true") {
      const s_dt = this.formatDate(
        new Date(
          document.getElementsByClassName("published_date_start")[0].value
        )
      );
      const e_dt = this.formatDate(
        new Date(document.getElementsByClassName("published_date_end")[0].value)
      );
      filterString += "&fq=publish_date:[" + s_dt + " TO " + e_dt + "]";
    }
    let isModifiedDateChanged =
      document.querySelectorAll("input[name=modifiedToDate]")[0] !== undefined
        ? document.querySelectorAll("input[name=modifiedToDate]")[0].value
        : [];
    if (isModifiedDateChanged == "true") {
      const s_dt = this.formatDate(
        new Date(
          document.getElementsByClassName("modified_date_start")[0].value
        )
      );
      const e_dt = this.formatDate(
        new Date(document.getElementsByClassName("modified_date_end")[0].value)
      );
      filterString += "&fq=modified_date:[" + s_dt + " TO " + e_dt + "]";
    }
    // Gold Collateral
    let gold_collateral = document.querySelectorAll(
      "input[name=gold_collateral]:checked"
    );
    for (let i = 0; i < gold_collateral.length; i++) {
      if (i === 0) {
        filterString += '&fq=isgoldcollateral:"true"';
      }
    }
    //NDA Documents Only
    let isNDAOnly = document.querySelectorAll("input[name=NDAOnly]:checked");
    for (let i = 0; i < isNDAOnly.length; i++) {
      if (i === 0) {
        var filterStrings =
          '&fq=nda:"True"&fq=ndamails_raw:*' + Cookies.get("mail") + "*";
        filterString += filterStrings;
      }
    }

    if (document.getElementById("archived_result").checked) {
      filterString = filterString.replace("&fq=-isarchived:True", "");
    }
      this.setState({ filterString });
    if (isUpdateAndApply) {
      this.props.ApplyFilter(filterString, this.state.SelectedFilters);
    }
    return filterString;
  };

  ApplyFilters = () => {
    this.showHideDiv("divMsg");
    this.props.ApplyFilter(this.state.filterString, this.state.SelectedFilters);
    this.TrackingService.LogMasterClick(Cookies.get("empnumber"));
    console.log(
      this.state.filterString,
      this.state.SelectedFilters,
      "this.state.filterString, this.state.SelectedFilters"
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

  static getDerivedStateFromProps(props, state) {
    if (props.filterData.length !== state.filterData.length) {
      const filterData = cloneDeep(props.filterData);
      return {
        filterData: filterData,
        Disclosure: uniq(map(filterData, "disclosure_level")),
        file_type: uniq(map(filterData, "file_type")),
        rating: uniq(map(filterData, "rating")),
        doc_source: uniq(map(filterData, "doc_source")),
        industry_segment: uniq(
          map(filterData, "industry_segment").filter((x) => x !== undefined)
        ),
        language_s: uniq(
          map(filterData, "language_s").filter((x) => x !== undefined)
        ),
        competitors_covered: uniq(
          map(filterData, "competitors_covered").filter((x) => x !== undefined)
        ),
        research_vendors: uniq(
          map(filterData, "research_vendors").filter((x) => x !== undefined)
        ),
        system_integrators: uniq(
          map(filterData, "system_integrators").filter((x) => x !== undefined)
        ),
        technology_partners: uniq(
          map(filterData, "technology_partners").filter((x) => x !== undefined)
        ),
        recommended_by: uniq(
          map(filterData, "recommended_by").filter((x) => x !== undefined)
        ),
        alligned_initiative: uniq(
          map(filterData, "alligned_initiative").filter((x) => x !== undefined)
        ),
        service_type:
          uniq(
            map(filterData, "service_type").filter((x) => x !== undefined)
          ) || [],
        region: uniq(
          filterData
            .filter((x) => x.region !== undefined)
            .map((x) => x.region.join())
        ),
        country: uniq(
          filterData
            .filter((x) => x.country !== undefined)
            .map((x) => x.country.join())
        )
          .join()
          .split(","),
        product_line: uniq(
          map(filterData, "product_line").filter((x) => x !== undefined)
        ),
        asset_creator: uniq(
          map(filterData, "asset_creator").filter((x) => x !== undefined)
        ),
        creation_date: uniq(
          map(filterData, "creation_date").filter((x) => x !== undefined)
        ),
        modified_date: uniq(
          map(filterData, "modified_date").filter((x) => x !== undefined)
        ),
        publish_date: uniq(
          map(filterData, "publish_date").filter((x) => x !== undefined)
        ),
      };
    }
    return null;
  }

  // ndamails_raw: uniq(
  //   map(filterData, "ndamails_raw").filter((x) => x !== undefined)
  // ),

  ClearAllFilters = () => {
    var SelectedFilters = {
      SelectedLanguages: "",
      SelectedCountries: "",
      SelectedDocSource: "",
      SelectedDisclouser: "",
      SelectedFileTypes: "",
      SelectedCreatedDates: "",
      SelectedPublishedDates: "",
      SelectedModifiedDates: "",
      SelectedShowArchivedDocs: false,
      SelectedResearchVendors: "",
      SelectedCompetitors: "",
      SelectedIndustrySegment: "",
    };
    this.setState({ SelectedFilters });
    const { ResetFilters } = this.props;
    ResetFilters();
  };

  // OnLanguagesChange = (SelectedLanguages) => {
  //   this.setState((prevState) => ({
  //     SelectedFilters: { ...prevState.SelectedFilters, SelectedLanguages },
  //   }));
  // };

  // OnDocSourceChange = (SelectedDocSource) => {
  //   this.setState((prevState) => ({
  //     SelectedFilters: { ...prevState.SelectedFilters, SelectedDocSource },
  //   }));
  // };
  // OnIndustrySegmentChange = (SelectedIndustrySegment) => {
  //   this.setState((prevState) => ({
  //     SelectedFilters: {
  //       ...prevState.SelectedFilters,
  //       SelectedIndustrySegment,
  //     },
  //   }));
  // };
  OnLanguagesChange = (SelectedLanguages) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedLanguages = SelectedLanguages;
    this.setState({ SelectedFilters });
  };
  OnDocSourceChange = (SelectedDocSource) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedDocSource = SelectedDocSource;
    this.setState({ SelectedFilters });
  };
  OnIndustrySegmentChange = (SelectedIndustrySegment) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedIndustrySegment = SelectedIndustrySegment;
    this.setState({ SelectedFilters });
  };
  OnDisclouserChange = (SelectedDisclouser) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedDisclouser = SelectedDisclouser;
    this.setState({ SelectedFilters });
  };

  onFileTypeChange = (SelectedFileTypes) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedFileTypes = SelectedFileTypes;
    this.setState({ SelectedFilters });
  };

  OnGeoChange = (SelectedCountries) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedCountries = SelectedCountries;
    this.setState({ SelectedFilters });
  };

  OnCreatedDateChange = (SelectedCreatedDates) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedCreatedDates = SelectedCreatedDates;
    this.setState({ SelectedFilters });
  };

  onPublishDateChange = (SelectedPublishedDates) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedPublishedDates = SelectedPublishedDates;
    this.setState({ SelectedFilters });
  };

  onModifiedDateChange = (SelectedModifiedDates) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedModifiedDates = SelectedModifiedDates;
    this.setState({ SelectedFilters });
  };

  OnServiceTypeChange = (SelectedServiceType) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedServiceType = SelectedServiceType;
    this.setState({ SelectedFilters });
  };

  OnRecommendedByChange = (SelectedOnRecommendedBy) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedOnRecommendedBy = SelectedOnRecommendedBy;
    this.setState({ SelectedFilters });
  };

  OnInitiativeChange = (SelectedInitiative) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedInitiative = SelectedInitiative;
    this.setState({ SelectedFilters });
  };

  onGoldCollateralChange = (SelectedGoldCollateral) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedGoldCollateral = SelectedGoldCollateral;
    if (SelectedGoldCollateral && SelectedFilters.IsNDAOnly) {
      document.getElementById("NDAOnly").checked = false;
      SelectedFilters.IsNDAOnly = false;
    }

    this.setState({ SelectedFilters });
  };

  onNDAChange = (IsNDAOnly) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.IsNDAOnly = IsNDAOnly;
    if (IsNDAOnly && SelectedFilters.SelectedGoldCollateral) {
      document.getElementById("goldchk").checked = false;
      SelectedFilters.SelectedGoldCollateral = false;
    }
    this.setState({ SelectedFilters });
  };

  onArchivedCheckChange = (SelectedShowArchivedDocs) => {
    document.getElementById("archived_result").checked =
      SelectedShowArchivedDocs;
    this.setState((prevState) => {
      const SelectedFilters = prevState.SelectedFilters;
      SelectedFilters.SelectedShowArchivedDocs = SelectedShowArchivedDocs;
      return { SelectedFilters: SelectedFilters };
    });
  };
  onResearchVendorsBoxChange = (SelectedResearchVendors) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedResearchVendors = SelectedResearchVendors;
    this.setState({ SelectedFilters });
  };
  onCompetitorsBoxChange = (SelectedCompetitors) => {
    let SelectedFilters = this.state.SelectedFilters;
    SelectedFilters.SelectedCompetitors = SelectedCompetitors;
    this.setState({ SelectedFilters });
  };
  render() {
    const Mail = Cookies.get("mail");
    const mainDivStyle = {
      boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 10px 0px",
      display: "none",
    };
    return (
      <div id="divMsg" style={mainDivStyle}>
        <>
          <div className="row ">
            <div className="col-10 ml-3 mt-2 pr-0">
              <div className="pl-1 pr-1 col-12 filter-heading">
                Filter By
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="applytitle">
                      Click to apply selected filters
                    </Tooltip>
                  }
                >
                  <i
                    className="far fa-check-circle btn btn-sm btn-success mt-1 mb-1 mr-0 float-right pointer hw"
                    onClick={this.ApplyFilters}
                  />
                </OverlayTrigger>
                {this.state.filterString !== "&fq=-isarchived:True" && (
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="resettitle">
                        Click to reset selected filters
                      </Tooltip>
                    }
                  >
                    <i
                      className="far fa-times-circle btn btn-sm btn-danger mt-1 mb-1 mr-1 float-right pointer hw"
                      style={{
                        backgroundColor: "red",
                        border: "none",
                        color: "white",
                      }}
                      onClick={this.ClearAllFilters}
                    />
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div
              className="mt-1 mb-1 mr-3 pl-1 close-btn-fliter"
              onClick={() => this.showHideDiv("divMsg")}
              translate="no"
            >
              x
            </div>
            {/* <p onClick={()=>this.selectAll}>Select All</p> */}
          </div>

          <div className="row ">
            <div className="col-12 ml-0 mt-2 accordion" id="sidefilters">
              <div className="pl-1 pr-1 col-12 clear-all-filters">
                <GoldCollateral
                  UpdateFilters={this.UpdateFilters}
                  onGoldCollateralChange={this.onGoldCollateralChange}
                  value={this.state.SelectedFilters.SelectedGoldCollateral}
                  filter={this.props.filters}
                  ref={this.ClearGoldCollateral}
                />
                {this.state.ndamails_raw > 0 && (
                  // this.state.ndamails_raw !== "" &&
                  // this.state.ndamails_raw.find(
                  //   (x) => x.indexOf(Mail) !== -1
                  // ) && (
                  <NDAOnly
                    UpdateFilters={this.UpdateFilters}
                    onNDAChange={this.onNDAChange}
                    ref={this.ClearNDAOnly}
                  />
                )}
                <ArchivedDocs
                  UpdateFilters={this.UpdateFilters}
                  onArchivedCheckChange={this.onArchivedCheckChange}
                  value={this.state.SelectedFilters.SelectedShowArchivedDocs}
                  ref={this.ClearArchivedDocs}
                />
                {this.state.geoData && this.state.geoData.length > 0 && (
                  <LOCALIZATION
                    geoData={this.state.geoData || []}
                    language_s={this.state.language_s || []}
                    region={this.state.region || []}
                    country={this.state.country || []}
                    UpdateFilters={this.UpdateFilters}
                    ref={this.ClearLocalization}
                    OnLanguagesChange={this.OnLanguagesChange}
                    OnGeoChange={this.OnGeoChange}
                  />
                )}
                <BusinessGroup
                  recommended_by={this.state.recommended_by || []}
                  alligned_initiative={this.state.alligned_initiative || []}
                  service_type={this.state.service_type || []}
                  UpdateFilters={this.UpdateFilters}
                  ref={this.ClearBusinessGroup}
                  OnServiceTypeChange={this.OnServiceTypeChange}
                  OnRecommendedByChange={this.OnRecommendedByChange}
                  OnInitiativeChange={this.OnInitiativeChange}
                />
                <DocumentFilters
                  Disclosure={this.state.Disclosure || []}
                  file_type={this.state.file_type || []}
                  rating={this.state.rating}
                  UpdateFilters={this.UpdateFilters}
                  OnDisclouserChange={this.OnDisclouserChange}
                  onFileTypeChange={this.onFileTypeChange}
                  ref={this.ClearDocumentFilters}
                />
                <MarketPlace
                  competitors_covered={this.state.competitors_covered || []}
                  research_vendors={this.state.research_vendors || []}
                  UpdateFilters={this.UpdateFilters}
                  onResearchVendorsBoxChange={this.onResearchVendorsBoxChange}
                  onCompetitorsBoxChange={this.onCompetitorsBoxChange}
                  ref={this.ClearMarketPlace}
                />
                <DateRange
                  creation_date={this.state.creation_date || []}
                  modified_date={this.state.modified_date || []}
                  publish_date={this.state.publish_date || []}
                  UpdateFilters={this.UpdateFilters}
                  OnCreatedDateChange={this.OnCreatedDateChange}
                  ref={this.ClearDates}
                  onPublishDateChange={this.onPublishDateChange}
                  onModifiedDateChange={this.onModifiedDateChange}
                />
                {this.state.asset_creator &&
                  this.state.asset_creator.length > 0 && (
                    <AssetCreator
                      asset_creator={this.state.asset_creator}
                      UpdateFilters={this.UpdateFilters}
                    />
                  )}
                <DataSource
                  doc_source={this.state.doc_source || []}
                  UpdateFilters={this.UpdateFilters}
                  OnDocSourceChange={this.OnDocSourceChange}
                  ref={this.ClearDocSources}
                />
                <StrategicAlliances
                  system_integrators={this.state.system_integrators || []}
                  technology_partners={this.state.technology_partners || []}
                  UpdateFilters={this.UpdateFilters}
                />
              </div>
              {this.state.industry_segment !== undefined &&
                this.state.industry_segment.length !== 0 && (
                  <IndustrySegment
                    industry_segment={this.state.industry_segment || []}
                    UpdateFilters={this.UpdateFilters}
                    OnIndustrySegmentChange={this.OnIndustrySegmentChange}
                    ref={this.ClearIndustrySegment}
                  />
                )}
            </div>
          </div>
        </>
      </div>
    );
  }
}

export default Filters;
