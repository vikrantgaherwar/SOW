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

class ActionRequired extends Component {
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
      SelectedIds: [],
      valid_Notes: false,
      geoRegionData: {},
      actionRequiredCountPerPage: 10,
      actionRequiredActivePage: 1,
      approval_Required: [],
    };
  }
  handleKso_Notes = (e) => {
    const valid_Notes = e.target.value.length > 0 ? true : false;
    this.setState({ Notes_To_KSO: e.target.value, valid_Notes });
  };
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
    const pageSize = this.state.actionRequiredCountPerPage;
    this.setState({
      approval_Required: this.state.InProgressList.slice(0, pageSize),
      TotalCount: this.state.InProgressList.length,
      DraftstotalItemsCount: this.state.InProgressList.length,
    });
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.InProgressList;
    const begin =
      pageNumber * this.state.actionRequiredCountPerPage -
      this.state.actionRequiredCountPerPage;
    const end =
      pageNumber * this.state.actionRequiredCountPerPage >
      this.state.InProgressList.length
        ? this.state.InProgressList.length
        : pageNumber * this.state.actionRequiredCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({
      actionRequiredActivePage: pageNumber,
      approval_Required: list,
    });
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
  toggleSelectDocCheckbox = (checked, id) => {
    let SelectedIds = []; //this.state.SelectedIds;
    if (checked) {
      SelectedIds.push(id);
      this.setState({ SelectedIds });
      //}
    } else {
      this.setState({ SelectedIds });
    }
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
                    <td className="border-none tab-background" width="2%"></td>
                    <td className="border-none tab-background">
                      <strong>Opportunities</strong>
                    </td>
                    <td className="border-none tab-background" width="40%">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Uploaded Date (UTC)</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Feedback From KSO</strong>
                    </td>
                    <td className="border-none tab-background"></td>
                  </tr>
                  {this.state.approval_Required.map((value, index) => (
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
                        {value.deltaDocumentDetails[0].responseFromKso}
                      </td>
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
export default ActionRequired;
