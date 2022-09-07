import React, { Component, Fragment } from "react";
import _ from "lodash";
import Modal from "react-bootstrap/Modal";
import UnTaggedModal from "./UnTaggedModal";
import { post } from "axios";
import URLConfig from "../URLConfig";
import Cookies from "js-cookie";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import popuplogo from "../img/element-popup-headers.png";
import CryptoJS from "crypto-js";
import Pagination from "react-js-pagination";

class PublishedDocuments extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      OppId: "",
      filesMetaData: [],
      MasterData: null,
      geoRegionData: {},
      roleList: [],
      selectedValue: [],
      isLoading: false,
      showDocumentPreview: false,
      publishitemsCountPerPage: 10,
      publishactivePage: 1,
      publish_documents: [],
    };
  }
  componentDidMount() {
    const OppId = this.props.oppId;
    const InProgressList = this.props.docs;
    this.setState({ OppId, InProgressList }, () => this.paginate());
    if (this.props.MasterData.geoRegions) {
      this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
        this.modifyGeoRegionData()
      );
    }
  }
  paginate = () => {
    // pagination
    const pageSize = this.state.publishitemsCountPerPage;
    this.setState({
      publish_documents: this.state.InProgressList.slice(0, pageSize),
      TotalCount: this.state.InProgressList.length,
      publishtotalItemsCount: this.state.InProgressList.length,
    });
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.InProgressList;
    const begin =
      pageNumber * this.state.publishitemsCountPerPage -
      this.state.publishitemsCountPerPage;
    const end =
      pageNumber * this.state.publishitemsCountPerPage >
      this.state.InProgressList.length
        ? this.state.InProgressList.length
        : pageNumber * this.state.publishitemsCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({ publishactivePage: pageNumber, publish_documents: list });
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
    const url =
      URLConfig.EditPublishedDocDetailsAPI() +
      data.id +
      "/" +
      Cookies.get("empnumber");
    var MetaData = data.deltaDocumentDetails[0];
    MetaData.modifiedBy = Cookies.get("mail");
    post(url, MetaData).then((res) => {
      if (res.data) {
        this.setState({ isLoading: false, IsOpenMetaPopUp: false });
        this.props.refreshInProgressAndPublished();
      }
    });
  };

  render() {
    const MasterData = this.props.MasterData;
    MasterData.exclusiveFor = this.state.geoRegionData;
    return (
      <Fragment>
        {this.state.InProgressList && (
          <Fragment>
            <div
              className="col-12 mt-3"
              style={{
                overflow: "scroll",
                height: "500px",
                width: "100%",
                overflow: "auto",
              }}
            >
              <table
                className="table table-striped table-bordered"
                width="100%"
              >
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none tab-background" width="50%">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Uploaded Date (UTC)</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Predicted Document Type</strong>
                    </td>
                    <td className="border-none tab-background"></td>
                  </tr>
                  {this.state.publish_documents.map((value, index) => (
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
                      <td className="pt-2">{formatDate(value.uploadedDt)}</td>
                      <td className="pt-2">
                        {value.deltaDocumentDetails[0]?.documentType}
                      </td>
                      <td className="pt-2">
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
                    this.state.publish_documents.length > 0 && (
                      <tr>
                        <td colSpan="5">
                          <div className="text-center">
                            <Pagination
                              prevPageText="<"
                              nextPageText=">"
                              firstPageText="<<"
                              lastPageText=">>"
                              activePage={this.state.publishactivePage}
                              itemsCountPerPage={
                                this.state.publishitemsCountPerPage
                              }
                              totalItemsCount={
                                this.state.publishtotalItemsCount
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
                    translate="no"
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
                  ></UnTaggedModal>
                )}
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
        )}
      </Fragment>
    );
  }
}
export default PublishedDocuments;
