import React, { Component, Fragment } from "react";
import axios from "axios";
import Documents from "../Common/Documents";
import _, { map } from "lodash";
import TrackingService from "../TrackingService";
import Cookies from "js-cookie";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-js-pagination";
import URLConfig from "../URLConfig";
class ReUseTemplates extends Component {
  constructor(props) {
    super(props);
    this.reuseTemplatesRef = React.createRef();
    this.state = {
      InitialDocumentList: [],
      DocumentList: [],
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      applySearch: false,
      filters: "",
      searchKey: "",
      searchMoreKey: "",
      showMore: false,
      popupHeader: "",
      leveldetails: "",
    };
  }

  componentDidMount = () => {
    const data =
      this.props.TemplatesData !== null ? this.props.TemplatesData : [];
    const filters = this.props.filters !== null ? this.props.filters : "";
    const searchKey = document
      .getElementsByClassName("react-autosuggest__input")[0]
      .value.replace(/[#?&@]/g, " ");

    this.setState({
      initialList: this.props.TemplatesData,

      TotalCount: this.props.TemplatesData.length,
      searchKey: searchKey,
      filters: filters,
    });
    this.findreuserelevancy();
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.data !== this.props.data) {
      const data = this.props.data !== null ? this.props.data : [];
      const filters = this.props.filters !== null ? this.props.filters : "";
      const searchKey = document
        .getElementsByClassName("react-autosuggest__input")[0]
        .value.replace(/[#?&@]/g, " ");
      this.setState({
        initialList: this.props.TemplatesData,
        TotalCount: this.props.TemplatesData.length,
        searchKey: searchKey,
        filters: filters,
      });
    }
    if (!_.isEqual(prevProps.relevancyScore, this.props.relevancyScore)) {
      this.findreuserelevancy();
    }
    if (!_.isEqual(prevProps.filters, this.props.filters)) {
      this.loadDocumentsHandler(
        this.state.leveldetails,
        this.state.popupHeader
      );
    }
  };
  loadDocumentsHandler = async (fq, level) => {
    let url =
      "https://hpedelta.com:8983/solr/sharepoint_index/select?fq=" +
      fq +
      ":%22" +
      level +
      "%22&indent=on&q=*:*&rows=25&wt=json&fl=*,score" +
      this.props.filters;

    const res = await axios.get(url);
    if (res.data) {
      this.setState(
        {
          DocumentList: res.data.response.docs,
          InitialDocumentList: res.data.response.docs,
          totalItemsCount: res.data.response.docs.length,
        },
        () => {
          this.Paginate(this.state.InitialDocumentList);
        }
      );
    }
  };

  Paginate = (computedata) => {
    const data = computedata.slice(
      (this.state.activePage - 1) * this.state.itemsCountPerPage,
      (this.state.activePage - 1) * this.state.itemsCountPerPage +
        this.state.itemsCountPerPage
    );
    this.setState({ DocumentList: data });
  };
  logDocClick = (documentDetails) => {
    if (!this.TrackingService) {
      this.TrackingService = new TrackingService();
    }
    this.TrackingService.OpenLink(Cookies.get("empnumber"), documentDetails);
  };
  findreuserelevancy = () => {
    let arr = [
      this.props.relevancyScore.guidesMaxScore,
      this.props.relevancyScore.presentationsMaxScore,
      this.props.relevancyScore.servicesMaxScore,
      this.props.relevancyScore.trainingsMaxScore,
      this.props.relevancyScore.otherservicesMaxScore,
      this.props.relevancyScore.reuseMaxScore,
      this.props.relevancyScore.templatesMaxScore,
    ];
    let result = _.maxBy(arr, "score");
    if (
      result.item === "Reuse" &&
      this.props.relevancyScore.templatesMaxScore.score ===
        this.props.relevancyScore.reuseMaxScore.score
    ) {
      result = this.props.relevancyScore.templatesMaxScore;
    }
    this.setState({ highlightreuse: result.item }, () =>
      this.highlightreuseCategory(this.state.highlightreuse)
    );
  };
  highlightreuseCategory = (categoryname) => {
    categoryname === "Templates"
      ? this.setState({
          isTemplates: true,
        })
      : this.setState({
          isTemplates: false,
        });
  };
  ShowMore = (e, fq, categoryName) => {
    this.setState({
      showMore: true,
      popupHeader: categoryName,
      leveldetails: fq,
    });
    this.loadDocumentsHandler(fq, categoryName);
  };
  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
    this.reuseTemplatesRef.current.scrollTop = { top: 0, behavior: "smooth" };
    this.loadDocumentsHandler(this.state.leveldetails, this.state.popupHeader);
  };
  handleCloseMore = () => {
    this.setState({ showMore: false, activePage: 1, searchMoreKey: "" });
  };
  handleSearchValueChange = (e) => {
    const searchValue = e.target.value;
    this.setState({ searchMoreKey: searchValue }, () => {
      this.doSearch(e, searchValue);
    });
  };
  doSearch = (e, search) => {
    if (search) {
      let searchcomputedData = this.state.InitialDocumentList.filter((item) =>
        item.file.toLowerCase().includes(search.toLowerCase())
      );
      this.setState({
        DocumentList: searchcomputedData,
        totalItemsCount: searchcomputedData.length,
      });
    } else {
      this.loadDocumentsHandler(
        this.state.leveldetails,
        this.state.popupHeader
      );
    }
  };
  // remove whitespace,comas,special characters between words in a string
  rw = (str) => {
    str = str.replace(/ +/g, "");
    str = str.replace(/,/g, "-");
    str = str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "_");
    return str;
  };
  render() {
    return (
      <>
        <div
          className={
            "card-header" + (this.state.isTemplates ? " catgeorybg" : " ")
          }
          id="headingTemplatesReuse"
        >
          <h5 className="mb-0 in-flex">
            <button
              className={
                "btn btn-link btn-full collapsed" +
                (this.state.isTemplates ? " fontwhite" : "")
              }
              type="button"
              data-toggle="collapse"
              aria-expanded="false"
              data-target="#reuseTemplatesReuse"
              aria-controls="reuseTemplatesReuse"
            >
              {/* Level 1 */}
              Templates
            </button>
            <span className="circle-count">
              <span className="count-inner">
                {this.props.TotalCount ? this.props.TotalCount : "0"}
              </span>
            </span>
          </h5>
        </div>
        <div
          className="collapse"
          aria-labelledby={"headingTemplatesReuse"}
          data-parent="#accordionReUse"
          aria-expanded="false"
          id={"reuseTemplatesReuse"}
        >
          {/* Level 2 starts*/}
          <div className="card-body ml-2 mr-2 mt-2">
            <div className="accordion" id="accordionTemplatesReuseStages">
              {map(this.props.TemplatesData, (stage, index) => {
                return (
                  <Fragment
                    key={"level1templates" + this.rw(stage.value) + index}
                  >
                    <div
                      className={
                        "card-header" +
                        (this.state.isTemplates &&
                        stage.value ===
                          this.props.relevancyScore.templatesMaxScore.subitem
                          ? " subcatbg"
                          : " ")
                      }
                      id={"stage1" + this.rw(stage.value)}
                    >
                      <h5 className="mb-0 in-flex">
                        <button
                          type="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls={`TemplatesReuseStage${
                            this.rw(stage.value) + index
                          }`}
                          className="btn btn-link btn-full collapsed pt-1 pb-1"
                          data-target={`#TemplatesReuseStage${
                            this.rw(stage.value) + index
                          }`}
                          onClick={() => {
                            this.loadDocumentsHandler(
                              "document_type_details",
                              stage.value
                            );
                          }}
                        >
                          {stage.value}
                        </button>
                        <span className="circle-count-sub">
                          <span className="count-inner-sub">{stage.count}</span>
                        </span>
                      </h5>
                    </div>
                    <div
                      className="collapse"
                      aria-labelledby={"stage1" + this.rw(stage.value)}
                      data-parent="#accordionTemplatesReuseStages"
                      aria-expanded="false"
                      id={`TemplatesReuseStage${this.rw(stage.value) + index}`}
                    >
                      {/* 
                        1. checking whether level 2  has further levels or not
                        2. If No further levels , need to load the Level2 Docs
                        3. If have further levels load those menus                                    
                        */}
                      {stage.pivot?.length > 0 ? (
                        <div className="card-body ml-2">
                          {/* Level3 starts */}
                          <div
                            className="accordion"
                            id={
                              "accordionTemplatesReuseStages2" +
                              this.rw(stage.value)
                            }
                          >
                            {map(
                              this.props.TemplatesData[index].pivot,
                              (stage2, index2) => {
                                return (
                                  <Fragment
                                    key={
                                      "level12emplates" +
                                      this.rw(stage2.value) +
                                      index2
                                    }
                                  >
                                    <div
                                      className="card-header"
                                      id={"stage2" + this.rw(stage2.value)}
                                    >
                                      <h5 className="mb-0 in-flex ">
                                        <button
                                          type="button"
                                          data-toggle="collapse"
                                          aria-expanded="false"
                                          aria-controls={`TemplatesReuseStage2${
                                            this.rw(stage2.value) + index2
                                          }`}
                                          className="btn btn-link btn-full collapsed pt-1 pb-1"
                                          data-target={`#TemplatesReuseStage2${
                                            this.rw(stage2.value) + index2
                                          }`}
                                          onClick={() =>
                                            this.loadDocumentsHandler(
                                              "document_type_level3",
                                              stage2.value
                                            )
                                          }
                                        >
                                          {stage2.value}
                                        </button>
                                        <span className="circle-count-sub">
                                          <span className="count-inner-sub">
                                            {stage2.count}
                                          </span>
                                        </span>
                                      </h5>
                                    </div>
                                    <div
                                      className="collapse"
                                      aria-labelledby={
                                        "stage2" + this.rw(stage2.value)
                                      }
                                      data-parent={
                                        "#accordionTemplatesReuseStages2" +
                                        this.rw(stage.value)
                                      }
                                      aria-expanded="false"
                                      id={`TemplatesReuseStage2${
                                        this.rw(stage2.value) + index2
                                      }`}
                                    >
                                      {/* 
                                      1. checking whether level 3  has further levels or not
                                      2. If No further levels , need to load the Level3 Docs
                                      3. If have further levels load those menus                                    
                                      */}
                                      {this.props.TemplatesData[index]?.pivot[
                                        index2
                                      ]?.pivot?.length > 0 ? (
                                        <>
                                          <div className="card-body ml-3 ">
                                            {/* Level 4 Starts */}

                                            <div
                                              className="accordion"
                                              id={
                                                "accordionTemplatesReuseStages3" +
                                                this.rw(stage2.value)
                                              }
                                            >
                                              {map(
                                                this.props.TemplatesData[index]
                                                  .pivot[index2].pivot,
                                                (stage3, index3) => {
                                                  return (
                                                    <Fragment
                                                      key={
                                                        "level3templates" +
                                                        this.rw(stage3.value) +
                                                        index3
                                                      }
                                                    >
                                                      <div
                                                        className="card-header"
                                                        id={
                                                          "stage3" +
                                                          this.rw(stage3.value)
                                                        }
                                                      >
                                                        <h5 className="mb-0 in-flex ">
                                                          <button
                                                            type="button"
                                                            data-toggle="collapse"
                                                            aria-expanded="false"
                                                            aria-controls={`TemplatesReuseStage3${
                                                              this.rw(
                                                                stage3.value
                                                              ) + index3
                                                            }`}
                                                            className="btn btn-link btn-full collapsed pt-1 pb-1"
                                                            data-target={`#TemplatesReuseStage3${
                                                              this.rw(
                                                                stage3.value
                                                              ) + index3
                                                            }`}
                                                            onClick={() =>
                                                              this.loadDocumentsHandler(
                                                                "document_type_level4",
                                                                stage3.value
                                                              )
                                                            }
                                                          >
                                                            {stage3.value}
                                                          </button>
                                                          <span className="circle-count-sub">
                                                            <span className="count-inner-sub">
                                                              {stage3.count}
                                                            </span>
                                                          </span>
                                                        </h5>
                                                      </div>
                                                      <div
                                                        className="collapse"
                                                        aria-labelledby={
                                                          "stage3" +
                                                          this.rw(stage3.value)
                                                        }
                                                        data-parent={
                                                          "#accordionTemplatesReuseStages3" +
                                                          this.rw(stage2.value)
                                                        }
                                                        aria-expanded="false"
                                                        id={`TemplatesReuseStage3${
                                                          this.rw(
                                                            stage3.value
                                                          ) + index3
                                                        }`}
                                                      >
                                                        {this.state
                                                          .DocumentList && (
                                                          <div className="card-body left-border ml-2">
                                                            <>
                                                              <Documents
                                                                docList={
                                                                  this.state
                                                                    .InitialDocumentList
                                                                }
                                                                size={4}
                                                                logDocClick={
                                                                  this
                                                                    .logDocClick
                                                                }
                                                              />
                                                              {this.state
                                                                .InitialDocumentList
                                                                .length > 4 && (
                                                                <div className="col-12 pt-2 pb-4 more-wrapper mb-1 ml-1">
                                                                  <i className="fas fa-arrow-right float-right mr-3 pointer" />
                                                                  <b
                                                                    className="float-right mr-1 pointer"
                                                                    onClick={(
                                                                      e
                                                                    ) => {
                                                                      this.ShowMore(
                                                                        e,
                                                                        "document_type_level4",
                                                                        stage3.value
                                                                      );
                                                                    }}
                                                                  >
                                                                    More
                                                                  </b>
                                                                </div>
                                                              )}
                                                            </>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </Fragment>
                                                  );
                                                }
                                              )}
                                            </div>

                                            {/* Level 4 Ends */}
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="card-body left-border ml-2">
                                            <Documents
                                              docList={
                                                this.state.InitialDocumentList
                                              }
                                              size={4}
                                              logDocClick={this.logDocClick}
                                            />
                                            {this.state.InitialDocumentList
                                              .length > 4 && (
                                              <div className="col-12 pt-2 pb-4 more-wrapper mb-1 ml-1">
                                                <i className="fas fa-arrow-right float-right mr-3 pointer" />
                                                <b
                                                  className="float-right mr-1 pointer"
                                                  onClick={(e) => {
                                                    this.ShowMore(
                                                      e,
                                                      "document_type_level3",
                                                      stage2.value
                                                    );
                                                  }}
                                                >
                                                  More
                                                </b>
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Fragment>
                                );
                              }
                            )}
                          </div>

                          {/* level ends */}
                        </div>
                      ) : (
                        <>
                          <div className="card-body left-border ml-2">
                            <Documents
                              docList={this.state.InitialDocumentList}
                              size={4}
                              logDocClick={this.logDocClick}
                            />
                            {this.state.InitialDocumentList.length > 2 && (
                              <div className="col-12 pt-2 pb-4 more-wrapper mb-1 ml-1">
                                <i className="fas fa-arrow-right float-right mr-3 pointer" />
                                <b
                                  className="float-right mr-1 pointer"
                                  onClick={(e) => {
                                    this.ShowMore(
                                      e,
                                      "document_type_details",
                                      stage.value
                                    );
                                  }}
                                >
                                  More
                                </b>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
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
            <Modal.Body
              ref={this.reuseTemplatesRef}
              bsPrefix="document-data-modal"
            >
              <div className="row col-12">
                <div className="col-6">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    value={this.state.searchMoreKey}
                    onChange={this.handleSearchValueChange}
                    placeholder="Search File Name"
                  />
                </div>
              </div>
              {this.state.DocumentList && this.state.DocumentList.length > 0 ? (
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
                    docList={this.state.DocumentList}
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
export default ReUseTemplates;
