import React, { Fragment } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import TrackingService from "./TrackingService";
import Pagination from "react-js-pagination";
import URLConfig from "./URLConfig";
import bootbox from "bootbox";
import { identifyFileFormat } from "../utils/FileType";
//import AppTable from '../components/upcoming/AppTable'

class Guides extends React.Component {
  constructor(props) {
    super(props);
    this.guidesRef = React.createRef();
    this.state = {
      initialList: [],
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      searchTerm: "",
      applySearch: false,
      GuideList: [],
      filters: "",
      showEmail: false,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.onLike = this.onLike.bind(this);
    this.onDisLike = this.onDisLike.bind(this);
    this.logDocClick = this.logDocClick.bind(this);
    this.ShowMore = this.ShowMore.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  logDocClick(docLink) {
    this.TrackingService.OpenLink(Cookies.get("empnumber"), docLink);
  }
  onLike(docID) {
    if (document.getElementById("up" + docID).classList.contains("disable")) {
      return;
    }
    document.getElementById("up" + docID).classList.toggle("like-active");
    document.getElementById("down" + docID).classList.toggle("disable");
    document.getElementById("up" + docID).classList.toggle("disable");
    document.getElementById("up" + docID).classList.toggle("fa");

    var locale = { OK: "Submit", CONFIRM: "Submit", CANCEL: "Skip" };
    bootbox.addLocale("custom", locale);
    bootbox.prompt({
      title: "Please provide your feedback (optional)",
      inputType: "textarea",
      locale: "custom",
      callback: function (result) {
        axios
          .post(URLConfig.getURL_UserFeedBack(), {
            isLiked: true,
            documentID: docID,
            userId: Cookies.get("empnumber"),
            Comments: result,
          })
          .then(function (response) {
            toast.info("Thanks for your feedback..", {
              position: "bottom-left",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    });
  }
  onDisLike(docID) {
    if (document.getElementById("down" + docID).classList.contains("disable")) {
      return;
    }
    document.getElementById("down" + docID).classList.toggle("like-down");
    document.getElementById("up" + docID).classList.toggle("disable");
    document.getElementById("down" + docID).classList.toggle("disable");
    document.getElementById("down" + docID).classList.toggle("fa");
    var locale = {
      OK: "Submit",
      CONFIRM: "Submit",
      CANCEL: "Cancel",
    };

    bootbox.addLocale("custom", locale);
    bootbox.prompt({
      title: "Please provide your feedback",
      inputType: "textarea",
      inputOptions: {
        required: true,
      },
      locale: "custom",

      callback: function (result) {
        if (result === null) {
          document.getElementById("down" + docID).classList.toggle("like-down");
          document.getElementById("down" + docID).classList.toggle("fa");
          document.getElementById("up" + docID).classList.toggle("disable");
          document.getElementById("down" + docID).classList.toggle("disable");
        }
        if (result !== null) {
          if (result === "") {
            return false;
          }
          axios
            .post(URLConfig.getURL_UserFeedBack(), {
              isLiked: false,
              documentID: docID,
              userId: Cookies.get("empnumber"),
              Comments: result,
            })
            .then(function (response) {
              toast.info("Thanks for your feedback..", {
                position: "bottom-left",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },
    });
  }

  formatDate = (date) => {
    if (date === "" || date === undefined) {
      return "";
    }
    var dt = date.split("T");
    var year = dt[0].split("-")[0];
    var month = dt[0].split("-")[1];
    var day = dt[0].split("-")[2];
    return dt[0];
  };
  handlePageChange(pageNumber) {
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const url =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=file,url,rating,disclosure_level,title,id,doc_source,modified_date,file_type&fq=document_type:%22Guides%22%20AND%20document_type_details:%22" +
      this.state.popupHeader +
      "%22&indent=on&q=" +
      this.state.searckKey +
      "&rows=10&start=" +
      begin +
      (this.state.filters.indexOf("&fq=nda:\"True\"") === -1 ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles() : "") +
      this.state.filters;
    axios.get(url).then((res) => {
      if (res.data.response.docs) {
        this.setState({
          GuideList: res.data.response,
          InitialData: res.data.response,
          totalItemsCount: res.data.response.numFound,
        });
      }
    });
    this.setState({ activePage: pageNumber });
    this.guidesRef.current.scrollTop = 0;
  }
  componentDidMount() {
    const data = this.props.data !== null ? this.props.data : [];
    const filters = this.props.filters !== null ? this.props.filters : "";
    const searckKey = document
      .getElementsByClassName("react-autosuggest__input")[0]
      .value.replace(/[#?&@]/g, " ");
    this.setState({
      GuideList: [],
      initialList: data.groups,
      totalItemsCount: data.length,
      TotalCount: data.matches,
      searckKey: searckKey,
      filters: filters,
    });
  }
  ShowMore(categoryName) {
    const URLGuides =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=file,url,rating,disclosure_level,title,id,doc_source,modified_date,file_type&fq=document_type:%22Guides%22%20AND%20document_type_details:%22" +
      categoryName +
      "%22&indent=on&q=" +
      this.state.searckKey +
      (this.state.filters.indexOf("&fq=nda:\"True\"") === -1 ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles() : "") +
      this.state.filters;
    axios.get(URLGuides).then((res) => {
      if (res.data.response) {
        this.setState({
          GuideList: res.data.response,
          popupHeader: categoryName,
          activePage: 1,
          totalItemsCount: res.data.response.numFound,
        });
      }
    });
  }
  onChangeValue(event) {
    const showEmailStatus = this.state.showEmail;
    if (
      event.target.checked == true &&
      (showEmailStatus == false || showEmailStatus == true)
    ) {
      this.setState({ showEmail: true });
    } else {
      this.setState({ showEmail: false });
    }
  }
  render() {
    return (
      <Fragment>
        {this.state.initialList !== undefined &&
          this.state.initialList.length > 0 && (
            <div className="card-header">
              <h5 className="mb-0 in-flex">
                <button
                  className="btn btn-link btn-full collapsed"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  data-target="#Guides"
                  aria-controls="Guides"
                >
                  Guides
                </button>
                <span className="circle-count">
                  <span className="count-inner">{this.state.TotalCount}</span>
                </span>
              </h5>
            </div>
          )}
        {this.state.initialList !== undefined &&
          this.state.initialList.length > 0 && (
            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#Guides"
              aria-expanded="false"
              id="Guides"
              data-parent="#accordionExample"
            >
              <div className="card-body ml-2 mr-2 mt-2">
                <div className="accordion" id="accordionGuideCategories">
                  {this.state.initialList.map((list, index) => (
                    <Fragment key={index}>
                      <div className="card-header">
                        <h5 className="mb-0 in-flex">
                          <button
                            className="btn btn-link btn-full collapsed pt-1 pb-1"
                            type="button"
                            data-toggle="collapse"
                            aria-expanded="false"
                            data-target={"#guidesCategory" + index}
                            aria-controls="guidesCategory"
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
                        data-parent="#accordionGuideCategories"
                        aria-expanded="false"
                        id={"guidesCategory" + index}
                      >
                        <div className="left-border card-body">
                          {list.doclist.docs.map(
                            (doclist, index) =>
                              index < 4 && (
                                <div className="border-bottom">
                                  <div
                                    className="col-12 p-0 mb-0 ml-1 row  pb10"
                                    key={Math.random()}
                                  >
                                    <div className="col-1 pr-0 pt-1 mr-3">
                                      {
                                        <a
                                          className={identifyFileFormat(
                                            doclist.file_type
                                          )}
                                        ></a>
                                      }
                                    </div>

                                    <div className="col-6 p-1 row mr-1">
                                      <div className="col-12 row pr-0">
                                        {/* <a href={ "/docview?u=" +  CryptoJS.AES.encrypt(JSON.stringify([{"url":doclist.url}]), URLConfig.getEncKey()).toString()} target="_blank">{doclist.file}</a>  */}
                                        <a
                                          href={doclist.url}
                                          target="_blank"
                                          onClick={() =>
                                            this.logDocClick(doclist.url)
                                          }
                                        >
                                          {doclist.file}
                                        </a>
                                      </div>
                                    </div>

                                    <div className="col-3 pl-3 pr-0 mt-1">
                                      <div className="col-12 row p-0">
                                        <div
                                          className="col-3 p-0 mb-2"
                                          align="left"
                                        >
                                          <i
                                            className="fas fa-eye pointer"
                                            data-toggle="modal"
                                            data-target="#DocPreview"
                                            title="Document Preview"
                                          ></i>
                                        </div>
                                        <div className="col-3 p-0" align="left">
                                          <i
                                            className="far fa-heart pointer"
                                            data-toggle="modal"
                                            data-target=""
                                            title="Add to Bookmark"
                                          ></i>
                                        </div>
                                        <div className="col-3 p-0" align="left">
                                          <i
                                            className="fas fa-share-alt pointer"
                                            data-toggle="modal"
                                            data-target="#DocShareModal"
                                            title="Share"
                                          ></i>
                                        </div>
                                        <div className="col-3 p-0" align="left">
                                          <i
                                            className="fas fa-crosshairs pointer"
                                            data-toggle="modal"
                                            data-target="#DocUpdateModal"
                                            title="Request for update"
                                          ></i>
                                        </div>
                                        <div className="col-3 p-0" align="left">
                                          <i
                                            className="far fa-file-alt pointer"
                                            data-toggle="modal"
                                            data-target="#MetaDetailsModal"
                                            title="Meta Details"
                                          ></i>
                                        </div>
                                        <div className="col-3 p-0" align="left">
                                          <i
                                            className="far fa-comment pointer"
                                            data-toggle="modal"
                                            data-target="#CommentModalOne"
                                            title="Add Comment"
                                          ></i>
                                        </div>
                                        <div className="col-3 p-0" align="left">
                                          <i
                                            className="fas fa-database pointer"
                                            data-title={
                                              "Source : " + doclist.doc_source
                                            }
                                          ></i>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-1">
                                      <div className="row like_align">
                                        <span
                                          align=""
                                          className="col-6 p-1 fontx10 "
                                        >
                                          <div
                                            align="center"
                                            className="fontGreen"
                                          >
                                            100
                                          </div>
                                          <div align="center">
                                            <i
                                              className="far fa-thumbs-up"
                                              id={"up" + doclist.id}
                                              onClick={() =>
                                                this.onLike(doclist.id)
                                              }
                                            ></i>
                                          </div>
                                        </span>
                                        <span
                                          align=""
                                          className="col-6 p-1 fontx10 "
                                        >
                                          <div
                                            align="center"
                                            className="fontRed"
                                          >
                                            100
                                          </div>
                                          <div align="center">
                                            {" "}
                                            <i
                                              className="far fa-thumbs-down"
                                              id={"down" + doclist.id}
                                              onClick={() =>
                                                this.onDisLike(doclist.id)
                                              }
                                            ></i>
                                          </div>
                                        </span>
                                      </div>
                                      <div className="col-12 doc-nature pb-0 star_align">
                                        {/* { doclist.rating !== undefined && Array.from (Array(parseInt(doclist.rating))).map(() => <i key={Math.random()} className="fa fa-star txt-selective-yellow inblock"></i>)} */}
                                        {Array.from(Array(5)).map(() => (
                                          <i
                                            key={Math.random()}
                                            className="far fa-star txt-selective-yellow inblock"
                                          ></i>
                                        ))}
                                      </div>
                                      <div className="row fontx9 alignCenter">
                                        20 Views
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 row mr-0">
                                    <div className="col-1"></div>
                                    <div className="col-10 pl-2">
                                      <span
                                        className="fontx9 mr-2"
                                        align="left"
                                      >
                                        {doclist.disclosure_level}
                                      </span>
                                      <span className="fontx9" align="left">
                                        <strong>Modified on:</strong>
                                        {this.formatDate(doclist.modified_date)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                          )}
                          {list.doclist.docs.length > 4 && (
                            <div className="col-12 pt-2 pb-4 more-wrapper mb-1 ml-1">
                              <i className="fas fa-arrow-right float-right mr-3 pointer"></i>
                              <b
                                className="float-right mr-1 pointer"
                                data-toggle="modal"
                                data-target="#GuidesMore"
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
          )}
        <div
          className="modal fade"
          id="GuidesMore"
          role="dialog"
          aria-labelledby="deploymentModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deploymentModalLabel">
                  {this.state.popupHeader}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  translate="no"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                className="modal-body document-data-modal"
                ref={this.guidesRef}
              >
                {/* <AppTable data={this.state.GuideList.docs}/> */}
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview Modal */}
        <div
          className="modal fade"
          id="DocPreview"
          role="dialog"
          aria-labelledby="docpreview"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content mtop">
              <div className="modal-header">
                <h5 className="modal-title" id="docpreview">
                  Document Preview
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  translate="no"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body document-data-modal">
                Document Preview Content
              </div>
            </div>
          </div>
        </div>
        {/* DocShareModal */}
        <div
          className="modal fade"
          id="DocShareModal"
          role="dialog"
          aria-labelledby="docShareModal"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content mtop">
              <div className="modal-header">
                <h5 className="modal-title" id="docShareModal">
                  Share Document
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  translate="no"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body document-data-modal">
                <div id="share" className="col-12">
                  <div className="col-12">
                    <div className="col-12 row pb-2">
                      <div className="col-6">
                        Share <i className="fas fa-share-alt"></i>
                      </div>
                      <div className="col-6" onChange={this.onChangeValue}>
                        <div className="row">
                          {" "}
                          <input
                            type="radio"
                            name="viaemail"
                            value="option1"
                            className="form-check-input"
                          />
                          <span>Share Via Email</span>
                        </div>
                        <div className="row">
                          {" "}
                          <input
                            className="form-check-input"
                            type="radio"
                            name="viaemail"
                            value="option2"
                          />
                          <span>Share Via Delta</span>
                        </div>
                      </div>
                    </div>

                    <div id="emailbox" className="col-12 row">
                      {this.state.showEmail && (
                        <Fragment>
                          <div className="form-group col-9 p-0 mr-1">
                            <input
                              type="email"
                              className="form-control form-control-sm"
                              id="sharevia"
                              aria-describedby="emailHelp"
                              placeholder="Enter email"
                            />
                          </div>
                          <div className="col-2 p-0">
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                            >
                              Send
                            </button>
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* DocUpdateModal */}
        <div
          className="modal fade"
          id="DocUpdateModal"
          role="dialog"
          aria-labelledby="docUpdateModal"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content mtop">
              <div className="modal-header">
                <h5 className="modal-title" id="docUpdateModal">
                  Update Request Form
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  translate="no"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body document-data-modal">
                <div className="col-12 pr-0" id="updaterequest">
                  <div className="col-12 row pr-0 mr-0">
                    <div
                      id="heading"
                      className="row col-12 mb-2"
                      align="center"
                    >
                      {" "}
                      {/* <h5>Update Request Form</h5> */}
                    </div>
                    <div className="row col-12">
                      <div className="col-6 pl-0 mb-2">Update Request</div>
                      <div className="col-6 mb-2">
                        <select className="form-control form-control-sm">
                          <option>Select</option>
                          <option>Version update</option>
                          <option>Content update</option>
                          <option>Document category</option>
                          <option>Document disclosure</option>
                          <option>Metadata Update</option>
                          <option>Others</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 row">
                      <div className="col-6 pl-0">Additional Comments</div>
                      <div className="col-6">
                        {" "}
                        <textarea
                          className="form-control"
                          id="addcomments"
                          rows="2"
                        ></textarea>
                      </div>
                      <div></div>
                    </div>

                    <div className="col-11 mt-2 pr-0" align="right">
                      <button
                        type="button"
                        className="btn btn-success mr-2 btn-sm"
                      >
                        Save
                      </button>
                      <button type="button" className="btn btn-light btn-sm">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CommentModal */}
        {/* <div className="modal fade" id="CommentModal" role="dialog" aria-labelledby="commentModal" aria-hidden="true">
    <div className="modal-dialog" role="document">
        <div className="modal-content mtop">
            <div className="modal-header">
                <h5 className="modal-title" id="commentModal">Comments</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body document-data-modal">
            <div id="comments" className="col-12">
    <div className="row mb-3">
      Comment goes here
    </div>
<div className="row mb-3">
  <div className="col-6">  <span className="col-6 p-1 fontx10" align="center"><i className="far fa-thumbs-up"></i>
</span>
  <span className="col-6 p-1 fontx10" align="center"><i className="far fa-thumbs-down"></i>  
</span></div>
  <div className="col-6" align="right">
  <span className="col-6 p-1 fontx10"><i className="fas fa-reply"></i>
</span>
</div>
</div>
    <div className="row">
      <input type="text" placeholder="Type your comment" className="form-control form-control-sm mb-2"/>
      <button type="button" className="btn btn-info btn-sm">Submit</button>
    </div>
 
</div>

        </div>
        </div>
    </div>
</div> */}
        {/* MetaDetailsModal Starts*/}
        <div
          className="modal fade"
          id="MetaDetailsModal"
          role="dialog"
          aria-labelledby="metaDetailsModal"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content mtop">
              <div className="modal-header">
                <h5 className="modal-title" id="metaDetailsModal">
                  Metadata for
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  translate="no"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body document-data-modal">
                <div id="matadata" className="col-12">
                  <div className="row col-12 mb-2">
                    <span>
                      <b>File Name</b>
                    </span>
                  </div>

                  <div className="col-12 row">
                    <div className="col-6 p-0">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item metadata_items">
                          Document ID:{" "}
                        </li>
                        <li className="list-group-item metadata_items">
                          Document Type:
                        </li>
                        <li className="list-group-item metadata_items">
                          Description:
                        </li>
                        <li className="list-group-item metadata_items">
                          Mode of Delivery:
                        </li>
                        <li className="list-group-item metadata_items">NDA:</li>
                        <li className="list-group-item metadata_items">
                          Exclusive For:
                        </li>
                        <li className="list-group-item metadata_items">
                          Channel Enabled:
                        </li>
                        <li className="list-group-item metadata_items">
                          If Aligned to Initiative::
                        </li>

                        <li className="list-group-item metadata_items">
                          HPE Greenlake:
                        </li>
                        <li className="list-group-item metadata_items">
                          Service Type:
                        </li>

                        <li className="list-group-item metadata_items">
                          Competitors Covered:
                        </li>
                        <li className="list-group-item metadata_items">
                          Research Vendors:
                        </li>
                        <li className="list-group-item metadata_items">
                          Partners or SI:
                        </li>
                        <li className="list-group-item metadata_items">
                          Top comments:
                        </li>
                      </ul>
                    </div>

                    <div className="col-6 p-0">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item metadata_items">
                          Business:
                        </li>
                        <li className="list-group-item metadata_items">
                          Product:
                        </li>
                        <li className="list-group-item metadata_items">
                          Disclosure:
                        </li>
                        <li className="list-group-item metadata_items">
                          Planned Document Shelf Life:
                        </li>
                        <li className="list-group-item metadata_items">
                          Country of Origin:
                        </li>
                        <li className="list-group-item metadata_items">
                          Language:
                        </li>
                        <li className="list-group-item metadata_items">
                          Keywords:
                        </li>
                        <li className="list-group-item metadata_items">
                          Created Date:
                        </li>
                        <li className="list-group-item metadata_items">
                          Published Date:
                        </li>
                        <li className="list-group-item metadata_items">
                          Last Modified Date:
                        </li>
                        <li className="list-group-item metadata_items">
                          Source:
                        </li>
                        <li className="list-group-item metadata_items">
                          Rating:
                        </li>
                        <li className="list-group-item metadata_items">
                          Version History:
                        </li>
                        <li className="list-group-item metadata_items">
                          # Search hits:
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-12 mt-2 pr-4" align="right">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm mr-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm mr-1"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* MetaDetailsModal Ends*/}
      </Fragment>
    );
  }
}
export default Guides;
