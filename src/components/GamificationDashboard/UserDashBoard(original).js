import { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import Cookies from "js-cookie";
import CountUp from "react-countup";
import gold from "../../img/medal-icons/gold.png";
import { Modal, Button, Col, Container, Row, Card } from "react-bootstrap";
import { DOC_CONTRIBUTION, ACTIVITIES, MY_PROJECT_USAGE } from "./Constants";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import UserProjectUsage from "./UserProjectUsage";
import { formatDate } from "../../utils/Date";
import { identifyFileFormat } from "../../utils/FileType";
import URLConfig from "../URLConfig";

const UserDashBoard = ({ UserScore }) => {
  const [ProjectUsageDetails, setProjectUsageDetails] = useState([]);
  const [PublishedDocs, setPublishedDocs] = useState([]);

  // { UserScore }
  useEffect(() => {
    debugger;
    if (UserScore?.myProjectUsageTotal > 0) {
      getProjectUsage();
    }
    if (UserScore?.documentContributionTotal) {
      getDocumentContirutionDetails();
    }
  }, [UserScore]);

  const [modal, setModal] = useState({
    [DOC_CONTRIBUTION]: false,
    [ACTIVITIES]: false,
    [MY_PROJECT_USAGE]: false,
  });
  const [button, setButton] = useState({
    [DOC_CONTRIBUTION]: false,
    [ACTIVITIES]: true,
    [MY_PROJECT_USAGE]: false,
  });
  const getDocumentContirutionDetails = () => {
    var config = {
      method: "get",
      url:
        URLConfig.getURLDeltaAPI() +
        "DocumentAnalysis/GetPublishedDocuments/60143676",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setPublishedDocs(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getProjectUsage = () => {
    var data = JSON.stringify({
      UserId: Cookies.get("empnumber"),
      host: window.location.href,
    });

    var config = {
      method: "post",
      url:
        URLConfig.getURLDeltaAPI() +
        "UserGamificationDashboard/GetMyProjectUsage",
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
  const handleModalOpen = (item) => {
    setModal((prevState) => ({ ...prevState, [item]: true }));
  };

  const handleModalClose = (item) => {
    setModal((prevState) => ({ ...prevState, [item]: false }));
  };
  return (
    <div>
      {UserScore != null && (
        <>
          <div
          // style={{
          //   backgroundColor: "#4F5F76",
          // }}
          >
            {/* <div className="row p-1 m-0" style={{ justifyContent: "center" }}>
              <div className="col-10">
                <div className="user-count-card">
                  <h2 className="mb-1">User Dashboard</h2>
                </div>
              </div>
            </div> */}
            <div className="container border mt-5 pb-3">

              <div className="row user-count-card">
                <div className="col-6">
                  <h2 className="mb-1 gamification-title">User Dashboard</h2>
                </div>

                <div className="col-6 text-right">
                  <Link to="/">
                    {" "}
                    <i className="fas fa-home fa-2x"></i>
                  </Link>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6 pointsAlign1">
                  <h3>Badge:{UserScore.badge} </h3>
                </div>

                <div className="col-md-6 text-end pointsAlign">
                  Points Earned:
                  <span className="circle ml-1" title="Total Points">
                    <div className="circle__content">
                      <CountUp end={UserScore.totalPoints} duration={2} />
                    </div>
                  </span>
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
                        <div className="circle-1" title="Onboarding">
                          <span className="circle__content">
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
                      <div className="col-md-2 text-center">
                        <i class="fas fa-award fa-4x fasSize"></i>
                      </div>
                      <div className="col-md-8 text-center">
                        <h6>Achievement Bonus</h6>
                        <div className="circle-1">
                          <span
                            className="circle__content"
                            title="Achievement Bonus"
                          >
                            <CountUp
                              duration={1}
                              end={UserScore.achievementBonus}
                            ></CountUp>
                          </span>
                        </div>
                      </div>
                      <div className="col-md-2 text-center"></div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-sm-6 col-xs-12">
                  <div class="content colour-3">
                    <div className="row">
                      <div class="col-md-4 text-center">
                        <i className="fas fa-tasks fa-4x fasSize"></i>
                      </div>
                      <div class="col-md-4 text-center">
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
                      <div class="col-md-4 text-center">
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
              </div>
              <div class="row row-flex mt-3">
                <div class="col-md-4 col-sm-6 col-xs-12">
                  <div class="content colour-4">
                    <div className="row">
                      <div class="col-md-2 text-center">
                        <i class="fas fa-project-diagram fa-4x fasSize"></i>
                      </div>
                      <div class="col-md-8 text-center">
                        <h6>Project Usage</h6>
                        <div className="circle-1" title="Toal Project Usage">
                          <span className="circle__content">
                            <CountUp
                              duration={1}
                              end={UserScore.myProjectUsageTotal}
                            ></CountUp>
                          </span>
                        </div>
                      </div>
                      <div class="col-md-2 text-center">
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
                <div class="col-md-4 col-sm-6 col-xs-12">
                  <div class="content colour-5">
                    <div className="row">
                      <div class="col-md-2 text-center">
                        <i class="fas fa-file-alt fa-4x fasSize"></i>
                      </div>
                      <div class="col-md-8 text-center">
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
                      <div class="col-md-2 text-center">
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
                      <div class="col-md-2 text-center">
                        <i class="fas fa-file-alt fa-4x fasSize"></i>
                      </div>
                      <div class="col-md-8 text-center">
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
                      <div class="col-md-2 text-center">
                        <h1>
                          <a
                            onClick={(e) => {
                              UserScore.documentReUse > 0
                                ? handleModalOpen(DOC_CONTRIBUTION)
                                : e.preventDefault();
                            }}
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
                  Activities: ({UserScore.activitiesCount}X5)
                </Modal.Title>
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
                  {/* <Row className=" m-1">
                    <Col>Activities</Col>
                    <Col>{UserScore.activitiesCount}</Col>
                  </Row> */}
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
                <Modal.Title>
                  Document Contribution: ({UserScore.documentContribution}X5)
                </Modal.Title>
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
              <Modal.Body dialogClassName="preview-body">
                <Fragment>
                  {PublishedDocs && (
                    <Fragment>
                      <div
                        className="col-12 mt-3"
                        style={{
                          overflow: "scroll",
                          height: "500px",
                          width: "100%",
                          overflow: "auto",
                        }}
                      >
                        <table
                          className="table table-striped table-bordered"
                          width="100%"
                        >
                          <tbody>
                            <tr className="border-bottom mb-2">
                              <td
                                className="border-none tab-background"
                                width="50%"
                              >
                                <strong>Document Name</strong>
                              </td>
                              <td className="border-none tab-background">
                                <strong>Uploaded Date (UTC)</strong>
                              </td>
                            </tr>
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Fragment>
                  )}
                </Fragment>
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
              dialogClassName="preview-modal"
            >
              <Modal.Header>
                <Modal.Title>
                  Project Usage : ({UserScore.myProjectUsageCount}X30)
                </Modal.Title>
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
        </>
      )}
    </div>
  );
};

export default UserDashBoard;
