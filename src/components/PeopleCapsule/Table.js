import React, { useRef, useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Nav, Tab, TabContainer, TabContent } from "react-bootstrap";
import { map, startCase, _ } from "lodash";
import Pagination from "./Pagination";
import Search from "./Search";
import logo from "../../img/loading-icon-animated.gif";
import { ExportReactCSV } from "../ExportReactCSV";
const ActiveServiceCreditsTableData = ({ regionName, searchTerm }) => {
  const signal = axios.CancelToken.source();

  const cViewWrapperRef = useRef(null);
  const cviewref = useRef(null);
  const [activeKey, setActiveKey] = useState("");
  const [capabilityViewData, setCapabilityViewData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalCViewDataItems, setTotalCViewDataItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 10;
  const [exportData, setExportData] = useState([]);
  const handleOnSelect = (key) => {
    if (activeKey === key) {
      setActiveKey("");
    } else {
      setActiveKey(key);
    }
    setCurrentPage(1);
    setSearch("");
  };

  const getCapabilityViewData = async (cancelToken) => {
    const CapabilityViewUrl =
      "https://delta.app.hpecorp.net:8983/solr/rmc/select?fq=region:%22" +
      regionName +
      "%22&indent=on&q=" +
      searchTerm +
      "&rows=1000&wt=json";
    return await axios.get(CapabilityViewUrl, { cancelToken });
  };

  useEffect(() => {
    Promise.all([getCapabilityViewData(signal.token)]).then((results) => {
      const CapabilityViewData = results[0];
      const dataExport = results[0].data.response.docs;
      const fl = dataExport.map((item) => {
        return {
          Region: item.region,
          Cluster: item.cluster,
          Country: item.country,
          SkillName: item.skill_name,
          SkillSetName: item.skill_set_name,
          SkillType: item.skill_type,
          Total: item.total,
        };
      });
      setExportData(fl);
      setCapabilityViewData(CapabilityViewData.data.response.docs);
    });
  }, [regionName]);

  // Product Data Sorted and Paginated
  const CViewData = useMemo(() => {
    let computedCViewData = capabilityViewData;
    if (search) {
      computedCViewData = computedCViewData.filter(
        (item) =>
          item.cluster.toLowerCase().includes(search.toLowerCase()) ||
          item.country.toLowerCase().includes(search.toLowerCase()) ||
          item.region.toLowerCase().includes(search.toLowerCase()) ||
          item.skill_type.toLowerCase().includes(search.toLowerCase()) ||
          item.skill_set_name.toLowerCase().includes(search.toLowerCase()) ||
          item.skill_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalCViewDataItems(computedCViewData.length);

    //Current Page slice
    return computedCViewData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [capabilityViewData, currentPage, search]);

  const setCurrentPageHandle = (page) => {
    setCurrentPage(page);
  };
  return CViewData.length > 0 ? (
    <div ref={cViewWrapperRef}>
      <div className="col-12">
        <Search
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
        />
        <ExportReactCSV
          csvData={exportData}
          fileName="CapabilityViewData.xls"
        />
        <table
          className="table table-bordered"
          width="100%"
          cellSpacing="0"
          cellPadding="0"
          border="0"
          align="center"
        >
          <thead>
            <th className="">Region</th>
            <th className="">Cluster</th>
            <th className="">Country</th>
            <th className="">Skill Name</th>
            <th className="">Skill Set Name</th>
            <th className="">Skill Type</th>
            <th className="">Total</th>
          </thead>
          <tbody>
            {CViewData.map((item, index) => (
              <tr key={`cview` + index}>
                <td>{item.region}</td>
                <td>{item.cluster}</td>
                <td>{item.country}</td>
                <td>{item.skill_name}</td>
                <td>{item.skill_set_name}</td>
                <td>{item.skill_type}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-12" align="center">
        <Pagination
          total={totalCViewDataItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPageHandle(page)}
        />
      </div>
    </div>
  ) : (
    <div className="text-center">
      <img className="cviewloader" src={logo} alt="loading"></img>
    </div>
  );
};

export default ActiveServiceCreditsTableData;
