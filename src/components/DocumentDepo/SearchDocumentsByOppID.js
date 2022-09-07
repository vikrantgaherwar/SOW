import React, { Fragment } from "react";
import axios, {post} from 'axios'
import logo from "./img/loading-icon-animated.gif";
import URLConfig from "./URLConfig";
import UploadDocuments from "./OpportunityRelated/UploadDocuments";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-js-pagination";

class SearchDocumentsByOppID extends React.Component {
  constructor() {
    super();
    this.state = {
      docData: [],
      OppID: "",
      SelectedDoc: null,
      isLoading: true,
      DraftsitemsCountPerPage: 4,
      DraftsactivePage: 1,
      Inprogress: [],
      accountName:"",
    };
    this.LoadDocumentsByOppID = this.LoadDocumentsByOppID.bind(this);
    this.OnSelectDocument = this.OnSelectDocument.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }
  getAccountName(Opportunity) {
    debugger;
    const URL =
      "https://hpedelta.com:5003/api/v1/ml/predict?q=" +
      " " +
      "&opp_wbs_id=" +
      Opportunity;
    const config = URLConfig.ApplyAuth(URL);
    axios(config)
      .then((res) => {
        this.setState({
          accountName:res?.data?.psa_opportunity_details[0]?.Account_Account_ST_Name__c
        })
      })
  }
  LoadDocumentsByOppID(OppID) {
    this.getAccountName(OppID);
    const URL = URLConfig.SearchDocsByOppID() + OppID;
    const data = new FormData();
    data.append("oppId", OppID);
    post(URL, {}).then((res) => {
      if (res.data) {
        this.setState({docData: res.data,isLoading: false}
          ,() => this.paginate()
        );
      }
    });
  }
  componentDidMount() {
    const oppID = this.props.oppID;
    this.setState({ OppID: oppID });
    this.LoadDocumentsByOppID(oppID);
  }
  paginate = () => {
    const pageSize = this.state.DraftsitemsCountPerPage;
    this.setState({
      Inprogress: this.state.docData.slice(0, pageSize),
      TotalCount: this.state.docData.length,
      DraftstotalItemsCount: this.state.docData.length,
    });
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.docData;
    const begin =
      pageNumber * this.state.DraftsitemsCountPerPage -
      this.state.DraftsitemsCountPerPage;
    const end =
      pageNumber * this.state.DraftsitemsCountPerPage >
      this.state.docData.length
        ? this.state.docData.length
        : pageNumber * this.state.DraftsitemsCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({ DraftsactivePage: pageNumber, Inprogress: list });
  };
  componentDidUpdate = (prevState) => {
    if (prevState.oppID !== "" && prevState.oppID !== this.props.oppID) {
      this.setState({ OppID: this.props.oppID });
      this.LoadDocumentsByOppID(this.props.oppID);
    }
  };
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
  OnSelectDocument(Doc) {
    this.setState({ SelectedDoc: Doc.deltaDocumentDetails[0], Name: Doc.name });
  }
  refreshData() {
    this.setState({ isLoading: true });
    this.LoadDocumentsByOppID(this.state.OppID);
  }
  render() {
    const Domain = URLConfig.Domain();
    const MasterData = this.props.MasterData;
    return (
      <Fragment>
        <div className="col-sm-12">
          <div className="col-sm-12 no-margins tab-content float-left">
            <div className="col-md-4 right-divide float-left">
              {this.state.isLoading && (
                <div className="text-center">
                  <img className="loading-img" src={logo} alt="loading"></img>
                </div>
              )}
              {!this.state.isLoading && (
                <Fragment>
                  <ul
                    className="col-sm-6 nav nav-pills mb-3"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="pills-home-tab"
                        data-toggle="pill"
                        href="#pills-home"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                        aria-expanded="true"
                      >
                        <strong>Customer Opportunity Related</strong>
                      </a>
                    </li>
                  </ul>
                  <div
                    className="col-sm-12 no-margins tab-content float-left"
                    id="pills-tabContent"
                  >
                    <div
                      className="tab-pane fade active show"
                      id="pills-home"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                      aria-expanded="true"
                    >
                      <table className="table-sm table-striped table-bordered">
                        <thead>
                        <tr>
                            <th width="30%">Opportunities</th>
                            <th width="30%">Document Count</th>
                            <th width="40%">Account Name</th>
                          </tr>
                        </thead>
                        <tbody>
                        
                          <tr>
                            <td>{this.state.OppID}</td>
                            <td align="center">{this.state.docData.length}</td>
                            <td>{this.state.accountName}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
            <div className="col-md-8 float-left">
              {this.state.docData.length > 0 && !this.state.isLoading && (
                <div className="col-md-12 mt-3">
                  <table className="table-sm table-striped table-bordered" width="100%">
                    <tbody>
                      <tr className="border-bottom mb-2">
                        <td className="border-none" width="50%">
                          <strong>Document Name</strong>
                        </td>
                        <td colSpan="2" className="border-none">
                          <strong>Document Type</strong>
                        </td>
                      </tr>
                      {this.state.Inprogress.map((value, index) => (
                        <tr key={index}>
                          <td className="pt-2">
                            {
                              <a
                                className={this.identifyFileFormat(
                                  value.name.toLowerCase()
                                )}
                              ></a>
                            }
                            {value.name}
                          </td>
                          {value.deltaDocumentDetails.length > 0 && (
                            <td className="pt-2">
                              {value.deltaDocumentDetails[0].documentType}
                            </td>
                          )}
                          {value.documentPath && (
                            <td className="pt-2">
                              <button
                                type="button"
                                className="btn btn-light p-1 pointer"
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
                          )}
                        </tr>
                      ))}
                      {this.state.docData &&
                        this.state.docData.length > 4 &&
                        this.state.Inprogress.length > 0 && (
                          <tr>
                            <td colSpan="5">
                              <div className="text-center">
                                <Pagination
                                  prevPageText="<"
                                  nextPageText=">"
                                  firstPageText="<<"
                                  lastPageText=">>"
                                  activePage={this.state.DraftsactivePage}
                                  itemsCountPerPage={
                                    this.state.DraftsitemsCountPerPage
                                  }
                                  totalItemsCount={
                                    this.state.DraftstotalItemsCount
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
              )}
              {this.state.docData && !this.state.isLoading && (
                <UploadDocuments
                  refreshData={this.refreshData}
                  MasterData={MasterData}
                  count={this.state.docData.length}
                  oppId={this.state.OppID}
                  docs={this.state.docData}
                  key={Math.random()}
                ></UploadDocuments>
              )}
            </div>
          </div>
        </div>
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
export default SearchDocumentsByOppID;
