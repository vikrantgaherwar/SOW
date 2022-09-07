import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import logo from "../img/loading-icon-animated.gif";
import map from "lodash/map";
import TrackingService from "./TrackingService";
import Cookies from "js-cookie";
import parse from "html-react-parser";
import {
  Container,
  ListGroup,
  Modal,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";

import URLConfig from "./URLConfig";
import HeaderLogo from "../img/element-popup-headers.png";
import InfoIcon from "../img/info-icon.png";

const PracticeDropdown = ({ onSubmit }) => {
  const signal = axios.CancelToken.source();
  const [practiceDropdownData, setPracticeDropdownData] = useState([]);
  const wrapperRef = useRef(null);
  const [showPracticeUI, setShowPracticeUI] = useState(false);
  const [serviceToggle, setServiceToggle] = useState(false);
  const [practiceDetails, setPracticeDetails] = useState({});
  const [practiceTabDetails, setPracticeTabDetails] = useState([]);
  const [overview, setOverview] = useState(false);
  const [organization, setOrganization] = useState(false);
  const [whattodo, setWhattodo] = useState(false);
  const [strategy, setStrategy] = useState(false);
  const [focusareas, setFocusareas] = useState(false);
  const [serviceofferings, setServiceofferings] = useState(false);
  const [keycontacts, setKeycontacts] = useState(false);
  const [loader, setLoader] = useState(false);
  const trackingService = new TrackingService();
  // const [overviewData,setOverviewData]=useState('');
  // const [organizationData,setOrganizationData]=useState('');
  // const [whattodoData,setwhattodoData]=useState('');
  // const [strategyData,setStrategyData]=useState('');
  // const [focusareasData,setFocusareasData]=useState('');
  // const [serviceofferingsData,setServiceofferingsData]=useState('');
  // const [keycontactsData,setKeycontactsData]=useState('');
  useEffect(() => {
    fetchPracticeData(signal.token);
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  const fetchPracticeData = async (cancelToken) => {
    const URL =
      URLConfig.getURLDeltaAPI() + "DeltaPractice/GetPracticeDropdown";
    try {
      const res = await axios.get(URL, { cancelToken });
      if (res && res.data) {
        setPracticeDropdownData([...res.data]);
      }
    } catch (error) {
      console.log("API Error", error);
    }
  };

  const fetchPracticeDetails = async (id, cancelToken) => {
    const URL =
      URLConfig.getURLDeltaAPI() + "DeltaPractice/GetPracticeDetails/" + id;
    try {
      const res = await axios.get(URL, { cancelToken });
      if (res && res.data) {
        setPracticeDetails({ ...res.data });
        //fetchPracticeDocumentDetails(id,signal.token)
        // setLoader(true);
        setShowPracticeUI(true);
      }
    } catch (error) {
      console.log("API Error", error);
    }
  };

  // const fetchPracticeDocumentDetails=async (id, cancelToken) => {
  //   var data=[];
  //   const URL =
  //     URLConfig.getURLDeltaAPI() + "DeltaPractice/GetPracticeDocumentDetails/" + id;
  //   console.log(URL);
  //   try {
  //     const res = await axios.get(URL, {cancelToken });
  //     if (res && res.data) {
  //       console.log(res.data);
  //       setPracticeTabDetails([...res.data]);
  //       data=res.data;
  //       setLoader(false);
  //       //setShowPracticeUI(true);
  //     }
  //   } catch (error) {
  //     console.log("API Error", error);
  //   }
  //   console.log(data);
  //   UpdatingTabsData(data);
  // };
  // const UpdatingTabsData=(data)=>{
  //   console.log(data);
  //   var dataOverview=data.filter(item=>item.name.includes('Overview'))
  //                     .map((selectedItem)=>{
  //                       return selectedItem.name;
  //                     }).toString();
  //     if(dataOverview.length > 0)
  //       {
  //         setOverview(true);
  //       }

  //       var dataOrganization=data.filter(item=>item.name.includes('Organization'))
  //                                 .map((selectedItem)=>{
  //                                   return selectedItem.name;
  //                                 }).toString();
  //       if(dataOrganization.length > 0)
  //       {
  //         setOrganization(true);
  //       }

  //       var dataWhattodo=data.filter(item=>item.name.includes('What we do?'))
  //                                 .map((selectedItem)=>{
  //                                   return selectedItem.name;
  //                                 }).toString();
  //       if(dataWhattodo.length > 0)
  //       {
  //         setWhattodo(true);
  //       }

  //       var datastrategy=data.filter(item=>item.name.includes('Strategy'))
  //                             .map((selectedItem)=>{
  //                               return selectedItem.name;
  //                             }).toString();
  //       if(datastrategy.length > 0)
  //       {
  //         setStrategy(true);
  //       }

  //       var datafocusareas=data.filter(item=>item.name.includes('Focus Areas'))
  //                             .map((selectedItem)=>{
  //                               return selectedItem.name;
  //                             }).toString();
  //       if(datafocusareas.length > 0)
  //       {
  //         setFocusareas(true);
  //       }

  //       var dataserviceOfferings=data.filter(item=>item.name.includes('Service Offerings'))
  //                             .map((selectedItem)=>{
  //                               return selectedItem.name;
  //                             }).toString();
  //       if(dataserviceOfferings.length > 0)
  //       {
  //         setServiceofferings(true);
  //       }

  //       var datakeycontacts=data.filter(item=>item.name.includes('Key Contacts'))
  //                             .map((selectedItem)=>{
  //                               return selectedItem.name;
  //                             }).toString();
  //       if(datakeycontacts.length > 0)
  //       {
  //         setKeycontacts(true);
  //       }
  //  // console.log(dataOverview);

  // }
  const handleDomainSelect = (event, practice, domain) => {
    event.preventDefault();
    // const encodedFilter = `&fq=practice:"${encodeURIComponent(
    //   practice.practiceName
    // )}"`;

    // onSubmit(`"${domain.domainName}"`, encodedFilter);
    onSubmit(`"${domain.domainName}"`);
  };

  const handleGoldCollateralSelect = (event, practice, domain) => {
    event.preventDefault();
    const encodedFilter = `&fq=practice:"${encodeURIComponent(
      practice.practiceName
    )}"&fq=isgoldcollateral:"true"`;

    onSubmit(`*:*`, encodedFilter, { SelectedGoldCollateral: true });
  };

  const handlePracticeDocumentSelect = (event, id) => {
    event.preventDefault();
    fetchPracticeDetails(id, signal.token);
  };

  const handleClosePracticeUI = () => {
    setShowPracticeUI(false);
  };
  const practicelink = (dom) => {
    console.log(Cookies.get("empnumber"), dom);
    trackingService.LogPracticelinkClick(Cookies.get("empnumber"), dom, true);
  };
  return (
    <div ref={wrapperRef}>
      <div className="accordion" id="practiceDropdown">
        {map(practiceDropdownData, (item, index) => (
          <div className="card" align="left" key={item.id}>
            <h5 className="mb-0 in-flex">
              <button
                className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                type="button"
                data-toggle="collapse"
                aria-expanded="false"
                data-target={`#Practice${index}`}
                aria-controls={`Practice${index}`}
              >
                {item.practiceName}
                {/* {item.deltaPracticeUi.length > 0 && (
                  <img
                    src={InfoIcon}
                    width="19px"
                    height="15px"
                    className="pl-1 pointer"
                    alt="Info Icon"
                    onClick={(e) =>
                      handlePracticeDocumentSelect(
                        e,
                        item.deltaPracticeUi[0].id
                      )
                    }
                  />
                )} */}
              </button>
              {item.deltaPracticeUi.length > 0 && (
                <i
                  className="pr-3 pointer fas fa-info-circle fa-sm"
                  style={{ color: "#00a982" }}
                  title="About Practice"
                  onClick={(e) =>
                    handlePracticeDocumentSelect(e, item.deltaPracticeUi[0].id)
                  }
                />
              )}
            </h5>

            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#practiceDropdown"
              aria-expanded="false"
              id={`Practice${index}`}
            >
              <div className="card-body ml-0 mr-0 mt-0">
                <div className="accordion" id={`practice${index}Domains`}>
                  {item.deltaPracticeDomain.length > 0 && (
                    <>
                      <div className="card" align="left">
                        <h5 className="mb-0 in-flex">
                          <button
                            className="btn btn-link btn-full pt-0 pb-0 pl-2 collapsed"
                            type="button"
                            data-toggle="collapse"
                            aria-expanded="false"
                            aria-controls={`Domain${index}`}
                            data-target={`#Domain${index}`}
                          >
                            Domains
                          </button>
                        </h5>
                      </div>
                      <div
                        className="collapse"
                        aria-labelledby="headingHPSE"
                        data-parent={`#practice${index}Domains`}
                        aria-expanded="false"
                        id={`Domain${index}`}
                      >
                        <div className="selections_container col">
                          {map(item.deltaPracticeDomain, (dom, idx) => (
                            <div
                              className="row"
                              key={dom.id}
                              style={{
                                paddingLeft: "20px",
                                backgroundColor:
                                  idx % 2 ? "" : "rgba(0, 0, 0, 0.05)",
                              }}
                              onClick={() => practicelink(dom.domainName)}
                            >
                              <a
                                href="#"
                                onClick={(e) =>
                                  handleDomainSelect(e, item, dom)
                                }
                              >
                                {dom.domainName}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="accordion" id={`practice${index}Documents`}>
                  {/* {item.deltaPracticeUi.length > 0 && (
                    <>
                      <div className="card" align="left">
                        <h5 className="mb-0 in-flex">
                          <button
                            className="btn btn-link btn-full pt-0 pb-0 pl-2 collapsed"
                            type="button"
                            data-toggle="collapse"
                            aria-expanded="false"
                            aria-controls={`Document${index}`}
                            data-target={`#Document${index}`}
                          >
                            Practice Documents
                          </button>
                        </h5>
                      </div>
                      <div
                        className="collapse"
                        aria-labelledby="headingHPSE"
                        data-parent={`#practice${index}Documents`}
                        aria-expanded="false"
                        id={`Document${index}`}
                      >
                        <div className="selections_container col">
                          {map(item.deltaPracticeUi, (item, idx) => (
                            <div
                              className="row "
                              key={item.id}
                              style={{
                                paddingLeft: "20px",
                                backgroundColor:
                                  idx % 2 ? "" : "rgba(0, 0, 0, 0.05)",
                              }}
                            >
                              <a
                                href="#"
                                onClick={(e) =>
                                  handlePracticeDocumentSelect(e, item.id)
                                }
                              >
                                {item.practiceTitle}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )} */}
                  {item.displayGoldcollateral && (
                    <div className="card" align="left">
                      <h5 className="mb-0 in-flex">
                        <button
                          className="btn btn-link btn-full pt-0 pb-0 pl-2"
                          type="button"
                        >
                          <a
                            href="#"
                            onClick={(e) => handleGoldCollateralSelect(e, item)}
                          >
                            Gold Collaterals
                          </a>
                        </button>
                      </h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPracticeUI && (
        <Modal
          show={showPracticeUI}
          onHide={() => handleClosePracticeUI()}
          centered
          dialogClassName="prescriptive-modal"
        >
          <Modal.Header>
            <Modal.Title>
              <img
                src={HeaderLogo}
                width="90px"
                className="pr-2"
                alt="HPE Logo"
              />
              {practiceDetails.practiceName}
            </Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleClosePracticeUI()}
              class="close"
              data-dismiss="modal"
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body bsPrefix="practice-modal-body">
            {/* {loader && (
              <div className="text-center">
                <img className="loading-img" src={logo} alt="loading"></img>
              </div>
            )}
          {loader==false && (
          <div className="col-md-12" style={{textAlign:'center',padding:'15px'}}>
              <h2>Advisory & Professional Services - {practiceDetails.practiceName}</h2>
          </div>
          )}
         {loader==false && (
          <div className="col-md-12" id="model_5">
              <div class="tabs-container">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                {overview && (
                  <li class="nav-item">
                    <a class="nav-link active" id="Overview-tab" data-toggle="tab" href="#Overview5" role="tab" aria-controls="Overview" aria-selected="true"><i class="fa fa-home pb-1"></i>Overview</a>
                  </li>
                )}
                {organization && (
                  <li class="nav-item">
                     <a class="nav-link" id="Organization-tab" data-toggle="tab" href="#Organization5" role="tab" aria-controls="Organization" aria-selected="false"><i class="fa fa-building pb-1"></i>Organization </a>
                  </li>
                )}
                {whattodo && (
                  <li class="nav-item">
                     <a class="nav-link" id="Whatwedo-tab" data-toggle="tab" href="#Whatwedo5" role="tab" aria-controls="Whatwedo" aria-selected="false"><i class="fa fa-question pb-1"></i>What we do?</a>
                  </li>
                )}               
                {strategy && (
                  <li class="nav-item">
                   <a class="nav-link" id="Strategy-tab" data-toggle="tab" href="#Strategy5" role="tab" aria-controls="Strategy" aria-selected="false"><i class="fa fa-bullhorn pb-1"></i>Strategy</a>
                 </li>
                )} 
                {focusareas && (
                  <li class="nav-item">
                     <a class="nav-link" id="Focusareas-tab" data-toggle="tab" href="#Focusareas5" role="tab" aria-controls="Focusareas" aria-selected="false"><i class="fa fa-chart-area pb-1"></i>Focus Areas
                   </a>
                  </li>
                )}
                {serviceofferings && (
                  <li class="nav-item">
                     <a class="nav-link" id="Serviceofferings-tab" data-toggle="tab" href="#Serviceofferings5" role="tab" aria-controls="Serviceofferings" aria-selected="false"><i class="fa fa-network-wired pb-1"></i>Service Offerings</a>
                  </li>
                )}
                {keycontacts && (
                  <li class="nav-item">
                    <a class="nav-link" id="Keycontacts-tab" data-toggle="tab" href="#Keycontacts5" role="tab" aria-controls="Keycontacts" aria-selected="false"><i class="fa fa-envelope pb-1"></i>Key Contacts</a>
                  </li>
                )}                    
                </ul>
              </div>
              <div class="tab-content" id="myTabContent">
              {overview &&(
                <div class="tab-pane fade show active" id="Overview5" role="tabpanel" aria-labelledby="Overview-tab">
                  <div className="col-md-12 pt-3">
                  {parse(practiceTabDetails.filter(item=>item.name.includes('Overview'))
                                                      .map(selectedItem=>selectedItem.description).toString())}
                  </div>           
                </div>
              )}
              {organization > 0 &&(
                <div class="tab-pane fade" id="Organization5" role="tabpanel" aria-labelledby="Organization-tab">
                  <div className="col-md-12 pt-3">
                      {parse(practiceTabDetails.filter(item=>item.name.includes('Organization'))
                                                      .map(selectedItem=>selectedItem.description).toString())}
                  </div>
                </div>
              )}
              {whattodo > 0 &&(
                <div class="tab-pane fade" id="Whatwedo5" role="tabpanel" aria-labelledby="Whatwedo-tab">
                  <div className="col-md-12 pt-3">
                       {parse(practiceTabDetails.filter(item=>item.name.includes('What we do?'))
                                                      .map(selectedItem=>selectedItem.description).toString())}
                  </div>
                </div>
              )}                        
              {strategy > 0 &&(
                <div class="tab-pane fade" id="Strategy5" role="tabpanel" aria-labelledby="Strategy-tab">
                  <div className="col-md-12 pt-3">
                      {parse(practiceTabDetails.filter(item=>item.name.includes('Strategy'))
                                                      .map(selectedItem=>selectedItem.description).toString())}
                  </div>
                </div>
              )} 
               {focusareas &&(
                 <div class="tab-pane fade" id="Focusareas5" role="tabpanel" aria-labelledby="Focusareas-tab">
                    <div className="col-md-12 pt-3">
                      {parse(practiceTabDetails.filter(item=>item.name.includes('Focus Areas'))
                                                       .map(selectedItem=>selectedItem.description).toString())}
                    </div>
                 </div>
               )}  
              {serviceofferings && (
                <div class="tab-pane fade" id="Serviceofferings5" role="tabpanel" aria-labelledby="Serviceofferings-tab">
                  <div className="col-md-12 pt-3">
                     {parse(practiceTabDetails.filter(item=>item.name.includes('Service Offerings'))
                                                     .map(selectedItem=>selectedItem.description).toString())}
                  </div>
                </div>
              )} 
              {keycontacts &&(
                <div class="tab-pane fade" id="Keycontacts5" role="tabpanel" aria-labelledby="Keycontacts-tab">
                  <div className="col-md-12 pt-3">
                     {parse(practiceTabDetails.filter(item=>item.name.includes('Key Contacts'))
                                                      .map(selectedItem=>selectedItem.description).toString())}
                  </div>
                </div>
              )} 
                
            </div>
          </div>
          )} */}

            {practiceDetails.deltaPracticeService &&
              practiceDetails.deltaPracticeService.length > 0 && (
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={
                    <Popover id="popover-basic">
                      <Container>
                        <Popover.Title
                          as="h5"
                          className="briefcase_header pt-2"
                        >
                          Service URL
                        </Popover.Title>
                        <Popover.Content className="practice-popover-content pb-2">
                          <ListGroup variant="flush">
                            {map(
                              // Array(12).fill([])
                              practiceDetails.deltaPracticeService,
                              (item) => (
                                <ListGroup.Item className="p-1">
                                  <a
                                    href={item.serviceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.serviceName}
                                  </a>
                                </ListGroup.Item>
                              )
                            )}
                          </ListGroup>
                        </Popover.Content>
                      </Container>
                    </Popover>
                  }
                >
                  <button
                    type="button"
                    className="btn btn-primary btn-sm pointer service-btn"
                    onClick={() => setServiceToggle(!serviceToggle)}
                  >
                    Services
                  </button>
                </OverlayTrigger>
              )}
            <iframe
              src={practiceDetails.documentUrl}
              style={{
                height: "70vh",
                width: "100%",
                border: "none",
              }}
              title="Practice UI IFrame"
              onError={(e) => {
                console.log("Error", e);
              }}
            />
          </Modal.Body>
          {/* <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm pointer"
              onClick={() => handleClosePracticeUI()}
            >
              Close
            </button>
          </Modal.Footer> */}
        </Modal>
      )}
    </div>
  );
};

export default PracticeDropdown;
