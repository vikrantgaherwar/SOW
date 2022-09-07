import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ActiveServiceCreditsTableData from "./ActiveServiceCreditsTableData";
import PurchasedServiceCreditsTableData from "./PurchasedServiceCreditsTableData";
import DeliveredServiceCreditsTableData from "./DeliveredServiceCreditsTableData";
import ConvertedNotDeliveredServiceCreditsTableData from "./ConvertedNotDeliveredServiceCreditsTableData";
import { map, each, find, sumBy } from "lodash";
import axios from "axios";
import URLConfig from "../URLConfig";
import Cookies from "js-cookie";
import TrackingService from "../TrackingService";
import ServiceCreditRecommendations from "./ServiceCreditRecommendations";
const ServiceCredits = ({ AccountId }) => {
  const AccountSTID = AccountId.replace(
    "Account.Account_ST_ID__c%20=%20%27",
    ""
  );
  const signal = axios.CancelToken.source();
  const [serviceCreditsFirstLevelData, setServiceCreditsFirstLevelData] =
    useState([]);
  const [activeCredits, setActiveCredits] = useState();
  const [deliveredCredits, setDeliveredCredits] = useState();
  const [convertedNotDeliveredCredits, setConvertedNotDeliveredCredits] =
    useState();
  const [deliveredCreditsForExpired, setDeliveredCreditsForExpired] =
    useState();
  const [
    convertedNotDeliveredCreditsForExpired,
    setConvertedNotDeliveredCreditsForExpired,
  ] = useState();
  const trackingService = new TrackingService();
  const [shouldShowActiveCredit, setShouldShowActiveCredit] = useState(false);
  const [shouldShowPurchasedCredit, setShouldShowPurchasedCredit] =
    useState(false);
  const [shouldShowDeliveredCredit, setShouldShowDeliveredCredit] =
    useState(false);
  const [
    shouldShowConvNotDeliveredCredit,
    setShouldShowConvNotDeliveredCredit,
  ] = useState(false);
  const [ActiveTableData, setActiveTableData] = useState();
  const [DeliveredTableData, setDeliveredTableData] = useState();
  const [convertedNotDeliveredTableData, setConvertedNotDeliveredTableData] =
    useState();
  const [recommndations, setRecommndations] = useState(false);
  useEffect(() => {
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  useEffect(() => {
    setServiceCreditsFirstLevelData([]);
    if (AccountSTID) {
      fetchServiceCreditsFirstLevelDetails(AccountSTID, signal.token);
      fetchTableData(AccountSTID, signal.token);
    }
  }, [AccountSTID]);
  const fetchServiceCreditsFirstLevelDetails = async (
    AccountSTID,
    cancelToken
  ) => {
    let ServiceCreditURL =
      "https://delta.app.hpecorp.net:8983/solr/service_credit/select?facet.pivot=ProjectId,ActiveCredits&facet.mincount=1&facet=on&fl=ActiveCredits&indent=on&json.facet=%7Bcategories:%7Btype%20:%20terms,limit:1000,field%20:%20Status,facet:%7BSUM%20:%20%22sum(CreditValue)%22%7D%7D%7D&q=Account_ST_ID:%22" +
      AccountSTID +
      "%22&rows=10000&wt=json&fq=-ActiveCredits:0";
    try {
      const res = await axios.get(ServiceCreditURL);
      if (res.data) {
        const credits = [
          ...res?.data?.facet_counts?.facet_pivot["ProjectId,ActiveCredits"],
        ];

        let sum = 0;
        const lv1 = credits.map((item1, index) => {
          sum = sum + item1.pivot[0].value;
        });
        setActiveCredits(sum);
        if (res.data.facets.count > 0) {
          if (res.data.facets.categories.buckets.length > 1) {
            if (
              res.data.facets.categories.buckets[0].val ===
              "Converted Not Delivered"
            ) {
              setDeliveredCredits(res.data.facets.categories.buckets[1].SUM);
              setConvertedNotDeliveredCredits(
                res.data.facets.categories.buckets[0].SUM
              );
            } else {
              setDeliveredCredits(res.data.facets.categories.buckets[0].SUM);
              setConvertedNotDeliveredCredits(
                res.data.facets.categories.buckets[1].SUM
              );
            }
          } else {
            if (
              res.data.facets.categories.buckets[0].val ===
              "Converted Not Delivered"
            ) {
              setDeliveredCredits(0);
              setConvertedNotDeliveredCredits(
                res.data.facets.categories.buckets[0].SUM
              );
            } else {
              setDeliveredCredits(res.data.facets.categories.buckets[0].SUM);
              setConvertedNotDeliveredCredits(0);
            }
          }
          setServiceCreditsFirstLevelData(res.data);
        } else {
          setDeliveredCredits(0);
          setConvertedNotDeliveredCredits(0);
        }
      } else {
        setActiveCredits(0);
        setDeliveredCredits(0);
        setConvertedNotDeliveredCredits(0);
        setServiceCreditsFirstLevelData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTableData = async (AccountSTID) => {
    // API call for Active and Purchased Credits Table Data

    let securl =
      "https://delta.app.hpecorp.net:8983/solr/service_credit/select?fl=*&group.field=ProjectId&group.mincount=1&group.limit=1&group=true&indent=on&json.facet=%7Bcategories:%7Btype%20:%20terms,limit:1000,field%20:%20ProjectId,facet:%7Bprojects:%20%7Btype%20:%20terms,%20field:%20Status,%20facet:%7BSUM%20:%20%22sum(CreditValue)%22%7D%7D%7D%7D%7D&&q=Account_ST_ID:%22" +
      AccountSTID +
      "%22&rows=10000&wt=json";

    try {
      const res = await axios.get(securl);
      const projectsGrouped = [...res?.data?.grouped?.ProjectId?.groups];
      const credits = [...res?.data?.facets?.categories?.buckets];

      let projects = [];
      each(projectsGrouped, (item) => {
        projects = [...projects, ...item.doclist.docs];
      });

      const newCredits = map(credits, (item1) => ({
        ...item1,
      }));
      //console.log({ newCredits });
      const finalProjects = map(projects, (item) => {
        const matchingCredit = find(
          newCredits,
          (credit) => credit.val === item.ProjectId
        );

        if (matchingCredit?.projects?.buckets.length > 0) {
          const credits = map(matchingCredit.projects.buckets, (credit) => ({
            creditName: credit.val,
            creditSum: credit.SUM,
          }));
          return {
            ...item,
            credits: [...credits],
          };
        }
        return { ...item };
      });
      setActiveTableData(finalProjects);
    } catch (error) {
      console.log(error);
    }

    // API call for Delivered Credits Table Data

    let delurl =
      "https://delta.app.hpecorp.net:8983/solr/service_credit/select?fl=*&group.field=ProjectId&group.mincount=1&group.limit=1&group=true&indent=on&json.facet=%7Bcategories:%7Btype%20:%20terms,limit:1000,field%20:%20ProjectId,facet:%7Bprojects:%20%7Btype%20:%20terms,%20field:%20Status,%20facet:%7BSUM%20:%20%22sum(CreditValue)%22%7D%7D%7D%7D%7D&&q=Account_ST_ID:%22" +
      AccountSTID +
      "%22%20AND%20TaskStatus:%22Completed%22&rows=10000&wt=json";
    try {
      const res = await axios.get(delurl);
      const projectsGrouped = [...res?.data?.grouped?.ProjectId?.groups];
      const credits = [...res?.data?.facets?.categories?.buckets];

      let projects = [];
      each(projectsGrouped, (item) => {
        projects = [...projects, ...item.doclist.docs];
      });

      const newCredits = map(credits, (item1) => ({
        ...item1,
      }));
      //console.log({ newCredits });
      const finalProjects = map(projects, (item) => {
        const matchingCredit = find(
          newCredits,
          (credit) => credit.val === item.ProjectId
        );

        if (matchingCredit?.projects?.buckets.length > 0) {
          const credits = map(matchingCredit.projects.buckets, (credit) => ({
            creditName: credit.val,
            creditSum: credit.SUM,
          }));
          return {
            ...item,
            credits: [...credits],
          };
        }
        return { ...item };
      });
      setDeliveredTableData(finalProjects);
    } catch (error) {
      console.log(error);
    }
    // API call for Converted(Not Delivered) Credits Table Data
    let convurl =
      "https://delta.app.hpecorp.net:8983/solr/service_credit/select?fl=*&group.field=ProjectId&group.mincount=1&group.limit=1&group=true&indent=on&json.facet=%7Bcategories:%7Btype%20:%20terms,limit:1000,field%20:%20ProjectId,facet:%7Bprojects:%20%7Btype%20:%20terms,%20field:%20Status,%20facet:%7BSUM%20:%20%22sum(CreditValue)%22%7D%7D%7D%7D%7D&&q=Account_ST_ID:%22" +
      AccountSTID +
      "%22%20AND%20-TaskStatus:%22Completed%22&rows=10000&wt=json";

    try {
      const res = await axios.get(convurl);
      const projectsGrouped = [...res?.data?.grouped?.ProjectId?.groups];
      const credits = [...res?.data?.facets?.categories?.buckets];

      let projects = [];
      each(projectsGrouped, (item) => {
        projects = [...projects, ...item.doclist.docs];
      });

      const newCredits = map(credits, (item1) => ({
        ...item1,
      }));
      //console.log({ newCredits });
      const finalProjects = map(projects, (item) => {
        const matchingCredit = find(
          newCredits,
          (credit) => credit.val === item.ProjectId
        );

        if (matchingCredit?.projects?.buckets.length > 0) {
          const credits = map(matchingCredit.projects.buckets, (credit) => ({
            creditName: credit.val,
            creditSum: credit.SUM,
          }));
          return {
            ...item,
            credits: [...credits],
          };
        }
        return { ...item };
      });

      setConvertedNotDeliveredTableData(finalProjects);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingServiceCredentials">
          <h5 className="mb-0">
            <button
              className="btn btn-link btn-full collapsed"
              type="button"
              data-toggle="collapse"
              aria-expanded="true"
              aria-controls="ServiceCredentials"
              data-target="#ServiceCredentials"
            >
              Service Credits
            </button>
          </h5>
        </div>
      </div>
      <div
        aria-labelledby="headingServiceCredentials"
        data-parent="#accordionCust"
        aria-expanded="true"
        className="collapse"
        id="ServiceCredentials"
      >
        <div className="card-body ml-3 mb-4">
          <div className="col-12" align="right">
            <a
              className="pointer"
              data-toggle="tooltip"
              title="Service Credit Recommendations"
              onClick={() => setRecommndations(true)}
            >
              <u
                className="capsuleonelead mr-1"
                onClick={() => {
                  trackingService.LogServiceCreditsClick(
                    Cookies.get("empnumber"),
                    "LogAllRecommendationsServiceCreditsClick"
                  );
                }}
              >
                All Recommendations
              </u>
            </a>

            <a
              className="auto-cursor"
              data-toggle="tooltip"
              title="Details retrieved from dependent data source."
            >
              <i className="far fa-question-circle disclaimertooltip" />
            </a>
          </div>
          <div className="col-12 row p-1">
            <div
              className="col-5 service-credits-box-active mr-2 ml-4 card pointer"
              onClick={() => {
                if (activeCredits !== 0) setShouldShowActiveCredit(true);
              }}
              style={
                activeCredits !== 0
                  ? { cursor: "pointer" }
                  : { cursor: "default" }
              }
            >
              <div>ACTIVE</div>
              <div
                onClick={() => {
                  trackingService.LogServiceCreditsClick(
                    Cookies.get("empnumber"),
                    this.state.opened_cases,
                    "LogActiveServiceCreditsClick"
                  );
                }}
              >
                {activeCredits ? <h4>{activeCredits}</h4> : <h4>0</h4>}
              </div>
            </div>
            <div
              className="col-5 service-credits-box-purchased card "
              onClick={() => {
                if (
                  activeCredits +
                    deliveredCredits +
                    convertedNotDeliveredCredits >
                  0
                )
                  setShouldShowPurchasedCredit(true);
              }}
              style={
                activeCredits +
                  deliveredCredits +
                  convertedNotDeliveredCredits >
                0
                  ? { cursor: "pointer" }
                  : { cursor: "default" }
              }
            >
              <div>PURCHASED</div>
              <div>
                <h4
                  onClick={() => {
                    trackingService.LogServiceCreditsClick(
                      Cookies.get("empnumber"),
                      this.state.opened_cases,
                      "LogPurchasedServiceCreditsClick"
                    );
                  }}
                >
                  {activeCredits +
                    deliveredCredits +
                    convertedNotDeliveredCredits >
                  0
                    ? activeCredits +
                      deliveredCredits +
                      convertedNotDeliveredCredits
                    : 0}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-12 row p-1 mb-1">
            <div
              className="col-5 service-credits-box-delivered  mr-2 ml-4 card "
              onClick={() => {
                if (deliveredCredits !== 0) setShouldShowDeliveredCredit(true);
              }}
              style={
                deliveredCredits !== 0
                  ? { cursor: "pointer" }
                  : { cursor: "default" }
              }
            >
              <div>DELIVERED</div>
              <div
                onClick={() => {
                  trackingService.LogServiceCreditsClick(
                    Cookies.get("empnumber"),
                    this.state.opened_cases,
                    "LogDeliveredServiceCreditsClick"
                  );
                }}
              >
                {deliveredCredits ? <h4>{deliveredCredits}</h4> : <h4>0</h4>}
              </div>
            </div>
            <div
              className="col-5 service-credits-box-converted card pointer"
              onClick={() => {
                if (convertedNotDeliveredCredits !== 0)
                  setShouldShowConvNotDeliveredCredit(true);
              }}
              style={
                convertedNotDeliveredCredits !== 0
                  ? { cursor: "pointer" }
                  : { cursor: "default" }
              }
            >
              <div>
                CONVERTED <br />
                (Not Delivered)
              </div>
              <div
                onClick={() => {
                  trackingService.LogServiceCreditsClick(
                    Cookies.get("empnumber"),
                    this.state.opened_cases,
                    "LogConvertedServiceCreditsClick"
                  );
                }}
              >
                {convertedNotDeliveredCredits ? (
                  <h4>{convertedNotDeliveredCredits}</h4>
                ) : (
                  <h4>0</h4>
                )}
              </div>
            </div>
          </div>
          {/* <div className="col-10 service-credits-box-expired card exp-margin">
            <div>EXPIRED</div>
            <div>
              <h6>
                {deliveredCreditsForExpired +
                  convertedNotDeliveredCreditsForExpired >
                0
                  ? deliveredCreditsForExpired +
                    convertedNotDeliveredCreditsForExpired
                  : 0}
              </h6>
            </div>
          </div> */}
        </div>
      </div>
      {/* Modal Box for Showing the Graph and Table for the corresponding Click from first level */}
      {shouldShowActiveCredit && (
        <div className="Install-Chart-Layout">
          <Modal show={shouldShowActiveCredit} size="lg">
            <Modal.Header as="section">
              <Modal.Title className="ibheadertext alignheader col-12" as="div">
                <a className="btn btn-sm btn-transp">Active Credits</a>
                <a
                  className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                  onClick={() => setShouldShowActiveCredit(false)}
                  translate="no"
                >
                  X
                </a>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div align="center">
                {ActiveTableData.length > 0 ? (
                  <ActiveServiceCreditsTableData
                    AccountSTID={AccountSTID}
                    data={ActiveTableData}
                  />
                ) : (
                  "Loading"
                )}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
      {/* Modal Box for Showing the Table for the Purchased credits */}
      {shouldShowPurchasedCredit && (
        <div className="Install-Chart-Layout">
          <Modal show={shouldShowPurchasedCredit} size="lg">
            <Modal.Header as="section">
              <Modal.Title className="ibheadertext alignheader col-12" as="div">
                <a className="btn btn-sm btn-transp">Purchased Credits</a>
                <a
                  className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                  onClick={() => setShouldShowPurchasedCredit(false)}
                  translate="no"
                >
                  X
                </a>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div align="center">
                {ActiveTableData.length > 0 ? (
                  <PurchasedServiceCreditsTableData
                    AccountSTID={AccountSTID}
                    data={ActiveTableData}
                  />
                ) : (
                  "Loading"
                )}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
      {/* Modal Box for Showing the Table for the Converted (Not Delivered) credits */}
      {shouldShowConvNotDeliveredCredit && (
        <div className="Install-Chart-Layout">
          <Modal show={shouldShowConvNotDeliveredCredit} size="lg">
            <Modal.Header as="section">
              <Modal.Title className="ibheadertext alignheader col-12" as="div">
                <a className="btn btn-sm btn-transp">
                  Converted (Not Delivered) Credits
                </a>
                <a
                  className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                  onClick={() => setShouldShowConvNotDeliveredCredit(false)}
                  translate="no"
                >
                  X
                </a>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div align="center">
                {convertedNotDeliveredTableData.length > 0 ? (
                  <ConvertedNotDeliveredServiceCreditsTableData
                    AccountSTID={AccountSTID}
                    data={convertedNotDeliveredTableData}
                  />
                ) : (
                  "Loading"
                )}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
      {/* Modal Box for Showing the Table for the Delivered credits */}
      {shouldShowDeliveredCredit && (
        <div className="Install-Chart-Layout">
          <Modal show={shouldShowDeliveredCredit} size="lg">
            <Modal.Header as="section">
              <Modal.Title className="ibheadertext alignheader col-12" as="div">
                <a className="btn btn-sm btn-transp">Delivered Credits</a>
                <a
                  className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                  onClick={() => setShouldShowDeliveredCredit(false)}
                  translate="no"
                >
                  X
                </a>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div align="center">
                {DeliveredTableData.length > 0 ? (
                  <DeliveredServiceCreditsTableData
                    AccountSTID={AccountSTID}
                    data={DeliveredTableData}
                  />
                ) : (
                  "Loading"
                )}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
      {/* Modal to show the Service Credits Recommendation details */}
      {recommndations && (
        <div className="Install-Chart-Layout">
          <Modal
            show={recommndations}
            size="lg"
            className="modal-dialog-scrollable"
          >
            <Modal.Header as="section">
              <Modal.Title className="ibheadertext alignheader col-12" as="div">
                <a className="btn btn-sm btn-transp">
                  Service Credit - Recommendations
                </a>
                <a
                  className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                  onClick={() => setRecommndations(false)}
                  translate="no"
                >
                  x
                </a>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div align="center">
                <ServiceCreditRecommendations
                  AccountId={AccountId}
                  activeCredits={activeCredits}
                />
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};
export default ServiceCredits;
