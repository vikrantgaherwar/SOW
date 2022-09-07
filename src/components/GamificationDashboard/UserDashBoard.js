import { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import Cookies from "js-cookie";
import CountUp from "react-countup";
import gold from "../../img/medal-icons/gold.png";
import { Modal, Button, Col, Container, Row, Card } from "react-bootstrap";
import {
  DOC_CONTRIBUTION,
  ACTIVITIES,
  MY_PROJECT_USAGE,
  DOCUMENT_REUSE,
} from "./Constants";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import UserProjectUsage from "./UserProjectUsage";
import { formatDate } from "../../utils/Date";
import { identifyFileFormat } from "../../utils/FileType";
import URLConfig from "../URLConfig";
import { OverlayTrigger, Tooltip } from "react-bootstrap/";

const UserDashBoard = ({ UserScore }) => {
  const [ProjectUsageDetails, setProjectUsageDetails] = useState([]);
  const [PublishedDocs, setPublishedDocs] = useState([]);
  const [DocumentReUseDetails, setDocumentReUseDetails] = useState([]);
  // { UserScore }
  useEffect(() => {
    debugger;
    if (UserScore?.myProjectUsageTotal > 0) {
      getProjectUsage();
    }
    if (UserScore?.documentContribution > 0) {
      getDocumentContirutionDetails();
    }
    if (UserScore?.documentReUse > 0) {
      getDocumentReUseDetails();
    }
  }, [UserScore]);

  const [modal, setModal] = useState({
    [DOC_CONTRIBUTION]: false,
    [ACTIVITIES]: false,
    [MY_PROJECT_USAGE]: false,
    [DOCUMENT_REUSE]: false,
  });
  const [button, setButton] = useState({
    [DOC_CONTRIBUTION]: false,
    [ACTIVITIES]: true,
    [MY_PROJECT_USAGE]: false,
  });
  const getDocumentReUseDetails = () => {
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
  };
  const getDocumentContirutionDetails = () => {
    var config = {
      method: "get",
      url:
        URLConfig.getURLDeltaAPI() +
        "DocumentAnalysis/GetPublishedDocuments/" +
        Cookies.get("empnumber"),
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
      host: window.location.origin + "/",
      // UserId: "60066521",
      // host: "https://delta.app.hpecorp.net/",
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
          <div className="container mt-5">
            <div className="row align-items-stretch">
              <div className="c-dashboardInfo col-lg-12 col-md-12">
                <div className="wrap">
                  <div className="row">
                    <div className="col-md-4">
                      <h4>User Dashboard</h4>
                    </div>

                    <div className="col-md-4">
                      {UserScore.badge.length > 0 ? (
                        <h6 className="pt-2">Badge : {UserScore.badge}</h6>
                      ) : (
                        <h6 className="pt-2">Badge : No Badge</h6>
                      )}
                    </div>
                    <div className="col-md-3">
                      <h6 className="pt-2">
                        Total Points Earned : {UserScore.totalPoints }
                      </h6>
                    </div>
                    <div className="col-md-1 text-right">
                      <h6 className="pt-2">
                        <Link to="/">
                          <i className="fas fa-home pointer" title="Home"></i>
                        </Link>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>

              {/* Onboarding */}
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
                        title=" Points earned on you onboarding to DELTA"
                      ></i>
                    </h5>
                  </div>
                  <div className="border-top mt-3 invisible">
                    <div className="row pt-1">
                      <div className="col-md-12 text-right">
                        <a href="#">
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
                    <h6>Achievement Bonus </h6>
                    <h5>
                      {UserScore.achievementBonus}

                      <i
                        className="fas fa-info-circle pl-1"
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Points earned when you are moved from one batch level to another"
                      ></i>
                    </h5>
                  </div>
                  <div className="border-top mt-3 invisible">
                    <div className="row pt-1">
                      <div className="col-md-12 text-right">
                        <a href="#">
                          {" "}
                          Achievement Bonus Count :{UserScore.achievementBonus}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="c-dashboardInfo col-lg-4 col-md-6">
                <div className="wrap">
                  <div className="user-card-3">
                    <h6>Activities</h6>
                    <h5>
                      {UserScore.activitiesTotal}

                      <i
                        className="fas fa-info-circle pl-1"
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Points earned on activities like View, Share & Feedback"
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
              {/* Ends here */}

              {/* My Project starts */}
              <div className="c-dashboardInfo col-lg-4 col-md-6">
                <div className="wrap">
                  <div className="user-card-4">
                    <h6>Project Usage </h6>
                    <h5>
                      {UserScore.myProjectUsageTotal}

                      <i
                        className="fas fa-info-circle pl-1"
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Points earned on the usage of your A&PS & PSA Projects"
                      ></i>
                    </h5>
                  </div>
                  <div className="border-top mt-3">
                    <div className="row pt-1">
                      <div className="col-md-12 text-right">
                        <a
                          href="#"
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
                  <div className="user-card-5">
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
                  <div className="user-card-6">
                    <h6>Document Reuse </h6>
                    <h5>
                      {UserScore.documentReUse}

                      <i
                        className="fas fa-info-circle pl-1"
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Points earned from the number of times a document(s) is reused"
                      ></i>
                    </h5>
                  </div>
                  <div className="border-top mt-3">
                    <div className="row pt-1">
                      <div className="col-md-12 text-right">
                        <a
                          href="#"
                          onClick={(e) => {
                            handleModalOpen(DOCUMENT_REUSE);
                          }}
                        >
                          {" "}
                          Document Reuse Count : {UserScore.documentReUse}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Ends here */}
            </div>
          </div>
          {/* Activities Modal */}
          {modal[ACTIVITIES] && (
            <div
              class="modal fade"
              id="activitymodal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="activityModalLabel"
              aria-hidden="true"
              show={modal[ACTIVITIES]}
              onHide={() => handleModalClose(ACTIVITIES)}
            >
              <div class="modal-dialog modal-md" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="activityModalLabel">
                      Activities : {UserScore.activitiesCount}{" "}
                    </h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      {" "}
                      <span
                        aria-hidden="true"
                        onClick={() => handleModalClose(ACTIVITIES)}
                      >
                        &times;
                      </span>{" "}
                    </button>
                  </div>
                  <div class="modal-body">
                    {UserScore.activitiesCount > 0 ? (
                      <table class="table table-striped table-sm table-bordered">
                        <thead>
                          <th>Activity Type</th>
                          <th>Count</th>
                        </thead>
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
                      " No Activities to  display"
                    )}
                  </div>
                  {/* <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary btn-sm"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          )}
          {/* Ends Here */}
          {/* {modal[ACTIVITIES] && (
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
                  className="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body>
                <Container className="border"> */}
          {/* <Row className=" m-1">
                    <Col>Activities</Col>
                    <Col>{UserScore.activitiesCount}</Col>
                  </Row> */}
          {/* <Row className=" m-1">
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
              </Modal.Body> */}
          {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
          {/* </Modal>
          )} */}
          {/* Document Contribution Modal */}
          {modal[DOC_CONTRIBUTION] && (
            <Modal
              show={modal[DOC_CONTRIBUTION]}
              onHide={() => handleModalClose(DOC_CONTRIBUTION)}
              dialogClassName="modal-md"
            >
              <Modal.Header>
                <Modal.Title>
                  Document Contribution: {UserScore.documentContribution}
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
                <Modal.Title>
                  Project Usage : {UserScore.myProjectUsageCount}
                </Modal.Title>
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
                  ? "No Project details to display"
                  : ""}
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
        </>
      )}
    </div>
  );
};

export default UserDashBoard;
