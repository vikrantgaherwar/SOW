import React, { Fragment } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-js-pagination";

import Insight from "./Insight";
import URLConfig from "./URLConfig";
import Documents from "./Common/Documents";
import TrackingService from "./TrackingService";
import logo from "../img/subheader/ref-cap-icon.png";
import _ from "lodash";
import PeopleCapsule from "./PeopleCapsule/index";
import ReUseTemplates from "./ReuseTemplates/index";
class ReUseList extends React.Component {
  constructor(props) {
    super(props);
    this.componentRef = React.createRef();
    this.state = {
      results: "",
      moreData: null,
      popupHeader: "",
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      filters: "",
      searchKey: "",
      searchMoreKey: "",
      showMore: false,
      isReuse: false,
      reusebg: "#f9f9f9",
      highlightreuse: false,
      rsubcategoryhighlight: "",
      peopleCapsuleData: "",
      TemplatesData: [],
    };
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;
    this.setState({ searchMoreKey: searchValue });
  };
  surveyClose = () => {
    const { isClose } = this.props;
    isClose(false);
  };

  resetResults = () => {
    this.setState({ searchMoreKey: "" }, () => this.handlePageChange(1));
  };

  fireSearch = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      this.handlePageChange(1);
    }
  };

  logDocClick = (documentDetails) => {
    if (!this.TrackingService) {
      this.TrackingService = new TrackingService();
    }
    this.TrackingService.OpenLink(Cookies.get("empnumber"), documentDetails);
  };

  componentDidMount = () => {
    const filters = this.props.filters !== null ? this.props.filters : "";
    this.setState({ filters });
    this.findreuserelevancy();
    this.getPeopleCapsuleData(this.props.searchTerm);
    this.getTemplatesData(this.props.searchTerm);
  };

  componentDidUpdate = (prevProps) => {
    if (!_.isEqual(prevProps.relevancyScore, this.props.relevancyScore)) {
      this.findreuserelevancy();
    }
    if (!_.isEqual(prevProps.searchTerm, this.props.searchTerm)) {
      this.getPeopleCapsuleData(this.props.searchTerm);
      this.getTemplatesData(this.props.searchTerm);
    }
    if (!_.isEqual(prevProps.filters, this.props.filters)) {
      this.getTemplatesData(this.props.searchTerm);
    }
  };
  getPeopleCapsuleData = (searchTerm) => {
    let url =
      "https://delta.app.hpecorp.net:8983/solr/rmc/select?fq=skill_type:%22Experience%22&indent=on&json.facet={categories:{type%20:%20terms,field%20:%20cluster,facet:{SUM%20:%20%22sum(total)%22}}}&q=" +
      searchTerm +
      "&rows=1&wt=json";

    axios.get(url).then((res) => {
      if (res) {
        this.setState({
          peopleCapsuleData: res.data,
          peopleCapsuleDataLength: res.data.response.docs.length,
        });
      }
    });
  };
  getTemplatesData = async (searchTerm) => {
    let URL =
      "https://hpedelta.com:8983/solr/sharepoint_index/select?facet.pivot=document_type,document_type_details,document_type_level3,document_type_level4&facet=on&fl=file&fq=document_type:%22Templates%22%20AND%20scope:%22Reuse%22&indent=on&q=" +
      searchTerm +
      "&rows=1&wt=json" +
      (this.state.filters.indexOf('&fq=nda:"True"') === -1
        ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
        : "") +
      this.state.filters;
    const res = await axios.get(URL);
    if (res.data.response.numFound > 0) {
      this.setState({
        TemplatesData:
          res?.data?.facet_counts?.facet_pivot[
            "document_type,document_type_details,document_type_level3,document_type_level4"
          ][0]?.pivot,
        TotalCount: res?.data?.response?.numFound,
      });
    } else {
      this.setState({
        TemplatesData: [],
        TotalCount: res?.data?.response?.numFound,
      });
    }
  };
  findreuserelevancy = () => {
    let arr = [
      this.props.relevancyScore.guidesMaxScore,
      this.props.relevancyScore.presentationsMaxScore,
      this.props.relevancyScore.servicesMaxScore,
      // this.props.relevancyScore.multimediaMaxScore,
      this.props.relevancyScore.trainingsMaxScore,
      this.props.relevancyScore.otherservicesMaxScore,
      this.props.relevancyScore.reuseMaxScore,
      this.props.relevancyScore.templatesMaxScore,
    ];
    let result = _.maxBy(arr, "score");
    this.setState({ highlightreuse: result.item }, () =>
      this.highlightreuseCategory(this.state.highlightreuse)
    );
  };

  highlightreuseCategory = (categoryname) => {
    switch (categoryname) {
      case "Reuse":
        this.setState({
          isReuse: true,
          reusebg: "#0d5265",
          rsubcategoryhighlight:
            this.props.relevancyScore.reuseMaxScore.subitem,
        });
        break;
      case "Guides":
        this.setState({
          isReuse: false,
          reusebg: "#f9f9f9",
          rsubcategoryhighlight: "",
        });
        break;
      case "Presentation":
        this.setState({
          isReuse: false,
          reusebg: "#f9f9f9",
          rsubcategoryhighlight: "",
        });
        break;
      case "Services":
        this.setState({
          isReuse: false,
          reusebg: "#f9f9f9",
          rsubcategoryhighlight: "",
        });
        break;
      case "Multimedia":
        this.setState({
          isReuse: false,
          reusebg: "#f9f9f9",
          rsubcategoryhighlight: "",
        });
        break;
      case "Other Services":
        this.setState({
          isReuse: false,
          reusebg: "#f9f9f9",
          rsubcategoryhighlight: "",
        });
        break;
      case "Internal Trainings":
        this.setState({
          isReuse: false,
          reusebg: "#f9f9f9",
          rsubcategoryhighlight: "",
        });
        break;
      default:
        this.setState({
          isReuse: false,
          reusebg: "#f9f9f9",
          rsubcategoryhighlight: "",
        });
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.filters !== undefined &&
      props.filters.length !== state.filters.length
    ) {
      return { filters: props.filters };
    }
    return null;
  }

  formatDate = (date) => {
    if (date === "" || date === undefined) {
      return "";
    }
    const dt = date.split("T");

    return dt[0];
  };

  handlePageChange = (pageNumber) => {
    this.fetchMore(pageNumber);
    this.setState({ activePage: pageNumber });
    this.componentRef.current.scrollTop = 0;
  };

  fetchMore = (
    pageNumber = this.state.activePage,
    searchMoreKey = this.state.searchMoreKey
  ) => {
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const searchKey = document.getElementsByClassName(
      "react-autosuggest__input"
    )[0].value;
    const url =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=id,title,isgoldcollateral,score,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,isarchived&fq=scope:%22Reuse%22 AND document_type:%22" +
      this.state.popupHeader +
      "%22&indent=on&q=" +
      searchKey.replace(/[#?&@]/g, " ") +
      "&rows=10&start=" +
      begin +
      "&wt=json" +
      (this.state.filters.indexOf('&fq=nda:"True"') === -1
        ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
        : "") +
      this.state.filters +
      (searchMoreKey ? `&fq=file:%22${searchMoreKey}%22` : "");
    axios.get(url).then((res) => {
      if (res.data.response.docs) {
        this.setState({
          moreData: res.data.response,
          InitialData: res.data.response,
          totalItemsCount: res.data.response.numFound,
        });
      }
    });
    this.setState({ activePage: pageNumber });
    this.componentRef.current.scrollTop = 0;
  };

  ShowMore = (docs) => {
    const groupValue = docs.groupValue;
    this.setState({
      popupHeader: groupValue,
      moreData: docs.doclist,
      activePage: 1,
    });
    const searckKey = document.getElementsByClassName(
      "react-autosuggest__input"
    )[0].value;
    const url =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=" +
      "id,title,isgoldcollateral,score,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,isarchived&fq=scope:%22Reuse%22 AND document_type:%22" +
      groupValue +
      "%22&indent=on&q=" +
      searckKey.replace(/[#?&@]/g, " ") +
      "&rows=10&start=0&wt=json" +
      (this.state.filters.indexOf('&fq=nda:"True"') === -1
        ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles()
        : "") +
      this.state.filters;
    axios.get(url).then((res) => {
      if (res.data.response.docs) {
        this.setState({
          popupHeader: groupValue,
          moreData: res.data.response,
          InitialData: res.data.response,
          totalItemsCount: res.data.response.numFound,
          showMore: true,
          searchMoreKey: "",
        });
      }
    });
  };

  handleCloseMore = () => {
    this.setState({ showMore: false });
  };

  render() {
    const reUseList = this.props.docs.slice(0, 8);
    const ISPursuit =
      Cookies.get("roles")?.indexOf("Pursuit") != -1 ? true : false;
    return (
      <div
        className="capsule-container col-6 col-4-no-margins occupy-height"
        onChange={this.surveyClose}
        onClick={this.surveyClose}
      >
        <div className="capsules mr-1">
          <div id="sectionheader" className="col-12" align="center">
            <img className="img-fluid" src={logo} width="35px"></img>
            <span className="pl-3">REFERENCE (Re-Use)</span>
            <span className="float-right">
              <a
                className="auto-cursor"
                // href="#"
                data-toggle="tooltip"
                title="Results include historic “Customer Opportunity Related” documents with top 4 search results. Relevant for users from Pursuit and Delivery Select “More” for additional documents and details."
              >
                <i className="far fa-question-circle tootipicon pr-2 pt-1"></i>
              </a>
            </span>
          </div>
          <div id="searchresults" className="searchresults">
            <div className="accordion" id="accordionReUse">
              {this.state.TemplatesData.length > 0 && (
                <ReUseTemplates
                  searchTerm={this.props.searchTerm}
                  TemplatesData={this.state.TemplatesData}
                  TotalCount={this.state.TotalCount}
                  filters={this.props.filters}
                  relevancyScore={this.props.relevancyScore}
                />
              )}
              {reUseList.map((list, index) => (
                <Fragment key={list.groupValue}>
                  {process.env.REACT_APP_ENV === "PROD" &&
                    list.groupValue !== "Templates" &&
                    list.groupValue !== "Github" && (
                      <>
                        <div
                          className={
                            "card-header" +
                            (this.state.isReuse &&
                            list.groupValue ===
                              this.props.relevancyScore.reuseMaxScore.subitem
                              ? " catgeorybg"
                              : " ")
                          }
                          id={"heading" + index}
                        >
                          <h5 className="mb-0 in-flex">
                            <button
                              className={
                                "btn btn-link btn-full " +
                                (this.state.isReuse &&
                                list.groupValue ===
                                  this.props.relevancyScore.reuseMaxScore
                                    .subitem
                                  ? " fontwhite"
                                  : "") +
                                (index === 0 ? " collapsed" : " collapsed")
                              }
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              data-target={"#reuseservice" + index}
                              aria-controls={"reuseservice" + index}
                            >
                              {list.groupValue}
                            </button>
                            <span className="circle-count">
                              <span className="count-inner">
                                {list.doclist.numFound}
                              </span>
                            </span>
                          </h5>
                        </div>

                        <div
                          className="left-border ml-1 collapse"
                          aria-labelledby={"heading" + index}
                          data-parent="#accordionReUse"
                          aria-expanded="false"
                          id={"reuseservice" + index}
                        >
                          <div className="card-body ml-3">
                            <Documents
                              docList={list.doclist.docs}
                              size={4}
                              logDocClick={this.logDocClick}
                              pursuitView={
                                ISPursuit &&
                                list.groupValue === "Statement of Work (SoW)"
                              }
                            />
                            {list.doclist.docs.length > 4 && (
                              <div className="col-12 pt-2 pb-4 more-wrapper">
                                <i className="fas fa-arrow-right float-right mr-3 pointer" />
                                <b
                                  className="float-right mr-1 pointer"
                                  onClick={() => {
                                    this.ShowMore(list);
                                  }}
                                >
                                  More
                                </b>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  {process.env.REACT_APP_ENV === "UAT" &&
                    list.groupValue !== "Templates" && (
                      <>
                        <div
                          className={
                            "card-header" +
                            (this.state.isReuse &&
                            list.groupValue ===
                              this.props.relevancyScore.reuseMaxScore.subitem
                              ? " catgeorybg"
                              : " ")
                          }
                          id={"heading" + index}
                        >
                          <h5 className="mb-0 in-flex">
                            <button
                              className={
                                "btn btn-link btn-full " +
                                (this.state.isReuse &&
                                list.groupValue ===
                                  this.props.relevancyScore.reuseMaxScore
                                    .subitem
                                  ? " fontwhite"
                                  : "") +
                                (index === 0 ? " collapsed" : " collapsed")
                              }
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              data-target={"#reuseservice" + index}
                              aria-controls={"reuseservice" + index}
                            >
                              {list.groupValue}
                            </button>
                            <span className="circle-count">
                              <span className="count-inner">
                                {list.doclist.numFound}
                              </span>
                            </span>
                          </h5>
                        </div>

                        <div
                          className="left-border ml-1 collapse"
                          aria-labelledby={"heading" + index}
                          data-parent="#accordionReUse"
                          aria-expanded="false"
                          id={"reuseservice" + index}
                        >
                          <div className="card-body ml-3">
                            <Documents
                              docList={list.doclist.docs}
                              size={4}
                              logDocClick={this.logDocClick}
                              pursuitView={
                                ISPursuit &&
                                list.groupValue === "Statement of Work (SoW)"
                              }
                            />
                            {list.doclist.docs.length > 4 && (
                              <div className="col-12 pt-2 pb-4 more-wrapper">
                                <i className="fas fa-arrow-right float-right mr-3 pointer" />
                                <b
                                  className="float-right mr-1 pointer"
                                  onClick={() => {
                                    this.ShowMore(list);
                                  }}
                                >
                                  More
                                </b>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                </Fragment>
              ))}
              {(this.props.selectedFilters &&
                this.props.selectedFilters.IsNDAOnly === true) ||
              (this.props.selectedFilters &&
                this.props.selectedFilters.SelectedGoldCollateral)
                ? null
                : this.props.insightData && (
                    <Insight
                      insightData={this.props.insightData}
                      setActiveFilterAndValue={
                        this.props.setActiveFilterAndValue
                      }
                      searchTerm={this.props.searchTerm}
                      filters={this.props.filters}
                      // onCustomerSubmit={this.props.onCustomerSubmit}
                    />
                  )}

              {(this.props.selectedFilters &&
                this.props.selectedFilters.IsNDAOnly === true) ||
              (this.props.selectedFilters &&
                this.props.selectedFilters.SelectedGoldCollateral)
                ? null
                : this.state.peopleCapsuleDataLength > 0 && (
                    <PeopleCapsule
                      peopleCapsuleData={this.state.peopleCapsuleData}
                      searchTerm={this.props.searchTerm}
                    />
                  )}

              <div className="card p-2" onClick={this.surveyClose}>
                &nbsp;
              </div>
            </div>
          </div>
        </div>
        {this.state.showMore && (
          <Modal show={this.state.showMore} onHide={this.handleCloseMore}>
            <Modal.Header>
              <Modal.Title>{this.state.popupHeader}</Modal.Title>
              <button
                type="button"
                translate="no"
                onClick={() => this.handleCloseMore()}
                class="close"
                data-dismiss="modal"
              >
                ×
              </button>
            </Modal.Header>
            <Modal.Body ref={this.componentRef} bsPrefix="document-data-modal">
              <div className="row col-12">
                <div className="col-6">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    value={this.state.searchMoreKey}
                    onChange={this.handleSearchValueChange}
                    onKeyUp={this.fireSearch}
                    placeholder="Search File Name"
                  />
                </div>
                <span title="Click to reset current search.">
                  <i
                    className="fas fa-sync-alt reset-btn"
                    onClick={() => this.resetResults()}
                  />
                </span>
              </div>
              {this.state.moreData.docs &&
              this.state.moreData.docs.length > 0 ? (
                <>
                  <div className="text-center">
                    <Pagination
                      prevPageText="<"
                      nextPageText=">"
                      firstPageText="<<"
                      lastPageText=">>"
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.itemsCountPerPage}
                      totalItemsCount={this.state.totalItemsCount}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                    />
                  </div>

                  <Documents
                    docList={this.state.moreData.docs}
                    logDocClick={this.logDocClick}
                    pursuitView={
                      ISPursuit &&
                      this.state.popupHeader === "Statement of Work (SoW)"
                    }
                  />

                  <div className="text-center">
                    <Pagination
                      prevPageText="<"
                      nextPageText=">"
                      firstPageText="<<"
                      lastPageText=">>"
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.itemsCountPerPage}
                      totalItemsCount={this.state.totalItemsCount}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center">No Matching Data</div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => this.handleCloseMore()}
              >
                Close
              </button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
  }
}
export default ReUseList;
