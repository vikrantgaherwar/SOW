import React, { Component, Fragment } from "react";
import _ from "lodash";
import Modal from "react-bootstrap/Modal";
import URLConfig from "../URLConfig";
import Cookies from "js-cookie";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import axios, { post } from "axios";
import DocumentDetailsModal from "../OpportunityRelated/DocumentDetailsModal";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import "react-web-tabs/dist/react-web-tabs.css";
import Pagination from "react-js-pagination";

class PursuitDocuments extends Component {
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
      initialList: [],
      groupData: [],
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      templateSearchKey: "",
    };
  }

  componentDidMount() {
    this.LoadUserOppData();
    this.LoadTemplates();
    if (this.props.MasterData.geoRegions) {
      this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
        this.modifyGeoRegionData()
      );
    }
  }
  LoadTemplates = () => {
    const URL = URLConfig.GetPursuitDocumentsURL();
    axios.get(URL).then((res) => {
      if (res.data) {
        const ItemsPerPage = this.state.itemsCountPerPage;
        this.setState({
          Templates: res.data.slice(0, ItemsPerPage),
          ActualTemplatesData: res.data,
          isLoading: false,
          totalItemsCount: res.data?.length,
        });
      } else {
        this.setState({ isLoading: false });
      }
    });
  };

  LoadUserOppData = () => {
    const empnumber = Cookies.get("empnumber");
    const URL = URLConfig.GetPursuitDocumentsURL() + empnumber;
    axios.get(URL).then((res) => {
      if (res.data) {
        this.setState({ InProgressList: res.data, isLoading: false });
      } else {
        this.setState({ isLoading: false });
      }
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
        //this.props.refreshData();
      }
    });
  };
  GetPursuitUrl = (doc_Url) => {
    const CryptoJS = require("crypto-js");
    var DocumentUrl = CryptoJS.enc.Utf8.parse(
      doc_Url + "$$$$" + Cookies.get("empnumber") + "$$$$" + Cookies.get("name")
    );
    DocumentUrl =
      "https://delta.app.hpecorp.net:444/Aceoffix/editWord?q=" +
      CryptoJS.enc.Base64.stringify(DocumentUrl);
    return DocumentUrl;
  };
  handlePageChange = (pageNumber) => {
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const end =
      pageNumber * this.state.itemsCountPerPage >
      this.state.totalItemsCount.length
        ? this.state.totalItemsCount.length
        : pageNumber * this.state.itemsCountPerPage;
    const list = this.state.ActualTemplatesData.slice(begin, end);
    this.setState({ activePage: pageNumber, Templates: list });
  };
  handleSearch = (evt) => {
    const searchKey = evt.target.value.trim();
    this.setState(
      {
        templateSearchKey: searchKey,
      },
      () => {
        if (searchKey.length > 2) {
          const Docs = this.state.ActualTemplatesData.filter(
            (x) => x.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
          );
          this.setState({
            Templates: Docs,
            totalItemsCount: Docs?.length,
            activePage: 0,
            SearchInitiated: true,
          });
        } else if (searchKey.length == 0) {
          if (this.state.SearchInitiated) {
            const ItemsPerPage = this.state.itemsCountPerPage;
            const Docs = this.state.ActualTemplatesData.slice(0, ItemsPerPage);
            const totalItemsCount = this.state.ActualTemplatesData.length;
            this.setState({
              Templates: Docs,
              totalItemsCount: totalItemsCount,
              activePage: 0,
              SearchInitiated: true,
            });
          }
        }
      }
    );
  };
  render() {
    const MasterData = this.props.MasterData;
    const { PursuitDoc } = this.props;
    const Domain = URLConfig.Domain();
    return (
      <Fragment>
        <Tabs defaultTab="vertical-tab-inprogress" vertical>
          <TabList>
            <Tab tabFor="vertical-tab-new">New</Tab>
            <Tab tabFor="vertical-tab-inprogress">
              In Progress ({this.state.InProgressList?.length})
            </Tab>
          </TabList>
          <TabPanel tabId="vertical-tab-new">
            {!this.state.isLoading && (
              <Fragment>
                <div className="col-12 row">
                  <div className="col-12">
                    <h6>
                      Please click on one of the available templates to proceed
                      with document creation.
                    </h6>
                  </div>
                </div>
                <div className="col-sm-12 row">
                  <div className="col-sm-4 mt-2" id="tagged">
                    <div className="mb-12">
                      <h6>KSO recommended template</h6>
                    </div>
                    <Fragment>
                      <table className="table-borderless" width="100%">
                        <tbody>
                          <tr className="mb-2">
                            <td className="border-none" width="50%"></td>
                          </tr>
                          <tr>
                            <td className="pt-2">
                              {
                                <a
                                  href="_blank"
                                  className={"fa fa-file-word word-file"}
                                ></a>
                              }
                              <a
                                href={
                                  "javascript:AceBrowser.openWindowModeless('" +
                                  this.GetPursuitUrl(
                                    "https://delta.app.hpecorp.net:444/Uploads/SOWTemplate/SoW%20Template.docx"
                                  ) +
                                  "','width=1200px;height=800px;');"
                                }
                              >
                                {"SoW"}
                              </a>
                            </td>
                          </tr>

                          <tr>
                            <td colSpan="2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </Fragment>
                  </div>

                  <div className="col-sm-6 mt-2" id="tagged">
                    <div className="mb-12">
                      <h6>Other templates</h6>
                    </div>
                    {this.state.Templates && this.state.Templates.length > 0 && (
                      <Fragment>
                        <div className="mb-2">
                          <input
                            type="text"
                            className="form-control form-control-sm col-4"
                            placeholder="Find a file"
                            value={this.state.templateSearchKey}
                            onChange={this.handleSearch}
                          ></input>
                        </div>
                        <table className="table-borderless" width="100%">
                          <tbody>
                            <tr className="mb-2">
                              <td className="border-none" width="50%"></td>
                            </tr>
                            {this.state.Templates.map((value, index) => (
                              <tr key={index}>
                                <td className="pt-2">
                                  {
                                    <a
                                      href="_blank"
                                      className={identifyFileFormat(
                                        value.name.toLowerCase()
                                      )}
                                    ></a>
                                  }
                                  <a
                                    href={
                                      "javascript:AceBrowser.openWindowModeless('" +
                                      this.GetPursuitUrl(value.url) +
                                      "','width=1200px;height=800px;');"
                                    }
                                  >
                                    {value.name.split(".")[0]}
                                  </a>
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="2">
                                <div>
                                  <Pagination
                                    prevPageText="<"
                                    nextPageText=">"
                                    firstPageText="<<"
                                    lastPageText=">>"
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={
                                      this.state.itemsCountPerPage
                                    }
                                    totalItemsCount={this.state.totalItemsCount}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Fragment>
                    )}
                  </div>
                </div>
              </Fragment>
            )}
          </TabPanel>
          <TabPanel tabId="vertical-tab-inprogress">
            {!this.state.isLoading && (
              <div className="col-sm-8 mt-2" id="tagged">
                <div className="mb-2">
                  <h6>In Progress</h6>
                </div>
                {this.state.InProgressList &&
                  this.state.InProgressList.length > 0 && (
                    <table className="table-borderless" width="100%">
                      <tbody>
                        <tr className="border-bottom mb-2">
                          <td className="border-none">
                            <strong>Opportunities</strong>
                          </td>
                          <td className="border-none" width="50%">
                            <strong>Document Name</strong>
                          </td>
                          <td className="border-none">
                            <strong>Uploaded Date</strong>
                          </td>
                          <td className="border-none"></td>
                        </tr>
                        {this.state.InProgressList.map((value, index) => (
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
                              <a
                                target="_blank"
                                href={Domain + value.documentPath}
                              >
                                {value.name}
                              </a>
                            </td>
                            <td className="pt-2">
                              {formatDate(value.uploadedDt)}
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
                            {/* <td className="pt-2">
                        <button type="button" className="btn btn-light p-1 pointer" onClick={()=>this.RemoveInprogress(value.id)}>
                        <i className="fas fa-trash" aria-hidden="true"></i>
                        </button>
                        </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
              </div>
            )}
          </TabPanel>
        </Tabs>
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
                }} translate="no"
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
              />
            )}
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}
export default PursuitDocuments;
