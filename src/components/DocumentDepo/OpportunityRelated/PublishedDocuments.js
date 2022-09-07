import React, { Component, Fragment } from "react";
import _ from "lodash";
import Modal from "react-bootstrap/Modal";
import DocumentDetailsModal from "./DocumentDetailsModal";
import { post } from "axios";
import URLConfig from "../URLConfig";
import Cookies from "js-cookie";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import Pagination from "react-js-pagination";

class PublishedDocuments extends Component {
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
      geoRegionData: {},
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
    console.log(this.props.docs);
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
      data.docId +
      "/" +
      Cookies.get("empnumber");
    post(url, data).then((res) => {
      if (res.data) {
        this.setState({ isLoading: false, IsOpenMetaPopUp: false });
        this.props.refreshData();
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
            <div className="col-12 mt-3">
              <table
                className="table table-striped table-bordered"
                width="100%"
              >
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none tab-background">
                      <strong>Opportunities</strong>
                    </td>
                    <td className="border-none tab-background" width="50%">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Uploaded Date (UTC)</strong>
                    </td>
                    <td className="border-none tab-background"></td>
                  </tr>
                  {this.state.publish_documents.map((value, index) => (
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
                        <a>{value.name}</a>
                      </td>
                      <td className="pt-2">{formatDate(value.uploadedDt)}</td>
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
                  <a className="btn btn-sm btn-transp">
                    {this.state.SelectedDoc ? this.state.SelectedDoc.name : ""}
                  </a>
                  <a
                    className="btn btn-link float-right mtop-5 Doc-Depo-Heading close-btn"
                    translate="no"
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
                  <DocumentDetailsModal
                    onSave={this.SaveData}
                    MasterData={MasterData}
                    docData={this.state.SelectedDoc}
                    EditMode={true}
                  ></DocumentDetailsModal>
                )}
              </Modal.Body>
            </Modal>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
export default PublishedDocuments;
