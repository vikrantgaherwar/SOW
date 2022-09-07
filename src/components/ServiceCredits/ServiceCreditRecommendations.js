import React, { useRef, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { map } from "lodash";
import Pagination from "react-js-pagination";
import Search from "../SeismicBriefcase/Search";
const ServiceCreditRecommendations = ({ AccountId, activeCredits }) => {
  const signal = axios.CancelToken.source();
  const recommendationwrapperRef = useRef(null);
  const [serviceRecommendationData, setserviceRecommendationData] = useState(
    []
  );
  const [totaProductlItems, setTotalProductItems] = useState(0);
  const [forward, setForward] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 5;
  const [groupValue, setGroupValue] = useState(null);
  const [matches, setMatches] = useState(0);
  const [loader, setLoader] = useState(true);
  const getProductBriefData = async (cancelToken, activeCredits) => {
    const producturl =
      "https://delta.app.hpecorp.net:5006/service/recommendations?account_st_id=" +
      AccountId.replace("Account.Account_ST_ID__c%20=%20%27", "") +
      "&active_credits=" +
      activeCredits;
    return await axios.get(producturl, { cancelToken });
  };

  useEffect(() => {
    setLoader(true);
    Promise.all([getProductBriefData(signal.token, activeCredits)]).then(
      (results) => {
        const product = results[0];
        setCurrentPage(1);
        setserviceRecommendationData(
          product?.data?.grouped?.title?.groups[forward]?.doclist?.docs
        );
        setGroupValue(
          product?.data?.grouped?.title?.groups[forward]?.groupValue
        );
        setMatches(product?.data?.grouped?.title?.groups.length);
        if (serviceRecommendationData) {
          setLoader(false);
        }
      }
    );
  }, [AccountId, forward]);

  // Product Data Sorted and Paginated
  const productData = useMemo(() => {
    let computedRecommendationData = serviceRecommendationData;
    if (search) {
      computedRecommendationData = computedRecommendationData.filter(
        (sales) =>
          sales.service_activity.toLowerCase().includes(search.toLowerCase()) ||
          sales.service_description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalProductItems(computedRecommendationData?.length);

    //Current Page slice
    return computedRecommendationData?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [serviceRecommendationData, currentPage, search]);

  const setCurrentPageHandle = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      {!loader ? (
        <div ref={recommendationwrapperRef}>
          {/* Tags */}

          <div className="row mb-1">
            <div className="col-md-2 text-left">
              <Search
                onSearch={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
                placeholder={"Filter"}
              />
            </div>
            <div className="col-md-4 text-left">
              <i
                className="fas fa-info-circle helptextservice mt-2 ml-1"
                title="Filter using:Service Activity and Service Description "
              ></i>
            </div>
            <div className="col-md-6 text-right">
              <span className="project_detailstxt_hgl1">
                {
                  <a
                    href="https://hp.lightning.force.com/lightning/o/Lead/new?originalUrl=https%3A%2F%2Fhp--c.visualforce.com%2Fapex%2Fs1_GSDLead_Redirect%3FnavigationLocation%3DLIST_VIEW%26lexiSObjectName%3DLead%26lexiActionName%3Dnew%26sfdc.override%3D1%26vfRetURLInSFX%3D%252F00Q%252Fo&inContextOfRef=1.eyJ0eXBlIjoic3RhbmRhcmRfX29iamVjdFBhZ2UiLCJhdHRyaWJ1dGVzIjp7Im9iamVjdEFwaU5hbWUiOiJMZWFkIiwiYWN0aW9uTmFtZSI6Imxpc3QifSwic3RhdGUiOnsiZmlsdGVyTmFtZSI6IjAwQjFWMDAwMDA5NWhhWFVBUSJ9fQ%3D%3D&count=1"
                    target="_blank"
                    className="onleadLink"
                  >
                    <i className="fas fa-external-link-alt pr-1"></i>
                    Submit ONELead
                  </a>
                }
              </span>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6 text-left">
              <b>{groupValue}</b>
            </div>
            <div className="col-md-6 text-right">
              <span className="pr-1">
                {forward > 0 && (
                  <i
                    className="far fa-arrow-alt-circle-left tdata-list-arrow pointer"
                    onClick={() => setForward(forward - 1)}
                    title={"Click here to move to the previous service"}
                  ></i>
                )}
              </span>
              <span>
                {forward >= 0 && forward < matches - 1 && (
                  <i
                    className="far fa-arrow-alt-circle-right tdata-list-arrow pointer"
                    onClick={() => setForward(forward + 1)}
                    title={"Click here to move to the next service"}
                  ></i>
                )}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {productData ? (
                <div id="productClick">
                  <table className="table table-bordered" width="100%">
                    <>
                      <thead>
                        <tr>
                          <th className="p-1">Service Activity</th>
                          <th className="p-1">Service Description</th>
                          <th className="text-truncate p-1">
                            Standard Credits
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <>
                          {productData.length > 0 ? (
                            map(productData, (row, index2) => (
                              <>
                                <tr>
                                  <td className="p-1" width={300}>
                                    {row.service_activity}
                                  </td>
                                  <td className="p-1">
                                    {row.service_description}
                                  </td>
                                  <td className="p-1">
                                    {row.standard_credits}
                                  </td>
                                </tr>
                              </>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3">No Results Found</td>
                            </tr>
                          )}
                        </>
                      </tbody>
                    </>
                  </table>
                </div>
              ) : (
                <p>No Results Found</p>
              )}
            </div>
            {productData.length > 0 && (
              <div className="col-12" align="center">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={ITEMS_PER_PAGE}
                  totalItemsCount={totaProductlItems}
                  pageRangeDisplayed={5}
                  onChange={(page) => setCurrentPageHandle(page)}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ServiceCreditRecommendations;
