import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Cookies from "js-cookie";
import CountUp from "react-countup";
import UserDashBoard from "./UserDashBoard";
import {
  DOC_CONTRIBUTION,
  ACTIVITIES,
  MY_PROJECT_USAGE,
  ONBOARD_USERS,
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
  });
  const [button, setButton] = useState({
    [DOC_CONTRIBUTION]: false,
    [ACTIVITIES]: true,
    [MY_PROJECT_USAGE]: false,
    [ONBOARD_USERS]: false,
  });
  const [ProjectUsageDetails, setProjectUsageDetails] = useState([]);

  const handleModalOpen = (item) => {
    setModal((prevState) => ({ ...prevState, [item]: true }));
  };

  const handleModalClose = (item) => {
    setModal((prevState) => ({ ...prevState, [item]: false }));
  };

  useEffect(() => {
    if (UserScore && UserScore.myProjectUsageTotal > 0) {
      getProjectUsage();
    }
  }, [UserScore]);

  const getProjectUsage = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      UserId: Cookies.get("empnumber"),
      host: window.location.href,
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
  return (
    <div className="grey-bg">
      {UserScore != null && (
        <Container className="p-1">
          {/* <div className="row p-1 m-0 " style={{ justifyContent: "center" }}>
            <div className="col-10">
              <div className="user-count-card">
                <h2 className="mb-1">Leader Dashboard</h2>
              </div>
            </div>
          </div> */}

          <div class="container">
            {/* <div className="row mt-3">
              <div className="col-md-12 text-end pointsAlign">
                Points
                <span className="circle ml-1">

                  <div className="circle__content">

                  </div>
                </span>
              </div>
            </div> */}
            <div className="row user-count-card">
              <div className="col-6">
                <h2 className="mb-1 gamification-title">Leader Dashboard</h2>
              </div>

              <div className="col-6 text-right">
                <Link to="/">
                  {" "}
                  <i className="fas fa-home fa-2x"></i>
                </Link>
              </div>
            </div>
            <div class="row row-flex mt-3">
              <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="content colour-1">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <i className="fas fa-snowboarding fa-4x fasSize"></i>
                    </div>
                    <div className="col-md-4 text-center">
                      <h6>Onboarding</h6>
                      <div
                        className="circle-1"
                        onClick={() => handleModalOpen(ONBOARD_USERS)}
                      >
                        <span className="circle__content" title="Onboarding">
                          <CountUp
                            duration={1}
                            end={UserScore.onboarding}
                          ></CountUp>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4 text-center"></div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="content colour-2">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <i className="fas fa-tasks fa-4x fasSize"></i>
                    </div>
                    <div className="col-md-4 text-center">
                      <h6>Activities</h6>
                      <div className="circle-1" title="Total Activities">
                        <span className="circle__content">
                          <CountUp
                            duration={1}
                            end={UserScore.activitiesTotal}
                          ></CountUp>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      <h1>
                        <a
                          onClick={() => handleModalOpen(ACTIVITIES)}
                          style={{
                            textDecoration: "underline",
                            fontSize: "24px",
                            fontWeight: "600",
                            float: "right",
                          }}
                          title="Activities Count"
                        >
                          <CountUp
                            duration={1}
                            end={UserScore.activitiesCount}
                            className="pointer ml-2"
                          ></CountUp>
                        </a>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="content colour-4">
                  <div className="row">
                    <div className="col-md-2 text-center">
                      <i className="fas fa-project-diagram fa-4x fasSize"></i>
                    </div>
                    <div className="col-md-8 text-center">
                      <h6>Project Usage</h6>
                      <div className="circle-1" title="Total Project Usage">
                        <span className="circle__content">
                          <CountUp
                            duration={1}
                            end={UserScore.myProjectUsageTotal}
                          ></CountUp>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      <h1>
                        <a
                          onClick={() => handleModalOpen(MY_PROJECT_USAGE)}
                          style={{
                            textDecoration: "underline",
                            fontSize: "24px",
                            fontWeight: "600",
                            float: "right",
                          }}
                          title="Project Usage Count"
                        >
                          <CountUp
                            duration={1}
                            end={UserScore.myProjectUsageCount}
                            className=" pointer ml-2"
                          ></CountUp>
                        </a>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row row-flex mt-3">
              <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="content colour-5">
                  <div className="row">
                    <div className="col-md-2 text-center">
                      <i className="fas fa-file-alt fa-4x fasSize"></i>
                    </div>
                    <div className="col-md-8 text-center">
                      <h6>Document Contribution</h6>
                      <div
                        className="circle-1"
                        title="Total Document Contribution"
                      >
                        <span className="circle__content">
                          <CountUp
                            duration={1}
                            end={UserScore.documentContributionTotal}
                          ></CountUp>{" "}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      <h1>
                        <a
                          onClick={() => handleModalOpen(DOC_CONTRIBUTION)}
                          style={{
                            textDecoration: "underline",
                            fontSize: "24px",
                            fontWeight: "600",
                            float: "right",
                          }}
                          title="Document Contribution"
                        >
                          <CountUp
                            duration={1}
                            end={UserScore.documentContribution}
                            className="pointer ml-2"
                          ></CountUp>
                        </a>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="content colour-6">
                  <div className="row">
                    <div className="col-md-2 text-center">
                      <i className="fas fad fa-folder fa-3x fasSize"></i>
                    </div>
                    <div className="col-md-8 text-center">
                      <h6>Document Reuse</h6>
                      <div className="circle-1" title="Document Reuse">
                        <span className="circle__content">
                          <CountUp
                            duration={1}
                            end={UserScore.documentReUse}
                          ></CountUp>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      <h1>
                        <a
                          onClick={() => handleModalOpen(DOC_CONTRIBUTION)}
                          style={{
                            textDecoration: "underline",
                            fontSize: "24px",
                            fontWeight: "600",
                            float: "right",
                          }}
                          title="Document Reuse"
                        >
                          <CountUp
                            duration={1}
                            end={UserScore.documentReUse}
                            className="pointer ml-2"
                          ></CountUp>
                        </a>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div class="col-md-8 col-sm-8">
                <div class="content colour-7">
                  <div className="row">
                    <div className="col-md-12">
                      <h3 className="float-start text-white">
                        Top 5 Achievers
                      </h3>
                    </div>
                  </div>

                  <div className="row">
                    <Col md={12}>
                      {TopFive && TopFive.length > 0 && (
                        <table className="table table-bordered table-stripped table-sm text-white">
                          <thead>
                            <th>Mail</th>
                            <th>Role/Job Function</th>
                          </thead>
                          <tbody>
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
                    </Col>
                  </div>
                  <Card.Text href="#"></Card.Text>
                </div>
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
                <Modal.Title>GAMIFICATION DASHBOARD USER</Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(ACTIVITIES)}
                  class="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body>
                <Container className="border">
                  <Row className=" m-1">
                    <Col>Activities</Col>
                    <Col>{UserScore.activitiesCount}</Col>
                  </Row>
                  <Row className=" m-1">
                    <Col>Views</Col>
                    <Col>{UserScore.viewCount}</Col>
                  </Row>
                  <Row className=" m-1">
                    <Col>Share</Col>
                    <Col>{UserScore.shareCount}</Col>
                  </Row>
                  <Row className=" m-1">
                    <Col>Feedback</Col>

                    <Col>{UserScore.feedbackCount}</Col>
                  </Row>
                </Container>
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
              dialogClassName="preview-modal"
            >
              <Modal.Header>
                <Modal.Title>Document Contribution</Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(DOC_CONTRIBUTION)}
                  class="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body dialogClassName="preview-body"></Modal.Body>
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
              dialogClassName="preview-modal"
            >
              <Modal.Header>
                <Modal.Title>Project Usage</Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(MY_PROJECT_USAGE)}
                  class="close"
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
              </Modal.Body>
            </Modal>
          )}
          {modal[ONBOARD_USERS] && (
            <Modal
              show={modal[ONBOARD_USERS]}
              onHide={() => handleModalClose(ONBOARD_USERS)}
              dialogClassName="preview-modal"
            >
              <Modal.Header>
                <Modal.Title>Onboarding</Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleModalClose(ONBOARD_USERS)}
                  class="close"
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
        </Container>
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
                <div class="user-details ">
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
  /* <div class="col-3 detail-card">
   <i class="fa fa-refresh"  aria-hidden="true" style={{float:"left"}} ></i>
    <p>Unique Users</p>
    <div className="score-div"><p><CountUp duration={1} end={UserScore.uniqueUsers}></CountUp></p></div>
    </div>
    <div class="col-3 detail-card">
   <i class="fa fa-refresh"  aria-hidden="true" style={{float:"left"}} ></i>
    <p>Search Releavency Feedback</p>
    <div className="score-div"><p><CountUp duration={1} end={UserScore.searchReleavencyFeedback}></CountUp></p></div>
    </div>*/
}
//       </div>
//     </div>
//   </div>
// </div> */}

export default LeaderDashBoard;
