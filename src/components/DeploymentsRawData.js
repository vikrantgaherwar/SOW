import React from "react";
import axios from "axios";
import URLConfig from "./URLConfig";
import TableFilter from "react-table-filter/lib/bundle";
import { } from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";
import { ExportReactCSV } from "./ExportReactCSV";
import _ from "lodash";
import moment from "moment";
class DeploymentsRawData extends React.Component {
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

  // componentDidUpdate(prevProps) {
  //   if (this.props.filterRawData !== prevProps.filterRawData) {
  //     this.setState({ episodes: this.props.filterRawData });
  //   }
  // }
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
    if (filterRawData !== "")
      filterRawData = filterRawData?.replace(/Account./g, "pse__Account__r.");
    var URL = URLConfig.getURL_Deployments_RawData(
      AccountId.replace("Account.", "")
    );
    if (Filter === "All" && filterRawData == "") {
    } else if (Filter === "All" && filterRawData != "") {
      URL = URL + "%20AND%20" + filterRawData;
    } else if (Filter === "OPEN" && filterRawData == "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20Id,%20Name,%20CreatedDate,%20pse__Account__r.Name,%20pse__Account__r.Focus_Account__c,%20pse__Billing_Type__c,%20pse__End_Date__c,%20pse__Is_Active__c,%20pse__Opportunity__r.Opportunity_ID__c,%20pse__Planned_Hours__c,%20pse__Project_ID__c,%20pse__Project_Phase__c,%20pse__Project_Status__c,%20pse__Project_Type__c,%20pse__Revenue__c,%20pse__Stage__c,%20pse__Start_Date__c,%20pse__Total_Costs__c,%20PSA_Funded__c,%20PSA_Product_Family__c,%20PSA_Overall_Status__c%20from%20pse__Proj__c%20WHERE%20pse__Account__r." +
        AccountId.replace("Account.", "") +
        "%27%20AND%20pse__Project_Phase__c%20!=%27Closed%27";
    } else if (Filter === "OPEN" && filterRawData != "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20Id,%20Name,%20CreatedDate,%20pse__Account__r.Name,%20pse__Account__r.Focus_Account__c,%20pse__Billing_Type__c,%20pse__End_Date__c,%20pse__Is_Active__c,%20pse__Opportunity__r.Opportunity_ID__c,%20pse__Planned_Hours__c,%20pse__Project_ID__c,%20pse__Project_Phase__c,%20pse__Project_Status__c,%20pse__Project_Type__c,%20pse__Revenue__c,%20pse__Stage__c,%20pse__Start_Date__c,%20pse__Total_Costs__c,%20PSA_Funded__c,%20PSA_Product_Family__c,%20PSA_Overall_Status__c%20from%20pse__Proj__c%20WHERE%20pse__Account__r." +
        AccountId.replace("Account.", "") +
        "%27%20AND%20pse__Project_Phase__c%20!=%27Closed%27%20AND%20" +
        filterRawData;
    } else if (Filter === "CLOSED" && filterRawData == "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20Id,%20Name,%20CreatedDate,%20pse__Account__r.Name,%20pse__Account__r.Focus_Account__c,%20pse__Billing_Type__c,%20pse__End_Date__c,%20pse__Is_Active__c,%20pse__Opportunity__r.Opportunity_ID__c,%20pse__Planned_Hours__c,%20pse__Project_ID__c,%20pse__Project_Phase__c,%20pse__Project_Status__c,%20pse__Project_Type__c,%20pse__Revenue__c,%20pse__Stage__c,%20pse__Start_Date__c,%20pse__Total_Costs__c,%20PSA_Funded__c,%20PSA_Product_Family__c,%20PSA_Overall_Status__c%20from%20pse__Proj__c%20WHERE%20pse__Account__r." +
        AccountId.replace("Account.", "") +
        "%27%20AND%20pse__Project_Phase__c%20=%27Closed%27";
    } else if (Filter === "CLOSED" && filterRawData != "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20Id,%20Name,%20CreatedDate,%20pse__Account__r.Name,%20pse__Account__r.Focus_Account__c,%20pse__Billing_Type__c,%20pse__End_Date__c,%20pse__Is_Active__c,%20pse__Opportunity__r.Opportunity_ID__c,%20pse__Planned_Hours__c,%20pse__Project_ID__c,%20pse__Project_Phase__c,%20pse__Project_Status__c,%20pse__Project_Type__c,%20pse__Revenue__c,%20pse__Stage__c,%20pse__Start_Date__c,%20pse__Total_Costs__c,%20PSA_Funded__c,%20PSA_Product_Family__c,%20PSA_Overall_Status__c%20from%20pse__Proj__c%20WHERE%20pse__Account__r." +
        AccountId.replace("Account.", "") +
        "%27%20AND%20pse__Project_Phase__c%20=%27Closed%27%20AND%20" +
        filterRawData;
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
          delete v.pse__Account__r_attributes_type;
          delete v.pse__Account__r_attributes_url;
          delete v.pse__Planned_Hours__c;
          delete v.pse__Stage__c;
        });
        this.setState({
          data: data,
          dataExport: dataExport,
          episodes: data,
          totalItemsCount: data.length,
        });
      } else {
        console.log("No Deployments Raw Data Found!!");
      }
    });
  };
  modifyDateComponent = ({ value }) => {
    let formattedDate = null;
    if (value) {
      formattedDate = moment(value).format("YYYY-MM-DD");
    }
    return formattedDate;
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
        list.pse__Project_ID__c
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1 ||
        list.pse__Account__r_Name
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1 ||
        list.CreatedDate.toLowerCase().indexOf(
          this.state.search.toLowerCase()
        ) !== -1 ||
        (list.PSA_Funded__c !== null &&
          list.PSA_Funded__c.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) !== -1) ||
        list.PSA_Overall_Status__c.toLowerCase().indexOf(
          this.state.search.toLowerCase()
        ) !== -1 ||
        (list.pse__Project_Phase__c !== null &&
          list.pse__Project_Phase__c
            .toLowerCase()
            .indexOf(this.state.search.toLowerCase()) !== -1) ||
        (list.pse__Project_Status__c !== null &&
          list.pse__Project_Status__c
            .toLowerCase()
            .indexOf(this.state.search.toLowerCase()) !== -1) ||
        (list.pse__Start_Date__c !== null &&
          list.pse__Start_Date__c
            .toLowerCase()
            .indexOf(this.state.search.toLowerCase()) !== -1) ||
        (list.pse__End_Date__c !== null &&
          list.pse__End_Date__c
            .toLowerCase()
            .indexOf(this.state.search.toLowerCase()) !== -1) ||
        list.pse__Total_Costs__c.toString().indexOf(this.state.search) != -1
      );
    });
    // Removing some of the coloumns since we dont want to display them either on the UI or in the export
    episodes.forEach(function (v) {
      delete v.attributes_type;
      delete v.attributes_url;
      delete v.pse__Account__r_attributes_type;
      delete v.pse__Account__r_attributes_url;
      delete v.pse__Planned_Hours__c;
      delete v.pse__Stage__c;
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
              {item.pse__Project_ID__c}
            </a>
          </td>
          <td className="cell">{item.pse__Account__r_Name}</td>
          <td className="cell">
            {item.CreatedDate
              ? moment(item.CreatedDate).format("YYYY-MM-DD")
              : ""}
          </td>
          <td className="cell">{item.PSA_Funded__c}</td>
          <td className="cell">{item.PSA_Overall_Status__c}</td>
          <td className="cell">{item.pse__Project_Phase__c}</td>
          <td className="cell">{item.pse__Project_Status__c}</td>
          <td className="cell">{item.pse__Start_Date__c}</td>
          <td className="cell">{item.pse__End_Date__c}</td>
          <td className="cell">{item.pse__Total_Costs__c}</td>
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
                  title="Filter using: Project ID, Account Name, Project Status etc.,
"
                  style={{ marginLeft: "4px", marginTop: "3px" }}
                ></i>
              </div>
              <div className="col-md-4 text-right">
              {this.state.filterApplied === true &&
                  <button 
                    className="btn btn-sm filter-remove mr-2 mb-1" 
                    onClick={() =>{
                      this.tableFilterNode.reset(this.state.data, true);
                      this._filterUpdated(this.state.data)}}
                    >
                    <i class="fa fa-times" aria-hidden="true"></i> Clear all Filter
                  </button>
                }
                <span
                  title="Export data is limited to filters applied
              "
                >
                  <ExportReactCSV
                    csvData={episodes}
                    fileName={"ProjectPSARawData- " + this.props.filter + ".xls"}
                  >
                    Export
                  </ExportReactCSV>
                </span>
              </div>
            </div>


            <table
              // className="table table-sm table-bordered table-striped "
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
                  ref={ (node) => {this.tableFilterNode = node}}
                >
                  <th
                    key="pse__Project_ID__c"
                    filterkey="pse__Project_ID__c"
                    className="cell "
                    width="200px"
                  >
                    Project ID
                  </th>
                  <th
                    key="pse__Account__r_Name"
                    filterkey="pse__Account__r_Name"
                    className="cell "
                    width="220px"
                  >
                    Account Name
                  </th>
                  <th
                    key="CreatedDate"
                    filterkey="CreatedDate"
                    className="cell "
                    width="250px"
                  >
                    Created Date (UTC)
                  </th>
                  <th
                    key="PSA_Funded__c"
                    filterkey="PSA_Funded__c"
                    className="cell "
                    width="220px"
                  >
                    PSA Funded
                  </th>
                  <th
                    key="PSA_Overall_Status__c"
                    filterkey="PSA_Overall_Status__c"
                    className="cell "
                    width="230px"
                  >
                    PSA Overall Status
                  </th>
                  <th
                    key="pse__Project_Phase__c"
                    filterkey="pse__Project_Phase__c"
                    className="cell "
                    width="220px"
                  >
                    Project Phase
                  </th>
                  <th
                    key="pse__Project_Status__c"
                    filterkey="pse__Project_Status__c"
                    className="cell "
                    width="220px"
                  >
                    Project Status
                  </th>
                  <th
                    key="pse__Start_Date__c"
                    filterkey="pse__Start_Date__c"
                    className="cell "
                    alignleft={"true"}
                    width="230px"
                  >
                    Start Date (UTC)
                  </th>
                  <th
                    key="pse__End_Date__c"
                    filterkey="pse__End_Date__c"
                    className="cell "
                    alignleft={"true"}
                    width="220px"
                  >
                    End Date (UTC)
                  </th>
                  <th
                    key="pse__Total_Costs__c"
                    filterkey="pse__Total_Costs__c"
                    className="cell "
                    alignleft={"true"}
                    width="230px"
                  >
                    Total Costs (USD)
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {elementsHtml}

                {this.state.applySearch && elementsHtml.length === 0 && (
                  <tr>
                    <td colSpan="10">No Results Found</td>
                  </tr>
                )}

                {/* {!this.state.applySearch && ( */}
                <tr>
                  <td colSpan="10" align="center">
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
export default DeploymentsRawData;
