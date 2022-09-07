import { useEffect, Fragment } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Cookies from "js-cookie";
import CountUp from "react-countup";
import UserDashBoard from "./UserDashBoard";
import { OverlayTrigger, Tooltip } from "react-bootstrap/";
import { formatDate } from "../../utils/Date";
import { identifyFileFormat } from "../../utils/FileType";
import axios from "axios";
import {
  DOC_CONTRIBUTION,
  ACTIVITIES,
  MY_PROJECT_USAGE,
  ONBOARD_USERS,
  DOCUMENT_REUSE
} from "./Constants";
import { Modal, Button, Col, Container, Row, Card } from "react-bootstrap";
import UserProjectUsage from "./UserProjectUsage";
import ActiveUserMatrics from "./ActiveUserMatrics";
import URLConfig from "../URLConfig";
const LeaderDashBoard = ({
  UserScore,
  TopFive,
  UserMetrics,
  UserScoreOfflineData,
}) => {
  const [modal, setModal] = useState({
    [DOC_CONTRIBUTION]: false,
    [ACTIVITIES]: false,
    [MY_PROJECT_USAGE]: false,
    [ONBOARD_USERS]: false,
    [DOCUMENT_REUSE]:false,
  });
  const [button, setButton] = useState({
    [DOC_CONTRIBUTION]: false,
    [ACTIVITIES]: true,
    [MY_PROJECT_USAGE]: false,
    [ONBOARD_USERS]: false,
  });
  const [ProjectUsageDetails, setProjectUsageDetails] = useState([]);
  const [PublishedDocs, setPublishedDocs] = useState([]);
  const [DocumentReUseDetails, setDocumentReUseDetails] = useState([]);

  const handleModalOpen = (item) => {
    // console.log("+++", ProjectUsageDetails);
    setModal((prevState) => ({ ...prevState, [item]: true }));
  };

  const handleModalClose = (item) => {
    setModal((prevState) => ({ ...prevState, [item]: false }));
  };

  useEffect(() => {
    if (UserScore && UserScore.myProjectUsageTotal > 0) {
      getProjectUsage();
    }
    if (UserScore?.documentContribution > 0) {
      getDocumentContirutionDetails();
    }
    if(UserScore?.documentReUse > 0){
      getDocumentReUseDetails();
    }
  }, [UserScore]);
  const getDocumentReUseDetails = () =>{
    var data = JSON.stringify({
      UserId: Cookies.get("empnumber"),
      host: window.location.origin + "/",
    });

    var config = {
      method: "post",
      url:
        URLConfig.getURLDeltaAPI() +
        "UserGamificationDashboard/GetDocumentReUseDetails",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        response.data && setDocumentReUseDetails(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const getProjectUsage = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      UserId: Cookies.get("empnumber"),
      host: window.location.origin + "/",
      // UserId: "60066521",
      // host: "https://delta.app.hpecorp.net/",
    });

    var config = {
      method: "post",
      url:
        URLConfig.getURLDeltaAPI() +
        "UserGamificationDashboard/GetMyProjectUsageByTeam",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        response.data && setProjectUsageDetails(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getDocumentContirutionDetails = () => {
    var data = JSON.stringify({
      UserId: Cookies.get("empnumber"),
      host: window.location.origin + "/",
      // UserId: "60066521",
      // host: "https://delta.app.hpecorp.net/",
    });
    var config = {
      method: "post",
      url:
        URLConfig.getURLDeltaAPI() +
        "UserGamificationDashboard/GetDocumentContributionByTeam",
        headers: {
          "Content-Type": "application/json",
        },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setPublishedDocs(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div className="grey-bg">
      {UserScore != null && (
        <div className="container mt-5">
          <div className="row align-items-stretch">
            <div className="c-dashboardInfo col-lg-12 col-md-12">
              <div className="wrap">
                <div className="row">
                  <div className="col-md-4">
                    <h4>Leader Dashboard</h4>
                  </div>
                   <div className="col-md-4 text-center">
                    {/* {UserScore.badge.length > 0 ? (
                      <h6 className="pt-2">Badge : {UserScore.badge}</h6>
                    ) : (
                      <h6 className="pt-2">Badge : No Badge</h6>
                    )} */}
                  </div>
                  {/* <div className="col-md-2">
                      <h6 className="pt-2">
                        Total Points Earned : {UserScore.totalPoints}
                      </h6>
                    </div> */}
                  <div className="col-md-4 text-right">
                    <h6>
                      <Link to="/">
                        <i className="fas fa-home pointer" title="Home"></i>
                      </Link>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="c-dashboardInfo col-lg-4 col-md-6">
              <div className="wrap">
                <div className="user-card-1">
                  <h6>Onboarding</h6>
                  <h5>
                    {UserScore.onboarding}

                    <i
                      className="fas fa-info-circle pl-1"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Points earned on you onboarding to DELTA"
                    ></i>
                  </h5>
                </div>
                <div className="border-top mt-3 invisible">
                  <div className="row pt-1">
                    <div className="col-md-12 text-right">
                      <a
                        href="#"
                        onClick={() => handleModalOpen(ONBOARD_USERS)}
                      >
                        {" "}
                        Onboarding Count : {UserScore.onboarding}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="c-dashboardInfo col-lg-4 col-md-6">
              <div className="wrap">
                <div className="user-card-2">
                  <h6>Activities </h6>
                  <h5>
                    {UserScore.activitiesTotal}

                    <i
                      className="fas fa-info-circle pl-1"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Points earned on activities like View, Share & Feedback."
                    ></i>
                  </h5>
                </div>
                <div className="border-top mt-3">
                  <div className="row pt-1">
                    <div className="col-md-12 text-right">
                      <a
                        href="#"
                        data-toggle="modal"
                        data-target="#activitymodal"
                        onClick={() => handleModalOpen(ACTIVITIES)}
                      >
                        {" "}
                        Activities Count : {UserScore.activitiesCount}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="c-dashboardInfo col-lg-4 col-md-6">
              <div className="wrap">
                <div className="user-card-3">
                  <h6>Project Usage</h6>
                  <h5>
                    {UserScore.myProjectUsageTotal}

                    <i
                      className="fas fa-info-circle pl-1"
                      data-toggle="tooltip"
                      data-placement="right"
                      title=" Points earned on the usage of your A&PS & PSA Projects"
                    ></i>
                  </h5>
                </div>
                <div className="border-top mt-3">
                  <div className="row pt-1">
                    <div className="col-md-12 text-right">
                      <a
                        href="#"
                        data-toggle="modal"
                        data-target="#activitymodal"
                        onClick={() => handleModalOpen(MY_PROJECT_USAGE)}
                      >
                        {" "}
                        Project Usage Count : {UserScore.myProjectUsageCount}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="c-dashboardInfo col-lg-4 col-md-6">
              <div className="wrap">
                <div className="user-card-4">
                  <h6>Document Contribution </h6>
                  <h5>
                    {UserScore.documentContributionTotal}

                    <i
                      className="fas fa-info-circle pl-1"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Points earned from the documents contributed by you"
                    ></i>
                  </h5>
                </div>
                <div className="border-top mt-3">
                  <div className="row pt-1">
                    <div className="col-md-12 text-right">
                      <a
                        href="#"
                        onClick={() => handleModalOpen(DOC_CONTRIBUTION)}
                      >
                        {" "}
                        Document Contribution Count :{" "}
                        {UserScore.documentContribution}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="c-dashboardInfo col-lg-4 col-md-6">
              <div className="wrap">
                <div className="user-card-5">
                  <h6>Document Reuse </h6>
                  <h5>
                    {UserScore.documentReUse}

                    <i
                      className="fas fa-info-circle pl-1"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Points earned from the number of times a document(s) is reused."
                    ></i>
                  </h5>
                </div>
                <div className="border-top mt-3">
                  <div className="row pt-1">
                    <div className="col-md-12 text-right">
                      <a
                        href="#"
                        onClick={() => handleModalOpen(DOCUMENT_REUSE)}
                      >
                        {" "}
                        Document Reuse Count : {UserScore.documentReUse}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="c-dashboardInfo col-md-12">
              <div className="wrap">
                <h6 className="pb-2">Top 5 Achievers</h6>
                {TopFive && TopFive.length > 0 && (
                  <table className="achievers-table table table-bordered table-stripped table-sm">
                    <thead>
                      <th width="30%">Email</th>
                      <th width="10%">Role</th>
                      {/* <th width="10%">Score</th> */}
                    </thead>
                    <tbody>
                      {TopFive.map((value, index) => (
                        <tr key={index}>
                          <td className="p-1"> {value.name}</td>
                          <td className="p-1"> {value.detp}</td>
                          {/* <td className="p-1">5000</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {modal[ACTIVITIES] && (
            <Modal
              className="insidedivModal"
              show={modal[ACTIVITIES]}
              onHide={() => handleModalClose(ACTIVITIES)}
              dialogClassName="insidedivModal"
            >
              <Modal.Header className="insidediv">
                <Modal.Title>
                  Activities : {UserScore.activitiesCount}{" "}
                </Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(ACTIVITIES)}
                  className="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body>
                {UserScore.activitiesCount > 0 ? (
                  <table className="achievers-table table table-bordered table-stripped table-sm text-left">
                    <thead>
                      <th>Activity Type</th>
                      <th>Count</th>
                    </thead>
                    {/* <tr>
                    <th className="border">Activities</th>
                    <td>{UserScore.activitiesCount}</td>
                  </tr> */}
                    <tbody>
                      <tr>
                        <td>Views</td>
                        <td>{UserScore.viewCount}</td>
                      </tr>
                      <tr>
                        <td>Share</td>
                        <td>{UserScore.shareCount}</td>
                      </tr>
                      <tr>
                        <td>Feedback</td>
                        <td>{UserScore.feedbackCount}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  "No Activities  to display"
                )}
              </Modal.Body>
              {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
            </Modal>
          )}
          {/* Document Contribution Modal */}
          {modal[DOC_CONTRIBUTION] && (
            <Modal
              show={modal[DOC_CONTRIBUTION]}
              onHide={() => handleModalClose(DOC_CONTRIBUTION)}
              dialogClassName="modal-md"
            >
              <Modal.Header>
                <Modal.Title>
                  Document Contribution: {UserScore.documentContribution}{" "}
                </Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(DOC_CONTRIBUTION)}
                  className="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body dialogClassName="preview-body">
                {UserScore.documentContribution > 0 ? (
                  <Fragment>
                    {PublishedDocs && (
                      <Fragment>
                        <table className="table-striped table table-bordered table-sm">
                          <thead>
                            <tr>
                              <th>Document Name</th>
                              <th>Uploaded Date (UTC)</th>
                              <th>Uploaded By</th>
                            </tr>
                          </thead>
                          <tbody>
                            {PublishedDocs.map((value, index) => (
                              <tr key={index}>
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
                                  {formatDate(value.uploadedDt)}
                                </td>
                                <td className="pt-2">
                                  {value.uploadedByName}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Fragment>
                    )}
                  </Fragment>
                ) : (
                  "No document to display"
                )}
              </Modal.Body>
              {/* <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleModalClose(DOC_PREVIEW)}
            >
              Close
            </button>
          </Modal.Footer> */}
            </Modal>
          )}
          {/* MY Proect Usage Contribution Modal */}
          {modal[MY_PROJECT_USAGE] && (
            <Modal
              show={modal[MY_PROJECT_USAGE]}
              onHide={() => handleModalClose(MY_PROJECT_USAGE)}
              dialogClassName="modal-md"
            >
              <Modal.Header>
                <Modal.Title>Project Usage</Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(MY_PROJECT_USAGE)}
                  className="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body dialogClassName="preview-body">
                {ProjectUsageDetails && ProjectUsageDetails.length > 0 && (
                  <UserProjectUsage
                    ProjectUsageDetails={ProjectUsageDetails}
                  ></UserProjectUsage>
                )}

                {ProjectUsageDetails && ProjectUsageDetails.length <= 0
                  ? "No Project details to Display"
                  : ""}
              </Modal.Body>
            </Modal>
          )}
          {modal[ONBOARD_USERS] && (
            <Modal
              show={modal[ONBOARD_USERS]}
              onHide={() => handleModalClose(ONBOARD_USERS)}
              dialogClassName="modal-md"
            >
              <Modal.Header>
                <Modal.Title>Onboarding</Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(ONBOARD_USERS)}
                  className="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body dialogClassName="preview-body">
                {UserMetrics && UserMetrics.length > 0 && (
                  <ActiveUserMatrics
                    UserMetrics={UserMetrics}
                  ></ActiveUserMatrics>
                )}
              </Modal.Body>
            </Modal>
          )}
           {modal[DOCUMENT_REUSE] && (
            <Modal
              show={modal[DOCUMENT_REUSE]}
              onHide={() => handleModalClose(DOCUMENT_REUSE)}
              dialogClassName="modal-md"
            >
              <Modal.Header>
                <Modal.Title>
                  Document Reuse : {UserScore.documentReUse}
                </Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(DOCUMENT_REUSE)}
                  className="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body dialogClassName="preview-body">
                {DocumentReUseDetails && DocumentReUseDetails.length > 0 && (
                  <UserProjectUsage
                    ProjectUsageDetails={DocumentReUseDetails}
                  ></UserProjectUsage>
                )}
                {DocumentReUseDetails && DocumentReUseDetails.length <= 0
                  ? "No Document Reuse details to display"
                  : ""}
              </Modal.Body>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};
{
  /* Comment below statements */
}
{
  /* <div className="container ml-5">
            <div className="ml-5 col-md-8 ">
              <div>
                <div className="user-details ">
                  <div className="row row-flex mt-3">
                    <div className="col-md-6 ">
                      <div className="content">
                        <div className="row border p-2 insidediv_Leaderdashboard">
                          <div className="col-md-2">
                            <i className="fas fa-snowboarding fas_size"></i>
                          </div>
                          <div className="col-md-6">
                            <h6 className="fontresize"> Onboarding</h6>
                          </div>
                          <div className="col-md-4 ">
                            <div className="circle1">
                              <span className="circle__content1">
                                <CountUp
                                  duration={1}
                                  end={UserScore.onboarding}
                                ></CountUp>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="content">
                        <div className="row border p-2 insidediv_Leaderdashboard">
                          <div className="col-md-2">
                            <i className="fas fa-award fas_size"></i>
                          </div>
                          <div className="col-md-6">
                            <h6 className="fontresize"> Top 5 Achievers</h6>
                          </div>
                          <div className="col-md-4">
                            <h6 className="fontresize"> </h6>
                          </div>

                          <div className="row col-md-12">
                            {TopFive.length > 0 && (
                              <table className="table-borderless" width="100%">
                                <tbody>
                                  <tr className="mb-2">
                                    <td className="border-none" width="50%">
                                      Name
                                    </td>
                                    <td className="border-none" width="50%">
                                      Role/Job Function
                                    </td>
                                  </tr>
                                  {TopFive.map((value, index) => (
                                    <tr key={index}>
                                      <td className="">
                                        {value.name}
                                        name
                                      </td>
                                      <td className="">
                                        {value.detp}
                                        detp
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end 1 */
}
{
  /* start */
}
// <div className="row row-flex">
//   <div className="col-md-6">
//     <div className="row border p-2 insidediv_Leaderdashboard">
//       <div className="col-md-2">
//         <i className="fas fa-tasks fas_size"></i>
//       </div>
//       <div className="col-md-6">
//         <h6 className="fontresize">
//           Activities
//           <span
//             className="badge bg-badge mt-1 pointer"
//             onClick={handleShow}
//           >
//             <CountUp
//               duration={1}
//               end={UserScore.activitiesTotal}
//             ></CountUp>
//           </span>
//         </h6>
//       </div>
//       <div className="col-md-4">
//         <div className="circle1">
//           <span className="circle__content1">
//             <CountUp
//               duration={1}
//               end={UserScore.activitiesCount}
//             ></CountUp>
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="col-md-6">
//     <div className="row border p-2 insidediv_Leaderdashboard">
//       <div className="col-md-2">
//         <i className="fas fa-project-diagram fas_size"></i>
//       </div>
//       <div className="col-md-8">
//         <h6 className="fontresize">
//           Project Usage
//           <span
//             className="badge bg-badge mt-1 pointer"
//             onClick={handleShow}
//           >
//             <CountUp
//               duration={1}
//               end={UserScore.myProjectUsageTotal}
//             ></CountUp>
//           </span>
//         </h6>
//       </div>
//       <div className="col-md-2">
//         <div className="circle1">
//           <span className="circle__content1">
//             <CountUp
//               duration={1}
//               end={UserScore.myProjectUsageCount}
//             ></CountUp>
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// <div className="row row-flex">
//   <div className="col-md-6">
//     <div className="row border p-2 insidediv_Leaderdashboard">
//       <div className="col-md-2">
//         <i className="fas fa-file-alt fas_size"></i>
//       </div>
//       <div className="col-md-7">
//         <h6 className="fontresize">
//           Document Contribution
//           <span
//             className="badge bg-badge mt-1 pointer"
//             onClick={handleShow}
//           >
//             <CountUp
//               duration={1}
//               end={UserScore.documentContributionTotal}
//             ></CountUp>
//           </span>
//         </h6>
//       </div>
//       <div className="col-md-3">
//         <div className="circle1">
//           <span className="circle__content1">
//             <CountUp
//               duration={1}
//               end={UserScore.documentContributionTotal}
//             ></CountUp>
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="col-md-6">
//     <div className="row border p-2 insidediv_Leaderdashboard">
//       <div className="col-md-2">
//         <i className="fas fa-folder fas_size"></i>
//       </div>
//       <div className="col-md-7 ">
//         <h6 className="fontresize">
//           Document Reuse
//           <span
//             className="badge bg-badge mt-1 pointer"
//             onClick={handleShow}
//           >
//             <CountUp
//               duration={1}
//               end={UserScore.documentReUse}
//             ></CountUp>
//           </span>
//         </h6>
//       </div>
//       <div className="col-md-3">
//         <div className="circle1">
//           <span className="circle__content1">
//             <CountUp
//               duration={1}
//               end={UserScore.documentReUse}
//             ></CountUp>
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

{
  /* <div className="col-3 detail-card">
   <i className="fa fa-refresh"  aria-hidden="true" style={{float:"left"}} ></i>
    <p>Unique Users</p>
    <div className="score-div"><p><CountUp duration={1} end={UserScore.uniqueUsers}></CountUp></p></div>
    </div>
    <div className="col-3 detail-card">
   <i className="fa fa-refresh"  aria-hidden="true" style={{float:"left"}} ></i>
    <p>Search Releavency Feedback</p>
    <div className="score-div"><p><CountUp duration={1} end={UserScore.searchReleavencyFeedback}></CountUp></p></div>
    </div>*/
}
//       </div>
//     </div>
//   </div>
// </div> */}

export default LeaderDashBoard;
