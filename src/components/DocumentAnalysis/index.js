import React, { Fragment, useEffect, useContext, useState,useRef } from "react";
import axios, { post } from "axios";
import logo from "../DocumentDepo/img/loading-icon-animated.gif";
import reportLogo from "../DocumentDepo/img/report-icon.png";
import Cookies from "js-cookie";
import briefCaseInnerlogo from "../../img/suitcaseiocn-nobg.png";
import URLConfig from "./URLConfig";
import MyWorkSpace from "./MyWorkSpace/index";
import QueuedDocs from "./DocsQueued/Index";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import "react-web-tabs/dist/react-web-tabs.css";
import { UserContext } from "../../UserContext";
import bootbox, { alert } from "bootbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import exportFromJSON from "export-from-json";
import { CSVLink } from "react-csv";
const Index = ({ MasterData, homeredirect, showDocDepo }) => {
  const [userDetails, dispatch] = useContext(UserContext);
  const [DataLoaded, setLoader] = useState(false);
  const [myWorkSpaceData, setMyWorkSpaceData] = useState([]);
  const [teamSpaceData, setTeamSpaceData] = useState([]);
  const [SelectedTabQueue, setSelectedTabQueue] = useState(null);
  const [SelectedTabMyWorkSpace, setSelectedTabMyWork] = useState(null);
  const signal = axios.CancelToken.source();
  const isAdmin = userDetails.UserRoles.indexOf("Admin") !== -1 ? true : false;
  const [DefaultTab, setDefaultTab] = useState("");
  const [refreshTab, setRefreshTab] = useState([]);
  const [refreshworkspaceTab, setworkspaceTab] = useState([]);
  const [refreshTabData, setRefreshTabData] = useState([]);
  const [refreshworkSpaceData, setworkSpaceData] = useState([]);
  const [isrefresh, setIsRefresh] = useState(false);
  const [isDocumentsQueued, setDocumentsQueued] = useState(false);
  const [isMyWorkspace, setMyWorkspace] = useState(false);
  const [isLoadReports, setLoadReports] = useState(false);
  const [submittedfromDate, setsubmittedfromDate] = useState();
  const [submittedtoDate, setsubmittedtoDate] = useState();
  const [IsPopUpDisplay, setIsPopUpDisplay] = useState(false);
  const [publishedfromDate, setpublishedfromDate] = useState();
  const [publishedtodate, setpublishedtodate] = useState();
  const [reportData, setreportData] = useState([]);
  const csvLink = useRef();
  const [requiredFiledDisable, setrequiredFiledDisable] = useState(true);
  const getMyWorkSpaceData = async (cancelToken, userDetails) => {
    return await axios.get(
      URLConfig.GetMyWorkSpaceDocumentsCount() + userDetails.empNumber,
      { cancelToken }
    );
  };

  const getTeamViewData = async (cancelToken) => {
    return await axios.get(URLConfig.GetQueuedDocumentsCount(), {
      cancelToken,
    });
  };

  useEffect(() => {
    Promise.all([
      getMyWorkSpaceData(signal.token, userDetails),
      getTeamViewData(signal.token),
    ]).then(function (results) {
      if (isAdmin) {
        setDefaultTab("vertical-tab-queue");
      } else {
        setDefaultTab("vertical-tab-myworkspace");
      }
      setMyWorkSpaceData(results[0].data);
      setTeamSpaceData(results[1].data);
      setLoader(true);
    });
  }, []);

  const refresh = () => {
    setLoader(false);
    setMyWorkSpaceData([]);
    setTeamSpaceData([]);
    Promise.all([
      getMyWorkSpaceData(signal.token, userDetails),
      getTeamViewData(signal.token),
    ]).then(function (results) {
      setMyWorkSpaceData(results[0].data);
      setTeamSpaceData(results[1].data);
      setLoader(true);
    });
  };
  const refreshData = (tab, data) => {
    if (data !== "") {
      setDocumentsQueued(true);
      setRefreshTab(tab);
    }
  };
  const refreshDataWorkspace = (data) => {
    if (data !== "") {
      setMyWorkspace(true);
      setworkspaceTab(data);
    }
  };
  const refreshWithSelectedTabQueue = (SelectedTabQueue) => {
    setSelectedTabQueue(SelectedTabQueue);
    setDefaultTab("vertical-tab-queue");
    refresh();
  };
  const refreshWithSelectedTabWorkSpace = (SelectedTabMyWorkSpace) => {
    setSelectedTabMyWork(SelectedTabMyWorkSpace);
    setDefaultTab("vertical-tab-myworkspace");
    refresh();
  };
  const resetTabsAndRefresh = () => {
    setSelectedTabQueue(null);
    setSelectedTabMyWork(null);
    if (isAdmin) {
      setDefaultTab("vertical-tab-queue");
    }
    if (!isAdmin) {
      setDefaultTab("vertical-tab-myworkspace");
    }
    if (isDocumentsQueued) {
      setIsRefresh(true);
      setDefaultTab("vertical-tab-queue");
      setRefreshTabData(refreshTab);
      setDocumentsQueued(false);
    }

    if (isMyWorkspace) {
      setIsRefresh(true);
      setDefaultTab("vertical-tab-myworkspace");
      setworkSpaceData(refreshworkspaceTab);
      setMyWorkspace(false);
    }
    refresh();
  };
  const ShowDeltaReports = () => {
    document.getElementById("login").submit();
    // var req = new XMLHttpRequest();
    //       req.onreadystatechange = function() {
    //         if (this.readyState == 4 && this.status == 200) {
    //           debugger;
    //           // Typical action to be performed when the document is ready:
    //           setLoadReports(true);

    //         }
    //     };
    //     req.open("POST","https://readuser:Readuser1220@hpedelta.com:8983/solr/banana/src/index.html#/dashboard/file/DeltaDashboard",false); //use POST to safely send combination
    //     req.send(null); //here you
  };

  const PopupDocReport = () => {
    setIsPopUpDisplay(true);
  };
  const ExportToExcel = async () => {
    debugger;
         const documentReportRequest = {
        SubmittedFrom: submittedfromDate,
        SubmittedTo: submittedtoDate,
        PublishedFrom: publishedfromDate,
        PublishedTo: publishedtodate
      };
      const url = URLConfig.GetDocument_URL();
      debugger;
      const res = await axios.post(url , documentReportRequest);
      const data = res.data;
      setreportData(data)
      csvLink.current.link.click()
      debugger;
  }
  const submittedfromDateFun = (date)=>{
    setsubmittedfromDate(date);
    setrequiredFiledDisable(false);
    
  }
  
  const publishedfromDateFun = (date)=>{
    setpublishedfromDate(date);
    setrequiredFiledDisable(false);
    
  }

  const Reset = () => {
    setsubmittedfromDate();
    setsubmittedtoDate();
    setpublishedfromDate();
    setpublishedtodate();
  }

  const headers = [
    { label: "Document Title", key: "documentName" },
    { label: "Status", key: "status" },
    { label: "Submitted By", key: "submittedby" },
    { label: "Submitted Date", key: "submittedDate" },
    { label: "Document Type", key: "document_Type" },
    { label: "Disclosure", key: "disclosure" },
    { label: "Country", key: "country" },
    { label: "Last Modified By", key: "lastModifiedBy" },
    { label: "Last Modified Date", key: "lastModifiedDt" },
    { label: "Planned Shelf Life", key: "plannedShelfLife" },
    { label: "Technical Reviewer", key: "technicalReviewer" },
    { label: "KSO Owner", key: "ksoOwner" },
    { label: "Published Date", key: "publishedDate" },
  
  ];
  return (
    <Fragment>
      <div
        id="maincontainer"
        className="container-fluid doc-analysis height-90vh"
      >
        <div className="col-12 p-1 height-100vh">
          <div className="pt-0 height-100vh" id="depot">
            {!isLoadReports && (
              <>
                <div id="sectionheader3" className="col-12 pl-3 pt-2 pr-2 mb-2">
                  <span
                    className="Home_logo"
                    title="Home"
                    style={{ cursor: "pointer", color: "#0d5265" }}
                  >
                    <a onClick={homeredirect}>
                      <i class="fas fa-home"></i>
                    </a>
                  </span>
                  DOCUMENT ANALYSIS
                  <span
                    className="Home_logo"
                    title="My Documents"
                    style={{
                      float: "right",
                      cursor: "pointer",
                      color: "#0d5265",
                    }}
                  >
                    <i class="fas fa-briefcase mr-1" onClick={showDocDepo}></i>
                  </span>
                  <span
                    title="Click here to open Utilization Dashboard"
                    style={{
                      right: "0px",
                      float: "right",
                      cursor: "pointer",
                      color: "#0d5265",
                    }}
                  >
                    <a
                      onClick={() => {
                        ShowDeltaReports();
                      }}
                    >
                      <i class="fas fa-chart-line mr-3"></i>
                    </a>
                  </span>
                  <span
                    className="Home_logo"
                    title="Refresh"
                    style={{
                      float: "right",
                      cursor: "pointer",
                      color: "#0d5265",
                    }}
                  >
                    <a
                      onClick={() => {
                        resetTabsAndRefresh();
                      }}
                    >
                      <i class="fas fa-sync-alt mr-1"></i>
                    </a>
                  </span>
                   <span
                    className="Home_logo"
                    title="Export"
                    style={{
                      float: "right",
                      cursor: "pointer",
                      color: "#0d5265",
                    }}
                  >
                    <i
                      class=" mr-1 fas fa-download"
                      aria-hidden="true"
                      onClick={() => {
                        PopupDocReport();
                      }}
                    ></i>
                  </span> 
                </div>
                {IsPopUpDisplay && <div>
                  <Modal show={true}>
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <div className='row'>
                          <div className='col-md-12'>
                            <form name="form" class="form-inline">
                              <div class="form-group">
                                <label for="startDate" className='pr-1'>Submitted From</label>
                                <DatePicker className='form-control form-control-sm'
                                selected={submittedfromDate} onChange={(date) => submittedfromDateFun(date)} 
                                placeholderText="select date(dd/mm/yy)"
                                />
                                &nbsp;
                                <label className='pr-1' for="endDate">To</label>
                                <DatePicker className='form-control form-control-sm' 
                                selected={submittedtoDate} onChange={(date) => setsubmittedtoDate(date)}
                                placeholderText="select date(dd/mm/yy)" />
                              </div>
                              <div class="form-group mt-4">
                                <label for="startDate" className='pr-2'>Published From</label>
                                <DatePicker className='form-control form-control-sm' 
                                selected={publishedfromDate} onChange={(date) => publishedfromDateFun(date)} 
                                placeholderText="select date(dd/mm/yy)"
                                />
                                &nbsp;
                                <label className='pr-1' for="endDate">To</label>
                                <DatePicker className='form-control form-control-sm' 
                                selected={publishedtodate} onChange={(date) => setpublishedtodate(date)} 
                                placeholderText="select date(dd/mm/yy)"
                                />
                              </div>
                            </form>
                          </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button className='btn btn-sm btn-dark' onClick={() => Reset()}>Reset</Button> 
                      <Button className='btn btn-sm btn-dark' onClick={() => setIsPopUpDisplay(false)}>Close</Button>
                      {/* <Button className='btn btn-sm btn-success' onClick={() => ExportToExcel()}>Export</Button> */}

                     {/* <span  onClick={() => ExportToExcel()}> <ExportReactCSV csvData={reportData} fileName="DocumentReport.xls">Export </ExportReactCSV></span> */}
                       <CSVLink data={reportData}  headers={headers}  className='hidden' target='_blank'  
                        ref={csvLink}  filename="DocumentReport.xls" >

                       </CSVLink>
                    <Button className='btn btn-sm btn-success' disabled={requiredFiledDisable} 
                              onClick={() => ExportToExcel()} >Export</Button>
    
                    </Modal.Footer>
                  </Modal>
                </div>
                }

                {DataLoaded && (
                  <Tabs defaultTab={DefaultTab}>
                    <TabList>
                      {isAdmin && (
                        <Tab tabFor="vertical-tab-queue">Documents Queued</Tab>
                      )}
                      <Tab tabFor="vertical-tab-myworkspace">My Workspace</Tab>
                    </TabList>
                    {isAdmin && (
                      <TabPanel tabId="vertical-tab-queue">
                        <QueuedDocs
                          data={teamSpaceData}
                          defaultTab={SelectedTabQueue}
                          MasterData={MasterData}
                          refresh={(SelectedTab) => {
                            refreshWithSelectedTabQueue(SelectedTab);
                          }}
                          refreshDocQueueTabData={refreshData}
                          docQueueDataTab={refreshTabData}
                          IsRefresh={isrefresh}
                          refreshbutton={resetTabsAndRefresh}
                        ></QueuedDocs>
                      </TabPanel>
                    )}
                    <TabPanel tabId="vertical-tab-myworkspace">
                      <MyWorkSpace
                        data={myWorkSpaceData}
                        defaultTab={SelectedTabMyWorkSpace}
                        MasterData={MasterData}
                        refresh={(SelectedTab) => {
                          refreshWithSelectedTabWorkSpace(SelectedTab);
                        }}
                        refreshWorkspaceTabData={refreshDataWorkspace}
                        myWorkspaceDataTab={refreshworkSpaceData}
                        IsRefresh={isrefresh}
                      ></MyWorkSpace>
                    </TabPanel>
                  </Tabs>
                )}
                {!DataLoaded && (
                  <div className="text-center">
                    <img className="loading-img" src={logo} alt="loading"></img>
                  </div>
                )}
              </>
            )}
            {isLoadReports && (
              <>
                {/* <div id="sectionheader3" className="col-12 pl-3 pt-2 pr-2 mb-2">
            Delta Dashboard
            <span className = "Home_logo" title="Reports" style={{right:'0px', float: 'right'}}>
            <a onClick={()=>{ShowDeltaReports()}}>
              <i class="fas fa-sync-alt ml-2"></i>
              </a>
            </span>
            </div> */}

                {/* <iframe
                width="100%"
                height={"700px"}
                src="https:hpedelta.com:8983/solr/banana/src/index.html#/dashboard/file/DeltaDashboard"
                frameBorder="0"
                allowFullScreen={true}
              ></iframe>   */}
              </>
            )}
          </div>
          <form
            id="login"
            method="post"
            target="frame"
            action="https://readuser:Readuser1220@hpedelta.com:8983/solr/banana/src/index.html#/dashboard/file/DeltaDashboard"
          ></form>
        </div>
      </div>
    </Fragment>
  );
};
export default Index;
