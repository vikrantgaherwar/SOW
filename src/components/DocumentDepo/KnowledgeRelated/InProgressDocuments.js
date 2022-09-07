import React, { Component, Fragment } from "react";
import _ from "lodash";
import UnTaggedModal from "./UnTaggedModal";
import Modal from "react-bootstrap/Modal";
import Cookies from "js-cookie";
import logo from "../img/loading-icon-animated.gif";
import axios from "axios";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import URLConfig from "../URLConfig";
import { post, get } from "axios";
import popuplogo from "../img/element-popup-headers.png";
import CryptoJS from "crypto-js";
import Pagination from "react-js-pagination";

class InProgressDocuments extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      OppId: "",
      filesMetaData: [],
      geoRegionData: {},
      MasterData: null,
      roleList: [],
      selectedValue: [],
      isLoading: false,
      IsOpenMetaPopUp: false,
      showDocumentPreview: false,
      InprogressitemsCountPerPage: 10,
      InprogressActivePage: 1,
      Inprogress: [],
      MasterDataOther: {},
      isbarsEnable : true
    };
  }
  componentDidMount() {
    const OppId = this.props.oppId;
    const InProgressList = this.props.docs;
    const InitialList = InProgressList;
    this.setState({ OppId, InProgressList, InitialList }, () =>
      this.paginate()
    );
    if (this.props.MasterData.geoRegions) {
      this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
        this.modifyGeoRegionData()
      );
    }
    this.setState({ MasterDataOther: this.props.MasterDataOther });
  }
  UpdateMasterTableDataOthers() {
    const otherURL = URLConfig.GetAllOtherMasterTablesDataURL();
    axios.get(otherURL).then((res) => {
      if (res.data) {
        this.setState({
          MasterDataOther: res.data,
          isbarsEnable : false
        });
      }
    });
  }
  paginate = () => {
    const pageSize = this.state.InprogressitemsCountPerPage;
    this.setState({
      Inprogress: this.state.InProgressList.slice(0, pageSize),
      TotalCount: this.state.InProgressList.length,
      InprogresstotalItemsCount: this.state.InProgressList.length,
    });
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.InProgressList;
    const begin =
      pageNumber * this.state.InprogressitemsCountPerPage -
      this.state.InprogressitemsCountPerPage;
    const end =
      pageNumber * this.state.InprogressitemsCountPerPage >
      this.state.InProgressList.length
        ? this.state.InProgressList.length
        : pageNumber * this.state.InprogressitemsCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({ InprogressActivePage: pageNumber, Inprogress: list });
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
    this.state.geoRegionData = transformedObject;
  };
  showMetaInfoPopUp = (data) => {
    this.setState({ SelectedDoc: data, IsOpenMetaPopUp: true });
  };

  RemoveInprogress = (id) => {
    const URL =
      URLConfig.GetDeleteDocURL() + id + "/" + Cookies.get("empnumber");
    axios.delete(URL).then((res) => {
      if (res.data) {
        this.props.refreshInProgressAndInActive();
      }
    });
  };
  getPendingApproval = (value) => {
    var length = value.deltaDocumentApprovals[0]
      ? value.deltaDocumentApprovals.length
      : 0;
    if (length == 0) return "NA";
    else if (length == 1) {
      if (value.deltaDocumentApprovals[0].approvalRecieved == true)
        return "Approved";
      else return "Primary";
    } else if (length > 1) {
      if (
        value.deltaDocumentApprovals[0].approvalRecieved == null &&
        value.deltaDocumentApprovals[1]?.approvalRecieved == null
      )
        return "Primary";
      else {
        for (var i = 1; i <= length - 1; ) {
          if (value.deltaDocumentApprovals[i].approvalRecieved == true) i++;
          else return "Additional";
        }
        return "Approved";
      }
    }
  };

  OnChangeSearch = (event) => {
    const SearchKey = event.target.value;
    if (event.target.value === "") {
      const InitialList = this.state.InitialList;
      this.setState(
        {
          Inprogress: InitialList,
          SearchKey,
          InProgressList: InitialList,
          InprogressActivePage: 1,
        },
        () => this.paginate()
      );
    } else {
      var results = this.state.Inprogress.filter(
        (x) => x.name.toLowerCase().indexOf(SearchKey.toLowerCase()) !== -1
      );
      this.setState({
        Inprogress: results,
        SearchKey,
        InProgressList: results,
      });
      console.log(this.state.Inprogress);
    }
  };
  onSearchKeyUp = (e) => {
    if (e.keyCode === 13) {
      //  var results = this.state.InProgressList.filter(x=>x.name.indexOf(this.state.SearchKey)!=-1);
      //  this.setState({InProgressList: results});
    }
  };
  SaveMetaData = (docData) => {
    debugger;
    var MetaData = docData.deltaDocumentDetails[0]; // Meta Data Only
    const url = URLConfig.EditDocumentDetails();
    // this.setState({ isLoading: true });
    // const employeeID=docData.uploadedBy;
    MetaData.modifiedBy = Cookies.get("mail");
    post(url, MetaData).then((res) => {
      if (res.data) {
        // this.refreshData(employeeID);
        this.UpdateMasterTableDataOthers();
        this.setState({ isLoading: false });
      }
    });
  };
  // refreshData=(employeeID)=>{
  //   const url = URLConfig.GetInprogressDocument()+employeeID;
  //   get(url).then((res)=>{
  //     if(res.data)
  //     {
  //       this.setState({InProgressList:res.data});
  //       this.setState({ isLoading: false });
  //     }
  //   });
  // };
  render() {
    const MasterData = this.props.MasterData;
    MasterData.exclusiveFor = this.state.geoRegionData;
    return (
      <Fragment>
        {/* {this.state.isLoading &&
                <div className="text-center">
                <img className="loading-img" src={logo} alt="loading"></img>
              </div>
        }  */}
        {this.state.Inprogress && (
          <Fragment>
            <div className="col-12 mt-3">
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control form-control-sm col-4"
                  placeholder="Search Documents"
                  value={this.state.SearchKey}
                  onChange={this.OnChangeSearch}
                ></input>
              </div>
              <div
                style={{
                  overflow: "scroll",
                  height: "500px",
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <table
                  className="table table-striped table-bordered mt-2"
                  width="100%"
                >
                  <tbody>
                    <tr className="border-bottom mb-2">
                      <td className="border-none tab-background " width="50%">
                        <strong>Document Name</strong>
                      </td>
                      <td className="border-none text-truncate tab-background">
                        <strong>Uploaded Date (UTC)</strong>
                      </td>
                      <td className="border-none text-truncate tab-background">
                        <strong>Predicted Document Type</strong>
                      </td>
                      <td className="border-none text-truncate tab-background">
                        <strong>Approval Pending</strong>
                      </td>
                      <td className="border-none tab-background"></td>
                    </tr>

                    {this.state.Inprogress &&
                      this.state.Inprogress.map((value, index) => (
                        <tr key={index}>
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
                          <td className="pt-2">
                            {formatDate(value.uploadedDt)}
                          </td>
                          <td className="pt-2">
                            {value.deltaDocumentDetails[0]?.documentType}
                          </td>
                          <td className="pt-2">
                            {this.getPendingApproval(value)}
                          </td>
                          <td className="pt-2 text-truncate">
                            <button
                              type="button"
                              className="btn btn-light p-1"
                              onClick={() => this.showMetaInfoPopUp(value)}
                             
                            >
                              <i className="fas fa-bars"></i>
                         
                            </button>
                            <button
                              type="button"
                              className="btn btn-light p-1 pointer ml-2"
                            >
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
                    {this.state.InProgressList &&
                      this.state.InProgressList.length > 10 &&
                      this.state.Inprogress.length > 0 && (
                        <tr>
                          <td colSpan="5">
                            <div className="text-center">
                              <Pagination
                                prevPageText="<"
                                nextPageText=">"
                                firstPageText="<<"
                                lastPageText=">>"
                                activePage={this.state.InprogressActivePage}
                                itemsCountPerPage={
                                  this.state.InprogressitemsCountPerPage
                                }
                                totalItemsCount={
                                  this.state.InprogresstotalItemsCount
                                }
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
            </div>
            <Modal
              size="lg"
              show={this.state.IsOpenMetaPopUp}
              dialogClassName="doc-depo-meta-popups"
            >
              <Modal.Header as="section">
                <Modal.Title className="ibheadertext col-12" as="div">
                  <img src={popuplogo} width="93" height="27" />
                  <a className="btn btn-sm btn-transp">
                    Additional Information
                  </a>
                  <a
                    className="btn btn-link float-right mtop-5 Doc-Depo-Heading close-btn"
                    onClick={() => {
                      this.setState({ IsOpenMetaPopUp: false });
                    }}
                  >
                    X
                  </a>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.state.SelectedDoc && (
                  <UnTaggedModal
                    onSave={this.SaveMetaData}
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
export default InProgressDocuments;
