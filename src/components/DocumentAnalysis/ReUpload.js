import React from 'react';
import 'bootstrap'
import HeaderForm from '../HeaderForm';
import '../../css/anps.css';
import URLConfig from './URLConfig'
import logo from '../DocumentDepo/img/loading-icon-animated.gif';
import axios from 'axios'
import UnTaggedModal from '../DocumentDepo/KnowledgeRelated/UnTaggedModal'
import ReUploadDocument from './ReUploadDocument'


class ReUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Document: null
        }
        this.GetDocumentDetails = this.GetDocumentDetails.bind(this);
        this.identifyFileFormat = this.identifyFileFormat.bind(this);
        this.getAllMasterData = this.getAllMasterData.bind(this);
        this.showMetaInfoPopUp = this.showMetaInfoPopUp.bind(this);
    }
    componentDidMount(){
        const CryptoJS = require("crypto-js");
        var urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('d')){
            var bytes = CryptoJS.AES.decrypt(urlParams.get('d').replace(/ /g,'+'), URLConfig.getEncKey());
            var decryptedUrl =  JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            this.setState({DocID: decryptedUrl[0].DocID});
            this.GetDocumentDetails(decryptedUrl[0].DocID);
            this.getAllMasterData();
        }
    }
    showMetaInfoPopUp(){
        const Doc = this.state.Document;
        this.setState({SelectedDoc : Doc});
    }
    getAllMasterData(){
        const URL = "https://delta.app.hpecorp.net:444/api/Document/GetAllMasterTablesData";
        axios.get(URL)
            .then(res => {
                this.setState({MasterData : res.data});
            });
    }
    GetDocumentDetails(DocID){
        const URL = URLConfig.GetDocumentDetails(DocID);
        axios.get(URL).then(res => { 
        if (res.data) {
          this.setState({Document : res.data});
        }
        });
    }
    identifyFileFormat(fileName){
        if (fileName.indexOf('.pdf') !== -1)
          return 'fa fa-file-pdf pdf-file';
        else if (fileName.indexOf('.docx') !== -1 || fileName.indexOf('.doc')!== -1)
          return 'fa fa-file-word word-file';
        else if (fileName.indexOf('.pptx') !== -1 || fileName.indexOf('.ppt')!== -1)
          return 'fa fa-file-powerpoint ppt-file';
        else if (fileName.indexOf('.xls') !== -1 || fileName.indexOf('.xl')!== -1)
          return 'fa fa-file-excel xl-file';
        else if (fileName.indexOf('.msg') !== -1)
          return 'fa fa-envelope-square mail-file';
        else if (fileName.indexOf('.mp4') !== -1)
          return 'fa fa-file-video xl-file';
          else if (fileName.indexOf('.zip') !== -1)
        return 'fas fa-file-archive file-zip';
        else
          return 'fa fa-external-link-square-alt xl-file';
  }
    render() {
        return (
            <div>
                <HeaderForm></HeaderForm>
                <div id="maincontainer" className="container-fluid mt-3 doc-analysis">
              <div id="" className="container-fluid">
              <div className="col-12">
              <div className="row">
              <div className="col-12">
              <div className="capsules mr-1">
              <div id="sectionheader3" className="col-12 pl-3 pt-2 pr-2">Upload Document</div>
              <div className="col-6 right-divide float-left">
              <table className="table table-sm table-striped">
                <tbody>
                <tr>
                  <th className="border-none">Document</th>
                  <th>Rejected By</th>
                  <th>Comments</th>
                  <th></th>
                </tr>  
                {this.state.Document !== null &&
                <tr>
                  <td>{<a className={this.identifyFileFormat(this.state.Document.name.toLowerCase())}></a>}
                      <a href={"https://delta.app.hpecorp.net:444/" + this.state.Document.documentPath}>{this.state.Document.name}</a></td>
                  <td>{this.state.Document.assignedToName}</td>
                  <td></td>
                  {this.state.MasterData &&
                  <td className="pt-2">
                    <button type="button" className="btn btn-light p-1" data-toggle="modal" data-target="#UnTaggedtaxonomy" onClick={()=>this.showMetaInfoPopUp()}>
                    <i className="fas fa-bars"></i>
                    </button>
                  </td>
                  }
                </tr>
                }           
                {this.state.Document === null &&
                <tr>
                  <td colSpan="2">
                   No Data Found
                  </td>
                </tr>
                }
              </tbody>
              </table>
              {/* { this.state.MasterData !== null && 
              <UnTaggedModal onSave={this.SaveData} MasterData={this.state.MasterData} docData={this.state.SelectedDoc}></UnTaggedModal>
              } */}
              </div>
              <div className="col-sm-6 float-right" id="tagged">
              <div className="col-12"><h6>Re Upload Document</h6></div>
              { this.state.MasterData !== null &&  this.state.Document != null &&
               <ReUploadDocument oppId={this.state.Document.oppId} DocID={this.state.Document.id}></ReUploadDocument>
              }
              </div>
    
              </div>
              </div>
              </div>
              </div>
              </div>
              </div>
                <footer>
                  <p>© Copyright 2020 Hewlett Packard Enterprise Pvt. Ltd.</p>
                  <p>The tool works best with Google Chrome and Mozilla Firefox.</p>
                </footer>
            </div>
        );
    }
}
export default ReUpload;