import React, {Fragment} from 'react';
import axios, {post} from 'axios'
import logo from '../img/loading-icon-animated.gif';
import URLConfig from '../URLConfig'
import Cookies from 'js-cookie'
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import "react-web-tabs/dist/react-web-tabs.css";
import InProgressDocuments from './InProgressDocuments'
import PublishedDocuments from './PublishedDocuments'
import UpForArchivalDocuments from './UpForArchivalDocuments'
import InActiveDocuments from './InActiveDocuments'
import ActionRequired from './ActionRequired'
import UploadDocuments from '../OpportunityRelated/UploadDocuments'
import ArchivedDocuments from '../OpportunityRelated/ArchivedDocuments';

class TaggedDocuments extends React.Component {
    constructor() {
      super();
      this.state = {
        selectedOppData : null,
        files : [],
        OppData : [],
        isLoading : true,
        selectedOppID : '',
        InProgressList : [],
        PublishedDocuments : [],
        UpForArchivalList : [],
        InActiveList : [],
        ArchivedList : [],
        UnpublishList: [],
        ActionReqList : [],
        OppIds : [],
        MasterDataOther:{}
      };
    }
    ItemClick = (selectedOppData) =>{
      //alert(selectedOppData.oppId);
      //this.setState({selectedOppData: selectedOppData, selectedOppID : selectedOppData.oppId});
      this.setState({isLoading: true, selectedOppID : selectedOppData.oppId},()=>{
        this.GetAllDocumentsByOppID(selectedOppData.oppId);
      }); 
    }
    UpdateMasterTableDataOthers()
    {
      debugger;
      const otherURL = URLConfig.GetAllOtherMasterTablesDataURL();
      axios.get(otherURL).then((res) => {
        if (res.data) {
          this.setState({
            MasterDataOther:res.data
          });
        }
      });
    }

    LoadUserOppData = ()=>{
      debugger;
      const empnumber = Cookies.get("empnumber");
      //if(this.state.OppIds.length){
      this.UpdateMasterTableDataOthers();
      let OppIds = this.state.OppIds;
      OppIds = OppIds.length === 0 ? "NoData" : OppIds.join();
      const URL = URLConfig.GetOpportunityRelatedAPIURL() + empnumber + "/" + OppIds;
      axios.get(URL).then(res => { 
      if (res.data) {
              this.setState({InProgressList : res.data.inProgress, opportunityList : res.data.opportunityList,
                             PublishedDocuments :  res.data.published, UpForArchivalList : res.data.upForArchival,
                             InActiveList : res.data.inActive, ActionReqList : res.data.actionRequired, UnpublishList : res.data.unPublished,
                             ArchivedList : res.data.archived, isLoading : false
                            });
          }
          else{
            this.setState({isLoading : false});
          }
        });
      // }
      // else{
      //   this.setState({isLoading : false});
      // }
    }
    loaded= ()=>{
      this.setState({isLoading : false});
    }
    refreshPageAfterUpload =() =>{
      this.setState({ isLoading : true}, ()=>{
        this.LoadUserOppData();
      });
    }
    
    showMetaInfoPopUp = (data) =>{
      this.setState({SelectedDoc : data});
    }
    SaveData = (docData) =>{
      const url = URLConfig.EditDocumentDetails();
        post(url, docData).then(res => { 
        if(res.data){
          this.setState({isLoading : false});
          //refresh Document
          this.refreshData();
        };
    });
    }
    refreshData(){
      //this.LoadUserOppData();
    }
    GetUserOppByMail= ()=>{
      const mail = Cookies.get("mail");
      // const mail = "devin.brodie%40safarimicro.com";
      const config = URLConfig.GetOppDetailsByMailID(mail);
      axios(config).then(res => { 
      
      if (res.data) {
             this.setState({OppIds : res.data.response.map(x=>x.Opportunity_ID__c)}
             ,()=>{this.LoadUserOppData()})
          }
          else{
            this.setState({isLoading : false});
          }
        });
    }
    componentDidMount(){
      
      this.GetUserOppByMail();
      //this.LoadUserOppData();
    }
    onOppValueChange = (e) =>{
      const selectedOppID = e.target.value;
      this.setState({selectedOppID});
      this.props.redirect(selectedOppID);
    }
    render() {
      const MasterData = this.props.MasterData;
      const DefaultTab = this.props.default;
      return (
        <Fragment>
              {this.state.isLoading &&
                <div className="text-center">
                <img className="loading-img" src={logo} alt="loading"></img>
              </div>
              }
          { !this.state.isLoading &&
          <div className="" id="tagged">
            <Tabs defaultTab="vertical-tab-inprogress" vertical>
              <TabList>
                <Tab tabFor="vertical-tab-new">New</Tab>
                <Tab tabFor="vertical-tab-inprogress">In Progress ({this.state.InProgressList.length})</Tab>
                <Tab tabFor="vertical-tab-published">Published Documents ({this.state.PublishedDocuments.length})</Tab>
                <Tab tabFor="vertical-tab-actionrequired">Action Required ({this.state.ActionReqList.length})</Tab>
                <Tab tabFor="vertical-tab-unpublished">Un-Published Documents ({this.state.UnpublishList.length})</Tab>
                <Tab tabFor="vertical-tab-upforarchival">Up for Archival ({this.state.UpForArchivalList.length})</Tab>
                <Tab tabFor="vertical-tab-Archived">Archived ({this.state.ArchivedList.length})</Tab>
                <Tab tabFor="vertical-tab-inactive">Inactive ({this.state.InActiveList.length})</Tab>
              </TabList>
              <TabPanel tabId="vertical-tab-new">
              { !this.state.isLoading &&
                <div>
                  <div className="col-sm-12 mt-2" id="tagged">
                    <div className="col-12"><h6>Upload Documents</h6>
                     <select className="form-control form-control-sm col-4" onChange={this.onOppValueChange} value={this.state.selectedOppID && this.state.selectedOppID !== '' ? this.state.selectedOppID : ''}>
                      <option disabled value=''> -- select an Opportunity -- </option>
                      {this.state.OppIds && this.state.OppIds.length > 0 &&
                      this.state.OppIds.map((name,index) => 
                      <option value={name} key={index}>{name}</option>
                      )}
                    </select>
                    {this.state.selectedOppID !== '' &&
                    <UploadDocuments MasterData={MasterData} count={this.state.InProgressList.length} refreshData={this.refreshPageAfterUpload} oppId={this.state.selectedOppID} key={Math.random()}></UploadDocuments>
                    }
                    </div>
                </div>
                </div>
              }
              </TabPanel>
              <TabPanel tabId="vertical-tab-inprogress">
              { !this.state.isLoading &&
                <div className="col-sm-12 mt-2" id="tagged">
                    <div className="col-12"><h6>In Progress</h6></div>
                    <InProgressDocuments count={this.state.InProgressList.length} 
                    docs={this.state.InProgressList} MasterData={MasterData} 
                    refreshData={this.refreshPageAfterUpload}  
                    key={Math.random()}></InProgressDocuments> 
                </div>
              }
              </TabPanel>
              <TabPanel tabId="vertical-tab-published">
              {this.state.PublishedDocuments.length > 0  && 
              <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12"><h6>Published Documents</h6></div>
                  <PublishedDocuments count={this.state.PublishedDocuments.length} 
                  docs={this.state.PublishedDocuments} MasterData={MasterData} 
                  refreshData={this.refreshPageAfterUpload}  
                  MasterDataOther={this.state.MasterDataOther}
                  key={Math.random()}></PublishedDocuments>
                  </div>
              }
              </TabPanel>
              <TabPanel tabId="vertical-tab-actionrequired">
              {this.state.ActionReqList.length > 0  && 
              <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12"><h6>Pending for Information</h6></div>
                  <ActionRequired count={this.state.ActionReqList.length} 
                  docs={this.state.ActionReqList} MasterData={MasterData} 
                  refreshData={this.refreshPageAfterUpload}  
                  key={Math.random()}></ActionRequired>
                  </div>
              }
              </TabPanel>
              <TabPanel tabId="vertical-tab-upforarchival">
              {this.state.UpForArchivalList.length > 0  && 
              <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12"><h6>Up for Archival</h6></div>
                  <UpForArchivalDocuments count={this.state.UpForArchivalList.length} 
                  docs={this.state.UpForArchivalList} MasterData={MasterData} 
                  refreshData={this.refreshPageAfterUpload}  
                  key={Math.random()}></UpForArchivalDocuments>
                  </div>
              }
              </TabPanel>
              <TabPanel tabId="vertical-tab-inactive">
              {this.state.InActiveList.length > 0  && 
              <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12"><h6>Inactive</h6></div>
                  <InActiveDocuments count={this.state.InActiveList.length} 
                  docs={this.state.InActiveList} 
                  MasterData={MasterData} 
                  refreshData={this.refreshPageAfterUpload}  
                  key={Math.random()}></InActiveDocuments>
                  </div>
              }
              </TabPanel>
              <TabPanel tabId="vertical-tab-unpublished">
              {this.state.UnpublishList.length > 0  && 
              <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Un-Published Documents</h6></div>
                  <ArchivedDocuments 
                  count={this.state.UnpublishList.length} 
                  docs={this.state.UnpublishList} 
                  MasterData={MasterData} 
                  refreshData={this.refreshPageAfterUpload}  
                  key={Math.random()}>
                  </ArchivedDocuments>
                  </div>
              }
              </TabPanel>
              <TabPanel tabId="vertical-tab-Archived">
              {this.state.ArchivedList.length > 0  && 
              <div className="col-sm-12 mt-2" id="tagged">
                  <div className="col-12">
                    <h6>Archived</h6>
                  </div>
                  <ArchivedDocuments 
                    count={this.state.ArchivedList.length} 
                    docs={this.state.ArchivedList} 
                    MasterData={MasterData} 
                    refreshData={this.refreshPageAfterUpload}  
                    key={Math.random()}>
                  </ArchivedDocuments >
                  </div>
              }
              </TabPanel>
            </Tabs>
          </div>
          }
          </Fragment>
      );
    }
  }
export default TaggedDocuments