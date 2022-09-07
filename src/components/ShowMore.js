import React, { Fragment } from "react";
import URLConfig from "./URLConfig";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import bootbox from "bootbox";
import TrackingService from "./TrackingService";
class ShowMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moreData: null,
    };
    this.onLike = this.onLike.bind(this);
    this.onDisLike = this.onDisLike.bind(this);
    this.logDocClick = this.logDocClick.bind(this);
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
  identifyFileFormat(fileName) {
    if (fileName.indexOf("pdf") !== -1) return "fa fa-file-pdf pdf-file";
    else if (fileName.indexOf("docx") !== -1 || fileName.indexOf("doc") !== -1)
      return "fa fa-file-word word-file";
    else if (fileName.indexOf("pptx") !== -1 || fileName.indexOf("ppt") !== -1)
      return "fa fa-file-powerpoint ppt-file";
    else if (fileName.indexOf("xls") !== -1 || fileName.indexOf("xl") !== -1)
      return "fa fa-file-excel xl-file";
    else if (fileName.indexOf("msg") !== -1)
      return "fa fa-envelope-square mail-file";
    else if (fileName.indexOf("mp4") !== -1) return "fa fa-file-video xl-file";
    else if (fileName.indexOf("zip") !== -1)
      return "fas fa-file-archive file-zip";
    else return "fa fa-external-link-square-alt xl-file";
  }
  componentDidMount() {
    this.setState({
      moreData: this.props.moreData,
      popupHeader: this.props.popupHeader,
    });
  }
  render() {
    return (
      <Fragment>
        <div
          className="modal fade"
          id="moreDataModal"
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
              <div className="modal-body document-data-modal">
                <div className="card-body ml-2">
                  <p></p>
                  {this.state.moreData &&
                    this.state.moreData.doclist.docs.map((doclist, index) => (
                      <div
                        className="col-12 p-0 mb-1 row border-bottom"
                        key={Math.random()}
                      >
                        <div className="col-1 pr-0 pt-1">
                          {
                            <a
                              className={this.identifyFileFormat(
                                doclist.file_type
                              )}
                            ></a>
                          }
                        </div>
                        <div className="col-11 p-1 row">
                          <div className="col-10">
                            {/* <a href={ "/docview?u=" +  CryptoJS.AES.encrypt(JSON.stringify([{"url":doclist.url}]), URLConfig.getEncKey()).toString()} target="_blank">{doclist.file}</a>  */}
                            <a
                              href={doclist.url}
                              className="breakall_word"
                              target="_blank"
                            >
                              {doclist.file}
                            </a>
                            <div className="col-12 p-0">
                              <p className="badge-doctype">
                                {doclist.disclosure_level}
                              </p>
                            </div>
                          </div>
                          <div className="col-2 p-0">
                            <div className="col-12 p-0">
                              <div className="col-12 p-0" align="right">
                                <span align="right" className="col-1 p-1">
                                  <i
                                    className="far fa-thumbs-up"
                                    id={"up" + doclist.id}
                                    onClick={() => this.onLike(doclist.id)}
                                  ></i>
                                </span>
                                <span align="right" className="col-1 p-1">
                                  <i
                                    className="far fa-thumbs-down"
                                    id={"down" + doclist.id}
                                    onClick={() => this.onDisLike(doclist.id)}
                                  ></i>
                                </span>
                              </div>
                            </div>
                            <div className="col-12 p-0">
                              <div className="p-0 doc-nature" align="right">
                                {Array.from(Array(5)).map(() => (
                                  <i
                                    key={Math.random()}
                                    className="far fa-star txt-selective-yellow inblock"
                                  ></i>
                                ))}
                                {/* { doclist.rating !== undefined && Array.from(Array(parseInt(doclist.rating))).map(() => <i key={Math.random()} className="fa fa-star txt-selective-yellow inblock"></i>)} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default ShowMore;
