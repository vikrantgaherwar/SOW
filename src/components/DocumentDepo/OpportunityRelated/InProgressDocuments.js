import React, { Component, Fragment } from "react";
import _ from "lodash";
import Modal from "react-bootstrap/Modal";
import Cookies from "js-cookie";
import axios from "axios";
import URLConfig from "../URLConfig";
import DocumentDetailsModal from "./DocumentDetailsModal";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import { post } from "axios";
import Pagination from "react-js-pagination";

class InProgressDocuments extends Component {
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
      IsOpenMetaPopUp: false,
      InitialList: [],
      showDocumentPreview: false,
      geoRegionData: {},
      InprogressitemsCountPerPage: 10,
      InprogressActivePage: 1,
      Inprogress: [],
      MasterDataOther: {},
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
    this.UpdateMasterTableDataOthers();
  }
  UpdateMasterTableDataOthers() {
    let MasterDataOther = this.state.MasterDataOther;
    MasterDataOther.competitorsOthers = [];
    MasterDataOther.researchVendorsOthers = [];
    MasterDataOther.partnersOthers = [];
    const otherURL = URLConfig.GetAllOtherMasterTablesDataURL();
    axios.get(otherURL).then((res) => {
      if (res.data) {
        debugger;
        this.setState({
          MasterDataOther: res.data,
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
  };

  showMetaInfoPopUp = (data) => {
    this.setState({ SelectedDoc: data, IsOpenMetaPopUp: true });
  };

  SaveData = (docData) => {
    debugger;
    //this.UpdateMasterTableDataOthersNew(docData);
    docData.modifiedBy = Cookies.get("mail");
    const url = URLConfig.EditDocumentDetails();
    post(url, docData).then((res) => {
      if (res.data) {
        this.setState({ isLoading: false });
        this.UpdateMasterTableDataOthers();
      }
    });
  };

  UpdateMasterTableDataOthersNew(data) {
    debugger;
    let MasterDataOther = this.state.MasterDataOther;
    MasterDataOther.competitorsOthers = [];
    MasterDataOther.researchVendorsOthers = [];
    MasterDataOther.partnersOthers = [];
    if (data.competitorsOthers != undefined && data.competitorsOthers != "") {
      var competitorOthers = data.competitorsOthers.split(",");
      for (var i = 0; i < competitorOthers.length; i++)
        MasterDataOther.competitorsOthers.push({
          name: competitorOthers[i],
          createdBy: data.createdBy,
        });
    }
    if (
      data.researchVendorsOthers != undefined &&
      data.researchVendorsOthers != ""
    ) {
      var vendorsOthers = data.researchVendorsOthers.split(",");
      for (var i = 0; i < vendorsOthers.length; i++)
        MasterDataOther.researchVendorsOthers.push({
          name: vendorsOthers[i],
          createdBy: data.createdBy,
        });
    }
    if (data.partnersOthers != undefined && data.partnersOthers != "") {
      var partnerOthers = data.partnersOthers.split(",");
      for (var i = 0; i < partnerOthers.length; i++)
        MasterDataOther.partnersOthers.push({
          name: partnerOthers[i],
          createdBy: data.createdBy,
        });
    }
    this.setState({ MasterDataOther: MasterDataOther });
  }
  RemoveInprogress = (id) => {
    const URL =
      URLConfig.GetDeleteDocURL() + id + "/" + Cookies.get("empnumber");
    axios.delete(URL).then((res) => {
      if (res.data) {
        this.props.refreshData();
      }
    });
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
        (x) =>
          x.name.toLowerCase().indexOf(SearchKey.toLowerCase()) != -1 ||
          x.oppId.toLowerCase().indexOf(SearchKey.toLowerCase()) != -1
      );
      this.setState({
        Inprogress: results,
        SearchKey,
        InProgressList: results,
      });
    }
  };
  render() {
    const MasterData = this.props.MasterData;
    MasterData.exlusiveFor = this.state.geoRegionData;
    const Domain = URLConfig.Domain();
    return (
      <Fragment>
        <div className="col-12 mt-3">
          {this.state.InitialList.length > 0 && (
            <div className="mb-2">
              <input
                type="text"
                className="form-control form-control-sm col-4"
                placeholder="Search Documents"
                value={this.state.SearchKey}
                onChange={this.OnChangeSearch}
              ></input>
            </div>
          )}
          {this.state.Inprogress && this.state.Inprogress.length > 0 && (
            <table
              className="table table-striped table-bordered mt-2"
              width="100%"
            >
              <tbody>
                <tr className="border-bottom mb-2">
                  <td className="border-none text-truncate tab-background">
                    <strong>Opportunities</strong>
                  </td>
                  <td
                    className="border-none text-truncate tab-background"
                    width="50%"
                  >
                    <strong>Document Name</strong>
                  </td>
                  <td className="border-none text-truncate tab-background">
                    <strong>Uploaded Date (UTC)</strong>
                  </td>
                  <td className="border-none tab-background">
                    <strong> </strong>
                  </td>
                </tr>
                {this.state.Inprogress &&
                  this.state.Inprogress.map((value, index) => (
                    <tr key={index}>
                      <td className="pt-2">{value.oppId}</td>
                      <td className="pt-2">
                        {
                          <a
                            className={identifyFileFormat(
                              value.name.toLowerCase()
                            )}
                          ></a>
                        }

                        {value.name}
                      </td>
                      <td className="pt-2">{formatDate(value.uploadedDt)}</td>
                      <td className="pt-2 text-truncate">
                        <button
                          type="button"
                          className="btn btn-light p-1 mr-2 "
                          onClick={() => this.showMetaInfoPopUp(value)}
                        >
                          <i className="fas fa-bars"></i>
                        </button>
                        {value.documentPath && (
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
                        )}
                      </td>
                      {/* {value.documentPath && (
                        <td className="pt-2">
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
                      )} */}
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
          )}
        </div>
        <Modal
          show={this.state.IsOpenMetaPopUp}
          dialogClassName="doc-depo-meta-popups"
          size="lg"
        >
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a className="btn btn-sm btn-transp">Additional Information</a>
              <a
                className="btn btn-link float-right mtop-5 Doc-Depo-Heading close-btn"
                onClick={() => {
                  this.setState({ IsOpenMetaPopUp: false, SelectedDoc: null });
                }}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              (console.log(this.state.MasterDataOther),
              this.state.SelectedDoc && (
                <DocumentDetailsModal
                  onSave={this.SaveData}
                  MasterData={MasterData}
                  docData={this.state.SelectedDoc}
                  EditMode={false}
                  MasterDataOther={this.state.MasterDataOther}
                ></DocumentDetailsModal>
              ))
            }
          </Modal.Body>
        </Modal>
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
