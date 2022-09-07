import React,{Fragment} from 'react';
import axios, {post} from 'axios'
import Cookies from 'js-cookie'
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import "react-web-tabs/dist/react-web-tabs.css";
import {MyWorkSpace_ByStatus,Assigned} from '../Constants'
import DocumentList from './DocumentList'
class MyWorkSpace extends React.Component {
    constructor() {
      super();
      this.state = {
        selectedTab : Assigned,
        data : [],
      }
    }
   
    componentDidMount(){
      if(this.props.data){
        var {data} = this.props;
        if(this.props.IsRefresh != true){
        const selectedTab = this.props.defaultTab != null ? this.props.defaultTab : Assigned;
        this.setState({data, selectedTab});
        }
        else{
          // const selectedTab = this.props.myWorkspaceDataTab != null ? this.props.myWorkspaceDataTab : Assigned;
          var selectedTab;
          if (this.props.myWorkspaceDataTab == ""){
            selectedTab = Assigned;
          }
          else selectedTab = this.props.myWorkspaceDataTab != null ? this.props.myWorkspaceDataTab : Assigned;
          this.setState({data, selectedTab});

      }
      }
    }
    OnTabChange= (selectedTabDetails) =>{
        this.setState({selectedTab: selectedTabDetails},()=>{
          this.props.refreshWorkspaceTabData(this.state.selectedTab)
         });
    }
    refresh = () =>{
      this.props.refresh(this.state.selectedTab);
    }
    static getDerivedStateFromProps(props, state) { 
      if (props.data.length != state.data.length) {
        return { data: props.data };
      }
      return null;
    }

    render() {
      const MasterData = this.props.MasterData;
      return (
        <Fragment>
          {this.state && this.state.data && 
         <Fragment>
         <div className="tab">
          {MyWorkSpace_ByStatus.map((value,index)=>{
              return <button key={index} className={this.state.selectedTab.name === value.name ? "tablinks Selected" : "tablinks"}
               onClick={()=>this.OnTabChange(value)}>{value.label} ({this.state.data[value.countLabel]})</button>
          })}
        </div>
        <div className="tabcontent">
        <div className="col-12 height-100vh">
        <DocumentList selectedCategory={this.state.selectedTab} MasterData={MasterData} refresh={()=>{this.refresh()}}></DocumentList>
        </div>
        </div>
        </Fragment>
         }
        </Fragment>
      );
    }
  }
export default MyWorkSpace