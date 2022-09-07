import React, { useState, Fragment, useEffect, useMemo } from "react";
import map from "lodash/map";
import axios from "axios";
import _ from "lodash";
import Pagination from "./SeismicBriefcase/Pagination";
import Search from "./SeismicBriefcase/Search";
const InsightsMoreDocs = ({
  stageData,
  searchTerm,
  filters,
  handleAccountNameClick,
}) => {
  const [salesStageData, setSalesStageData] = useState([]);
  const [totalSalesStageItems, setTotalSalesStageItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 10;
  useEffect(() => {
    getOpportunitySalesStageBasedData();
  }, [stageData, filters, searchTerm]);
  // const handleAccountNameClick = (e, searchValue) => {
  //   setActiveFilterAndValue("Account Name", searchValue);
  // };
  const getOpportunitySalesStageBasedData = () => {
    let url =
      "https://hpedelta.com:8983/solr/insights/select?fq=Account_ST_ID:[%27%27%20TO%20*]%20AND%20Opportunity_Sales_Stage:%22" +
      encodeURIComponent(stageData) +
      "%22&indent=on&q=" +
      searchTerm +
      filters.replace("&fq=-isarchived:True", "") +
      "&wt=json&rows=1000";
    axios.get(url).then(({ data }) => {
      if (data.response && data.response.docs) {
        setSalesStageData(data.response.docs);
      } else {
        setSalesStageData(null);
      }
    });
  };
  // Data Sorted and Paginated
  const stageDataset = useMemo(() => {
    let computedStageData = salesStageData;
    if (search) {
      computedStageData = computedStageData.filter(
        (salesStage) =>
          salesStage.Account_ST_Name.toLowerCase().includes(
            search.toLowerCase()
          ) ||
          salesStage.owner_email.toLowerCase().includes(search.toLowerCase()) ||
          salesStage.geography.toLowerCase().includes(search.toLowerCase()) ||
          salesStage.country.toLowerCase().includes(search.toLowerCase()) ||
          salesStage.country.toLowerCase().includes(search.toLowerCase()) ||
          salesStage.opportunity_id.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalSalesStageItems(computedStageData.length);

    //Current Page slice
    return computedStageData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [salesStageData, currentPage, search]);
  const setCurrentPageHandle = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <Search
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
      />
      {stageDataset.length > 0 && (
        <div className="col-12" align="center">
          <Pagination
            total={totalSalesStageItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPageHandle(page)}
          />
        </div>
      )}
      {map(stageDataset, (doc) => {
        return (
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
                          handleAccountNameClick(e, doc.Account_ST_Name)
                        }
                      >
                        {doc.Account_ST_Name ? doc.Account_ST_Name : ""}
                      </a>
                    </div>
                  </div>

                  <div className="col-12 mb-1">
                    <div>
                      <strong>Sales Rep</strong>
                    </div>
                    <div className="lnht12x">
                      {doc.owner_email ? doc.owner_email : ""}
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
                        href={doc.url ? doc.url : ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to Open Opportunity ID (Salesforce)"
                      >
                        {doc.opportunity_id ? doc.opportunity_id : ""}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {stageDataset.length > 0 ? (
        <div className="col-12" align="center">
          <Pagination
            total={totalSalesStageItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPageHandle(page)}
          />
        </div>
      ) : (
        <div align="center" className="p-5">
          No Matching Data
        </div>
      )}
    </>
  );
};
export default InsightsMoreDocs;
