import React, { Fragment } from "react";
import Griddle, {
  plugins,
  RowDefinition,
  ColumnDefinition,
} from "griddle-react";
import axios from "axios";
import { connect } from "react-redux";
import URLConfig from "./URLConfig";
import { ExportReactCSV } from "./ExportReactCSV";
import moment from "moment";
import _ from "lodash";

// import React, { Component } from "react";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";
import { sum } from "../utils/math";
import { ExportReactCSVData } from "./ExportReactCSVData";
class OpportunityRawData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      episodes: [],
      search: "",
      activePage: 1,
      itemsCountPerPage: 10,
      applySearch: false,
      totalItemsCount: 0,
      // psa related
      AccountId: 0,
      data: null,
      currentPage: 1,
      pageSize: 10,
      recordCount: 0,
      getData: this.getData.bind(this),
      APIHost: URLConfig.get_CustomerCapsule_API_Host(),
      filterRawData: this.props.filterRawData,
      filterApplied: false,
    };
    this._filterUpdated = this._filterUpdated.bind(this);
  }

  componentDidMount() {
    const AccountId = this.props.AccountId;
    const filter = this.props.filter;
    const filterRawData = this.props.filterRawData;
    this.setState({ AccountId: AccountId, filter: filter });
    this.getData(AccountId, filter, filterRawData);
  }

  componentDidUpdate(prevProps) {
    if (this.props.filterRawData !== prevProps.filterRawData) {
      this.getData(
        this.props.AccountId,
        this.props.filter,
        this.props.filterRawData
      );
    }
  }
  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const end =
      pageNumber * this.state.itemsCountPerPage > this.state.episodes.length
        ? this.state.episodes.length
        : pageNumber * this.state.itemsCountPerPage;
  }

  _filterUpdated(newData, filtersObject) {
    this.setState({
      episodes: newData,
      totalItemsCount: newData.length,
      activePage: 1,
      dataExport: newData,
      filterApplied: true,
    });
  }
  updateSearch(event) {
    this.setState({
      search: event.target.value,
      activePage: 1,
      applySearch: true,
    });
    if (event.target.value.length === 0) {
      this.setState({ applySearch: false });
    }
  }
  getData = (AccountId, Filter, filterRawData) => {
    var URL = URLConfig.getURL_Opportunity_RawData(AccountId);
    if (Filter === "Closed" && filterRawData == "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20Description,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20Win_Loss_Reason__c,%20Type,%20CreatedDate,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c%20!=%27HPE%20Not%20Pursued%27%20AND%20" +
        AccountId +
        "%27%20AND%20IsClosed%20=%20true%20Order%20By%20SystemModstamp%20DESC";
    }
    if (filterRawData != "" && Filter != "Closed") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20Description,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20Win_Loss_Reason__c,%20Type,%20CreatedDate,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c !='HPE Not Pursued'  AND%20" +
        AccountId +
        "%27%20AND%20" +
        filterRawData +
        "%20Order%20By%20SystemModstamp%20DESC";
    }
    if (filterRawData != "" && Filter === "Closed") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20Description,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20Win_Loss_Reason__c,%20Type,%20CreatedDate,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c !='HPE Not Pursued' AND%20" +
        AccountId +
        "%27%20AND%20" +
        filterRawData +
        "%20Order%20By%20SystemModstamp%20DESC";
    }
    const config = URLConfig.ApplyAuth(URL);
    axios(config).then((res) => {
      if (res.data.response.length) {
        const data = res.data.response;
        let dataExport = _.cloneDeep(data);
        dataExport.forEach(function (v) {
          delete v.attributes_type;
          delete v.attributes_url;
          delete v.Id;
        });
        dataExport = dataExport.map(function (obj) {
          Object.keys(obj).forEach(function (key) {
            obj[key] =
              obj[key] !== null ? obj[key].toString().replace(/,/g, " ") : null;
          });
          return obj;
        });
        this.setState({
          data: data,
          dataExport: dataExport,
          episodes: data,
          totalItemsCount: data.length,
        });
      }
    });
  };

  updateTableState = ({ data, currentPage }) => {
    this.setState({ data, currentPage });
  };

  render() {
    const begin =
      this.state.activePage * this.state.itemsCountPerPage -
      this.state.itemsCountPerPage;
    const end =
      this.state.activePage * this.state.itemsCountPerPage >
      this.state.episodes.length
        ? this.state.episodes.length
        : this.state.activePage * this.state.itemsCountPerPage;
    const episodes = this.state.episodes.filter((list) => {
      return (
        list?.Opportunity_ID__c?.toLowerCase().indexOf(
          this.state.search.toLowerCase()
        ) != -1 ||
        (list?.Description !== null &&
          list.Description.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) != -1) ||
        list?.CreatedDate?.toLowerCase().indexOf(
          this.state.search.toLowerCase()
        ) !== -1 ||
        // (list.TotalOpportunityQuantity &&
        //   list.TotalOpportunityQuantity.toString().indexOf(this.state.search) !=
        //     -1) ||
        (list.Type !== null &&
          list.Type.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
            -1) ||
        (list.Win_Loss_Reason__c !== null &&
          list.Win_Loss_Reason__c.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) != -1) ||
        (list.Amount !== null &&
          list.Amount.toString().indexOf(this.state.search) != -1) ||
        (list.StageName &&
          list.StageName.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) != -1)
      );
    });
    episodes.forEach(function (v) {
      delete v.attributes_type;
      delete v.attributes_url;
    });
    const totalItemsCount = episodes.length;
    const elementsHtml = episodes.slice(begin, end).map((item, index) => {
      return (
        <tr key={"row_" + index}>
          <td className="cell">
            <a
              style={{ color: "#0275d8", cursor: "pointer" }}
              href={`https://hp.my.salesforce.com/${item.Id}`}
              target="_blank"
            >
              {item.Opportunity_ID__c}
            </a>
          </td>
          <td className="cell">{item.Description}</td>
          <td className="cell">
            {item.CreatedDate
              ? moment(item.CreatedDate).format("YYYY-MM-DD")
              : ""}
          </td>
          {/* <td className="cell">{item.TotalOpportunityQuantity}</td> */}
          <td className="cell">{item.Type}</td>
          <td className="cell">{item.Opportunity_Sales_Stage__c}</td>
          <td className="cell">{item.Win_Loss_Reason__c}</td>
          <td className="cell">{item.Amount}</td>
        </tr>
      );
    });
    return this.state.data ? (
      <div>
        <div className="examples">
          <div className="basic">
            <div className="row">
              <div className="col-md-8">
                <input
                  type="text"
                  value={this.state.search}
                  placeholder="Filter"
                  className="filterInput"
                  onChange={this.updateSearch.bind(this)}
                />
                <i
                  className="fas fa-info-circle helptextCC"
                  title="Filter using: Opportunity ID, Type, Win Loss Reason etc.,

"
                  style={{ marginLeft: "4px", marginTop: "3px" }}
                ></i>
              </div>
              <div className="col-md-4 text-right">
                {this.state.filterApplied === true && (
                  <button
                    className="btn btn-sm filter-remove mr-2 mb-1"
                    onClick={() => {
                      this.tableFilterNode.reset(this.state.data, true);
                      this._filterUpdated(this.state.data);
                    }}
                  >
                    <i class="fa fa-times" aria-hidden="true"></i> Clear all
                    Filter
                  </button>
                )}
                <span title="Export data is limited to filters applied">
                  <ExportReactCSVData
                    csvData={episodes}
                    fileName="OpportunityRawData.xls"
                  >
                    Export
                  </ExportReactCSVData>
                </span>
              </div>
            </div>

            <table
              className="table table-bordered"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={episodes}
                  onFilterUpdate={this._filterUpdated}
                  ref={(node) => {
                    this.tableFilterNode = node;
                  }}
                >
                  <th
                    key="Opportunity_ID__c"
                    filterkey="Opportunity_ID__c"
                    className="cell "
                    casesensitive={"false"}
                    showsearch={"false"}
                    width="200px"
                  >
                    Opportunity ID
                  </th>
                  <th
                    key="Description"
                    filterkey="Description"
                    className="cell "
                    width="220px"
                  >
                    Description
                  </th>
                  <th
                    key="CreatedDate"
                    filterkey="CreatedDate"
                    className="cell "
                    width="250px"
                  >
                    Created Date (UTC)
                  </th>
                  {/* <th
                    key="TotalOpportunityQuantity"
                    filterkey="TotalOpportunityQuantity"
                    className="cell "
                    width="220px"
                  >
                    Opportunity Sales
                  </th> */}
                  <th
                    key="Type"
                    filterkey="Type"
                    className="cell "
                    width="220px"
                  >
                    Type
                  </th>
                  <th
                    key="StageName"
                    filterkey="StageName"
                    className="cell "
                    width="220px"
                  >
                    StageName
                  </th>
                  <th
                    key="Win_Loss_Reason__c"
                    filterkey="Win_Loss_Reason__c"
                    className="cell "
                    width="220px"
                  >
                    Win Loss Reason
                  </th>
                  <th
                    key="Amount"
                    filterkey="Amount"
                    className="cell "
                    alignleft={"true"}
                    width="200px"
                  >
                    Amount (USD)
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {elementsHtml}

                {this.state.applySearch && elementsHtml.length === 0 && (
                  <tr>
                    <td colSpan="8">No Results Found</td>
                  </tr>
                )}
                {elementsHtml.length === 1 && (
                  <tr>
                    <td colSpan="8">
                      <div align="center">No Results Found</div>
                    </td>
                  </tr>
                )}

                {/* {!this.state.applySearch && ( */}
                <tr>
                  <td colSpan="8" align="center">
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.itemsCountPerPage}
                      totalItemsCount={totalItemsCount}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange.bind(this)}
                    />
                  </td>
                </tr>
                {/* )} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ) : (
      <p align="center">Loading Data...</p>
    );
  }
}
export default OpportunityRawData;
