import React, { Component, Fragment } from "react";
import DragAndDrop from "../DocumentDepo/DragAndDrop";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../DocumentDepo/img/loading-icon-animated.gif";
import { post } from "axios";
import { FileDetails } from "../DocumentDepo/FileDetails";
import URLConfig from "./URLConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class ReUploadDocument extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      OppId: "",
      filesMetaData: [],
      MasterData: null,
      roleList: [],
      selectedValue: [],
      isLoading: false,
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.setFile = this.setFile.bind(this);
    this.getFileMetaData = this.getFileMetaData.bind(this);
    this.FormFileDetails = this.FormFileDetails.bind(this);
    this.UploadAndSaveDocDetails = this.UploadAndSaveDocDetails.bind(this);
    this.CancelUpload = this.CancelUpload.bind(this);
  }

  FormFileDetails(data) {
    var filesmetaData = this.state.filesMetaData;
    var fileDetails = new FileDetails();
    fileDetails.Name = data.filename;

    fileDetails.documentType = data.predicted_document_type;
    fileDetails.Document_Sub_Type =
      data.predicted_document_sub_type == null
        ? ""
        : data.predicted_document_sub_type;

    filesmetaData.push(fileDetails);
    this.setState({ filesMetaData: filesmetaData, isLoading: false });
  }
  getFileMetaData(FileName) {
    const URL = "https://hpedelta.com:5003/api/v1/ml/predict?q=" + FileName;
    axios.get(URL).then((res) => {
      this.FormFileDetails(res.data);
    });
  }
  handleDrop = (files) => {
    let fileList = this.state.files;
    if (files.length > 1) {
      toast.error("Multiple Documents Selected, Please Select Valid document", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    this.setState({ isLoading: true });
    for (var i = 0; i < 1; i++) {
      if (!files[i].name) return;
      fileList.push(files[i]);
      this.getFileMetaData(files[i].name);
    }
    this.setState({ files: fileList });
  };
  setFile(e) {
    let fileList = [];
    if (e.target.files.length > 1) {
      toast.error("Multiple Documents Selected, Please Select Valid document", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    this.setState({ isLoading: true });
    for (var i = 0; i < 1; i++) {
      fileList.push(e.target.files[i]);
      this.getFileMetaData(e.target.files[i].name);
    }
    this.setState({ files: fileList });
  }
  CancelUpload() {
    this.setState({ files: [], filesMetaData: [] });
  }

  componentDidMount() {
    const OppId = this.props.oppId;
    const DocID = this.props.DocID;
    this.setState({ OppId: OppId, DocID: DocID });
  }

  UploadAndSaveDocDetails() {
    this.setState({ isLoading: true });
    const files = this.state.filesMetaData;
    const empnumber = Cookies.get("empnumber");
    const url = URLConfig.ReUploadFile(
      this.state.DocID,
      empnumber,
      this.state.OppId,
      this.state.filesMetaData[0].documentType
    );
    const formData = new FormData();
    for (var index = 0; index < this.state.files.length; index++) {
      var element = this.state.files[index];
      formData.append("files", element);
    }
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    post(url, formData, config).then((res) => {
      if (res.data) {
        window.location.href = window.location.href;
      }
    });
  }

  identifyFileFormat(fileName) {
    if (fileName.indexOf(".pdf") !== -1) return "fa fa-file-pdf pdf-file";
    else if (
      fileName.indexOf(".docx") !== -1 ||
      fileName.indexOf(".doc") !== -1
    )
      return "fa fa-file-word word-file";
    else if (
      fileName.indexOf(".pptx") !== -1 ||
      fileName.indexOf(".ppt") !== -1
    )
      return "fa fa-file-powerpoint ppt-file";
    else if (fileName.indexOf(".xls") !== -1 || fileName.indexOf(".xl") !== -1)
      return "fa fa-file-excel xl-file";
    else if (fileName.indexOf(".msg") !== -1)
      return "fa fa-envelope-square mail-file";
    else if (fileName.indexOf(".mp4") !== -1) return "fa fa-file-video xl-file";
    else if (fileName.indexOf(".zip") !== -1)
      return "fas fa-file-archive file-zip";
    else return "fa fa-external-link-square-alt xl-file";
  }

  refresh() {
    const { refreshData } = this.props;
    refreshData();
  }
  render() {
    return (
      <Fragment>
        <DragAndDrop handleDrop={this.handleDrop}>
          {this.state.files.length === 0 && (
            <div className="col-12 p-5 mt-5 nodocspace">
              <div className="doc-depo-div-file-select">
                <h6>
                  Please Select or drag and drop the document to ReUpload
                  Document
                </h6>
                <input
                  type="file"
                  multiple
                  onChange={(e) => this.setFile(e)}
                  className="doc-depo-input-upload"
                />
              </div>
            </div>
          )}
          {this.state.files.length > 0 && (
            <div className="col-12 mt-3">
              <table className="table-borderless" width="100%">
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none" width="70%">
                      <strong>Document Name</strong>
                    </td>
                    <td colspan="2" className="border-none">
                      <strong>Predicted Document Type</strong>
                    </td>
                  </tr>
                  {this.state.filesMetaData.map((value, index) => (
                    <tr key={index}>
                      <td className="pt-2">
                        {
                          <a
                            className={this.identifyFileFormat(
                              value.Name.toLowerCase()
                            )}
                          ></a>
                        }
                        <a>{value.Name}</a>
                      </td>
                      <td className="pt-2">{value.documentType}</td>
                      {/* <select className="form-control form-control-sm"><option>SOW</option></select></td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {!this.state.isLoading && (
                <div className="col-12 mt-4">
                  <button
                    className="btn btn-sm btn-danger float-right"
                    onClick={this.CancelUpload}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-sm float-right btn-success mr-3"
                    onClick={this.UploadAndSaveDocDetails}
                  >
                    Submit Documents
                  </button>
                </div>
              )}
            </div>
          )}
        </DragAndDrop>
        {this.state.isLoading && (
          <div className="text-center">
            <img className="loading-img" src={logo} alt="loading"></img>
          </div>
        )}
      </Fragment>
    );
  }
}
export default ReUploadDocument;
