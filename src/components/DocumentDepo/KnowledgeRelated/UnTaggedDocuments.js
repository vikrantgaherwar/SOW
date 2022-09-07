import React from "react";
import axios, { post } from "axios";
import URLConfig from "../URLConfig";
import Cookies from "js-cookie";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import "react-web-tabs/dist/react-web-tabs.css";
import DraftDocuments from "./DraftDocuments";
import InProgressDocuments from "./InProgressDocuments";
import PublishedDocuments from "./PublishedDocuments";
import UpForArchivalDocuments from "./UpForArchivalDocuments";
import InActiveDocuments from "./InActiveDocuments";
import ActionRequired from "./ActionRequired";
import logo from "../img/loading-icon-animated.gif";
import popuplogo from "../img/element-popup-headers.png";
import ArchivedDocuments from "./ArchivedDocuments";

class UnTaggedDocuments extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedOppData: null,
      files: [],
      DraftsList: [],
      isLoading: false,
      selectedOppID: null,
      DraftsCount: 0,
      InProgressList: [],
      PublishedDocuments: [],
      UpForArchivalList: [],
      ArchivedList: [],
      InActiveList: [],
      ActionReqList: [],
      ActionReqTotal: 0,
      UnPublishedDocuments: [],
      MasterDataOther:{}
    };
    this.ItemClick = this.ItemClick.bind(this);
    this.showMetaInfoPopUp = this.showMetaInfoPopUp.bind(this);
    this.SaveData = this.SaveData.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }
  ItemClick(selectedOppData) {
    this.setState({ selectedOppData: selectedOppData });
  }

  SaveData(docData) {
    const url = URLConfig.EditDocumentDetails();
    post(url, docData).then((res) => {
      if (res.data) {
        this.setState({ isLoading: false });
        //refresh Document
        this.refreshData();
      }
    });
  }
  refreshData() {
    this.setState({ isLoading: true }, () => {
      this.GetAllDocuments();
    });
  }

  LoadDrafts = () => {
    const empnumber = Cookies.get("empnumber");
    const URL = URLConfig.DraftAPI() + empnumber;
    axios.get(URL).then((res) => {
      if (res.data) {
        this.setState({
          DraftsList: res.data,
          isLoading: false,
          DraftsCount: res.data.length,
        });
      }
    });
  };

  LoadInProgressDocs = () => {
    const mail = Cookies.get("mail");
    const empnumber = Cookies.get("empnumber");
    const URL = URLConfig.UnTaggedDocuemnts() + mail + "/" + empnumber;
    axios.get(URL).then((res) => {
      if (res.data) {
        this.setState({
          InProgressList: res.data,
          InProgressCount: res.data.length,
          isLoading: false,
        });
      }
    });
  };

  LoadPublishedDocs = () => {
    const mail = Cookies.get("mail");
    const empnumber = Cookies.get("empnumber");
    const URL = URLConfig.PublishedDocAPI() + empnumber;
    axios.get(URL).then((res) => {
      if (res.data) {
        this.setState({
          PublishedDocuments: res.data,
          PublishedDocsCount: res.data.length,
        });
      }
    });
  };
  GetUpForArchival = () => {
    const mail = Cookies.get("mail");
    const empnumber = Cookies.get("empnumber");
    const URL = URLConfig.GetUpForArchivalDocAPI() + empnumber + "/6"; // -- Pass Months before it is Archived...
    axios.get(URL).then((res) => {
      if (res.data) {
        this.setState({
          UpForArchivalList: res.data,
          UpForArchivalCount: res.data.length,
        });
      }
    });
  };
  GetInActiveDocuments = () => {
    const empnumber = Cookies.get("empnumber");
    const URL = URLConfig.GetInActiveDocsAPI() + empnumber;
    axios.get(URL).then((res) => {
      if (res.data) {
        this.setState({
          InActiveList: res.data,
          InActiveCount: res.data.length,
        });
      }
    });
  };

  showMetaInfoPopUp(data) {
    this.setState({ SelectedDoc: data });
  }
  GetAllDocuments = () => {
    this.UpdateMasterTableDataOthers();
    const empnumber = Cookies.get("empnumber");
    const URL = URLConfig.GetKnowledgeDocAPIURL() + empnumber;
    axios.get(URL).then((res) => {
      if (res.data) {
        this.setState({
          DraftsList: res.data.drafts,
          InProgressList: res.data.inProgress,
          PublishedDocuments: res.data.published,
          UpForArchivalList: res.data.upForArchival,
          InActiveList: res.data.inActive,
          ArchivedList: res.data.archived,
          ActionReqList: res.data.actionRequired,
          ActionReqTotal: res.data.actionRequired.total,
          isLoading: false,
          UnPublishedDocuments: res.data.unPublished,
        });
      }
    });
  };
  componentDidMount() {
    //this.LoadDrafts();
    //this.LoadInProgressDocs();
    //this.LoadPublishedDocs();
    //this.GetUpForArchival();
    //this.GetInActiveDocuments();
    this.setState({ isLoading: true }, () => {
      this.GetAllDocuments();
    });
  }
  UpdateMasterTableDataOthers()
  {
    debugger;
    const otherURL = URLConfig.GetAllOtherMasterTablesDataURL();
    axios.get(otherURL).then((res) => {
      if (res.data) {
        console.log(res.data);
        this.setState({
          MasterDataOther:res.data

        });
      }
    });
  }

  refreshDraftAndInProgress = () => {
    this.setState({ isLoading: true }, () => {
      this.LoadDrafts();
      this.LoadInProgressDocs();
    });
  };
  refreshInProgressAndInActive = () => {
    this.setState({ isLoading: true }, () => {
      this.GetInActiveDocuments();
      this.LoadInProgressDocs();
    });
  };
  refreshInProgressAndPublished = () => {
    this.setState({ isLoading: true }, () => {
      this.LoadInProgressDocs();
      this.LoadPublishedDocs();
    });
  };
  render() {
    const MasterData = this.props.MasterData;
    const Domain = URLConfig.Domain();
    return (
      <div
        className="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
        aria-expanded="false"
      >
        <div className="">
          <Tabs vertical defaultTab="vertical-tab-draft">
            <TabList>
              <Tab tabFor="vertical-tab-draft">
                Draft Documents ({this.state.DraftsList.length}/15)
              </Tab>
              <Tab tabFor="vertical-tab-inprogress">
                In Progress ({this.state.InProgressList.length})
              </Tab>
              <Tab tabFor="vertical-tab-published">
                Published Documents ({this.state.PublishedDocuments.length})
              </Tab>
              <Tab tabFor="vertical-tab-actionrequired">
                Action Required ({this.state.ActionReqTotal})
              </Tab>
              <Tab tabFor="vertical-tab-unpublished">
                Un-Published Documents ({this.state.UnPublishedDocuments.length}
                )
              </Tab>
              <Tab tabFor="vertical-tab-upforarchival">
                Up for Archival ({this.state.UpForArchivalList.length})
              </Tab>
              <Tab tabFor="vertical-tab-Archived">Archived ({this.state.ArchivedList.length})</Tab>
              <Tab tabFor="vertical-tab-inactive">
                Inactive ({this.state.InActiveList.length})
              </Tab>
            </TabList>
            <TabPanel tabId="vertical-tab-draft">
              {this.state.DraftsList.length === 0 && !this.state.isLoading && (
                <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Drafts</h6>
                  </div>
                  <DraftDocuments
                    count={this.state.DraftsList.length}
                    docs={this.state.DraftsList}
                    MasterData={MasterData}
                    refreshData={this.refreshData}
                    refreshDraftAndInProgress={this.refreshDraftAndInProgress}
                    key={Math.random()}
                    MasterDataOther={this.state.MasterDataOther}
                  ></DraftDocuments>
                </div>
              )}
              {this.state.DraftsList.length > 0 && (
                <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Drafts</h6>
                  </div>
                  <DraftDocuments
                    count={this.state.DraftsList.length}
                    docs={this.state.DraftsList}
                    MasterData={MasterData}
                    refreshData={this.refreshData}
                    key={Math.random()}
                    refreshDraftAndInProgress={this.refreshDraftAndInProgress}
                    MasterDataOther={this.state.MasterDataOther}
                  ></DraftDocuments>
                </div>
              )}
            </TabPanel>
            <TabPanel tabId="vertical-tab-inprogress">
              {this.state.InProgressList.length > 0 && !this.state.isLoading && (
                <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>In Progress</h6>
                  </div>
                  <InProgressDocuments
                    count={this.state.InProgressList.length}
                    docs={this.state.InProgressList}
                    MasterData={MasterData}
                    refreshData={this.refreshData}
                    key={Math.random()}
                    refreshInProgressAndInActive={
                      this.refreshInProgressAndInActive
                    }
                    MasterDataOther={this.state.MasterDataOther}
                  ></InProgressDocuments>
                </div>
              )}
            </TabPanel>
            <TabPanel tabId="vertical-tab-actionrequired">
              <div className="col-sm-12 mt-2" id="tagged">
                <ActionRequired
                  count={this.state.ActionReqList.length}
                  docs={this.state.ActionReqList}
                  MasterData={MasterData}
                  refreshData={this.refreshData}
                  key={Math.random()}
                ></ActionRequired>
              </div>
            </TabPanel>
            <TabPanel tabId="vertical-tab-published">
              {this.state.PublishedDocuments.length > 0 && (
                <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Published Documents</h6>
                  </div>
                  <PublishedDocuments
                    count={this.state.PublishedDocuments.length}
                    docs={this.state.PublishedDocuments}
                    MasterData={MasterData}
                    refreshData={this.refreshData}
                    key={Math.random()}
                    refreshInProgressAndPublished={
                      this.refreshInProgressAndPublished
                    }
                  ></PublishedDocuments>
                </div>
              )}
            </TabPanel>
            <TabPanel tabId="vertical-tab-upforarchival">
              {this.state.UpForArchivalList.length > 0 && (
                <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Up for archival</h6>
                  </div>
                  <UpForArchivalDocuments
                    count={this.state.UpForArchivalList.length}
                    docs={this.state.UpForArchivalList}
                    MasterData={MasterData}
                    refreshData={this.refreshData}
                    key={Math.random()}
                  ></UpForArchivalDocuments>
                </div>
              )}
            </TabPanel>
            <TabPanel tabId="vertical-tab-Archived">
              {this.state.ArchivedList.length > 0 && (
                <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Archived</h6>
                  </div>
                  <ArchivedDocuments
                    count={this.state.ArchivedList.length}
                    docs={this.state.ArchivedList}
                    MasterData={MasterData}
                    refreshData={this.refreshData}
                    key={Math.random()}
                  ></ArchivedDocuments>
                </div>
              )}
            </TabPanel>
            <TabPanel tabId="vertical-tab-unpublished">
              {this.state.UnPublishedDocuments.length > 0 && (
                <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Un-Published Documents</h6>
                  </div>
                  <ArchivedDocuments
                    count={this.state.UnPublishedDocuments.length}
                    docs={this.state.UnPublishedDocuments}
                    MasterData={MasterData}
                    refreshData={this.refreshData}
                    key={Math.random()}
                  ></ArchivedDocuments>
                </div>
              )}
            </TabPanel>
            <TabPanel tabId="vertical-tab-inactive">
              {this.state.InActiveList.length > 0 && (
                <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Inactive</h6>
                  </div>
                  <InActiveDocuments
                    count={this.state.InActiveList.length}
                    docs={this.state.InActiveList}
                    MasterData={MasterData}
                    refreshData={this.refreshData}
                    key={Math.random()}
                  ></InActiveDocuments>
                </div>
              )}
            </TabPanel>
          </Tabs>
        </div>
        {this.state.isLoading && (
          <div className="text-center">
            <img className="loading-img" src={logo} alt="loading"></img>
          </div>
        )}
      </div>
    );
  }
}
export default UnTaggedDocuments;
