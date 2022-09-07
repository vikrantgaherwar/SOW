import { render } from "@testing-library/react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap/";
import React from "react";
import gold from "../../img/medal-icons/gold.png";
// import bronze from "../img/medal-icons/bronze.png";
import silver from "../../img/medal-icons/silver.png";
import diamond from "../../img/medal-icons/diamond.png";
import platinum from "../../img/medal-icons/platinum.png";
import white from "../../img/medal-icons/white.png";
import bronze from "../../img/medal-icons/bronze.png";
class GamificationModal extends React.Component {
  render() {
    return (
      <>
        {/* <Button variant="primary" onClick={this.handleShow}>
          Launch demo modal
        </Button> */}

        <Modal
          show={this.props.show}
          size="lg"
          className="modal-dialog-scrollable"
        >
          <Modal.Header>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-11">
                  <h5 class="modal-title ml-2" id="exampleModalLabel">
                    Knowledge Gamification
                  </h5>
                </div>
                <div
                  className="col-md-1 btn"
                  style={{
                    float: "end",
                    fontWeight: 600,
                    fontSize: "12px",
                  }}
                  onClick={this.props.handleClose}
                >
                  X
                </div>
              </div>
              <div class="row">
                <div className="col-md-12">
                  <p className="gamification-info">
                    The launch of Gamification is to engage with Knowledge
                    Management Users to contribute , collaborate, share and
                    interact. By performing the various KM activities , the KM
                    user can earn points and attain badges as per the
                    achievement levels.
                  </p>
                </div>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              {/* <div class="row">
                <div className="col-md-12">
                  <p className="gamification-info">
                    The launch of Gamification is to engage with Knowledge
                    Management Users to contribute , collaborate, share and
                    interact. By performing the various KM activities , the KM
                    user can earn points and attain badges as per the
                    achievement levels.
                  </p>
                </div>
              </div> */}
              <div class="row mb-5">
                <div class="col-md-8 col-sm-12 border-right">
                  <div class="apland-timeline-area">
                    <div class="single-timeline-area">
                      <div class="timeline-date wow fadeInLeft">
                        <p>Onboarding </p>
                      </div>
                      <div class="row">
                        <div class="col-12 col-md-12 col-lg-12">
                          <div class="single-timeline-content d-flex wow fadeInLeft slice-1">
                            <div class="timeline-icon">
                              <i class="fa fa-user" aria-hidden="true"></i>
                            </div>
                            <div class="timeline-text">
                              <div class="row">
                                <div class="col-md-7">
                                  <h6>Onboarding-Profile & Persona Update </h6>
                                </div>
                                <div class="col-md-5 text-right">
                                  <h6 className="text-right">
                                    Total Score :{" "}
                                    <span class="badge badge-info p-2">
                                      100
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="single-timeline-area">
                      <div class="timeline-date wow fadeInLeft">
                        <p>Solution Usage </p>
                      </div>
                      <div class="row">
                        <div class="col-12 col-md-6 col-lg-6 equal">
                          <div class="single-timeline-content d-flex wow fadeInLeft slice-2">
                            <div class="timeline-icon">
                              <i class="fa fa-eye"></i>
                            </div>
                            <div class="timeline-text">
                              <div class="row">
                                <div class="col-md-12">
                                  <h6>Activity (View,Share & Feedback) </h6>
                                </div>
                                <div class="col-md-12 mt-3">
                                  <div class="text-right">
                                    <h6>
                                      Total Score :{" "}
                                      <span class="badge badge-info p-2">
                                        05
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-6 equal">
                          <div class="single-timeline-content d-flex wow fadeInLeft slice-3">
                            <div class="timeline-icon">
                              <i class="fa fa-desktop"></i>
                            </div>
                            <div class="timeline-text">
                              <div class="row">
                                <div class="col-md-12">
                                  <h6>
                                    Project Usage (Project View & ReUse){" "}
                                  </h6>
                                </div>
                                <div class="col-md-12 mt-3">
                                  <div class="text-right">
                                    <h6>
                                      Total Score :{" "}
                                      <span class="badge badge-info p-2">
                                        30
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="single-timeline-area">
                      <div class="timeline-date wow fadeInLeft">
                        <p>Contirbution & Reuse </p>
                      </div>
                      <div class="row">
                        <div class="col-12 col-md-6 col-lg-6 equal">
                          <div class="single-timeline-content d-flex wow fadeInLeft slice-4">
                            <div class="timeline-icon">
                              <i class="fa fa-id-card" aria-hidden="true"></i>
                            </div>
                            <div class="timeline-text">
                              <div class="row">
                                <div class="col-md-12">
                                  <h6>
                                    Publish/Update (Collateral,Lessons...){" "}
                                  </h6>
                                </div>
                                <div class="col-md-12 mt-3">
                                  <div class="text-right">
                                    <h6>
                                      Total Score :{" "}
                                      <span class="badge badge-info p-2">
                                        50
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-6 equal">
                          <div class="single-timeline-content d-flex wow fadeInLeft slice-5">
                            <div class="timeline-icon">
                              <i class="fa fa-file" aria-hidden="true"></i>
                            </div>
                            <div class="timeline-text">
                              <div class="row">
                                <div class="col-md-12">
                                  <h6>Document Hits & Relevance </h6>
                                </div>
                                <div class="col-md-12 mt-3">
                                  <div class="text-right">
                                    <h6>
                                      Total Score :{" "}
                                      <span class="badge badge-info p-2">
                                        05
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-sm-12">
                  <div class="row">
                    <div class="col-12 col-md-12 col-lg-12">
                      <div class="right-card">
                        <div class="single-timeline-content d-flex wow fadeInLeft">
                          <div class="timeline-icon">
                            <i class="fa fa-trophy"></i>
                          </div>
                          <div class="timeline-text">
                            <div class="row">
                              <div class="col-md-5">
                                <h6 class="pt-1">Achievement Levels </h6>
                              </div>
                              <div class="col-md-7">
                                <div class="text-right">
                                  <h6>
                                    Total Score :{" "}
                                    <span class="badge badge-info p-2">
                                      250
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2">
                          <div class="col-md-6 mb-sm-0">
                            <div class="custom-card card-1">
                              {" "}
                              <strong>Bronze</strong>
                              <h6>(5000+)</h6>
                            </div>
                          </div>
                          <div class="col-md-6 mb-sm-0">
                            <div class="custom-card card-2">
                              {" "}
                              <strong>Silver</strong>
                              <h6>(10000+)</h6>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2">
                          <div class="col-md-6 mb-sm-0">
                            <div class="custom-card card-3">
                              {" "}
                              <strong>Gold</strong>
                              <h6>(25000+)</h6>
                            </div>
                          </div>
                          <div class="col-md-6 mb-sm-0">
                            <div class="custom-card card-4">
                              {" "}
                              <strong>Platinum</strong>
                              <h6>(50000+)</h6>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2">
                          <div class="col-md-6">
                            <div class="custom-card card-5">
                              {" "}
                              <strong>Diamond</strong>
                              <h6>(100000+)</h6>
                            </div>
                          </div>
                        </div>
                        <hr></hr>
                        <div class="single-timeline-content d-flex wow fadeInLeft mt-3">
                          <div class="timeline-icon">
                            <i class="fa fa-question"></i>
                          </div>
                          <div class="timeline-text">
                            <div class="row">
                              <div class="col-md-5">
                                <h6 class="pt-1">
                                  Quiz<span class="invisible">dddddd</span>{" "}
                                </h6>
                              </div>
                              <div class="col-md-7">
                                <div class="text-right">
                                  <h6>
                                    Total Score :{" "}
                                    <span class="badge badge-info p-2">
                                      250
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-12">
                            <p className="gamification-info pt-2">
                              Know your A & PS Practices,Service
                              Offerings,Learning Catalog,M & A's etc..,
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default GamificationModal;
