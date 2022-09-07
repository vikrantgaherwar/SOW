import React, { useState, Fragment, useEffect } from "react";
import map from "lodash/map";
import fill from "lodash/fill";
import slice from "lodash/slice";
import filter from "lodash/filter";
import includes from "lodash/includes";
import trim from "lodash/trim";
import lowerCase from "lodash/lowerCase";
import { ExportReactInsightData } from "./ExportReactInsightData";
import Modal from "react-bootstrap/Modal";
import InsightMoreDocs from "./InsightsMoreDocs";
const Insight = ({
  insightData,
  setActiveFilterAndValue,
  searchTerm,
  filters,
  //   onCustomerSubmit,
}) => {
  const [pageNo, setPageNo] = useState(() =>
    fill(Array(insightData.groups.length), 0)
  );
  const [searchKey, setSearchKey] = useState(() =>
    fill(Array(insightData.groups.length), "")
  );
  const [data, setData] = useState([]);
  const [insightDocsCount, setInsightDocsCount] = useState(0);
  const size = 5;
  const [exportData, setExportData] = useState([]);
  const [exportData2, setExportData2] = useState([]);
  const [show, setShow] = useState(false);
  const [stageData, setStageData] = useState([]);
  useEffect(() => {
    processInsightData(insightData);
  }, [insightData, searchKey]);
  useEffect(() => {
    updateExportData(insightData);
  }, [exportData]);

  const processInsightData = (incomingInsightData) => {
    if (
      incomingInsightData &&
      incomingInsightData.groups &&
      incomingInsightData.groups.length > 0
    ) {
      let count = 0;
      let expData = [];
      // Remove docs that do not have Account_ST_Name
      const processedInsightData = [
        ...map(incomingInsightData.groups, (stage, index) => {
          const docs = filter(
            stage.doclist.docs,
            (item) =>
              includes(
                trim(lowerCase(item.Account_ST_Name)),
                trim(lowerCase(searchKey[index]))
              ) ||
              includes(
                trim(lowerCase(item.opportunity_id)),
                trim(lowerCase(searchKey[index]))
              )
          );
          expData = expData.concat(docs);
          count += docs.length;
          return {
            groupValue: stage.groupValue,
            docs,
          };
        }),
      ];
      setData(processedInsightData);
      setInsightDocsCount(count);
      setExportData(expData);
    } else {
      setData([]);
      setInsightDocsCount(0);
    }
  };

  useEffect(() => {
    // Reset on change of Insight Data
    setPageNo(fill(Array(insightData.groups.length), 0));
    setSearchKey(fill(Array(insightData.groups.length), ""));
  }, [insightData]);

  const handleSearch = (e, index) => {
    const { value } = e.target;
    setSearchKey((prevState) => {
      prevState[index] = value;
      return [...prevState];
    });
  };

  const prevPage = (index) => {
    setPageNo((prevState) => {
      prevState[index] = prevState[index] - 1;
      return [...prevState];
    });
  };

  const nextPage = (index) => {
    setPageNo((prevState) => {
      prevState[index] = prevState[index] + 1;
      return [...prevState];
    });
  };

  const handleAccountNameClick = (e, searchValue) => {
    // e.preventDefault();
    setActiveFilterAndValue("Account Name", searchValue);
    setShow(false);
    // onCustomerSubmit(searchValue);
  };
  const updateExportData = () => {
    const newFile = exportData.map((item) => {
      var desc = item?.description?.replace(/\n/g, "");
      return {
        Geo: item.geography,
        Country: item.country_name,
        Account: item.Account_Name,
        SalesRep: item.owner_email,
        Amount: item.Amount,
        CreatedDate: item.creation_date,
        Description: desc,
        Id: item.id,
        Opportunity_ID: item.opportunity_id,
        Opportunity_Sales_Stage: item.Opportunity_Sales_Stage,
        Status_C: item.status,
        Type: item.type,
        Win_Loss_Reason_c: item.win_loss_reason,
      };
    });

    setExportData2(newFile);
  };
  return (
    <>
      {data.length > 0 && (
        <>
          <div className="card-header" id="headingInsight">
            <h5 className="mb-0 in-flex">
              <button
                className="btn btn-link btn-full collapsed"
                type="button"
                data-toggle="collapse"
                aria-expanded="false"
                data-target="#reuseInsight"
                aria-controls="reuseInsight"
              >
                Insights (Commit Pipeline)
              </button>
              <span
                title="Export data is limited to filters applied "
                className="mb-4"
              >
                <ExportReactInsightData
                  csvData={exportData2}
                  fileName="InsightsRawData.xls"
                >
                  Export
                </ExportReactInsightData>
              </span>
              <span className="circle-count">
                <span className="count-inner">
                  {/* {insightData.matches ? insightData.matches : "0"} */}
                  {insightDocsCount}
                </span>
              </span>
            </h5>
          </div>
          <div
            className="collapse"
            aria-labelledby={"headingInsight"}
            data-parent="#accordionReUse"
            aria-expanded="false"
            id={"reuseInsight"}
          >
            <div className="card-body ml-2 mr-2 mt-2">
              <div className="accordion" id="accordionInsightStages">
                {/* {insightData.groups.length > 0 &&
              map(insightData.groups, (stage, index) => {
                if (stage.doclist.docs.length > 0) */}
                {data.length > 0 &&
                  map(data, (stage, index) => {
                    // if (stage.doclist.docs.length > 0)
                    // if (stage.docs.length > 0) {
                    return (
                      <Fragment key={stage.groupValue}>
                        <div className="card-header">
                          <h5 className="mb-0 in-flex">
                            <button
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              aria-controls="refthree"
                              className="btn btn-link btn-full collapsed pt-1 pb-1"
                              data-target={`#insightStage${index}`}
                            >
                              {stage.groupValue}
                            </button>

                            <span className="circle-count-sub">
                              <span className="count-inner-sub">
                                {/* {stage.doclist.numFound} */}
                                {stage.docs.length}
                              </span>
                            </span>
                          </h5>
                        </div>
                        <div
                          className="collapse"
                          aria-labelledby="headingHPSE"
                          data-parent="#accordionInsightStages"
                          aria-expanded="false"
                          id={`insightStage${index}`}
                        >
                          {/* Search */}
                          {/* <div className="row pr-1 pb-2">
                            <div className="col-6">
                              <input
                                className="form-control form-control-sm ml-2"
                                type="text"
                                value={searchKey[index]}
                                onChange={(e) => handleSearch(e, index)}
                                placeholder="OPP ID / Account Name"
                              />
                            </div>
                          </div> */}

                          <div className="card-body">
                            {/* {stage.doclist.docs.length > 0 && */}
                            {stage.docs.length > 0
                              ? map(
                                  slice(
                                    // stage.doclist.docs,
                                    stage.docs,
                                    pageNo[index] * size,
                                    pageNo[index] * size + size
                                  ),
                                  (doc) => (
                                    <div
                                      key={doc.id}
                                      className="col p-0 mb-1 border-bottom breakall_word"
                                    >
                                      <div className="col-12 pl-1 row pr-0 mr-0">
                                        <div className="col-12 p-0">
                                          <div className="col-12 row mr-0 pr-0">
                                            <div className="col-12 mb-1">
                                              <div>
                                                <strong>Account Name</strong>
                                              </div>
                                              <div className=" lnht12x default-anchor-style pointer">
                                                <a
                                                  title="Click to Open Customer Capsule"
                                                  // href="#"
                                                  onClick={(e) =>
                                                    handleAccountNameClick(
                                                      e,
                                                      doc.Account_ST_Name
                                                    )
                                                  }
                                                >
                                                  {doc.Account_ST_Name}
                                                </a>
                                              </div>
                                            </div>

                                            <div className="col-12 mb-1">
                                              <div>
                                                <strong>Sales Rep</strong>
                                              </div>
                                              <div className="lnht12x">
                                                {doc.owner_email}
                                              </div>
                                            </div>
                                            <div className="col-7 mb-1">
                                              <div>
                                                <strong>Geography</strong>
                                              </div>
                                              <div className="lnht12x">{`${doc.geography} (${doc.country})`}</div>
                                            </div>
                                            <div className="col-5 mb-1">
                                              <div>
                                                <strong>Opportunity ID</strong>
                                              </div>
                                              <div className="lnht12x default-anchor-style">
                                                <a
                                                  href={doc.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  title="Click to Open Opportunity ID (Salesforce)"
                                                >
                                                  {doc.opportunity_id}
                                                </a>
                                              </div>
                                            </div>
                                            {/* <div className="col-8">
                                          <div>
                                            <strong>Created Date</strong>
                                          </div>
                                          <div className="lnht12x">
                                            {doc.creation_date &&
                                              doc.creation_date.split("T") &&
                                              doc.creation_date.split("T")[0] &&
                                              doc.creation_date.split("T")[0]}
                                          </div>
                                        </div>
                                        <div className="col-4">
                                          <div>
                                            <strong>Product Line</strong>
                                          </div>
                                          <div className="lnht12x">
                                            {doc.product_line}
                                          </div>
                                        </div> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )
                              : "No Match"}

                            {stage.docs.length > size && (
                              <div className="col-12 pt-0 pb-3 more-wrapper mb-1 ml-1">
                                {/* <i
                                  className="fas fa-arrow-right float-right mr-3 pointer pt-1 pb-1"
                                  style={{
                                    color:
                                      slice(
                                        stage.docs,
                                        (pageNo[index] + 1) * size
                                      ).length > 0
                                        ? "black"
                                        : "grey",
                                  }}
                                  onClick={
                                    slice(
                                      stage.docs,
                                      (pageNo[index] + 1) * size
                                    ).length > 0
                                      ? () => nextPage(index)
                                      : undefined
                                  }
                                />
                                <i
                                  className="fas fa-arrow-left float-right mr-3 pointer pt-1 pb-1"
                                  style={{
                                    color: pageNo[index] > 0 ? "black" : "grey",
                                  }}
                                  onClick={
                                    pageNo[index] > 0
                                      ? () => prevPage(index)
                                      : undefined
                                  }
                                /> */}
                                {/* <p
                                  align="right"
                                  onClick={() => {
                                    setStageData(stage.groupValue);
                                    setShow(!show);
                                  }}
                                >
                                  More
                                </p> */}

                                <i className="fas fa-arrow-right float-right mr-3 pointer" />
                                <b
                                  className="float-right mr-1 pointer"
                                  onClick={() => {
                                    setStageData(stage.groupValue);
                                    setShow(!show);
                                  }}
                                >
                                  More
                                </b>
                              </div>
                            )}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
              </div>
            </div>
          </div>
          <Modal
            show={show}
            onHide={() => {
              setShow(!show);
            }}
          >
            <Modal.Header>
              <Modal.Title>{stageData}</Modal.Title>
              <button
                type="button"
                translate="no"
                onClick={() => {
                  setShow(!show);
                }}
                class="close"
                data-dismiss="modal"
              >
                ×
              </button>
            </Modal.Header>
            <Modal.Body bsPrefix="document-data-modal">
              {stageData.length > 0 ? (
                <InsightMoreDocs
                  stageData={stageData}
                  searchTerm={searchTerm}
                  filters={filters}
                  handleAccountNameClick={handleAccountNameClick}
                />
              ) : (
                "No Data"
              )}
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default Insight;
