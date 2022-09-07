import React, { useEffect, useState, createRef } from "react";
import XLSX from "xlsx";
import axios from "axios";
import moment from "moment";
import Pagination from "react-js-pagination";
import { PieChart, Pie, Legend, Sector, Cell } from "recharts";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import {
  map,
  each,
  some,
  slice,
  filter,
  reduce,
  isEmpty,
  includes,
  uniq,
} from "lodash";
import Cookies from "js-cookie";
import URLConfig from "./URLConfig";
import PrescriptiveSalesIcon from "../img/prescriptive-sales-icon.png";
import HeaderLogo from "../img/element-popup-headers.png";
import TrackingService from "./TrackingService";
const SUPPORT_ACTIVE = "Support-Active";
const SUPPORT_TO_BE_EXPIRED = "Support-To Be Expired";
const SUPPORT_EXPIRED = "Support-Expired";

const EOSL = "EoSL";
const NOT_EOSL = "ASL";

const PrescriptiveSales = ({ AccountId }) => {
  const signal = axios.CancelToken.source();
  const [showPrescriptiveSales, setShowPrescriptiveSales] = useState(false);
  const [prescriptiveSalesData, setPrescriptiveSalesData] = useState([]);
  const [dataPoints1, setDataPoints1] = useState([]);
  const [dataPoints2, setDataPoints2] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableName, setTableName] = useState("");
  const [colors1, setColors1] = useState([]);
  const [colors2, setColors2] = useState([]);
  const [doughnutMouseEnterActiveIndex, setDoughnutMouseEnterActiveIndex] =
    useState(999);
  const [doughnutMouseClickActiveIndex, setDoughnutMouseClickActiveIndex] =
    useState(999);
  const [pieMouseEnterActiveIndex, setPieMouseEnterActiveIndex] = useState(999);
  const [pieMouseClickActiveIndex, setPieMouseClickActiveIndex] = useState(999);
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [doughnutMidAngle, setDoughnutMidAngle] = useState(999);
  const itemsCountPerPage = 10;
  const componentRef = createRef();
  const trackingService = new TrackingService();
  const renderDoughnutShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      name,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      points,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 10;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    setDoughnutMidAngle(midAngle);
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          onClick={() => {
            setTableName(props.eoslStatus);
            handleDoughnutClick(points);
          }}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${name}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`Count: ${value} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const renderPieShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      points,
      percent,
      name,
      value,
      // midAngle,
    } = props;
    let { midAngle } = props;
    if (doughnutMidAngle >= 0 && doughnutMidAngle <= 360) {
      if (midAngle >= doughnutMidAngle && midAngle <= doughnutMidAngle + 20) {
        midAngle += 20;
      } else if (
        midAngle <= doughnutMidAngle &&
        midAngle >= doughnutMidAngle - 20
      ) {
        midAngle -= 20;
      }
    }
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 75;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          onClick={() => {
            // setTableName(props.eoslStatus);
            handlePieClick(points);
          }}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle < midAngle ? startAngle : midAngle}
          endAngle={endAngle > midAngle ? endAngle : midAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${name}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`Count: ${value} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  useEffect(() => {
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  useEffect(() => {
    setPrescriptiveSalesData([]);
    if (AccountId) {
      fetchPrescriptiveSalesDetails(AccountId, signal.token);
    }
  }, [AccountId]);

  const fetchPrescriptiveSalesDetails = async (AccId, cancelToken) => {
    const AccountSalesTerritoryID = AccId.replace(
      "Account.Account_ST_ID__c%20=%20%27",
      ""
    );
    const URL =
      URLConfig.getURLDeltaAPI() +
      "PrescriptiveSales/" +
      AccountSalesTerritoryID;
    try {
      const res = await axios.get(URL, { cancelToken });
      if (res.data) {
        fetchInfosightEligibleSKUs(res.data, signal.token);
        // setPrescriptiveSalesData([...res.data]);
      } else {
        setPrescriptiveSalesData([]);
      }
    } catch (error) {
      console.log("API Error", error);
    }
  };

  const fetchInfosightEligibleSKUs = async (data, cancelToken) => {
    let salesData = data;
    const productIds = uniq(map(salesData, (item) => item.productId));
    const URL =
      URLConfig.getURLDeltaAPI() + "DeltaSalesLead/CompareInfoSightEligibleSKU";
    try {
      const res = await axios.post(URL, productIds, { cancelToken });
      if (res.data) {
        salesData = map(salesData, (item) => ({
          ...item,

          infosightEligible: includes(res.data, item.productId) ? "Yes" : "No",
          infosightRegistered: includes(res.data, item.productId)
            ? "Yes"
            : "No",
        }));
      }
    } catch (error) {
      console.log("API Error", error);
    } finally {
      setPrescriptiveSalesData([...salesData]);
    }
  };

  useEffect(() => {
    const dataPoints1 = reduce(
      prescriptiveSalesData,
      (acc, item) => {
        let eoslStatus;
        if (
          item.productEndOfServiceLifeDate &&
          moment().isAfter(item.productEndOfServiceLifeDate)
        ) {
          eoslStatus = EOSL;
        } else {
          eoslStatus = NOT_EOSL;
        }

        if (some(acc, (val) => val.eoslStatus === eoslStatus)) {
          return map(acc, (el) =>
            el.eoslStatus === eoslStatus
              ? { ...el, count: ++el.count, points: [...el.points, item] }
              : { ...el }
          );
        } else {
          return [...acc, { eoslStatus: eoslStatus, count: 1, points: [item] }];
        }
      },
      []
    );
    var colors1 = [];
    each(dataPoints1, (item) => {
      if (item.eoslStatus === EOSL) {
        colors1.push("#FF8300");
      } else if (item.eoslStatus === NOT_EOSL) {
        colors1.push("#00dfa9");
      }
    });

    setColors1(colors1);
    setDataPoints1(dataPoints1);

    const dataPoints2 = reduce(
      filter(
        prescriptiveSalesData,
        (item) => item.supportStatus !== SUPPORT_ACTIVE
      ), // Only Expired and ToBeExpired
      (acc, item) => {
        if (some(acc, (val) => val.supportStatus === item.supportStatus)) {
          return map(acc, (el) =>
            el.supportStatus === item.supportStatus
              ? { ...el, count: ++el.count, points: [...el.points, item] }
              : { ...el }
          );
        } else {
          return [
            ...acc,
            { supportStatus: item.supportStatus, count: 1, points: [item] },
          ];
        }
      },
      []
    );

    var colors2 = [];
    each(dataPoints2, (item) => {
      if (item.supportStatus === SUPPORT_ACTIVE) {
        colors2.push("#12b790");
      } else if (item.supportStatus === SUPPORT_TO_BE_EXPIRED) {
        colors2.push("#FEC901");
      } else {
        colors2.push("#b0b0b0");
      }
    });

    setColors2(colors2);
    setDataPoints2(dataPoints2);

    setTableName("");

    setTableData([]);
    setActivePage(1);

    setDoughnutMouseEnterActiveIndex(999);
    setDoughnutMouseClickActiveIndex(999);
    setPieMouseEnterActiveIndex(999);
    setPieMouseClickActiveIndex(999);
  }, [prescriptiveSalesData]);

  const handleDoughnutClick = (points) => {
    setTableData(points);
    setTotalItemsCount(points.length);

    // setTableName(points[0].supportStatus);
    setActivePage(1);
  };

  const handlePieClick = (points) => {
    setTableData(points);
    setTotalItemsCount(points.length);

    setTableName(points[0].supportStatus);
    setActivePage(1);
  };

  useEffect(() => {
    if (tableData.length > 0 && tableName !== "") {
      componentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [tableData]);

  const handleClose = () => {
    setTableData([]);
    setActivePage(1);

    setDoughnutMouseEnterActiveIndex(999);
    setDoughnutMouseClickActiveIndex(999);
    setPieMouseEnterActiveIndex(999);
    setPieMouseClickActiveIndex(999);

    setShowPrescriptiveSales(false);
  };

  const onDoughnutEnter = (event, index) => {
    setDoughnutMouseEnterActiveIndex(index);
    setPieMouseEnterActiveIndex(999);
  };

  const onDoughnutLeave = (event) => {
    setDoughnutMouseEnterActiveIndex(999);
    setDoughnutMidAngle(999);
  };

  const onPieEnter = (event, index) => {
    setPieMouseEnterActiveIndex(index);
    setDoughnutMouseEnterActiveIndex(999);
  };

  const onPieLeave = (event) => {
    setPieMouseEnterActiveIndex(999);
    setDoughnutMidAngle(999);
  };

  const onDoughnutClick = (event, index) => {
    setDoughnutMouseClickActiveIndex(index);
    setPieMouseClickActiveIndex(999);
    setPieMouseEnterActiveIndex(999);
  };

  const onPieClick = (event, index) => {
    setPieMouseClickActiveIndex(index);
    setDoughnutMouseClickActiveIndex(999);
    setDoughnutMouseEnterActiveIndex(999);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const getActiveIndex = (mouseEnterIndex, mouseClickIndex) => {
    if (mouseEnterIndex === 999 && mouseClickIndex === 999) {
      return 999;
    }
    if (
      mouseClickIndex !== 999 &&
      mouseEnterIndex !== 999 &&
      mouseClickIndex !== mouseEnterIndex
    ) {
      return mouseEnterIndex;
    }
    return mouseEnterIndex === 999 ? mouseClickIndex : mouseEnterIndex;
  };

  const handleTableExport = () => {
    const headers = [
      [
        "Serial Number Id",
        "Product Number",
        "Product Family",
        "Product Platform",
        "Support Type",
        "Product Description",
        "Account Sales Territory Id",
        "Legacy Global Business Unit",
        "Product End Of Life Date (UTC)",
        "Product End Of Service Life Date (UTC)",
        "Final Service Date (UTC)",
        "Support End Date (UTC)",
        "Final Service Source",
        "Support Status",
        "Infosight Eligible",
        "Infosight Registered",
      ],
    ];

    let ws = XLSX.utils.aoa_to_sheet(headers);
    XLSX.utils.sheet_add_json(ws, prescriptiveSalesData, {
      origin: "A2",
      skipHeader: true,
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "Sales_Lead.xlsx");
  };

  const handleSummaryTitle = (title) => {
    switch (title) {
      case EOSL:
        return `${EOSL} (End of Service Life)`;
      case NOT_EOSL:
        return `${NOT_EOSL} (Active Service Life)`;
      default:
        return `${title}`;
    }
  };

  return (
    <>
      {prescriptiveSalesData.length > 0 && (
        <>
          <img
            src={PrescriptiveSalesIcon}
            className="capsulefiltericon pointer"
            height="20px"
            title="Sales Lead"
            onClick={() => {
              trackingService.LogsalesLeadClick(Cookies.get("empnumber"));
              setShowPrescriptiveSales(true);
            }}
          />

          {showPrescriptiveSales && (
            <Modal
              show={showPrescriptiveSales}
              onHide={() => handleClose()}
              centered
              dialogClassName="prescriptive-modal"
            >
              <Modal.Header>
                <Modal.Title>
                  <img
                    src={HeaderLogo}
                    width="90px"
                    className="pr-2"
                    alt="HPE Logo"
                  />
                  Sales Lead
                </Modal.Title>
                <button
                  type="button"
                  translate="no"
                  onClick={() => handleClose()}
                  class="close"
                  data-dismiss="modal"
                >
                  ×
                </button>
              </Modal.Header>
              <Modal.Body bsPrefix="document-data-modal">
                <Container fluid>
                  <Row>
                    <Col sm={7}>
                      <PieChart width={700} height={370}>
                        <Pie
                          data={dataPoints1}
                          dataKey="count"
                          nameKey="eoslStatus"
                          cx={350}
                          cy={170}
                          innerRadius={90}
                          outerRadius={120}
                          fill="#8884d8"
                          activeIndex={getActiveIndex(
                            doughnutMouseEnterActiveIndex,
                            doughnutMouseClickActiveIndex
                          )}
                          activeShape={renderDoughnutShape}
                          onMouseEnter={onDoughnutEnter}
                          onMouseLeave={onDoughnutLeave}
                          onClick={onDoughnutClick}
                        >
                          {dataPoints1.map((entry, index) => (
                            <Cell
                              key={`cellDoughnut-${index}`}
                              fill={colors1[index]}
                              onClick={() => {
                                setTableName(entry.eoslStatus);
                                handleDoughnutClick(entry.points);
                              }}
                            />
                          ))}
                        </Pie>
                        {!isEmpty(dataPoints2) && (
                          <Pie
                            data={dataPoints2}
                            dataKey="count"
                            nameKey="supportStatus"
                            cx={350}
                            cy={170}
                            outerRadius={75}
                            fill="#8884d8"
                            activeIndex={getActiveIndex(
                              pieMouseEnterActiveIndex,
                              pieMouseClickActiveIndex
                            )}
                            activeShape={renderPieShape}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            onClick={onPieClick}
                          >
                            {dataPoints2.map((entry, index) => (
                              <Cell
                                key={`cellPie-${index}`}
                                fill={colors2[index]}
                                onClick={() => {
                                  // setTableName(entry.eoslStatus);
                                  handlePieClick(entry.points);
                                }}
                              />
                            ))}
                          </Pie>
                        )}
                        <Legend verticalAlign="top" />
                      </PieChart>
                    </Col>
                    <Col sm={5}>
                      <div className="vertical-center custom-div-vertical-center">
                        <h6>
                          <b>Summary</b>
                        </h6>
                        <Table
                          responsive
                          bordered
                          size="sm"
                          id="summary-table"
                          className="summary-table"
                        >
                          <thead>
                            <tr>
                              <th className="perspective-table-header">
                                Legend
                              </th>
                              <th className="perspective-table-header">
                                Title
                              </th>
                              <th className="perspective-table-header">
                                Count
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataPoints1.map((entry, index) => (
                              <tr key={`listDataPoints1-${index}`}>
                                <td>
                                  <i
                                    className="fas fa-square-full"
                                    style={{ color: colors1[index] }}
                                  />
                                </td>
                                <td>{handleSummaryTitle(entry.eoslStatus)}</td>
                                <td>{entry.count}</td>
                              </tr>
                            ))}
                            {dataPoints2.map((entry, index) => (
                              <tr key={`listDataPoints2-${index}`}>
                                <td>
                                  <i
                                    className="fas fa-square-full"
                                    style={{ color: colors2[index] }}
                                  />
                                </td>
                                <td>
                                  {handleSummaryTitle(entry.supportStatus)}
                                </td>
                                <td>{entry.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                  {tableData.length > 0 && (
                    <Container ref={componentRef}>
                      <div className="h6 font-weight-bold">
                        <span style={{ color: "green" }}>{`${handleSummaryTitle(
                          tableName
                        )}`}</span>
                        {/* {tableName && (
                          <>
                            &nbsp;
                            <i className="fas fa-angle-right" /> &nbsp;
                            {tableName}
                          </>
                        )} */}
                      </div>
                      <Table
                        striped
                        bordered
                        responsive
                        hover
                        size="sm"
                        id="prescriptive-table"
                      >
                        <thead>
                          <tr>
                            <th className="perspective-table-header">
                              Serial Number
                            </th>
                            <th className="perspective-table-header">
                              Product Number
                            </th>
                            <th className="perspective-table-header">
                              Product Family
                            </th>
                            <th className="perspective-table-header">
                              Product Description
                            </th>
                            <th className="perspective-table-header">
                              Product Platform
                            </th>
                            {!(
                              tableName === EOSL || tableName === NOT_EOSL
                            ) && (
                              <>
                                <th className="perspective-table-header">
                                  Support Type
                                </th>
                                <th className="perspective-table-header">
                                  Support Description
                                </th>
                              </>
                            )}
                            {/* Display End Date only for To Be Expired */}
                            {(tableName === SUPPORT_TO_BE_EXPIRED ||
                              tableName === SUPPORT_EXPIRED) && (
                              <th className="perspective-table-header">
                                Support End Date (UTC)
                              </th>
                            )}
                            {/* Display End of Service Date only for EOSL */}
                            {tableName === EOSL && (
                              <th className="perspective-table-header">
                                Product EoSL Date (UTC)
                              </th>
                            )}
                            {/* Display Infosigh Eligible */}
                            <th className="perspective-table-header">
                              Infosight Eligible
                            </th>
                            <th className="perspective-table-header">
                              Infosight Registered
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {map(
                            slice(
                              tableData,
                              (activePage - 1) * itemsCountPerPage,
                              (activePage - 1) * itemsCountPerPage +
                                itemsCountPerPage
                            ),
                            (item) => (
                              <tr key={item.serialNumberId}>
                                <td>{item.serialNumberId}</td>
                                <td>{item.productId}</td>
                                <td>{item.lineDescriptionName}</td>
                                <td>{item.productName}</td>
                                <td>{item.productPlatformDescriptionName}</td>
                                {!(
                                  tableName === EOSL || tableName === NOT_EOSL
                                ) && (
                                  <>
                                    <td>{item.finalServiceSource}</td>
                                    <td>{item.businessAreaDescriptionName}</td>
                                  </>
                                )}
                                {(tableName === SUPPORT_TO_BE_EXPIRED ||
                                  tableName === SUPPORT_EXPIRED) && (
                                  <td>
                                    {moment(
                                      item.finalServiceEndDate,
                                      "MM/DD/YYYY hh:mm:ss a"
                                    ).format("DD/MM/YYYY")}
                                  </td>
                                )}
                                {tableName === EOSL && (
                                  <td>
                                    {moment(
                                      item.productEndOfServiceLifeDate,
                                      "MM/DD/YYYY hh:mm:ss a"
                                    ).format("DD/MM/YYYY")}
                                  </td>
                                )}
                                <td>{item.infosightEligible}</td>
                                <td>{item.infosightRegistered}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                      <div className="text-center">
                        <Pagination
                          prevPageText="<"
                          nextPageText=">"
                          firstPageText="<<"
                          lastPageText=">>"
                          activePage={activePage}
                          itemsCountPerPage={itemsCountPerPage}
                          totalItemsCount={totalItemsCount}
                          pageRangeDisplayed={5}
                          onChange={handlePageChange}
                        />
                      </div>
                    </Container>
                  )}
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-primary btn-sm pointer"
                  onClick={() => handleTableExport()}
                >
                  Export All Data &nbsp;
                  <i className="fas fa-download" />
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm pointer"
                  onClick={() => handleClose()}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default PrescriptiveSales;
