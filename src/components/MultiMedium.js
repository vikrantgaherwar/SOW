import React, { Fragment } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-js-pagination";

import URLConfig from "./URLConfig";
import Documents from "./Common/Documents";
import TrackingService from "./TrackingService";
import _ from "lodash";

class MultiMedium extends React.Component {
  constructor(props) {
    super(props);
    this.componentRef = React.createRef();
    this.state = {
      initialList: [],
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      searchTerm: "",
      applySearch: false,
      MultiMediumList: [],
      filters: "",
      searchKey: "",
      searchMoreKey: "",
      showMore: false,
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
    searchMoreKey = this.state.searchMoreKey
  ) => {
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const url =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=id,file,url,rating,disclosure_level,isgoldcollateral,title,id,doc_source,modified_date,file_type,isarchived&fq=document_type:%22Multimedia%22%20AND%20document_type_details:%22" +
      this.state.popupHeader +
      "%22&indent=on&q=" +
      this.state.searchKey +
      "&rows=10&start=" +
      begin +
      "&wt=json"
      + (this.state.filters.indexOf("&fq=nda:\"True\"") === -1 ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles() : "") +
      this.state.filters +
      (searchMoreKey ? `&fq=file:%22${searchMoreKey}%22` : "");
    axios.get(url).then((res) => {
      if (res.data.response.docs) {
        this.setState({
          MultiMediumList: res.data.response,
          InitialData: res.data.response,
          totalItemsCount: res.data.response.numFound,
        });
      }
    });
    this.setState({ activePage: pageNumber });
    this.componentRef.current.scrollTop = { top: 0, behavior: "smooth" };
  };

  componentDidMount = () => {
    const data = this.props.data !== null ? this.props.data : [];
    const filters = this.props.filters !== null ? this.props.filters : "";
    const searchKey = document
      .getElementsByClassName("react-autosuggest__input")[0]
      .value.replace(/[#?&@]/g, " ");

    this.setState({
      MultiMediumList: [],
      initialList: data.groups,
      totalItemsCount: data.length,
      TotalCount: data.matches,
      searchKey: searchKey,
      filters: filters,
    });
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.data !== this.props.data) {
      const data = this.props.data !== null ? this.props.data : [];
      const filters = this.props.filters !== null ? this.props.filters : "";
      const searchKey = document
        .getElementsByClassName("react-autosuggest__input")[0]
        .value.replace(/[#?&@]/g, " ");
      this.setState({
        MultiMediumList: [],
        initialList: data.groups,
        totalItemsCount: data.length,
        TotalCount: data.matches,
        searchKey: searchKey,
        filters: filters,
      });
    }
  };

  ShowMore = (categoryName) => {
    const URLMultiMedium =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=id,file,url,rating,disclosure_level,title,isgoldcollateral,id,doc_source,modified_date,file_type,isarchived&fq=document_type:%22Multimedia%22%20AND%20document_type_details:%22" +
      categoryName +
      "%22&indent=on&q=" +
      this.state.searchKey +
      "&rows=10&start=0&wt=json"
      + (this.state.filters.indexOf("&fq=nda:\"True\"") === -1 ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles() : "") +
      this.state.filters;
    axios.get(URLMultiMedium).then((res) => {
      if (res.data.response) {
        this.setState({
          MultiMediumList: res.data.response,
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
        {this.state.initialList !== undefined &&
          this.state.initialList.length > 0 && (
            <>
              <div
                className={
                  "card-header" + (this.props.isMultimedia ? " catgeorybg" : "")
                }
              >
                <h5 className="mb-0 in-flex">
                  <button
                    className={
                      "btn btn-link btn-full collapsed" +
                      (this.props.isMultimedia ? " fontwhite" : "")
                    }
                    type="button"
                    data-toggle="collapse"
                    aria-expanded="false"
                    data-target="#MultiMedium"
                    aria-controls="MultiMedium"
                  >
                    Multimedia
                  </button>
                  <span className="circle-count">
                    <span className="count-inner">{this.state.TotalCount}</span>
                  </span>
                </h5>
              </div>

              <div
                className="collapse"
                aria-labelledby="headingHPSE"
                data-parent="#MultiMedium"
                aria-expanded="false"
                id="MultiMedium"
                data-parent="#accordionExample"
              >
                <div className="card-body ml-2 mr-2 mt-2">
                  <div className="accordion" id="accordionMultiMediumCategories">
                    {this.state.initialList.map((list, index) => (
                      <Fragment key={list.groupValue}>
                        <div
                          className={
                            "card-header" +
                            (this.props.isMultimedia === true &&
                            list.groupValue === this.props.subcategoryhighlight
                              ? " subcatbg"
                              : " ")
                          }
                        >
                          <h5
                            className={
                              "mb-0 in-flex" +
                              (this.props.isMultimedia === true &&
                              list.groupValue ===
                                this.props.subcategoryhighlight
                                ? " subcatbg"
                                : " ")
                            }
                          >
                            <button
                              className="btn btn-link btn-full collapsed pt-1 pb-1"
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              data-target={"#multiMediumCategory" + index}
                              aria-controls="multiMediumCategory"
                            >
                              {list.groupValue}
                            </button>
                            <span className="circle-count-sub">
                              <span className="count-inner-sub">
                                {list.doclist.numFound}
                              </span>
                            </span>
                          </h5>
                        </div>

                        <div
                          className="collapse"
                          aria-labelledby="headingHPSE"
                          data-parent="#accordionMultiMediumCategories"
                          aria-expanded="false"
                          id={"multiMediumCategory" + index}
                        >
                          <div className="left-border card-body">
                            <Documents
                              docList={list.doclist.docs}
                              size={4}
                              logDocClick={this.logDocClick}
                            />
                            {list.doclist.docs.length > 4 && (
                              <div className="col-12 pt-2 pb-4 more-wrapper mb-1 ml-1">
                                <i className="fas fa-arrow-right float-right mr-3 pointer" />
                                <b
                                  className="float-right mr-1 pointer"
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
                  </div>
                </div>
              </div>
            </>
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
              {this.state.MultiMediumList.docs &&
              this.state.MultiMediumList.docs.length > 0 ? (
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
                    docList={this.state.MultiMediumList.docs}
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
      </>
    );
  }
}
export default MultiMedium;
