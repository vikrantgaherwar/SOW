import React, { Component, Fragment } from "react";
import _ from "lodash";
import Modal from "react-bootstrap/Modal";
import UnTaggedModal from "./UnTaggedModal";
import { post } from "axios";
import axios from "axios";
import URLConfig from "../URLConfig";
import Cookies from "js-cookie";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import popuplogo from "../img/element-popup-headers.png";
import CryptoJS from "crypto-js";
import Pagination from "react-js-pagination";

class ActionRequired extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      OppId: "",
      filesMetaData: [],
      MasterData: null,
      roleList: [],
      geoRegionData: {},
      selectedValue: [],
      isLoading: false,
      SelectedIds: [],
      ResubmitPopUp: false,
      Notes_To_KSO: "",
      valid_Notes: false,
      ApprovalPopUp: false,
      isApproved: false,
      actionRequiredCountPerPage: 5,
      PendingitemCountPerPage: 5,
      actionRequiredActivePage: 1,
      PendingactivePage: 1,
      pendingForInfo: [],
      approval_Required: [],
      MasterDataOther: {},
    };
  }
  componentDidMount() {
    const OppId = this.props.oppId;
    const ResponseFromKSO = this.props.docs.responseFromKSO;
    const ApprovalRequired = this.props.docs.approvalRequired;
    this.setState({ OppId, ResponseFromKSO, ApprovalRequired }, () =>
      this.paginate()
    );
    if (this.props.MasterData.geoRegions) {
      this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
        this.modifyGeoRegionData()
      );
    }
    this.UpdateMasterTableDataOthers();
  }
  UpdateMasterTableDataOthers() {
    const otherURL = URLConfig.GetAllOtherMasterTablesDataURL();
    axios.get(otherURL).then((res) => {
      if (res.data) {
        this.setState({
          MasterDataOther: res.data,
        });
      }
    });
  }
  UpdateMasterTableDataOthersNew(data) {
    let MasterDataOther = this.state.MasterDataOther;
    MasterDataOther.competitorsOthers = [];
    MasterDataOther.researchVendorsOthers = [];
    MasterDataOther.partnersOthers = [];
    if (
      data.deltaDocumentDetails[0].competitorsOthers != undefined &&
      data.deltaDocumentDetails[0].competitorsOthers != ""
    ) {
      var competitorOthers =
        data.deltaDocumentDetails[0].competitorsOthers.split(",");
      for (var i = 0; i < competitorOthers.length; i++)
        MasterDataOther.competitorsOthers.push({
          name: competitorOthers[i],
          createdBy: data.name,
        });
    }
    if (
      data.deltaDocumentDetails[0].researchVendorsOthers != undefined &&
      data.deltaDocumentDetails[0].researchVendorsOthers != ""
    ) {
      var vendorsOthers =
        data.deltaDocumentDetails[0].researchVendorsOthers.split(",");
      for (var i = 0; i < vendorsOthers.length; i++)
        MasterDataOther.researchVendorsOthers.push({
          name: vendorsOthers[i],
          createdBy: data.name,
        });
    }
    if (
      data.deltaDocumentDetails[0].partnersOthers != undefined &&
      data.deltaDocumentDetails[0].partnersOthers != ""
    ) {
      var partnerOthers =
        data.deltaDocumentDetails[0].partnersOthers.split(",");
      for (var i = 0; i < partnerOthers.length; i++)
        MasterDataOther.partnersOthers.push({
          name: partnerOthers[i],
          createdBy: data.name,
        });
    }
    this.setState({ MasterDataOther: MasterDataOther });
  }
  paginate = () => {
    const pageSize = this.state.actionRequiredCountPerPage;
    const pageSize_ = this.state.PendingitemCountPerPage;
    if (
      this.props.docs.approvalRequired !== undefined &&
      this.props.docs.responseFromKSO !== undefined
    ) {
      this.setState({
        approval_Required: this.state.ApprovalRequired.slice(0, pageSize),
        pendingForInfo: this.state.ResponseFromKSO.slice(0, pageSize_),
        TotalCount: this.state.ApprovalRequired.length,
        DraftstotalItemsCount: this.state.ApprovalRequired.length,
        PendingitemTotal: this.state.ResponseFromKSO.length,
      });
    }
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.ApprovalRequired;
    const begin =
      pageNumber * this.state.actionRequiredCountPerPage -
      this.state.actionRequiredCountPerPage;
    const end =
      pageNumber * this.state.actionRequiredCountPerPage >
      this.state.ApprovalRequired.length
        ? this.state.ApprovalRequired.length
        : pageNumber * this.state.actionRequiredCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({
      actionRequiredActivePage: pageNumber,
      approval_Required: list,
    });
  };
  handlePageChange_ = (pageNumber) => {
    const lists = this.state.ResponseFromKSO;
    const begin =
      pageNumber * this.state.PendingitemCountPerPage -
      this.state.PendingitemCountPerPage;
    const end =
      pageNumber * this.state.PendingitemCountPerPage >
      this.state.ResponseFromKSO.length
        ? this.state.ResponseFromKSO.length
        : pageNumber * this.state.PendingitemCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({ PendingactivePage: pageNumber, pendingForInfo: list });
  };

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

  showMetaInfoPopUp(data) {
    this.setState({ SelectedDoc: data, IsOpenMetaPopUp: true });
  }

  SaveData = (data) => {
    this.UpdateMasterTableDataOthersNew(data);
    const url =
      URLConfig.EditPublishedDocDetailsAPI() +
      data.id +
      "/" +
      Cookies.get("empnumber");
    post(url, data.deltaDocumentDetails[0]).then((res) => {
      if (res.data) {
        this.setState({ isLoading: false, IsOpenMetaPopUp: false });
        this.props.refreshInProgressAndPublished();
        //this.UpdateMasterTableDataOthers();
      }
    });
  };
  toggleSelectDocCheckbox = (checked, id) => {
    let SelectedIds = []; //this.state.SelectedIds;
    if (checked) {
      SelectedIds.push(id);
      // if(SelectedIds.length === this.state.docList.length){
      //   this.setState({AllSelected: true, SelectedIds});
      // }
      // else{
      this.setState({ SelectedIds });
      //}
    } else {
      //Remove it from SelectedIds
      this.setState({ SelectedIds });
    }
  };
  handleKso_Notes = (e) => {
    const valid_Notes = e.target.value.length > 0 ? true : false;
    this.setState({ Notes_To_KSO: e.target.value, valid_Notes });
  };
  ResubmitDocument = () => {
    const empId = Cookies.get("empnumber");
    const Name = Cookies.get("name");
    const CallbackObj = this.props;

    let data = {
      status: 8,
      documentID: this.state.SelectedIds[0],
      requestedBy_EmpID: empId,
      previousStatus: 7,
      requestedBy_Name: Name,
      comments: this.state.Notes_To_KSO,
    };
    post(URLConfig.ChangeStatus_API(), data).then((res) => {
      if (res.data) {
        this.setState({ ResubmitPopUp: false, Notes_To_KSO: "" }, () => {
          CallbackObj.refreshData();
        });
      }
    });
  };
  getApproverComment = (value) => {
    var length = value.deltaDocumentApprovals[0]
      ? value.deltaDocumentApprovals.length
      : 0;
    for (var i = 0; i <= length - 1; i++) {
      if (
        value.deltaDocumentApprovals[i].approvedComments !== null &&
        value.deltaDocumentApprovals[i].approvalRecieved == null
      )
        return value.deltaDocumentApprovals[i].approvedComments;
    }
    return "";
  };
  ApproveDocument = () => {
    const CryptoJS = require("crypto-js");
    const email = Cookies.get("mail");
    const Name = Cookies.get("name");
    const SelectedDoc = this.state.SelectedIds[0];
    const CallbackObj = this.props;
    const EncryptedDocID = CryptoJS.AES.encrypt(
      JSON.stringify([{ DocID: SelectedDoc.id }]),
      URLConfig.getEncKey()
    ).toString();
    console.log(this.props);

    let data = {
      approvedBy: email,
      DocumentID: this.state.SelectedIds[0],
      approvalFeedBack: this.state.Notes_To_KSO,
      isApproved: this.state.isApproved,
      documentName: this.props.docs.approvalRequired[0].name,
      authorID: this.props.docs.approvalRequired[0].uploadedBy,
      authorName: this.props.docs.approvalRequired[0].uploadedByName,
      reUploadUrl: window.location.origin,
      AssignedByName: Name,
    };
    post(URLConfig.DocApproval_API(), data).then((res) => {
      if (res.data) {
        this.setState(
          { ApprovalPopUp: false, Notes_To_KSO: "", isApproved: false },
          () => {
            CallbackObj.refreshData();
          }
        );
      }
    });
  };
  OnChange_Approval_Type = (event) => {
    alert(event.target.value);
  };

  render() {
    const MasterData = this.props.MasterData;
    MasterData.exclusiveFor = this.state.geoRegionData;
    return (
      <Fragment>
        {this.state.ResponseFromKSO && this.state.ResponseFromKSO.length > 0 && (
          <Fragment>
            <div className="col-12">
              <h6>Pending for Information</h6>
            </div>
            <div className="col-12 mt-3">
              <table
                className="table table-striped table-bordered"
                width="100%"
              >
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none tab-background" width="2%"></td>
                    <td className="border-none tab-background" width="30%">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Uploaded Date (UTC)</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Feedback From KSO</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Feedback From Approver</strong>
                    </td>
                    <td className="border-none tab-background"></td>
                  </tr>
                  {this.state.pendingForInfo.map((value, index) => (
                    <tr key={index}>
                      <td className="border-none">
                        <input
                          type="checkbox"
                          checked={
                            this.state.SelectedIds.indexOf(value.id) != -1
                          }
                          onChange={(e) =>
                            this.toggleSelectDocCheckbox(
                              e.target.checked,
                              value.id
                            )
                          }
                        ></input>
                      </td>
                      <td className="pt-2">
                        {
                          <a
                            className={identifyFileFormat(
                              value.name.toLowerCase()
                            )}
                          ></a>
                        }
                        <a>{value.name}</a>
                      </td>
                      <td className="pt-2">{formatDate(value.uploadedDt)}</td>
                      <td className="pt-2">
                        {value.deltaDocumentDetails[0]
                          ? value.deltaDocumentDetails[0].responseFromKso
                            ? value.deltaDocumentDetails[0].responseFromKso
                            : ""
                          : ""}
                      </td>
                      <td className="pt-2">{this.getApproverComment(value)}</td>
                      <td className="pt-2">
                        <button
                          type="button"
                          className="btn btn-light p-1"
                          onClick={() => this.showMetaInfoPopUp(value)}
                        >
                          <i className="fas fa-bars"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {this.state.ResponseFromKSO &&
                    this.state.ResponseFromKSO.length > 5 &&
                    this.state.pendingForInfo.length > 0 && (
                      <tr>
                        <td colSpan="5">
                          <div className="text-center">
                            <Pagination
                              prevPageText="<"
                              nextPageText=">"
                              firstPageText="<<"
                              lastPageText=">>"
                              activePage={this.state.PendingactivePage}
                              itemsCountPerPage={
                                this.state.PendingitemCountPerPage
                              }
                              totalItemsCount={this.state.PendingitemTotal}
                              pageRangeDisplayed={5}
                              onChange={this.handlePageChange_}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className="col-12 p-0 m-3 row">
              <div className="col-2 p-0">
                {this.state.SelectedIds.length > 0 && (
                  <button
                    className="btn btn-sm btn-success m-1"
                    onClick={() => {
                      this.setState({ ResubmitPopUp: true });
                    }}
                  >
                    Resubmit
                  </button>
                )}
              </div>
            </div>
            <Modal
              show={this.state.ResubmitPopUp}
              onHide={() => {
                this.setState({
                  ResubmitPopUp: false,
                  Notes_To_KSO: "",
                  valid_Notes: false,
                });
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Resubmit Document</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col-12 row pr-0 mr-0">
                  <div className="row col-12">
                    <div className="col-4 pl-0">Notes To KSO</div>
                    <div className="col-8">
                      <textarea
                        className="form-control"
                        id="Add_Notes_To_KSO"
                        value={this.state.Notes_To_KSO}
                        onChange={this.handleKso_Notes}
                        rows="2"
                        name="_Notes_To_KSO"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!this.state.valid_Notes}
                  onClick={() => {
                    this.ResubmitDocument();
                  }}
                >
                  Continue
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    this.setState({
                      AssiggnTO: false,
                      AssignMail: "",
                      valid_Notes: false,
                    });
                  }}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={this.state.IsOpenMetaPopUp}
              dialogClassName="doc-depo-meta-popups"
              size="lg"
            >
              <Modal.Header as="section">
                <Modal.Title className="ibheadertext col-12" as="div">
                  <a className="btn btn-sm btn-transp">
                    {this.state.SelectedDoc ? this.state.SelectedDoc.name : ""}
                  </a>
                  <a
                    className="btn btn-link float-right mtop-5 Doc-Depo-Heading close-btn"
                    onClick={() => {
                      this.setState({
                        IsOpenMetaPopUp: false,
                        SelectedDoc: null,
                      });
                    }}
                  >
                    X
                  </a>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.state.SelectedDoc && (
                  <UnTaggedModal
                    onSave={this.SaveData}
                    MasterData={MasterData}
                    docData={this.state.SelectedDoc}
                    EditMode={true}
                    MasterDataOther={this.state.MasterDataOther}
                  ></UnTaggedModal>
                )}
              </Modal.Body>
            </Modal>
          </Fragment>
        )}
        {this.state.ApprovalRequired && this.state.ApprovalRequired.length > 0 && (
          <Fragment>
            <div className="col-12">
              <h6>Approval Required</h6>
            </div>
            <div className="col-12 mt-3">
              <table className="table table-striped table-bordered" width="100%">
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none tab-background" width="2%"></td>
                    <td className="border-none tab-background" width="33%">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none tab-background" width="12%">
                      <strong>Uploaded Date (UTC)</strong>
                    </td>
                    <td className="border-none tab-background" width="15%">
                      <strong>Primary Owner</strong>
                    </td>
                    <td className="border- tab-background" width="15%">
                      <strong>Secondary Owner</strong>
                    </td>
                    <td className="border-none tab-background" width="5%"></td>
                  </tr>
                  {this.state.approval_Required.map((value, index) => (
                    <tr key={index}>
                      <td className="border-none pt-3 text-center">
                        <input
                          type="checkbox"
                          checked={
                            this.state.SelectedIds.indexOf(value.id) != -1
                          }
                          onChange={(e) =>
                            this.toggleSelectDocCheckbox(
                              e.target.checked,
                              value.id
                            )
                          }
                        ></input>
                      </td>
                      <td className="pt-2">
                        {
                          <a
                            className={identifyFileFormat(
                              value.name.toLowerCase()
                            )}
                          ></a>
                        }
                        <a>{value.name}</a>
                      </td>
                      <td className="pt-2">{formatDate(value.uploadedDt)}</td>
                      <td className="pt-2">
                        {
                          value.deltaDocumentApprovals.filter(
                            (x) => x.isPrimaryOwner == true
                          )[0]?.approverUid
                        }
                      </td>
                      <td className="pt-2">
                        {
                          value.deltaDocumentApprovals.filter(
                            (x) => x.isSecondryOwner == true
                          )[0]?.approverUid
                        }
                      </td>
                      <td className="pt-2">
                        <button
                          type="button"
                          className="btn btn-light p-1"
                          onClick={() => this.showMetaInfoPopUp(value)}
                        >
                          <i className="fas fa-bars"></i>
                        </button>
                        <button type="button" className="btn btn-light p-1">
                          <i
                            className="fas fa-eye pointer"
                            title="Document Preview"
                            onClick={() =>
                              this.setState({
                                showDocumentPreview: true,
                                previewURL: URLConfig.handlePreview(
                                  value.documentPath
                                ),
                              })
                            }
                          ></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {this.state.ApprovalRequired &&
                    this.state.ApprovalRequired.length > 5 &&
                    this.state.approval_Required.length > 0 && (
                      <tr>
                        <td colSpan="5">
                          <div className="text-center">
                            <Pagination
                              prevPageText="<"
                              nextPageText=">"
                              firstPageText="<<"
                              lastPageText=">>"
                              activePage={this.state.actionRequiredActivePage}
                              itemsCountPerPage={
                                this.state.actionRequiredCountPerPage
                              }
                              totalItemsCount={this.state.DraftstotalItemsCount}
                              pageRangeDisplayed={5}
                              onChange={this.handlePageChange}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className="col-12 p-0 m-3 row">
              <div className="col-2 p-0">
                {this.state.SelectedIds.length > 0 && (
                  <div>
                    <button
                      className="btn btn-sm btn-success m-1"
                      onClick={() => {
                        this.setState({
                          ApprovalPopUp: true,
                          isApproved: true,
                        });
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger m-1"
                      onClick={() => {
                        this.setState({
                          ApprovalPopUp: true,
                          isApproved: false,
                        });
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Modal
              show={this.state.ApprovalPopUp}
              onHide={() => {
                this.setState({
                  ApprovalPopUp: false,
                  Notes_To_KSO: "",
                  valid_Notes: false,
                  isApproved: false,
                });
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Send Approver Feedback</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col-12 row pr-0 mr-0">
                  {/* <div className="row col-12 mb-2">
                    <div className="col-4 pl-0">Feedback</div>
                    <div className="col-8">
                      <select className="form-control form-control-sm" onChange={this.OnChange_Approval_Type}>
                        <option value="-1">Select your option</option>
                        <option value="1">Approve</option>
                        <option value="0">Send Feedback</option>
                      </select>
                    </div>
                </div> */}
                  <div className="row col-12">
                    <div className="col-4 pl-0">Comments</div>
                    <div className="col-8">
                      <textarea
                        className="form-control"
                        id="Add_Notes_To_KSO"
                        value={this.state.Notes_To_KSO}
                        onChange={this.handleKso_Notes}
                        rows="2"
                        name="_Notes_To_KSO"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!this.state.valid_Notes}
                  onClick={() => {
                    this.ApproveDocument();
                  }}
                >
                  Continue
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    this.setState({
                      AssiggnTO: false,
                      AssignMail: "",
                      valid_Notes: false,
                    });
                  }}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={this.state.IsOpenMetaPopUp}
              dialogClassName="doc-depo-meta-popups"
              size="lg"
            >
              <Modal.Header as="section">
                <Modal.Title className="ibheadertext col-12" as="div">
                  <img src={popuplogo} width="93" height="27" />
                  <a className="btn btn-sm btn-transp">
                    {this.state.SelectedDoc ? this.state.SelectedDoc.name : ""}
                  </a>
                  <a
                    className="btn btn-link float-right mtop-5 Doc-Depo-Heading close-btn"
                    onClick={() => {
                      this.setState({
                        IsOpenMetaPopUp: false,
                        SelectedDoc: null,
                      });
                    }}
                  >
                    X
                  </a>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.state.SelectedDoc && (
                  <UnTaggedModal
                    onSave={this.SaveData}
                    MasterData={MasterData}
                    docData={this.state.SelectedDoc}
                    EditMode={true}
                    MasterDataOther={this.state.MasterDataOther}
                  ></UnTaggedModal>
                )}
              </Modal.Body>
            </Modal>
          </Fragment>
        )}
        <Modal
          show={this.state.showDocumentPreview}
          onHide={() => this.setState({ showDocumentPreview: false })}
          dialogClassName="preview-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Document Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body dialogClassName="preview-body">
            <div className="preview_iframe">
              <iframe
                frameborder="0"
                allowfullscreen
                src={this.state.previewURL}
              />
            </div>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}
export default ActionRequired;
