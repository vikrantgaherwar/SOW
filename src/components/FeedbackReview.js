import React from 'react';
import 'bootstrap'
import HeaderForm from './HeaderForm';
import '../css/anps.css';
import axios, {post} from 'axios'
import URLConfig from './URLConfig'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from 'js-cookie'


class FeedbackReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            QueueData : [],
            myBinData : [],
            showMyBin : true,
            selectedTitle: '',
            selectedId: 0,
            selectedComment : '',
            selectedDocList : [],
            startDate: new Date(),
            accept: false,
            displayAssign : true,
            selectedComments :[]
        }
        this.toggleMyBin = this.toggleMyBin.bind(this);
        this.populateFeedbackDetails = this.populateFeedbackDetails.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.acceptFeedback = this.acceptFeedback.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.AssignFeedBack = this.AssignFeedBack.bind(this);

    }
    handleChange(event) {
        this.setState({selectedStatus: event.target.value});
    }
    acceptFeedback(){
        this.setState({accept:true});
    }
    AssignFeedBack(){
    
        const url = URLConfig.getURL_SiteFeedBack() + '/assignfeedbackitem/';
        post(url, {
          id: this.state.selectedId,
          detailedFeedBack: document.getElementById("userComments").value,
          userId : Cookies.get("empnumber"),
          userName : Cookies.get("name"),
          status : this.state.selectedStatus,
          type : document.getElementById("feedbacktype").value,
          nfDt : this.state.startDate
      }).then(res => { 
        if(res.data){
           //this.setState({title:"", comments:"",filesUrl : null});
           window.location.href = window.location.href;
        };
    });
    }
    toggleMyBin(show){
        this.setState({showMyBin: show});
    }
    setStartDate(date){
        this.setState({startDate: date})
    }
    getQueueData(){
        const URL = URLConfig.getURL_SiteFeedBack();
        axios.get(URL)
          .then(res => { 
            if(res.data){
               this.setState({QueueData: res.data})
            }
            else{
              console.log("No Employee Data Found!!");
            }
        });
    }
    getMyBinData(){
        const UserId = Cookies.get("empnumber");
        const URL = URLConfig.getURL_SiteFeedBack()+ "/"+UserId;
        axios.get(URL)
          .then(res => { 
            if(res.data){
               this.setState({myBinData: res.data})
            }
            else{
              console.log("No Employee Data Found!!");
            }
        });
    }
    componentDidMount(){
        this.getMyBinData();
        this.getQueueData();

    }
    populateFeedbackDetails(feedbackId){ 
        var SelectedFeedackDetails = this.state.QueueData.filter(x=>x.id === feedbackId)[0];
        this.setState({selectedId: SelectedFeedackDetails.id, accept:false,selectedTitle : SelectedFeedackDetails.title, selectedComment:  SelectedFeedackDetails.feedback, selectedDocList: JSON.parse(SelectedFeedackDetails.attchmentsUrl)
            ,selectedStatus :    SelectedFeedackDetails.statusNavigation.status       
        })
    }
    getComments(feedbackID) {
        const UserId = Cookies.get("empnumber");
        const URL = URLConfig.getURL_SiteFeedBack() +"/" + feedbackID +"/" +UserId;
        axios.get(URL)
          .then(res => { 
            if(res.data){ 
               this.setState({selectedComments: res.data})
            }
            else{
              console.log("No Employee Data Found!!");
            }
        });
    }
    populateBinFeedbackDetails(feedbackId){
        var SelectedFeedackDetails = this.state.myBinData.filter(x=>x.id === feedbackId)[0];
        this.setState({displayAssign:false,selectedId: SelectedFeedackDetails.id, accept:true,selectedTitle : SelectedFeedackDetails.title, selectedComment:  SelectedFeedackDetails.feedback, selectedDocList: JSON.parse(SelectedFeedackDetails.attchmentsUrl)
            ,selectedStatus :  SelectedFeedackDetails.statusNavigation.status       
        })

        this.getComments(SelectedFeedackDetails.id);
    }
    formarDate(date){
        var d = new Date(date);
        return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

// 16-05-2015 09:50
    }
    render() {
        const startDate = new Date();
        const activeclass = this.state.showMyBin;
        return (
            <div>
                <HeaderForm></HeaderForm>
                <div id="maincontainer" className="container-fluid">
                <div className="container-fluid pt-3">
                    <div className="col-12 row">
                <div className="col-1 ml-5" >
                    <div className="row mb-2">
                        <button type="button" className={`btn ${activeclass ? "btn-success" : "btn-light"} btn-sm btn-width100`} onClick={()=>this.toggleMyBin(true)}>My Bin</button>
                    </div>
                    <div className="row">
                        <button type="button" className={`btn ${!activeclass ? "btn-success" : "btn-light"} btn-sm btn-width100`} onClick={()=>this.toggleMyBin(false)}>Queue</button>
                    </div>
                </div>
                {this.state.showMyBin &&
                <div className="col-10">
                <h4>My Bin</h4>
                {this.state.myBinData.length > 0 && 
                <table className="table table-bordered table-sm" width="100%" cellSpacing="0" cellPadding="0" border="0">
                <tbody>
                <tr>
                    <th width="150">Feedback ID</th>
                    <th width="350">Title</th>
                    <th>Feedback by</th>
                    <th>Feeback On</th>
                    <th>NFDT</th>
                    <th>Request Age</th>
                    <th>Status</th>
                </tr>
                {this.state.myBinData.map((list,index) =>
                  <tr key={index}>
                  <td><a href="" data-toggle="modal" className="pointer" data-target="#request" onClick={()=>this.populateBinFeedbackDetails(list.id)}>{list.id}</a></td>
                      <td>{list.title}</td>
                      <td>{list.feedbackByName}</td>
                      <td>{this.formarDate(list.dt)}</td>
                      <td>{this.formarDate(list.nfDt)}</td>
                      <td>0</td>
                      <td>{list.statusNavigation.status}</td>
                  </tr>
                )}
                </tbody>
                </table>
                }
               </div>
                }
                {!this.state.showMyBin &&
                <div className="col-10">
                <h4>Queue</h4>
                <div className="col-12">
                {this.state.QueueData.length > 0 && 
                <table className="table table-bordered table-sm" width="100%" cellSpacing="0" cellPadding="0" border="0">
                <tbody>
                <tr>
                    <th width="150">Feedback ID</th>
                    <th width="350">Title</th>
                    <th>Feedback by</th>
                    <th>Feeback On</th>
                    <th>NFDT</th>
                    <th>Request Age</th>
                    <th>Status</th>
                </tr>
                {this.state.QueueData.map((list,index) =>
                  <tr id={index}>
                  <td><a href="" data-toggle="modal" className="pointer" data-target="#request" onClick={()=>this.populateFeedbackDetails(list.id)}>{list.id}</a></td>
                      <td>{list.title}</td>
                      <td>{list.feedbackByName}</td>
                      <td>{this.formarDate(list.dt)}</td>
                      <td></td>
                      <td>0</td>
                      <td>{list.statusNavigation.status}</td>
                  </tr>
                )}
                </tbody>
                </table>
                }
                </div>
                </div>
                }
                </div>
                </div>
                </div>
                <footer>
                  <p>© Copyright 2020 Hewlett Packard Enterprise Pvt. Ltd.</p>
                  <p>The tool works best with Google Chrome and Mozilla Firefox.</p>
                </footer>
                <div className="modal fade show" id="request" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-width" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">A&amp;PS Delta Feedback</h5>
                        <button type="button" className="close" translate="no" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                    <div className="col-12">
                    <div className="form-group-sm">
                    {this.state.displayAssign &&
                    <button className="btn btn-danger btn-sm float-right mb-2" onClick={()=>this.acceptFeedback()}>Accept</button>
                    }
                     <label htmlFor="feedbacktitle"><strong>Title</strong></label>
                    <input type="text" id="feedbacktitle" className="feedbacktitle" disabled value={this.state.selectedTitle}></input>
                    </div>
                    </div>
                <div className="col-12 mt-2">
                    <div className="form-group-sm">
                    <label htmlFor="feedbacktitle"><strong>Detailed Feedback</strong></label>
                    <textarea className="form-control" id="userActivityComment" rows="3" disabled value={this.state.selectedComment}></textarea>  </div>
                </div>
                {this.state.selectedDocList.length > 0 &&
                <div className="col-12 mt-2 row" align="left">
                    <div className="col-12">
                <div className="row col-12"><strong>Uploaded Documents</strong></div>
                {this.state.selectedDocList.map((list,index)=>
                    <div className="row col-12"><a target="_blank" href={URLConfig.getURL_SiteFeedBack_Upload()+list}>{list}</a></div>
                )}
                </div>
                </div>
                }
                {this.state.accept &&
                <div className="col-12 mt-2" align="left">
                <div className="row">
                    <div className="col-4"><DatePicker selected={this.state.startDate} onChange={date => this.setStartDate(date)} /></div>
                    <div className="col-4">
                <select className="form-control form-control-sm feedbacktitle" id="feedbacktype">
                <option value="Issue">Issue</option>
                <option value="Enhancement Request">Enhancement Request</option>
                <option value="Query">Query</option>
                <option value="Appreciation">Appreciation</option>
                <option value="Apprehensions">Apprehensions</option>
                </select>
                </div>
                <div className="col-4">
                <select className="form-control form-control-sm feedbacktitle" value={this.state.selectedStatus} onChange={this.handleChange}>
                <option value="1">New</option>
                <option value="2">Active</option>
                <option value="3">Pending</option>
                <option value="4">Scheduled</option>
                <option value="5">Review</option>
                <option value="6">Closed</option>
                </select>
                </div>
                </div>

                <div className="col-12 mt-2 p-0">
                <div className="form-group">
                    <textarea className="form-control" id="userComments" rows="3"></textarea>
                </div>
                </div>

                <div className="col-12 mt-2 p-0">
                {this.state.selectedComments.length >0 &&
                <div>
                {this.state.selectedComments.map((item,index)=>
                    <div id="feedackadded" key={index}>
                    <div className="row">
                    <div className="col-6"><strong>Added by: {item.commentsBy}</strong></div>
                    <div className="col-6"><strong>Added on: {this.formarDate(item.dt)}</strong></div>
                    </div>
                    <div className="col-12 row">
                    {item.comments}
                    </div>
                </div> 
                )}
                </div>
                }
                </div>
                </div>
                 }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success btn-sm" onClick={()=>this.AssignFeedBack()}>Submit</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
export default FeedbackReview;