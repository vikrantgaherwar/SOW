import React, { Component, Fragment } from "react";
import _ from "lodash";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import Pagination from "react-js-pagination";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import URLConfig from "../URLConfig";

class InActiveDocuments extends Component {
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
      inactiveCountPerPage: 10,
      inactive_activePage: 1,
      inactive_documents: [],
      selectedDocuementID: 0,
      ResubmitPopUp: false,
      Notes_To_KSO: "",
      valid_Notes: false,
      isDraft: false,
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
    const pageSize = this.state.inactiveCountPerPage;
    this.setState({
      inactive_documents: this.state.InProgressList.slice(0, pageSize),
      TotalCount: this.state.InProgressList.length,
      inactivetotalItemsCount: this.state.InProgressList.length,
    });
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.InProgressList;
    const begin =
      pageNumber * this.state.inactiveCountPerPage -
      this.state.inactiveCountPerPage;
    const end =
      pageNumber * this.state.inactiveCountPerPage >
      this.state.InProgressList.length
        ? this.state.InProgressList.length
        : pageNumber * this.state.inactiveCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({
      inactive_activePage: pageNumber,
      inactive_documents: list,
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

  showMetaInfoPopUp = (data) => {
    this.setState({ SelectedDoc: data, IsOpenMetaPopUp: true });
  };

  toggleSelectDocCheckbox = (checked, selectedDocuementID, value) => {
    debugger;
    const isDraft = value.assignedTo === null ? true : false;
    if (checked) this.setState({ selectedDocuementID, isDraft });
    else this.setState({ selectedDocuementID: 0, isDraft: false });
  };
  handleKso_Notes = (e) => {
    const valid_Notes = e.target.value.length > 0 ? true : false;
    this.setState({ Notes_To_KSO: e.target.value, valid_Notes });
  };
  ResubmitDocument = () => {
    var data = JSON.stringify({
      id: this.state.selectedDocuementID,
      comments: this.state.Notes_To_KSO,
      isDraft: this.state.isDraft,
    });

    var config = {
      method: "post",
      url: URLConfig.GetReqForReSubmitInActive(), //'https://localhost:44322/api/InActiveDocuments',
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    var self = this;
    axios(config)
      .then(function (response) {
        debugger;
        if (response.data) {
          self.setState(
            {
              selectedDocuementID: 0,
              ResubmitPopUp: false,
              Notes_To_KSO: "",
              isDraft: false,
            },
            () => {
              toast.success("Request submitted successfully", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }
          );
          self.props.refreshData();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  render() {
    const MasterData = this.props.MasterData;
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
                    <td className="border-none tab-background"></td>
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
                  {this.state.inactive_documents.map((value, index) => (
                    <tr key={index}>
                      <td className="pt-2">
                        <input
                          type="checkbox"
                          checked={this.state.selectedDocuementID == value.id}
                          onChange={(e) =>
                            this.toggleSelectDocCheckbox(
                              e.target.checked,
                              value.id,
                              value
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
                      <td className="pt-2"></td>
                    </tr>
                  ))}
                  {this.state.InProgressList &&
                    this.state.InProgressList.length > 10 &&
                    this.state.inactive_documents.length > 0 && (
                      <tr>
                        <td colSpan="5">
                          <div className="text-center">
                            <Pagination
                              prevPageText="<"
                              nextPageText=">"
                              firstPageText="<<"
                              lastPageText=">>"
                              activePage={this.state.inactive_activePage}
                              itemsCountPerPage={
                                this.state.inactiveCountPerPage
                              }
                              totalItemsCount={
                                this.state.inactivetotalItemsCount
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
              {this.state.selectedDocuementID != 0 && (
                <Fragment>
                  {/* <button
                     className="btn btn-sm btn-danger float-right"
                     onClick={() => {
                       this.CancelUpload();
                     }}
                   >
                     Cancel
                   </button> */}

                  <button
                    className="btn btn-sm float-left btn-success mr-3 mt-4"
                    onClick={() => {
                      this.state.isDraft
                        ? this.ResubmitDocument()
                        : this.setState({ ResubmitPopUp: true });
                    }}
                  >
                    {this.state.isDraft
                      ? "Move to In Progress"
                      : "Request to Activate"}
                  </button>
                </Fragment>
              )}
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
                        rows="5"
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
                      Notes_To_KSO: "",
                      valid_Notes: false,
                      ResubmitPopUp: false,
                    });
                  }}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
            {/* <Modal show={this.state.IsOpenMetaPopUp}>
                <Modal.Header as="section">  
                <Modal.Title className="ibheadertext col-12" as="div">
                  <a className="btn btn-sm btn-transp">{this.state.SelectedDoc ? this.state.SelectedDoc.name : ''}</a>
                  <a className="btn btn-link float-right mtop-5 Doc-Depo-Heading" onClick={()=>{this.setState({IsOpenMetaPopUp : false})}}>X</a>                 
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>    
                     {this.state.SelectedDoc &&               
                     <UnTaggedModal onSave={this.SaveData} MasterData={MasterData} docData={this.state.SelectedDoc}></UnTaggedModal>
                     }
                 </Modal.Body>               
                </Modal>   */}
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
export default InActiveDocuments;
