import React, { Component, Fragment } from "react";
import _ from "lodash";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import { post } from "axios";
import URLConfig from "../URLConfig";
import Pagination from "react-js-pagination";

class UpForArchivalDocuments extends Component {
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
      ResubmitPopUp: false,
      SelectedDate: null,
      upforarchivalCountPerPage: 10,
      upforarchivalactivePage: 1,
      upforarchival_documents: [],
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
    const pageSize = this.state.upforarchivalCountPerPage;
    this.setState({
      upforarchival_documents: this.state.InProgressList.slice(0, pageSize),
      TotalCount: this.state.InProgressList.length,
      upforarchivaltotalCount: this.state.InProgressList.length,
    });
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.InProgressList;
    const begin =
      pageNumber * this.state.upforarchivalCountPerPage -
      this.state.upforarchivalCountPerPage;
    const end =
      pageNumber * this.state.upforarchivalCountPerPage >
        this.state.InProgressList.length
        ? this.state.InProgressList.length
        : pageNumber * this.state.upforarchivalCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({
      upforarchivalactivePage: pageNumber,
      upforarchival_documents: list,
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
    this.setState({ SelectedDoc: data });
  };
  toggleSelectDocCheckbox = (checked, id) => {
    let SelectedIds = []; //this.state.SelectedIds;
    if (checked) {
      SelectedIds.push(id);
      var SelectedDate = this.state.InProgressList.filter((x) => x.id == id)[0]
        .deltaDocumentDetails[0].plannedShelfLife;

      this.setState({ SelectedIds, SelectedDate });
    } else {
      this.setState({ SelectedIds });
    }
  };
  setValidUptoDate = (date) => {
    const SelectedDate = date;
    this.setState({ SelectedDate });
  };
  formatDate = (plannedShelfLife) => {
    if (typeof plannedShelfLife === "object") {
      return plannedShelfLife;
    }
    if (plannedShelfLife === "" || plannedShelfLife === undefined) {
      return new Date(
        new Date().getFullYear() + 1,
        new Date().getMonth(),
        new Date().getDate()
      );
    }
    var dt = plannedShelfLife.split("T");
    var year = dt[0].split("-")[0];
    var month = dt[0].split("-")[1];
    var day = dt[0].split("-")[2];
    return new Date(year, month - 1, day);
  };

  UpdatePlannedShelfLife = () => {
    const empId = Cookies.get("empnumber");
    const Name = Cookies.get("name");
    const CallbackObj = this.props;

    let data = {
      status: 17,
      documentID: this.state.SelectedIds[0],
      requestedBy_EmpID: empId,
      previousStatus: 17,
      requestedBy_Name: Name,
      plannedShelfLife: this.state.SelectedDate,
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
    return (
      <Fragment>
        {this.state.InProgressList && (
          <Fragment>
            <div
              className="col-12 mt-3"
              style={{
                height: "500px",
                width: "100%",
              }}
            >
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none tab-background" width="4%"></td>
                    <td className="border-none tab-background">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Planned Shelf Life (UTC)</strong>
                    </td>
                  </tr>
                  {this.state.upforarchival_documents.map((value, index) => (
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
                      <td className="pt-2">
                        {formatDate(
                          value.deltaDocumentDetails[0].plannedShelfLife
                        )}
                      </td>
                      {/* <td className="pt-2">
                <button type="button" className="btn btn-light p-1" data-toggle="modal" data-target="#UnTaggedUploadDetailsModal" onClick={()=>this.showMetaInfoPopUp(value)}>
                <i className="fas fa-bars"></i>
                </button>
                </td>                */}
                    </tr>
                  ))}
                  {this.state.InProgressList &&
                    this.state.InProgressList.length > 10 &&
                    this.state.upforarchival_documents.length > 0 && (
                      <tr>
                        <td colSpan="5">
                          <div className="text-center">
                            <Pagination
                              prevPageText="<"
                              nextPageText=">"
                              firstPageText="<<"
                              lastPageText=">>"
                              activePage={this.state.upforarchivalactivePage}
                              itemsCountPerPage={
                                this.state.upforarchivalCountPerPage
                              }
                              totalItemsCount={
                                this.state.upforarchivaltotalCount
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
              <div className="col-12 p-0 m-3 row">
                <div className="col-2 p-0">
                  {this.state.SelectedIds.length > 0 && (
                    <button
                      className="btn btn-sm btn-success m-1"
                      onClick={() => {
                        this.setState({ ResubmitPopUp: true });
                      }}
                    >
                      Modify Planned Shelf Life
                    </button>
                  )}
                </div>
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
                <Modal.Title>Modify Planned Shelf Life</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col-12 row pr-0 mr-0">
                  <div className="row col-12">
                    <div className="col-4 pl-0">Planned Shelf Life</div>
                    <div className="col-8">
                      <DatePicker
                        className="datechoose"
                        selected={
                          this.state && (this.state.SelectedDate !== null || "")
                            ? this.formatDate(this.state.SelectedDate)
                            : new Date(
                              new Date().getFullYear() + 1,
                              new Date().getMonth(),
                              new Date().getDate()
                            )
                        }
                        showYearDropdown
                        onChange={(date) => this.setValidUptoDate(date)}
                        minDate={
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            new Date().getDate()
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    this.UpdatePlannedShelfLife();
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
          </Fragment>
        )}
      </Fragment>
    );
  }
}
export default UpForArchivalDocuments;
