import React, { useRef, useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Nav, Tab, TabContainer, TabContent } from "react-bootstrap";
import { map, startCase } from "lodash";
import ReactPlayer from "react-player";
import URLConfig from "../URLConfig";
import Pagination from "./Pagination";
import Search from "./Search";
import {
  EXECUTIVE,
  EXPRESS_VIEW,
  PRODUCT,
  PROGRAM,
  SALES,
  SERVICE,
  SOLUTION,
  TAB_VALUES,
  TECHNICAL,
} from "./Constants";
import ExpressView from "./ExpressView";
import { UserContext } from "../../UserContext";
import TrackingService from "../TrackingService";
import nugflixlogo from "../../img/logo/nugflix-logo-vertical-no-bg.png";
import resultsImage from "../../img/rel-chat.png";
const SeismicBriefcase = ({ searchText, openFedback }) => {
  const [isEnable, setisEnable] = useState(true);
  const signal = axios.CancelToken.source();
  const trackingService = new TrackingService();
  const [userDetails, dispatch] = useContext(UserContext);
  const wrapperRef = useRef(null);
  const productRef = useRef(null);
  const technicalRef = useRef(null);
  const executiveRef = useRef(null);
  const solutionRef = useRef(null);
  const programRef = useRef(null);
  const salesRef = useRef(null);
  const serviceRef = useRef(null);
  const [activeKey, setActiveKey] = useState("");
  const [productSeismicData, setProductSeismicData] = useState([]);
  const [techincalSeismicData, setTechnicalSeismicData] = useState([]);
  const [executiveSeismicData, setExecutiveSeismicData] = useState([]);
  const [programSeismicData, setProgramSeismicData] = useState([]);
  const [solutionSeismicData, setSolutionSeismicData] = useState([]);
  const [salesSeismicData, setSalesSeismicData] = useState([]);
  const [serviceSeismicData, setServiceSeismicData] = useState([]);
  const [nugflixStartData, setNugflixStartData] = useState([]);
  const [roles, setRoles] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totaProductlItems, setTotalProductItems] = useState(0);
  const [totalExecutiveItems, setTotalExecutiveItems] = useState(0);
  const [totalTechnicalItems, setTotalTechnicalItems] = useState(0);
  const [totalSolutionItems, setTotalSolutionItems] = useState(0);
  const [totalProgramItems, setTotalProgramItems] = useState(0);
  const [totalServiceItems, setTotalServiceItems] = useState(0);
  const [totalNugFlixItems, setTotalNugFlixItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 10;
  const [expressViewData, setExpressViewData] = useState([]);

  const [expressViewKeyword, setExpressKeyword] = useState([]);
  // useEffect(() => {
  //   //   Close Tab if clicked outside
  //   const handleClickOutside = (event) => {
  //     if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
  //       setActiveKey("");
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  const isOpenSurveyWindow = () => {
    //  var showpopup = !isEnable
    //  setisEnable(showpopup)
    openFedback();
  };
  const handleOnSelect = (key) => {
    if (activeKey === key) {
      setActiveKey("");
    } else {
      setActiveKey(key);
    }
    setCurrentPage(1);
    setSearch("");
    if (activeKey === EXPRESS_VIEW) {
      trackingService.LogExpressPackageDocView(
        Cookies.get("empnumber"),
        expressViewData[0].doclist.docs[0].package,
        searchText,
        "Express_Package_Page_Visit"
      );
    }
  };
  const handlevideoplay = (cvideoid) => {
    if (document.getElementById("video" + cvideoid).style.display == "block") {
      document.getElementById("video" + cvideoid).style.display = "none";
    } else {
      document.getElementById("video" + cvideoid).style.display = "block";
    }
    document.getElementById("video" + cvideoid).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };
  const fetchExpressViewData = async (cancelToken, searchText) => {
    // setLoader(false);
    const URL = URLConfig.getURLExpressView(
      `"` + searchText.replaceAll("&", "%26") + `"`
    );
    debugger;
    return await axios.get(URL, { cancelToken });
  };

  const fetchExpressViewKeywordData = async (cancelToken, searchText) => {
    // setLoader(false);

    const URL =
      URLConfig.getURL_keywordSearch() + searchText.replaceAll("&", "%26");
    debugger;
    return await axios.get(URL, { cancelToken });
  };

  // Checking whether the userRole Is Executive/Management in order to display the Executive Seismic briefcase tag
  useEffect(() => {
    checkUserRole(userDetails);
  }, []);

  const checkUserRole = (userDetails) => {
    if (
      userDetails?.UserRoles?.indexOf("Executive") > -1 ||
      userDetails?.UserRoles?.indexOf("Management") > -1
    ) {
      setRoles(true);
    } else {
      setRoles(false);
    }
  };

  const getProductBriefData = async (cancelToken, searchText) => {
    const producturl = URLConfig.getSeismicBriefCaseProducts(searchText);

    return await axios.get(producturl, { cancelToken });
  };

  const getTechnicalBriefData = async (cancelToken, searchText) => {
    const techurl = URLConfig.getSeismicBriefCaseTechnical(searchText);
    return await axios.get(techurl, { cancelToken });
  };

  const getExecutiveBriefData = async (cancelToken, searchText) => {
    const execurl = URLConfig.getSeismicBriefCaseExecutive(searchText);
    return await axios.get(execurl, { cancelToken });
  };

  const getProgramBriefData = async (cancelToken, searchText) => {
    const progurl = URLConfig.getSeismicBriefCaseProgram(searchText);
    return await axios.get(progurl, { cancelToken });
  };

  const getSolutionBriefData = async (cancelToken, searchText) => {
    const soluturl = URLConfig.getSeismicBriefCaseSolution(searchText);
    return await axios.get(soluturl, { cancelToken });
  };

  const getServiceBriefData = async (cancelToken, searchText) => {
    const serurl = URLConfig.getSeismicBriefCaseService(searchText);
    return await axios.get(serurl, { cancelToken });
  };

  const getSalesBriefData = async (cancelToken, searchText) => {
    const salesurl = URLConfig.getSeismicBriefCaseSales(searchText);
    return await axios.get(salesurl, { cancelToken });
  };
  const getNugflixData = async (cancelToken, searchText) => {
    const nugflixurl = URLConfig.getNugFlixVideoData(searchText);
    return await axios.get(nugflixurl, { cancelToken });
  };
  useEffect(() => {
    debugger;
    Promise.all([
      getProductBriefData(signal.token, searchText),
      getTechnicalBriefData(signal.token, searchText),
      getExecutiveBriefData(signal.token, searchText),
      getProgramBriefData(signal.token, searchText),
      getSolutionBriefData(signal.token, searchText),
      getServiceBriefData(signal.token, searchText),
      getSalesBriefData(signal.token, searchText),
      fetchExpressViewData(signal.token, searchText),
      getNugflixData(signal.token, searchText),
      fetchExpressViewKeywordData(signal.token, searchText),
    ]).then((results) => {
      const product = results[0];
      const technical = results[1];
      const executive = results[2];
      const program = results[3];
      const solution = results[4];
      const service = results[5];
      const sales = results[6];
      const express = results[7];
      const nugflix = results[8];
      const expressKeyworddata = results[9];
      debugger;
      setProductSeismicData(product.data.response.docs);
      setTechnicalSeismicData(technical.data.response.docs);
      setExecutiveSeismicData(executive.data.response.docs);
      setProgramSeismicData(program.data.response.docs);
      setSolutionSeismicData(solution.data.response.docs);
      setServiceSeismicData(service.data.response.docs);
      setSalesSeismicData(sales.data.response.docs);
      debugger;
      if (
        express.data.grouped &&
        express.data.grouped.role.matches &&
        express.data.grouped.role &&
        express.data.grouped.role.matches > 0
      ) {
        debugger;
        setExpressKeyword(expressKeyworddata.data);
        setExpressViewData(express.data.grouped.role.groups);

        trackingService.LogMainSearch(
          Cookies.get("empnumber"),
          searchText,
          true
        );
      } else {
        setExpressViewData([]);
        setExpressKeyword([]);
        trackingService.LogMainSearch(
          Cookies.get("empnumber"),
          searchText,
          false
        );
      }
      setNugflixStartData(nugflix.data.response.docs);
    });
  }, [searchText]);

  const checkVisibility = (tag) => {
    switch (tag) {
      case EXPRESS_VIEW:
        return expressViewData.length > 0 && expressViewKeyword.id > 0;
      case PRODUCT:
        return productSeismicData.length > 0;
      case EXECUTIVE:
        return executiveSeismicData.length > 0 && roles;
      case SOLUTION:
        return solutionSeismicData.length > 0;
      case PROGRAM:
        return programSeismicData.length > 0;
      case SERVICE:
        return serviceSeismicData.length > 0;
      case SALES:
        return salesSeismicData.length > 0;
      case TECHNICAL:
        return techincalSeismicData.length > 0;
      case "nugflix":
        return "test string";
      default:
        return false;
    }
  };

  // Product Data Sorted and Paginated
  const productData = useMemo(() => {
    let computedProductData = productSeismicData;
    if (search) {
      computedProductData = computedProductData.filter(
        (sales) =>
          sales.title.toLowerCase().includes(search.toLowerCase()) ||
          sales.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalProductItems(computedProductData.length);

    //Current Page slice
    return computedProductData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [productSeismicData, currentPage, search]);
  // Technical Data Sorted and Paginated
  const techincalData = useMemo(() => {
    let computedTechincalData = techincalSeismicData;
    if (search) {
      computedTechincalData = computedTechincalData.filter(
        (technical) =>
          technical.title.toLowerCase().includes(search.toLowerCase()) ||
          technical.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalTechnicalItems(computedTechincalData.length);

    //Current Page slice
    return computedTechincalData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [techincalSeismicData, currentPage, search]);
  // Executive Data Sorted and Paginated
  const executiveData = useMemo(() => {
    let computedExecutiveData = executiveSeismicData;
    if (search) {
      computedExecutiveData = computedExecutiveData.filter(
        (executive) =>
          executive.title.toLowerCase().includes(search.toLowerCase()) ||
          executive.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalExecutiveItems(computedExecutiveData.length);

    //Current Page slice
    return computedExecutiveData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [executiveSeismicData, currentPage, search]);
  // Solution Data Sorted and Paginated
  const solutionData = useMemo(() => {
    let computedSolutionData = solutionSeismicData;
    if (search) {
      computedSolutionData = computedSolutionData.filter(
        (solution) =>
          solution.title.toLowerCase().includes(search.toLowerCase()) ||
          solution.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalSolutionItems(computedSolutionData.length);

    //Current Page slice
    return computedSolutionData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [solutionSeismicData, currentPage, search]);
  // Program Data Sorted and Paginated
  const programData = useMemo(() => {
    let computedProgramData = programSeismicData;
    if (search) {
      computedProgramData = computedProgramData.filter(
        (program) =>
          program.title.toLowerCase().includes(search.toLowerCase()) ||
          program.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalProgramItems(computedProgramData.length);

    //Current Page slice
    return computedProgramData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [programSeismicData, currentPage, search]);
  // Sales Data Sorted and Paginated
  const salesData = useMemo(() => {
    let computedSalesData = salesSeismicData;
    if (search) {
      computedSalesData = computedSalesData.filter(
        (sales) =>
          sales.title.toLowerCase().includes(search.toLowerCase()) ||
          sales.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedSalesData.length);

    //Current Page slice
    return computedSalesData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [salesSeismicData, currentPage, search]);
  // Service Data Sorted and Paginated
  const serviceData = useMemo(() => {
    let computedServiceData = serviceSeismicData;
    if (search) {
      computedServiceData = computedServiceData.filter(
        (service) =>
          service.title.toLowerCase().includes(search.toLowerCase()) ||
          service.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalServiceItems(computedServiceData.length);

    //Current Page slice
    return computedServiceData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [serviceSeismicData, currentPage, search]);
  // NugFlix Data Sorted and Paginated
  const nugflixData = useMemo(() => {
    let computednugflixData = nugflixStartData;
    if (search) {
      computednugflixData = computednugflixData.filter(
        (nugflix) =>
          nugflix.file.toLowerCase().includes(search.toLowerCase()) ||
          nugflix.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalNugFlixItems(computednugflixData.length);

    //Current Page slice
    return computednugflixData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [nugflixStartData, currentPage, search]);
  const setCurrentPageHandle = (page, tag) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    switch (tag) {
      case "product":
        productRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "technical":
        technicalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "executive":
        executiveRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "program":
        programRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "solution":
        solutionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "sales":
        salesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "service":
        serviceRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
    }
  };
  const productUrl = (title, url) => {
    trackingService.LogSesimicLinkClick(
      Cookies.get("empnumber"),
      "LogSesimicproductLinkClick",
      title,
      url,
      true
    );
  };

  const programUrl = (title, url) => {
    trackingService.LogSesimicLinkClick(
      Cookies.get("empnumber"),
      "LogSesimicprogramLinkClick",
      title,
      url,
      true
    );
  };

  const salesUrl = (title, url) => {
    trackingService.LogSesimicLinkClick(
      Cookies.get("empnumber"),
      "LogSesimicSalesLinkClick",
      title,
      url,
      true
    );
  };

  const serviceUrl = (title, url) => {
    trackingService.LogSesimicLinkClick(
      Cookies.get("empnumber"),
      "LogSesimicServiceLinkClick",
      title,
      url,
      true
    );
  };

  const solutionUrl = (title, url) => {
    trackingService.LogSesimicLinkClick(
      Cookies.get("empnumber"),
      "LogSesimicSolutionLinkClick",
      title,
      url,
      true
    );
  };
  const technicalUrl = (title, url) => {
    trackingService.LogSesimicLinkClick(
      Cookies.get("empnumber"),
      "LogSesimicTechnicalLinkClick",
      title,
      url,
      true
    );
  };
  const executiveUrl = (title, url) => {
    trackingService.LogSesimicLinkClick(
      Cookies.get("empnumber"),
      "LogSesimicExecutiveLinkClick",
      title,
      url,
      true
    );
  };
  return (
    <>
      <div ref={wrapperRef}>
        {/* Tags */}
        <TabContainer activeKey={activeKey}>
          <div id="stickers" className="stickers_pos">
            {map(
              TAB_VALUES,
              (value, key) =>
                //Checking whether the API response is null or not for respective Nav item to be shown and renders tag conditionally
                checkVisibility(value) && (
                  <Nav.Link
                    key={key}
                    as="div"
                    bsPrefix={`stickers_text mt-1 mb-1 pt-2 pb-2 stickers_${value}`}
                    eventKey={value}
                    onSelect={(eventKey) => handleOnSelect(eventKey)}
                  >
                    {startCase(key)}
                  </Nav.Link>
                )
            )}
            {nugflixData.length > 0 && (
              <Nav.Link
                as="div"
                bsPrefix={`mt-1 mb-1 pt-2 pb-2 stickers_nugflix`}
                eventKey="nugflix"
                onSelect={(eventKey) => handleOnSelect(eventKey)}
              >
                <img
                  src={nugflixlogo}
                  height="50"
                  width="12"
                  style={{ marginLeft: "2px" }}
                  alt="Nugflix Logo"
                />
              </Nav.Link>
            )}
          </div>

          {activeKey && (
            <TabContent>
              {/* Express View Tag Window*/}
              {activeKey === EXPRESS_VIEW && checkVisibility(activeKey) && (
                <Tab.Pane eventKey={EXPRESS_VIEW}>
                  <ExpressView
                    searchText={searchText}
                    expressViewData={expressViewData}
                    handleOnSelect={() => handleOnSelect(activeKey)}
                  />
                </Tab.Pane>
              )}

              {/* Product Tag Window*/}
              <Tab.Pane eventKey={PRODUCT}>
                <div className="stickers_click" id="stickersClick">
                  <div id="productClick" ref={productRef}>
                    <div className="col-12 mt-3">
                      <h5 className="briefcase_header">
                        Product Briefcase
                        <span
                          className="close"
                          translate="no"
                          onClick={() => handleOnSelect(activeKey)}
                        >
                          &times;
                        </span>
                      </h5>
                    </div>
                    <div className="col-12">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                      <div className="col-12 briefcase_note pt-1 pl-1">
                        <strong>Please note: </strong>
                        <br />
                        The link will redirect to Seismic. You need to have
                        access to Seismic to access these links below.
                      </div>
                      {productData.map((value, index) => (
                        <div className="col-12 row p-0 mt-2">
                          <div className="col-1">
                            <a className="fa fa-external-link-square-alt xl-file" />
                          </div>
                          <div className="col-11">
                            <a
                              className="breakall_word fileurl"
                              href={value.url}
                              target="_blank"
                              onClick={() => {
                                productUrl(value.title, value.url);
                              }}
                            >
                              {value.title}
                            </a>
                            <p align="justify">
                              Description:{value.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="col-12" align="center">
                      <Pagination
                        total={totaProductlItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) =>
                          setCurrentPageHandle(page, "product")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              {/* TECHNICAL Tag Window*/}
              <Tab.Pane eventKey={TECHNICAL}>
                <div className="stickers_click" id="stickersClick">
                  <div id="techClick" ref={technicalRef}>
                    <div className="col-12 mt-3">
                      <h5 className="briefcase_header">
                        Technical Briefcase
                        <span
                          className="close"
                          translate="no"
                          onClick={() => handleOnSelect(activeKey)}
                        >
                          &times;
                        </span>
                      </h5>
                    </div>

                    <div className="col-12">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                      <div className="col-12 briefcase_note pt-1 pl-1">
                        <strong>Please note: </strong>
                        <br />
                        The link will redirect to Seismic. You need to have
                        access to Seismic to access these links below.
                      </div>
                      {techincalData.map((value, index) => (
                        <div className="col-12 row p-0 mt-2">
                          <div className="col-1">
                            <a className="fa fa-external-link-square-alt xl-file"></a>
                          </div>
                          <div className="col-11">
                            <a
                              className="breakall_word fileurl"
                              href={value.url}
                              target="_blank"
                              onClick={() => {
                                technicalUrl(value.title, value.url);
                              }}
                            >
                              {value.title}
                            </a>
                            <p align="justify">
                              Description:{value.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-12" align="center">
                      <Pagination
                        total={totalTechnicalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) =>
                          setCurrentPageHandle(page, "technical")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey={EXECUTIVE}>
                <div className="stickers_click" id="stickersClick">
                  <div id="executiveClick" ref={executiveRef}>
                    <div className="col-12 mt-3">
                      <h5 className="briefcase_header">
                        Executive Briefcase
                        <span
                          className="close"
                          translate="no"
                          onClick={() => handleOnSelect(activeKey)}
                        >
                          &times;
                        </span>
                      </h5>
                    </div>

                    <div className="col-12">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                      <div className="col-12 briefcase_note pt-1 pl-1">
                        <strong>Please note: </strong>
                        <br />
                        The link will redirect to Seismic. You need to have
                        access to Seismic to access these links below.
                      </div>
                      {executiveData.map((value, index) => (
                        <div className="col-12 row p-0 mt-2">
                          <div className="col-1">
                            <a className="fa fa-external-link-square-alt xl-file"></a>
                          </div>
                          <div className="col-11">
                            <a
                              className="breakall_word fileurl"
                              href={value.url}
                              target="_blank"
                              onClick={() => {
                                executiveUrl(value.title, value.url);
                              }}
                            >
                              {value.title}
                            </a>
                            <p align="justify">
                              Description:{value.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-12" align="center">
                      <Pagination
                        total={totalExecutiveItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) =>
                          setCurrentPageHandle(page, "executive")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey={PROGRAM}>
                <div className="stickers_click" id="stickersClick">
                  <div id="programClick" ref={programRef}>
                    <div className="col-12 mt-3">
                      <h5 className="briefcase_header">
                        Program Briefcase
                        <span
                          className="close"
                          translate="no"
                          onClick={() => handleOnSelect(activeKey)}
                        >
                          &times;
                        </span>
                      </h5>
                    </div>

                    <div className="col-12">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                      <div className="col-12 briefcase_note pt-1 pl-1">
                        <strong>Please note: </strong>
                        <br />
                        The link will redirect to Seismic. You need to have
                        access to Seismic to access these links below.
                      </div>
                      {programData.map((value, index) => (
                        <div className="col-12 row p-0 mt-2">
                          <div className="col-1">
                            <a className="fa fa-external-link-square-alt xl-file"></a>
                          </div>
                          <div className="col-11">
                            <a
                              className="breakall_word fileurl"
                              href={value.url}
                              target="_blank"
                              onClick={() => {
                                programUrl(value.title, value.url);
                              }}
                            >
                              {value.title}
                            </a>
                            <p align="justify">
                              Description:{value.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-12" align="center">
                      <Pagination
                        total={totalProgramItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) =>
                          setCurrentPageHandle(page, "program")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey={SOLUTION}>
                <div className="stickers_click" id="stickersClick">
                  <div id="solutionClick" ref={solutionRef}>
                    <div className="col-12 mt-3">
                      <h5 className="briefcase_header">
                        Solution Briefcase
                        <span
                          translate="no"
                          className="close"
                          onClick={() => handleOnSelect(activeKey)}
                        >
                          &times;
                        </span>
                      </h5>
                    </div>

                    <div className="col-12">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                      <div className="col-12 briefcase_note pt-1 pl-1">
                        <strong>Please note: </strong>
                        <br />
                        The link will redirect to Seismic. You need to have
                        access to Seismic to access these links below.
                      </div>
                      {solutionData.map((value, index) => (
                        <div className="col-12 row p-0 mt-2">
                          <div className="col-1">
                            <a className="fa fa-external-link-square-alt xl-file"></a>
                          </div>
                          <div className="col-11">
                            <a
                              className="breakall_word fileurl"
                              href={value.url}
                              target="_blank"
                              onClick={() => {
                                solutionUrl(value.title, value.url);
                              }}
                            >
                              {value.title}
                            </a>
                            <p align="justify">
                              Description:{value.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-12" align="center">
                      <Pagination
                        total={totalSolutionItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) =>
                          setCurrentPageHandle(page, "solution")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey={SALES}>
                <div className="stickers_click" id="stickersClick">
                  <div id="salesClick" ref={salesRef}>
                    <div className="col-12 mt-3">
                      <h5 className="briefcase_header">
                        Sales Briefcase
                        <span
                          className="close"
                          translate="no"
                          onClick={() => handleOnSelect(activeKey)}
                        >
                          &times;
                        </span>
                      </h5>
                    </div>

                    <div className="col-12">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                      <div className="col-12 briefcase_note pt-1 pl-1">
                        <strong>Please note: </strong>
                        <br />
                        The link will redirect to Seismic. You need to have
                        access to Seismic to access these links below.
                      </div>

                      {salesData.map((value, index) => (
                        <div className="col-12 row p-0 mt-2">
                          <div className="col-1">
                            <a className="fa fa-external-link-square-alt xl-file"></a>
                          </div>
                          <div className="col-11">
                            <a
                              className="breakall_word fileurl"
                              href={value.url}
                              target="_blank"
                              onClick={() => {
                                salesUrl(value.title, value.url);
                              }}
                            >
                              {value.title}
                            </a>
                            <p align="justify">
                              Description:{value.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="col-12" align="center">
                      <Pagination
                        total={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) =>
                          setCurrentPageHandle(page, "sales")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey={SERVICE}>
                <div className="stickers_click" id="stickersClick">
                  <div id="serviceClick" ref={serviceRef}>
                    <div className="col-12 mt-3">
                      <h5 className="briefcase_header">
                        Service Briefcase
                        <span
                          className="close"
                          translate="no"
                          onClick={() => handleOnSelect(activeKey)}
                        >
                          &times;
                        </span>
                      </h5>
                    </div>

                    <div className="col-12">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                      <div className="col-12 briefcase_note pt-1 pl-1">
                        <strong>Please note: </strong>
                        <br />
                        The link will redirect to Seismic. You need to have
                        access to Seismic to access these links below.
                      </div>
                      {serviceData.map((value, index) => (
                        <div className="col-12 row p-0 mt-2">
                          <div className="col-1">
                            <a className="fa fa-external-link-square-alt xl-file"></a>
                          </div>
                          <div className="col-11">
                            <a
                              className="breakall_word fileurl"
                              href={value.url}
                              target="_blank"
                              onClick={() => {
                                serviceUrl(value.title, value.url);
                              }}
                            >
                              {value.title}
                            </a>
                            <p align="justify">
                              Description:{value.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-12" align="center">
                      <Pagination
                        total={totalServiceItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) =>
                          setCurrentPageHandle(page, "service")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              {/* NugFlix */}
              <Tab.Pane eventKey="nugflix">
                <div className="stickers_click" id="stickersClick">
                  <div id="serviceClick" ref={serviceRef}>
                    <div className="col-12 mt-3">
                      <h5 className="briefcase_header">
                        Nugflix
                        <span
                          className="close"
                          translate="no"
                          onClick={() => handleOnSelect(activeKey)}
                        >
                          &times;
                        </span>
                      </h5>
                    </div>

                    <div className="col-12">
                      {/* {nugflixData.length > 0 && (
                        <Search
                          onSearch={(value) => {
                            setSearch(value);
                            setCurrentPage(1);
                          }}
                        />
                      )} */}
                      <div className="col-12 briefcase_note pt-1 pl-1">
                        <strong>Please note: </strong>
                        <br />
                        The links given below are based on search string used.
                        The Video's are inetgrated with the NugFlix application.
                      </div>
                      <div className="col-12 mt-2">
                        {nugflixData.length > 0 && (
                          <Search
                            onSearch={(value) => {
                              setSearch(value);
                              setCurrentPage(1);
                            }}
                          />
                        )}
                      </div>
                      {/* if data is present starts */}
                      {nugflixData.map((value, index) => (
                        <div className="col-12 row p-0 mt-2">
                          <div className="col-1">
                            <a className="fa fa-file-video xl-file"></a>
                          </div>
                          <div className="col-11">
                            <a
                              className="breakall_word fileurl pointer"
                              // href={`#video` + value.id}
                              onClick={() => handlevideoplay(value.id)}
                            >
                              {value.file}
                            </a>
                            <p align="justify" className="pointer">
                              {value.description}
                            </p>
                          </div>

                          <div
                            className="col-12"
                            align="center"
                            id={`video` + value.id}
                            style={{ display: "none" }}
                          >
                            <ReactPlayer
                              url={value.url}
                              controls={true}
                              width="380px"
                              height="240px"
                            />
                          </div>
                        </div>
                      ))}

                      {/* if data is present ends */}
                    </div>
                    {nugflixData.length > 0 && (
                      <div className="col-12" align="center">
                        <Pagination
                          total={totalNugFlixItems}
                          itemsPerPage={ITEMS_PER_PAGE}
                          currentPage={currentPage}
                          onPageChange={(page) =>
                            setCurrentPageHandle(page, "nugflix")
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Tab.Pane>
            </TabContent>
          )}
        </TabContainer>
      </div>

      <div className="relevancy-floating-btn shadow">
        <div
          class="rel-btn"
          title="Click here to rate the search relevancy"
          onClick={() => {
            isOpenSurveyWindow();
          }}
        >
          <img className="text-center" src={resultsImage} width="10"></img>
        </div>
      </div>
    </>
  );
};

export default SeismicBriefcase;
