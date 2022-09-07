import React, { Fragment, useEffect, useContext, useState } from "react";
import TaggedDocuments from "./OpportunityRelated/TaggedDocuments";
import UnTaggedDocuments from "./KnowledgeRelated/UnTaggedDocuments";
import SearchDocumentsByOppID from "./SearchDocumentsByOppID";
import Cookies from "js-cookie";
import UrlConfig from "../URLConfig";
import PursuitDocuments from "./PursuitContent/index";
import { UserContext } from "../../UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const DocumentDepo = ({
  MasterData,
  refreshDocDepo,
  showDocAnalysys,
  enableDocAnalysis,
  PursuitDoc,
  homeredirect,
}) => {
  const [userDetails, dispatch] = useContext(UserContext);
  const [DataLoaded, setLoader] = useState(false);
  const [OppID, setOppID] = useState("");
  const [OppV, setOppV] = useState("");
  const [OppSearch, setOppSearch] = useState(false);
  const [KSO_USR, setKSO_USR] = useState(false);
  const [Environment, setEnvironment] = useState("");
  const isPursuitDoc = PursuitDoc === undefined ? false : true;

  useEffect(() => {
    if (PursuitDoc) document.getElementById("pills-Pursuit-tab").click(); // Activate Pursuit Tab..
    var DefaultRoles = Cookies.get("roles")?.split(",");
    var Environment = UrlConfig.get_Environment();
    var KSO_USR =
      DefaultRoles.indexOf("Admin") !== -1 ||
      DefaultRoles.indexOf("Analyst") !== -1 ||
      DefaultRoles.indexOf("Process") !== -1 ||
      DefaultRoles.indexOf("Specialist") !== -1;
    setKSO_USR(KSO_USR);
    setEnvironment(Environment);
    document
      .getElementsByClassName("AppContainer")[0]
      .classList.add("doc-depo-container");
  }, []);

  const getValidOpportunityID = async (Opp) => {
    const url =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20Account_Local_Name__c,%20Account_Region__c,Country__c,Business_Group2__c,Opportunity_ID__c%20from%20Opportunity%20where%20Opportunity_ID__c%20=%27" +
      Opp +
      "%27";
    const config = UrlConfig.ApplyAuth(url);
    try {
      const res = await axios({ ...config });
      if (res.data.response[0] !== undefined) {
        setOppV(Opp);
        setOppSearch(true);
      } else {
        toast.error("Please enter valid Opportunity ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const fireSearch = (e) => {
    if (e.key === "Enter") {
      if (e.keyCode === 13) {
        if ((e.target.value.length === 14) & isValidOppID(e.target.value)) {
          getValidOpportunityID(e.target.value);
        } else {
          toast.error("Please enter valid Opportunity ID", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    }
  };
  const isValidOppID = (fineSearch) => {
    if (fineSearch.length > 2) {
      if (
        fineSearch.toUpperCase().indexOf("OPP") === 0 ||
        fineSearch.toUpperCase().indexOf("OPE") === 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <Fragment>
      <div id="maincontainer" className="container-fluid mt-3">
        <div id="" className="container-fluid">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="doc-capsules mr-1">
                  <div
                    id="sectionheader3"
                    className="col-12 row ml-0 pt-2 pr-2"
                  >
                    <div className="col-8">
                      <span className="Home_logo" title="Home">
                        <a onClick={homeredirect}>
                          <i className="fas fa-home"></i>
                        </a>
                      </span>
                      <a onClick={refreshDocDepo} className="Doc-Depo-Heading">
                        DOCUMENT DEPOT
                      </a>
                    </div>
                    {KSO_USR && (
                      <Fragment>
                        <div className="col-3">
                          <input
                            className="form-control form-control-sm"
                            onKeyUp={fireSearch}
                            value={OppID}
                            placeholder="Enter Opportunity ID and hit enter"
                            type="text"
                            onChange={(e) => setOppID(e.target.value)}
                          ></input>
                        </div>
                        {/* {Environment === "UAT" && ( */}
                        <div className="col-1">
                          <button
                            className="btn btn-sm float-right btn-success docan-btn"
                            onClick={showDocAnalysys}
                          >
                            Doc Analysis
                          </button>
                        </div>
                        {/* )} */}
                      </Fragment>
                    )}
                    {!KSO_USR && (
                      <Fragment>
                        <div className="col-4">
                          <input
                            className="form-control form-control-sm"
                            onKeyUp={fireSearch}
                            value={OppID}
                            placeholder="Enter Opportunity ID and hit enter"
                            type="text"
                            onChange={(e) => setOppID(e.target.value)}
                          ></input>
                        </div>
                      </Fragment>
                    )}
                  </div>
                  <div className="pt-3" id="depot">
                    <div className="col-12 row">
                      {!OppSearch && !OppV ? (
                        <div className="col-sm-12">
                          <ul
                            className="col-sm-6 nav nav-pills mb-3"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li className="nav-item">
                              <a
                                className={
                                  isPursuitDoc ? "nav-link" : "nav-link active"
                                }
                                id="pills-home-tab"
                                data-toggle="pill"
                                href="#pills-home"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected={PursuitDoc ? "false" : "true"}
                                aria-expanded={PursuitDoc ? "false" : "true"}
                              >
                                <strong>Customer Opportunity Related</strong>
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className="nav-link"
                                id="pills-profile-tab"
                                data-toggle="pill"
                                href="#pills-profile"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                                aria-expanded="false"
                              >
                                <strong>Knowledge Related</strong>
                              </a>
                            </li>
                            {/* <li className="nav-item">
                              <a
                                className={
                                  isPursuitDoc ? "nav-link active" : "nav-link"
                                }
                                id="pills-Pursuit-tab"
                                data-toggle="pill"
                                href="#pills-Pursuit"
                                role="tab"
                                aria-controls="pills-Pursuit"
                                aria-selected={PursuitDoc ? "true" : "false"}
                                aria-expanded={PursuitDoc ? "true" : "false"}
                              >
                                <strong>Pursuit Content</strong>
                              </a>
                            </li> */}
                          </ul>

                          {!isPursuitDoc && (
                            <div
                              className="col-sm-12 no-margins tab-content float-left"
                              id="pills-tabContent"
                            >
                              <div
                                className={"tab-pane fade active show"}
                                id="pills-home"
                                role="tabpanel"
                                aria-labelledby="pills-home-tab"
                                aria-expanded="true"
                              >
                                <TaggedDocuments
                                  MasterData={MasterData}
                                  default={isPursuitDoc}
                                  redirect={getValidOpportunityID}
                                ></TaggedDocuments>
                              </div>

                              <UnTaggedDocuments
                                MasterData={MasterData}
                              ></UnTaggedDocuments>
                              <div
                                className={"tab-pane fade"}
                                id="pills-Pursuit"
                                role="tabpanel"
                                aria-labelledby="pills-Pursuit-tab"
                                aria-expanded="false"
                              >
                                {/* <PursuitDocuments
                                  MasterData={MasterData}
                                  PursuitDoc={isPursuitDoc}
                                  default={isPursuitDoc}
                                ></PursuitDocuments> */}
                              </div>
                            </div>
                          )}
                          {isPursuitDoc && (
                            <div
                              className="col-sm-12 no-margins tab-content float-left"
                              id="pills-tabContent"
                            >
                              <div
                                className={"tab-pane fade"}
                                id="pills-home"
                                role="tabpanel"
                                aria-labelledby="pills-home-tab"
                                aria-expanded="false"
                              >
                                <TaggedDocuments
                                  MasterData={MasterData}
                                  default={isPursuitDoc}
                                ></TaggedDocuments>
                              </div>

                              <UnTaggedDocuments
                                MasterData={MasterData}
                              ></UnTaggedDocuments>
                              <div
                                className={"tab-pane fade active show"}
                                id="pills-Pursuit"
                                role="tabpanel"
                                aria-labelledby="pills-Pursuit-tab"
                                aria-expanded="true"
                              >
                                {/* <PursuitDocuments
                                  MasterData={MasterData}
                                  PursuitDoc={isPursuitDoc}
                                  default={isPursuitDoc}
                                ></PursuitDocuments> */}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <SearchDocumentsByOppID
                          oppID={OppV}
                          MasterData={MasterData}
                        ></SearchDocumentsByOppID>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DocumentDepo;
