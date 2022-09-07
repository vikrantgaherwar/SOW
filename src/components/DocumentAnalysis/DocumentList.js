import React, { Fragment } from "react";
import Cookies from "js-cookie";
import axios, { post } from "axios";
import bootbox from "bootbox";
import DocumentDetailsModal from "../DocumentDepo/OpportunityRelated/DocumentDetailsModal";
import URLConfig from "./URLConfig";
import Modal from "react-bootstrap/Modal";
import CryptoJS from "crypto-js";
import _ from "lodash";
class DocumentList extends React.Component {
  constructor() {
    super();
    this.state = {
      OppID: "",
      docList: [],
      SelectedDoc: null,
      type: "",
      SelectedDocMetaData: null,
      DownLoadLink: "",
      showMetaInfoPopUp: false,
      SearchText: "",
      geoRegionData:{}
    };
  }

  SaveData = (docData) => {
    const url = URLConfig.EditDocumentDetails();
    post(url, docData).then((res) => {
      if (res.data) {
      }
    });
  };

  rejectDocument = () => {
    const CryptoJS = require("crypto-js");
    const SelectedDoc = this.state.SelectedDoc;
    const EncryptedDocID = CryptoJS.AES.encrypt(
      JSON.stringify([{ DocID: SelectedDoc.id }]),
      URLConfig.getEncKey()
    ).toString();
    const { refresh } = this.props;
    var locale = { OK: "Submit", CONFIRM: "Submit", CANCEL: "Cancel" };
    bootbox.addLocale("custom", locale);
    bootbox.prompt({
      title: "Please provide your feedback",
      inputType: "textarea",
      locale: "custom",
      callback: function (result) {
        if (result) {
          const url = URLConfig.RejectDocument();
          const dataReq = {
            id: SelectedDoc.id,
            comments: result,
            authorID: SelectedDoc.uploadedBy,
            documentName: SelectedDoc.name,
            ReUploadURL:
              window.location.origin + "/ReUpload?d=" + EncryptedDocID,
          };
          axios.delete(url, { data: dataReq }).then((res) => {
            if (res.data) {
              refresh();
            }
          });
        }
      },
    });
  };
  approveDocument = () => {
    const SelectedDoc = this.state.SelectedDoc;
    const { refresh } = this.props;
    bootbox.confirm({
      message: "Approve Document?",
      buttons: {
        confirm: {
          label: "Yes",
          className: "btn-success",
        },
        cancel: {
          label: "No",
          className: "btn-danger",
        },
      },
      callback: function (result) {
        if (result) {
          const url = URLConfig.ApproveDocument(SelectedDoc.id);
          post(url, {}).then((res) => {
            if (res.data) {
              refresh();
            }
          });
        }
      },
    });
  };
  componentDidMount() {
    //alert("HI mount");
    if (this.props.MasterData.geoRegions) {
      this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
        this.modifyGeoRegionData()
      );
    }
  }
  modifyGeoRegionData = () => {
    const transformedObject = {};
    transformedObject.isTouched = false;
    let data = [...this.state.geoRegions];

    let regionsObject = _.groupBy(data, "region");
    let regions = Object.keys(regionsObject);

    let regionsWithCheckBoxValue = regions.map((r) => {
      return { regionName: r, isChecked: true };
    });

    transformedObject.regions = regionsWithCheckBoxValue;

    for (let i = 0; i < transformedObject.regions.length; ++i) {
      let sameRegions = data.filter((c) => {
        return c.region === regions[i];
      });

      let clustersObject = _.groupBy(sameRegions, "cluster");
      let clusters = Object.keys(clustersObject);

      let clustersWithCheckBoxValue = clusters.map((c) => {
        return {
          clusterName: c,
          isChecked: true,
          countries: clustersObject[c].map((country) => {
            return { ...country, isChecked: true };
          }),
        };
      });

      transformedObject.regions[i].clusters = clustersWithCheckBoxValue;
    }
    this.setState({ geoRegionData: transformedObject });
  };
  showDocument = (document) => {
    //alert("HI");
    var DownLoadLink =
      this.state.type === "SharePoint"
        ? document.url
        : document.source === 3
        ? document.documentPath
        : "https://delta.app.hpecorp.net:444/" + document.documentPath;
    this.setState({ SelectedDoc: document, DownLoadLink });
    const URL =
      URLConfig.GetMetaDataByDocID(document.id) +
      document.source +
      "/" +
      Cookies.get("empnumber");
    axios.get(URL).then((res) => {
      if (res.data) {
        try {
          this.setState({ SelectedDocMetaData: res.data });
        } catch (err) {
          //alert(err);
        }
      }
    });
  };
  componentWillReceiveProps(props) {
    const { DocList } = this.props;
    if (props.DocList !== DocList) {
      const DocList = props.DocList;
      const DefaultDocument = DocList.length > 0 ? DocList[0] : null;
      this.setState(
        {
          docList: props.DocList,
          type: props.type,
          SelectedDoc: DefaultDocument,
        },
        () => {
          if (DefaultDocument !== null) this.showDocument(DefaultDocument);
        }
      );
    }
  }
  formatURL = (url) => {
    if (
      url.indexOf(".doc") !== -1 ||
      url.indexOf(".xls") !== -1 ||
      url.indexOf(".ppt") !== -1
    ) {
      return "https://view.officeapps.live.com/op/embed.aspx?src=" + url;
    }
    return url;
  };
  formatSharePointURL = (url) => {
    var filepath =
      "F:\\AnPS\\Sharepointfiles\\" +
      url
        .replace("https://hpedelta.com:8082/", "")
        .replace(/ /g, "%20")
        .split("/")
        .join("\\");
    filepath = CryptoJS.enc.Utf8.parse(filepath);
    filepath = CryptoJS.enc.Base64.stringify(filepath);
    return "https://hpedelta.com/Viewer.aspx?file=" + filepath;
  };
  AssignDocument = () => {
    this.refs.btnAccept.setAttribute("disabled", "disabled");
    const empId = Cookies.get("empnumber");
    const Name = Cookies.get("name");
    const DocumentDetails = this.state.SelectedDoc;
    const data = {
      id: this.state.SelectedDoc.id,
      assignedTo: empId,
      assignedToName: Name,
      documentSource: this.state.type,
    };
    const url = URLConfig.AssignDocument();
    post(url, data).then((res) => {
      if (res.data) {
        this.refresh();
        //this.refs.btnAccept.removeAttribute("disabled");
      }
    });
  };
  refresh = () => {
    const { refresh } = this.props;
    this.setState({ docList: [], SelectedDoc: null });
    refresh();
  };
  showMetaInfoPopUp = () => {
    //alert(this.state.SelectedDoc.id);
    this.setState({ showMetaInfoPopUp: true });
  };
  formatDate = (date) => {
    if (date === "" || date === undefined || date === null) {
      return ""; //new Date(new Date().getFullYear()+ 1, new Date().getMonth(), new Date().getDate())"";
    }
    var dt = date.split("T");
    var year = dt[0].split("-")[0];
    var month = dt[0].split("-")[1];
    var day = dt[0].split("-")[2];
    var min = dt[1].split(":")[0];
    var sec = dt[1].split(":")[1];

    return month + "/" + day + "/" + year + " " + min + ":" + sec;
  };
  doSearch = (e) => {
    if (e.keyCode === 13) {
      // Enter key
      this.props.onSearch(e.target.value);
    }
  };
  SearchBoxChange = (e) => {
    this.setState({ SearchText: e.target.value });
  };
  clearSearch = () => {
    this.setState({ SearchText: "" });
    this.props.clearSearch();
  };
  render() {
    const MasterData = this.props.MasterData;
    MasterData.exclusiveFor=this.state.geoRegionData;
    return (
      <Fragment>
        {this.state.type && this.state.type.indexOf("SharePoint") === -1 && (
          <div className="col-3 p-0 doc-analysis-section doc-list-container">
            <div className="height-5vh row col-12 p-0 m-0">
              <div className="search-wrapper">
                <input
                  type="text"
                  value={this.state.SearchText}
                  onChange={this.SearchBoxChange}
                  required
                  className="col-12 search-box form-control form-control-sm mt-1"
                  placeholder={"Search Documents"}
                  onKeyUp={this.doSearch}
                />
                <button
                  className="close-icon"
                  type="reset"
                  onClick={this.clearSearch}
                ></button>
              </div>
              {/* <div className="doc-sort-icon">
            <i className="fa fa-sort" title="sort by date"></i>
            </div> */}
              {/* <button type="button" className="btn btn-link float-right" value="Show/Hide"><i className="fa fa-filter"></i></button> */}
            </div>
            <div className="doc-items-list">
              {this.state.docList &&
                this.state.SelectedDoc !== null &&
                this.state.docList.length > 0 &&
                this.state.docList.map((value, index) => (
                  <Fragment>
                    <div
                      key={index}
                      className={
                        value.id === this.state.SelectedDoc.id
                          ? "col-12 doc-title-active p-1"
                          : "col-12 doc-title p-1"
                      }
                      onClick={() => {
                        this.showDocument(value);
                      }}
                    >
                      <div>
                        <p className="m-0">{value.name}</p>
                      </div>
                      <div>
                        Submitted by: {value.uploadedByName} | On:{" "}
                        {this.formatDate(value.uploadedDt)}
                      </div>
                    </div>
                  </Fragment>
                ))}
            </div>
            {/* <div className="p-0 height-5vh">
             <p>Pagination</p>
           </div> */}
          </div>
        )}
        {this.state.type && this.state.type.indexOf("SharePoint") !== -1 && (
          <div className="col-3 p-0 doc-analysis-section doc-list-container">
            <div className="height-5vh row col-12 p-0 m-0">
              <div className="search-wrapper">
                <input
                  type="text"
                  value={this.state.SearchText}
                  onChange={this.SearchBoxChange}
                  required
                  className="col-12 search-box form-control form-control-sm mt-1"
                  placeholder={"Search Documents"}
                  onKeyUp={this.doSearch}
                />
                <button
                  className="close-icon"
                  type="reset"
                  onClick={this.clearSearch}
                ></button>
              </div>
              {/* <div className="doc-sort-icon">
            <i className="fa fa-sort" title="sort by date"></i>
            </div> */}
              {/* <button type="button" className="btn btn-link float-right" value="Show/Hide"><i className="fa fa-filter"></i></button> */}
            </div>
            <div className="doc-items-list">
              {this.state.docList &&
                this.state.SelectedDoc !== null &&
                this.state.docList.length > 0 &&
                this.state.docList.map((value, index) => (
                  <div
                    key={index}
                    className={
                      value.id === this.state.SelectedDoc.id
                        ? "col-12 doc-title-active p-1"
                        : "col-12 doc-title p-1"
                    }
                    onClick={() => {
                      this.showDocument(value);
                    }}
                  >
                    <div>
                      <p className="m-0">{value.name}</p>
                    </div>
                    <div>
                      Submitted by: {value.uploadedByName} | On:{" "}
                      {this.formatDate(value.lastmodified)}
                    </div>
                  </div>
                ))}
            </div>
            {/* <div className="p-0 height-5vh">
             <p>Pagination</p>
           </div> */}
          </div>
        )}
        <div className="col-7 doc-analysis-section pl-0">
          {" "}
          {/*style="border: 1px solid #ccc;" */}
          <div className="row">
            <div className="col-6 pl-2">
              {this.state.type &&
                this.state.type === "My Bin" &&
                this.state.docList &&
                this.state.docList.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-light p-2 ml-3"
                    onClick={() => this.showMetaInfoPopUp()}
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                )}
            </div>
            {this.state.type &&
              this.state.type !== "My Bin" &&
              this.state.type !== "Published Documents" &&
              this.state.docList &&
              this.state.docList.length > 0 && (
                <div className="col-6 pr-2" align="right">
                  <button
                    className="btn btn-sm btn-success m-1"
                    ref="btnAccept"
                    onClick={this.AssignDocument}
                  >
                    Accept
                  </button>
                  {/* {this.state.DownLoadLink && this.state.DownLoadLink !== '' &&
                      <a className="fa fa-download" target="_blank" aria-hidden="true" href={this.state.DownLoadLink} download></a>
                    }  */}
                </div>
              )}
            {this.state.type &&
              this.state.type === "My Bin" &&
              this.state.docList &&
              this.state.docList.length > 0 && (
                <div className="col-6 pr-2" align="right">
                  <button
                    className="btn btn-sm btn-success m-1"
                    onClick={this.approveDocument}
                  >
                    Publish
                  </button>
                  <button
                    className="btn btn-sm btn-danger m-1"
                    onClick={this.rejectDocument}
                  >
                    Reject
                  </button>
                  {/* {this.state.DownLoadLink && this.state.DownLoadLink !== '' &&
                      <a className="fa fa-download" target="_blank" aria-hidden="true" href={this.state.DownLoadLink} download></a>
                    }  */}
                </div>
              )}
            {this.state.type &&
              this.state.docList &&
              this.state.type === "Published Documents" && (
                <div className="col-6 pr-2" align="right">
                  {/* {this.state.DownLoadLink && this.state.DownLoadLink !== '' &&
                      <a className="fa fa-download" target="_blank" aria-hidden="true" href={this.state.DownLoadLink} download></a>
                    }  */}
                </div>
              )}
          </div>
          {this.state.docList.length > 0 &&
            this.state.SelectedDoc !== null &&
            this.state.type.indexOf("SharePoint") !== -1 && (
              <div className="embed-container">
                <iframe
                  src={this.formatSharePointURL(this.state.SelectedDoc.url)}
                />
              </div>
            )}
          {this.state.docList.length > 0 &&
            this.state.SelectedDoc !== null &&
            this.state.type.indexOf("SharePoint") === -1 && (
              <div className="embed-container">
                {this.state.SelectedDoc.source === 3 && (
                  <iframe
                    src={this.formatURL(this.state.SelectedDoc.documentPath)}
                  />
                )}
                {this.state.SelectedDoc.source !== 3 && (
                  <iframe
                    src={this.formatURL(
                      "https://delta.app.hpecorp.net:444/" +
                        this.state.SelectedDoc.documentPath
                    )}
                  />
                )}
              </div>
            )}
        </div>

        <Modal show={this.state.showMetaInfoPopUp}>
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a className="btn btn-sm btn-transp">
                {this.state.SelectedDoc ? this.state.SelectedDoc.name : ""}
              </a>
              <a
                className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                onClick={() => {
                  this.setState({ showMetaInfoPopUp: false });
                }}
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.type &&
              this.state.type === "My Bin" &&
              this.state.SelectedDoc && (
                <DocumentDetailsModal
                  onSave={this.SaveData}
                  MasterData={MasterData}
                  docData={this.state.SelectedDocMetaData}
                  EditMode={true}
                />
              )}
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}
export default DocumentList;
