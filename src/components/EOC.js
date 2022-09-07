import React, { Fragment } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-js-pagination";
import { toast } from "react-toastify";

import TrackingService from "./TrackingService";
import URLConfig from "./URLConfig";
import Documents from "./Common/Documents";

class EOC extends React.Component {
  constructor(props) {
    super(props);
    this.componentRef = React.createRef();
    this.state = {
      initialServiceList: [],
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      searchTerm: "",
      searchMoreKey: "",
      showMore: false,
      applySearch: false,
      ServiceList: [],
      DigitalLearnerLookup: [
        "digital learning",
        "remote training",
        "elearning",
        "self-paced training",
        "training subscription",
        "subscription",
        "digital transformation",
        "technology training",
        "technical education",
        "technical training",
      ],
      VisualRemoteGuidanceLookUp: [
        "remote collaboration",
        "collaboration",
        "wearable",
        "visually-guided",
        "wearable learning",
        "remote support",
        "digital transformation",
        "remote working",
      ],
      getData: this.getData.bind(this),
    };
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;
    this.setState({ searchMoreKey: searchValue });
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
    const URLServices =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=id%2ctitle%2cfile%2curl%2cdisclosure_level%2crating%2cdoc_source%2cdocument_type_level3,modified_date,file_type,description,go_to_market,service_name,service_type,isarchived&fq=scope:%22Service%20Capsule%22%20AND%20document_type_level3:%22" +
      encodeURIComponent(this.state.popupHeader) +
      "%22%20AND%20document_type_details:%22Education%20and%20MoC%2220AND%20document_type:%22Services%22&indent=on&q=" +
      this.state.searchTerm +
      "&rows=10&start=" +
      begin +
      "&rows=500&wt=json" +
      URLConfig.GetUserRoles() +
      this.state.filters +
      (searchMoreKey ? `&fq=file:%22${searchMoreKey}%22` : "");
    axios.get(URLServices).then((res) => {
      if (res.data.response.docs) {
        this.setState({
          ServiceList: res.data.response,
          InitialServiceData: res.data.response,
          totalItemsCount: res.data.response.numFound,
        });
      }
    });
    this.setState({ activePage: pageNumber });
    this.componentRef.current.scrollTop = { top: 0, behavior: "smooth" };
  };

  static getDerivedStateFromProps(props, state) {
    if (props.searchTerm !== state.searchTerm) {
      state.getData(props.searchTerm, props.filters);
      return {
        searchTerm: props.searchTerm,
        initialServiceList: [],
        filters: props.filters,
      };
    }
    return null;
  }

  getData = (searchTerm, filters) => {
    const URLServices =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=id,title,file,url,disclosure_level,rating,file_type,doc_source,language_s,competitors_covered,research_vendors,system_integrators,technology_partners,product_line,business_segment,region,country,creation_date,modified_date,publish_date,asset_creator,practice,recommended_by,alligned_initiative,service_type,document_type_level3,description,go_to_market,service_name,service_type&fq=scope:%22Service%20Capsule%22%20AND%20document_type_details:%22Education%20and%20MoC%22%20AND%20document_type:%22Services%22&group.field=document_type_level3&group.limit=10&group.mincount=1&group=true&indent=on&q=" +
      searchTerm +
      "&rows=500&wt=json&fq=-file_type:%22msg%22" +
      URLConfig.GetUserRoles() +
      filters;
    axios.get(URLServices).then((res) => {
      if (res.data.grouped.document_type_level3) {
        this.setState({
          initialServiceList: res.data.grouped.document_type_level3.groups,
          TotalCount: res.data.grouped.document_type_level3.matches,
          searchTerm: searchTerm,
        });
      }
    });
  };

  ShowMore = (categoryName) => {
    const URLServices =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=id%2ctitle%2cfile%2curl%2cdisclosure_level%2crating%2cdoc_source%2cdocument_type_level3,modified_date,file_type,description,go_to_market,service_name,service_type,isarchived&fq=scope:%22Service%20Capsule%22%20AND%20document_type_level3:%22" +
      encodeURIComponent(categoryName) +
      "%22%20AND%20document_type_details:%22Education%20and%20MoC%2220AND%20document_type:%22Services%22&indent=on&q=" +
      this.state.searchTerm +
      "&rows=10&start=0&rows=500&wt=json&fq=-file_type:%22msg%22" +
      URLConfig.GetUserRoles() +
      this.state.filters;
    axios.get(URLServices).then((res) => {
      if (res.data.response) {
        this.setState({
          ServiceList: res.data.response,
          popupHeader: categoryName,
          activePage: 1,
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
    return (
      <>
        {this.state.initialServiceList !== undefined &&
          this.state.initialServiceList.length > 0 && (
            <div
              className={
                "card-header" +
                (this.props.highlight === "Education and MoC"
                  ? " subcatbg"
                  : "")
              }
            >
              <h5
                className={
                  "mb-0 in-flex" +
                  (this.props.highlight === "Education and MoC"
                    ? " subcatbg"
                    : "")
                }
              >
                <button
                  className="btn btn-link btn-full collapsed pt-1 pb-1"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  data-target="#EOC"
                  aria-controls="EOC"
                >
                  Education and MoC
                </button>
                <span className="circle-count-sub">
                  <span className="count-inner-sub">
                    {this.state.TotalCount}
                  </span>
                </span>
              </h5>
            </div>
          )}
        {this.state.initialServiceList !== undefined &&
          this.state.initialServiceList.length > 0 && (
            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#EOC"
              aria-expanded="false"
              id="EOC"
              data-parent="#accordionServiceCategories"
            >
              <div className="card-body ml-2 mr-2 mt-2">
                <div className="accordion" id="accordionEOCCategories">
                  {this.state.initialServiceList.map((list, index) => (
                    <Fragment key={index}>
                      <div className="card-header">
                        <h5 className="mb-0 in-flex">
                          <button
                            className="btn btn-link btn-full collapsed pt-1 pb-1"
                            type="button"
                            data-toggle="collapse"
                            aria-expanded="false"
                            data-target={"#EOCCategory" + index}
                            aria-controls="EOCCategory"
                          >
                            {list.groupValue}
                          </button>
                          <span className="circle-count-sub mr-3">
                            <span className="count-inner-sub">
                              {list.doclist.numFound}
                            </span>
                          </span>
                        </h5>
                      </div>
                      <div
                        className="collapse"
                        aria-labelledby="headingHPSE"
                        data-parent="#accordionEOCCategories"
                        aria-expanded="false"
                        id={"EOCCategory" + index}
                      >
                        <div className="left-border card-body">
                          <Documents
                            docList={list.doclist.docs}
                            size={4}
                            logDocClick={this.logDocClick}
                            showPreview={
                              list.groupValue === "Technical Training"
                                ? false
                                : true
                            }
                          />
                          {list.doclist.docs.length > 4 && (
                            <div className="col-12 pt-2 pb-4 more-wrapper mb-1 ml-1">
                              <i className="fas fa-arrow-right float-right mr-3 pointer"></i>
                              <b
                                className="float-right mr-1 pointer"
                                data-toggle="modal"
                                data-target="#EOCMore"
                                onClick={() => {
                                  this.ShowMore(list.groupValue);
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
                  {/*Add Static Sections here */}
                  {this.state.searchTerm !== "" &&
                    this.state.DigitalLearnerLookup.indexOf(
                      this.state.searchTerm
                    ) !== -1 && (
                      <>
                        <div className="card-header">
                          <h5 className="mb-0 in-flex">
                            <button
                              className="btn btn-link btn-full collapsed pt-1 pb-1"
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              data-target={"#EOCCategory1111"}
                              aria-controls="EOCCategory"
                            >
                              Digital Learner
                            </button>
                            <span className="circle-count-sub mr-3">
                              <span className="count-inner-sub">1</span>
                            </span>
                          </h5>
                        </div>
                        <div
                          className="collapse"
                          aria-labelledby="headingHPSE"
                          data-parent="#accordionEOCCategories"
                          aria-expanded="false"
                          id={"EOCCategory1111"}
                        >
                          <div className="left-border card-body">
                            <div className="col-12 p-0 mb-1 ml-1 row border-bottom">
                              <div className="col-1 pr-0 pt-1">
                                {
                                  <a className="fa fa-external-link-square-alt xl-file"></a>
                                }
                              </div>
                              <div className="col-11 p-1 row">
                                <div className="col-9">
                                  {/* <a href={ "/docview?u=" +  CryptoJS.AES.encrypt(JSON.stringify([{"url":doclist.url}]), URLConfig.getEncKey()).toString()} target="_blank">{doclist.file}</a>  */}
                                  <a
                                    href="https://education.hpe.com/ww/en/training/marketing/digital-learner-landing.html"
                                    target="_blank"
                                  >
                                    Digital Learner Landing
                                  </a>
                                  {/* <div className="doc_source"><span className="sourcetxt">Source:</span></div> */}
                                  <div className="col-12 p-0">
                                    <p className="badge-doctype"></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  {this.state.searchTerm !== "" &&
                    this.state.VisualRemoteGuidanceLookUp.indexOf(
                      this.state.searchTerm
                    ) !== -1 && (
                      <>
                        <div className="card-header">
                          <h5 className="mb-0 in-flex">
                            <button
                              className="btn btn-link btn-full collapsed pt-1 pb-1"
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              data-target={"#EOCCategory1111"}
                              aria-controls="EOCCategory"
                            >
                              Collaboration & Remote Tools
                            </button>
                            <span className="circle-count-sub mr-3">
                              <span className="count-inner-sub">1</span>
                            </span>
                          </h5>
                        </div>
                        <div
                          className="collapse"
                          aria-labelledby="headingHPSE"
                          data-parent="#accordionEOCCategories"
                          aria-expanded="false"
                          id={"EOCCategory1111"}
                        >
                          <div className="left-border card-body">
                            <div className="col-12 p-0 mb-1 ml-1 row border-bottom">
                              <div className="col-1 pr-0 pt-1">
                                {
                                  <a className="fa fa-external-link-square-alt xl-file"></a>
                                }
                              </div>
                              <div className="col-11 p-1 row">
                                <div className="col-9">
                                  {/* <a href={ "/docview?u=" +  CryptoJS.AES.encrypt(JSON.stringify([{"url":doclist.url}]), URLConfig.getEncKey()).toString()} target="_blank">{doclist.file}</a>  */}
                                  <a
                                    href="https://www.myroom.hpe.com/VRG"
                                    target="_blank"
                                  >
                                    VRG
                                  </a>
                                  {/* <div className="doc_source"><span className="sourcetxt">Source:</span></div> */}
                                  <div className="col-12 p-0">
                                    <p className="badge-doctype"></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          )}
        {this.state.showMore && (
          <Modal show={this.state.showMore} onHide={this.handleCloseMore}>
            <Modal.Header>
              <Modal.Title>{this.state.popupHeader}</Modal.Title>
              <button type="button" translate="no" onClick={() => this.handleCloseMore()}
                                class="close"
                                data-dismiss="modal">
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
              {this.state.ServiceList.docs &&
              this.state.ServiceList.docs.length > 0 ? (
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
                    docList={this.state.ServiceList.docs}
                    logDocClick={this.logDocClick}
                    showPreview={
                      this.state.popupHeader === "Technical Training"
                        ? false
                        : true
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
      </>
    );
  }
}
export default EOC;
