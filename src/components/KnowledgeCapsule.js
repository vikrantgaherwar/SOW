import React, { Fragment } from "react";
import URLConfig from "./URLConfig";
import Cookies from "js-cookie";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

import logo from "../img/subheader/knw-cap-icon.png";
import TrackingService from "./TrackingService";
import SKUList from "./SKUList";
import Pagination from "react-js-pagination";
import HPEList from "./HPEList";
import Guides from "./Guides";
import Presentations from "./Presentations";
import Services from "./Services";
import POCCentral from "./POCCentral";
import Multimedia from "./Multimedia";
import MultiMedium from "./MultiMedium";
import Documents from "./Common/Documents";
import _ from "lodash";
import InternalTrainings from "./InternalTrainings";
class KnowledgeCapsule extends React.Component {
  constructor(props) {
    super(props);
    this.componentRef = React.createRef();
    this.state = {
      results: "",
      popupHeader: "",
      moreData: null,
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      filters: "",
      searchKey: "",
      showMore: false,
      highlight: "",
      isGuides: false,
      isPresentation: false,
      isServices: false,
      isMultimedia: false,
      isReuse: false,
      isInternalTraining: false,
      isOtherServices: false,
      isMultimedia: false,
      subcategoryhighlight: "",
    };
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;
    this.setState({ searchKey: searchValue });
  };
  surveyClose = () => {
    const { isClose } = this.props;
    isClose(false);
  };
  resetResults = () => {
    this.setState({ searchKey: "" }, () => this.handlePageChange(1));
  };

  fireSearch = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      this.handlePageChange(1);
    }
  };

  componentDidMount = () => {
    this.resizeAllCapsules();
    const filters = this.props.filters !== null ? this.props.filters : "";
    this.setState({ filters });
    this.findrelevancy();
  };

  findrelevancy = () => {
    let arr = [
      this.props.relevancyScore.guidesMaxScore,
      this.props.relevancyScore.presentationsMaxScore,
      this.props.relevancyScore.servicesMaxScore,
      this.props.relevancyScore.trainingsMaxScore,
      this.props.relevancyScore.otherservicesMaxScore,
      this.props.relevancyScore.reuseMaxScore,
      this.props.relevancyScore.multimediaMaxScore,
    ];
    let result = _.maxBy(arr, "score");
    this.setState({ highlight: result.item }, () =>
      this.highlightCategory(this.state.highlight)
    );
  };

  componentDidUpdate = (prevProps) => {
    this.resizeAllCapsules();
    setTimeout(() => {
      this.resizeAllCapsules();
    }, 3000);
    if (!_.isEqual(prevProps.relevancyScore, this.props.relevancyScore)) {
      this.findrelevancy();
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

  highlightCategory = (categoryname) => {
    switch (categoryname) {
      case "Guides":
        this.setState({
          isGuides: true,
          isPresentation: false,
          isServices: false,
          isMultimedia: false,
          isReuse: false,
          isOtherServices: false,
          isInternalTraining: false,
          subcategoryhighlight:
            this.props.relevancyScore.guidesMaxScore.subitem,
        });
        break;
      case "Presentation":
        this.setState({
          isPresentation: true,
          isServices: false,
          isMultimedia: false,
          isReuse: false,
          isGuides: false,
          isOtherServices: false,
          isInternalTraining: false,
          subcategoryhighlight:
            this.props.relevancyScore.presentationsMaxScore.subitem,
        });
        break;
      case "Services":
        this.setState({
          isServices: true,
          isMultimedia: false,
          isReuse: false,
          isGuides: false,
          isPresentation: false,
          isOtherServices: false,
          isInternalTraining: false,
          subcategoryhighlight:
            this.props.relevancyScore.servicesMaxScore.subitem,
        });
        break;
      case "MultiMedia":
        this.setState({
          isMultimedia: true,
          isReuse: false,
          isGuides: false,
          isPresentation: false,
          isServices: false,
          isOtherServices: false,
          isInternalTraining: false,
          subcategoryhighlight:
            this.props.relevancyScore.multimediaMaxScore.subitem,
        });
        break;
      case "Reuse":
        this.setState({
          isReuse: true,
          isGuides: false,
          isPresentation: false,
          isServices: false,
          isMultimedia: false,
          isOtherServices: false,
          isInternalTraining: false,
          subcategoryhighlight: this.props.relevancyScore.reuseMaxScore.subitem,
        });
        break;
      case "Other Services":
        this.setState({
          isOtherServices: true,
          isReuse: false,
          isGuides: false,
          isPresentation: false,
          isServices: false,
          isMultimedia: false,
          isInternalTraining: false,
          subcategoryhighlight:
            this.props.relevancyScore.otherservicesMaxScore.subitem,
        });
        break;
      case "Internal Trainings":
        this.setState({
          isOtherServices: false,
          isReuse: false,
          isGuides: false,
          isPresentation: false,
          isServices: false,
          isMultimedia: false,
          isInternalTraining: true,
          subcategoryhighlight:
            this.props.relevancyScore.trainingsMaxScore.subitem,
        });
        break;
      default:
        this.setState({
          isOtherServices: false,
          isReuse: false,
          isGuides: false,
          isPresentation: false,
          isServices: false,
          isMultimedia: false,
          isInternalTraining: false,
          subcategoryhighlight: "",
        });
    }
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

  logDocClick = (documentDetails) => {
    if (!this.TrackingService) {
      this.TrackingService = new TrackingService();
    }
    this.TrackingService.OpenLink(Cookies.get("empnumber"), documentDetails);
  };

  formatDate = (date) => {
    if (date === "" || date === undefined) {
      return "";
    }
    var dt = date.split("T");
    return dt[0];
  };

  handlePageChange = (pageNumber) => {
    this.fetchMore(pageNumber);
    this.setState({ activePage: pageNumber });
    this.componentRef.current.scrollTop = 0;
  };

  fetchMore = (
    pageNumber = this.state.activePage,
    searchKey = this.state.searchKey
  ) => {
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const searchWord = document
      .getElementsByClassName("react-autosuggest__input")[0]
      .value.replace(/[#?&@]/g, " ");
    const url =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=id,file%2curl%2crating%2cdisclosure_level%2cdoc_source%2cmodified_date,file_type,isarchived&fq=scope:%22Service Capsule%22 AND document_type:%22" +
      this.state.popupHeader +
      "%22&indent=on&q=" +
      searchWord +
      "&rows=10&start=" +
      begin +
      "&wt=json" +
      URLConfig.GetUserRoles() +
      this.state.filters +
      (searchKey ? `&fq=file:%22${searchKey}%22` : "");
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
    const searchWord = document
      .getElementsByClassName("react-autosuggest__input")[0]
      .value.replace(/[#?&@]/g, " ");
    const url =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=id,file%2curl%2crating%2cdisclosure_level%2cdoc_source%2cmodified_date,file_type,isarchived&fq=scope:%22Service Capsule%22 AND document_type:%22" +
      groupValue +
      "%22&indent=on&q=" +
      searchWord +
      "&rows=10&start=0&wt=json" +
      URLConfig.GetUserRoles() +
      this.state.filters;
    axios.get(url).then((res) => {
      if (res.data.response.docs) {
        this.setState({
          popupHeader: groupValue,
          moreData: res.data.response,
          InitialData: res.data.response,
          activePage: 1,
          totalItemsCount: res.data.response.numFound,
          showMore: true,
          searchKey: "",
        });
      }
    });
  };

  handleCloseMore = () => {
    this.setState({ showMore: false });
  };

  render() {
    const documentsList = this.props.docs;
    let hpseList =
      this.props.hpse !== null ? this.props.hpse.slice(0, 30) : null;

    if (
      (this.props.selectedFilters &&
        this.props.selectedFilters.SelectedGoldCollateral) ||
      (this.props.selectedFilters &&
        this.props.selectedFilters.IsNDAOnly === true)
    ) {
      hpseList = null;
    }
    const skuList =
      this.props.SKUData !== null ? this.props.SKUData.slice(0, 1000) : null;
    const GuidesData =
      this.props.GuidesData != null ? this.props.GuidesData : null;
    const PresentationsData =
      this.props.Presentations != null ? this.props.Presentations : null;
    const ServicesData =
      this.props.ServicesData != null ? this.props.ServicesData : null;
    const MultimediaData =
      this.props.MultimediaData !== null ||
      this.props.MultimediaData !== undefined
        ? this.props.MultimediaData
        : null;
    const POCList = this.props.POCList !== null ? this.props.POCList : null;
    const TrainingsData =
      this.props.TrainingsData != null ? this.props.TrainingsData : null;
    const filters = this.props.filters !== null ? this.props.filters : null;

    return (
      <>
        {((documentsList && documentsList.length > 0) ||
          (GuidesData && GuidesData.matches > 0) ||
          (TrainingsData && TrainingsData.matches > 0) ||
          (PresentationsData && PresentationsData.matches > 0) ||
          (ServicesData && ServicesData.matches > 0) ||
          (MultimediaData && MultimediaData.matches > 0) ||
          (hpseList && hpseList.length > 0) ||
          (skuList && skuList.length > 0) ||
          (POCList && POCList.length > 0)) && (
          <div
            className="capsule-container col-6 col-4-no-margins occupy-height"
            onChange={this.surveyClose}
            onClick={this.surveyClose}
          >
            <div className="capsules mr-1">
              <div id="sectionheader" className="col-12" align="center">
                <img className="img-fluid" src={logo} width="35px" />
                <span className="pl-3">KNOWLEDGE</span>
                <span className="float-right">
                  <a
                    className="auto-cursor"
                    // href="#"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Results include “Knowledge” related documents with top 4 search results. Relevant for users from Sales, Pursuit and Practices. Select “More” for additional documents and details."
                  >
                    <i className="far fa-question-circle tootipicon pr-2 pt-1" />
                  </a>
                </span>
              </div>
              <div id="searchresults" className="searchresults">
                <div className="accordion" id="accordionExample">
                  {skuList !== null && skuList.length > 0 && (
                    <SKUList data={skuList} />
                  )}
                  <Guides
                    data={GuidesData}
                    filters={filters}
                    isGuides={this.state.isGuides}
                    subcategoryhighlight={this.state.subcategoryhighlight}
                  />
                  <Presentations
                    data={PresentationsData}
                    filters={filters}
                    isPresentation={this.state.isPresentation}
                    subcategoryhighlight={this.state.subcategoryhighlight}
                  />
                  <Services
                    data={ServicesData}
                    filters={filters}
                    isServices={this.state.isServices}
                    subcategoryhighlight={this.state.subcategoryhighlight}
                  />
                  <POCCentral
                    data={POCList}
                    searchTerm={this.props.searchTerm}
                  />
                  {/* {MultimediaData !== undefined && (
                    <Multimedia
                      data={MultimediaData}
                      filters={filters}
                      isMultimedia={this.state.isMultimedia}
                    />
                  )} */}
                  {MultimediaData !== undefined && (
                    <MultiMedium
                      data={MultimediaData}
                      filters={filters}
                      isMultimedia={this.state.isMultimedia}
                      subcategoryhighlight={this.state.subcategoryhighlight}
                    />
                  )}

                  <InternalTrainings
                    data={TrainingsData}
                    filters={filters}
                    isInternalTraining={this.state.isInternalTraining}
                    subcategoryhighlight={this.state.subcategoryhighlight}
                  />
                  {documentsList.map((list, index) => (
                    <Fragment key={list.groupValue}>
                      <div
                        className={
                          "card-header" +
                          (this.state.isOtherServices &&
                          list.groupValue === this.state.subcategoryhighlight
                            ? " catgeorybg"
                            : "")
                        }
                        id={"heading" + index}
                      >
                        <h5 className="mb-0 in-flex">
                          <button
                            className={
                              "btn btn-link btn-full collapsed" +
                              (this.state.isOtherServices &&
                              list.groupValue ===
                                this.state.subcategoryhighlight
                                ? " fontwhite"
                                : "")
                            }
                            type="button"
                            data-toggle="collapse"
                            aria-expanded="false"
                            data-target={"#service" + index}
                            aria-controls={"service" + index}
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
                        data-parent="#accordionExample"
                        aria-expanded="false"
                        id={"service" + index}
                      >
                        <div className="card-body ml-2">
                          <Documents
                            docList={list.doclist.docs}
                            size={4}
                            logDocClick={this.logDocClick}
                            showPreview={
                              list.groupValue === "Demo" ? false : true
                            }
                          />
                          {list.doclist.docs.length > 4 && (
                            <div className="col-12 pt-2 pb-4 more-wrapper">
                              <i className="fas fa-arrow-right float-right mr-3 pointer" />
                              <b
                                className="float-right mr-1 pointer"
                                data-toggle="modal"
                                data-target="#moreDataModal"
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
                    </Fragment>
                  ))}

                  {hpseList !== null && hpseList.length > 0 && (
                    <HPEList data={hpseList} />
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
                <Modal.Body
                  ref={this.componentRef}
                  bsPrefix="document-data-modal"
                >
                  <div className="row col-12">
                    <div className="col-6">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        value={this.state.searchKey}
                        onChange={this.handleSearchValueChange}
                        onKeyUp={this.fireSearch}
                        placeholder="Search File Name"
                      />
                    </div>
                    <span title="Click to reset current search.">
                      <i
                        className="fas fa-sync-alt reset-btn"
                        onClick={() => this.resetResults()}
                      ></i>
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
        )}
      </>
    );
  }
}
export default KnowledgeCapsule;
