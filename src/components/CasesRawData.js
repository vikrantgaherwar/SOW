import React, { Fragment } from "react";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import UrlConfig from "./URLConfig";
import TableFilter from "react-table-filter/lib/bundle";
import { } from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";
import { ExportReactCSVData } from "./ExportReactCSVData";
class CasesRawData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AccountId: 0,
      data: null,
      getData: this.getData.bind(this),
      APIHost: UrlConfig.get_CustomerCapsule_API_Host(),
      filterRawData: this.props.filterRawData,
      episodes: [],
      search: "",
      activePage: 1,
      itemsCountPerPage: 10,
      applySearch: false,
      totalItemsCount: 0,
      filterApplied: false,
    };
    this._filterUpdated = this._filterUpdated.bind(this);
  }
  getData = (AccountId, Filter, filterRawData) => {
    var URL =
      this.state.APIHost +
      "services/data/v38.0/sobjects/query2?q=Select%20CaseNumber,%20Id,%20Account.Account_ST_ID__c,%20Account.Account_ST_Name__c,%20Account.Top_Parent_ST_ID__c,%20Account.Top_Parent_ST_Name__c,%20Account.Focus_Account__c,%20Status,%20Origin,%20Subject,%20ClosedDate,%20IsEscalated,%20CreatedDate,%20Region__c,%20Case_Age_Business_Days__c,%20Elevated__c,%20Severity__c,%20Coverage_Response__c,%20Entitlement_SLA_Response__c,%20First_Response_TAT__c,%20Account.Name%20from%20Case%20WHERE%20" +
      AccountId +
      "%27";
    if (Filter === "ALL" && filterRawData == "") {
      URL = URL + "%20limit%205000";
    } else if (Filter === "ALL" && filterRawData != "") {
      URL = URL + "%20AND%20(" + filterRawData + ")%20limit%205000";
    } else if (Filter === "OPEN" && filterRawData == "") {
      URL = URL + "%20AND%20Status%20!=%20%27Closed%27%20limit%205000";
    } else if (Filter === "OPEN" && filterRawData != "") {
      URL =
        URL +
        "%20AND%20Status%20!=%20%27Closed%27%20AND%20(" +
        filterRawData +
        ")%20limit%205000";
    } else if (Filter === "Closed" && filterRawData == "") {
      URL = URL + "%20AND%20Status%20=%20%27Closed%27%20limit%205000";
    } else if (Filter === "Closed" && filterRawData != "") {
      URL =
        URL +
        "%20AND%20Status%20=%20%27Closed%27%20AND%20(" +
        filterRawData +
        ")%20limit%205000";
    } else if (Filter === "ELEVATED" && filterRawData == "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20CaseNumber,%20Id,%20Account.Account_ST_ID__c,%20Account.Account_ST_Name__c,%20Account.Top_Parent_ST_ID__c,%20Account.Top_Parent_ST_Name__c,%20Account.Focus_Account__c,%20Status,%20Origin,%20Subject,%20ClosedDate,%20IsEscalated,%20CreatedDate,%20Region__c,%20Case_Age_Business_Days__c,%20Elevated__c,%20Severity__c,%20Coverage_Response__c,%20Entitlement_SLA_Response__c,%20First_Response_TAT__c,%20Account.Name%20from%20Case%20WHERE%20" +
        AccountId +
        "%27%20AND%20Elevated__c=true";
    } else if (Filter === "ELEVATED" && filterRawData != "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20CaseNumber,%20Id,%20Account.Account_ST_ID__c,%20Account.Account_ST_Name__c,%20Account.Top_Parent_ST_ID__c,%20Account.Top_Parent_ST_Name__c,%20Account.Focus_Account__c,%20Status,%20Origin,%20Subject,%20ClosedDate,%20IsEscalated,%20CreatedDate,%20Region__c,%20Case_Age_Business_Days__c,%20Elevated__c,%20Severity__c,%20Coverage_Response__c,%20Entitlement_SLA_Response__c,%20First_Response_TAT__c,%20Account.Name%20from%20Case%20WHERE%20" +
        AccountId +
        "%27%20AND%20(" +
        filterRawData +
        ")%20AND%20Elevated__c=true";
    } else if (Filter === "ESCALATED" && filterRawData == "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20CaseNumber,%20Id,%20Account.Account_ST_ID__c,%20Account.Account_ST_Name__c,%20Account.Top_Parent_ST_ID__c,%20Account.Top_Parent_ST_Name__c,%20Account.Focus_Account__c,%20Status,%20Origin,%20Subject,%20ClosedDate,%20IsEscalated,%20CreatedDate,%20Region__c,%20Case_Age_Business_Days__c,%20Elevated__c,%20Severity__c,%20Coverage_Response__c,%20Entitlement_SLA_Response__c,%20First_Response_TAT__c,%20Account.Name%20from%20Case%20WHERE%20" +
        AccountId +
        "%27%20AND%20IsEscalated=true";
    } else if (Filter === "ESCALATED" && filterRawData != "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20CaseNumber,%20Id,%20Account.Account_ST_ID__c,%20Account.Account_ST_Name__c,%20Account.Top_Parent_ST_ID__c,%20Account.Top_Parent_ST_Name__c,%20Account.Focus_Account__c,%20Status,%20Origin,%20Subject,%20ClosedDate,%20IsEscalated,%20CreatedDate,%20Region__c,%20Case_Age_Business_Days__c,%20Elevated__c,%20Severity__c,%20Coverage_Response__c,%20Entitlement_SLA_Response__c,%20First_Response_TAT__c,%20Account.Name%20from%20Case%20WHERE%20" +
        AccountId +
        "%27%20AND%20(" +
        filterRawData +
        ")%20AND%20IsEscalated=true";
    } else if (Filter === "SEVERITY" && filterRawData == "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20CaseNumber,%20Id,%20Account.Account_ST_ID__c,%20Account.Account_ST_Name__c,%20Account.Top_Parent_ST_ID__c,%20Account.Top_Parent_ST_Name__c,%20Account.Focus_Account__c,%20Status,%20Origin,%20Subject,%20ClosedDate,%20IsEscalated,%20CreatedDate,%20Region__c,%20Case_Age_Business_Days__c,%20Elevated__c,%20Severity__c,%20Coverage_Response__c,%20Entitlement_SLA_Response__c,%20First_Response_TAT__c,%20Account.Name%20from%20Case%20WHERE%20" +
        AccountId +
        "%27%20AND%20Severity__c%20=%20%271-CRITICAL-DOWN%27";
    } else if (Filter === "SEVERITY" && filterRawData != "") {
      URL =
        this.state.APIHost +
        "services/data/v38.0/sobjects/query2?q=Select%20CaseNumber,%20Id,%20Account.Account_ST_ID__c,%20Account.Account_ST_Name__c,%20Account.Top_Parent_ST_ID__c,%20Account.Top_Parent_ST_Name__c,%20Account.Focus_Account__c,%20Status,%20Origin,%20Subject,%20ClosedDate,%20IsEscalated,%20CreatedDate,%20Region__c,%20Case_Age_Business_Days__c,%20Elevated__c,%20Severity__c,%20Coverage_Response__c,%20Entitlement_SLA_Response__c,%20First_Response_TAT__c,%20Account.Name%20from%20Case%20WHERE%20" +
        AccountId +
        "%27%20AND%20(" +
        filterRawData +
        ")%20AND%20Severity__c%20=%20%271-CRITICAL-DOWN%27";
    }
    const config = UrlConfig.ApplyAuth(URL);
    axios(config).then((res) => {
      if (res.data.response.length) {
        const data = res.data.response;
        let dataExport = _.cloneDeep(data);
        dataExport.forEach(function (v) {
          delete v.attributes_type;
          delete v.attributes_url;
          delete v.Id;
          delete v.Account_attributes_type;
          delete v.Account_attributes_url;
        });
        this.setState({
          data: data,
          dataExport: dataExport,
          episodes: data,
          totalItemsCount: data.length,
        });
      } else {
        console.log("No Cases Raw Data Found!!");
      }
    });
  };
  static getDerivedStateFromProps(props, state) {
    if (props.AccountId !== state.AccountId || props.filter !== state.filter) {
      state.getData(props.AccountId, props.filter, props.filterRawData);
      return { AccountId: props.AccountId, filter: props.filter, data: null };
    }
    return null;
  }
  componentDidMount() {
    const AccountId = this.props.AccountId;
    const filter = this.props.filter;
    this.setState({ AccountId: AccountId, filter: filter });
    this.getData(AccountId, filter, this.props.filterRawData);
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
  updateTableState = ({ data, currentPage }) => {
    this.setState({ data, currentPage });
  };

  HandleBoolData({ value }) {
    return <span>{value ? "Yes" : "No"}</span>;
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

  modifyDateComponent = ({ value }) => {
    let formattedDate = null;
    if (value) {
      formattedDate = moment(value).format("YYYY-MM-DD");
    }
    return formattedDate;
  };
  onFilterData = (e) => {
    if (e) {
      const originalData = _.cloneDeep(this.state.data);

      const dataExport = originalData.filter((list) => {
        // console.log(list.Severity__c);
        return (
          list.CaseNumber.toLowerCase().indexOf(e) != -1 ||
          list.Case_Age_Business_Days__c === e ||
          list.Elevated__c.toString().indexOf(e) != -1 ||
          list.Account_Name.toLowerCase().indexOf(e.toLowerCase()) != -1 ||
          list.IsEscalated.toString().indexOf(e) != -1 ||
          (list.Severity__c !== null &&
            list.Severity__c.toLowerCase().indexOf(e.toLowerCase()) != -1) ||
          (list.Region__c !== null &&
            list.Region__c.toLowerCase().indexOf(e.toLowerCase()) != -1) ||
          list.Status.toLowerCase().indexOf(e.toLowerCase()) != -1
        );
      });
      dataExport.forEach(function (v) {
        delete v.attributes_type;
        delete v.attributes_url;
        delete v.Id;
        delete v.Account_attributes_type;
        delete v.Account_attributes_url;
      });
      this.setState({ dataExport });
    } else {
      const dataExport = _.cloneDeep(this.state.data);
      dataExport.forEach(function (v) {
        delete v.attributes_type;
        delete v.attributes_url;
        delete v.Id;
        delete v.Account_attributes_type;
        delete v.Account_attributes_url;
      });
      this.setState({ dataExport });
    }
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
        list.CaseNumber.toString().indexOf(this.state.search) != -1 ||
        list.Case_Age_Business_Days__c.toString().indexOf(this.state.search) !=
        -1 ||
        (list.CreatedDate !== null &&
          list.CreatedDate.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) !== -1) ||
        (list.ClosedDate !== null &&
          list.ClosedDate.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) !== -1) ||
        list.Elevated__c.toString().indexOf(this.state.search) != -1 ||
        list.Account_Name.toLowerCase().indexOf(
          this.state.search.toLowerCase()
        ) != -1 ||
        list.IsEscalated.toString().indexOf(this.state.search) != -1 ||
        (list.Severity__c !== null &&
          list.Severity__c.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) != -1) ||
        (list.Region__c !== null &&
          list.Region__c.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) != -1) ||
        list.Status.toLowerCase().indexOf(this.state.search.toLowerCase()) != -1
      );
    });
    episodes.forEach(function (v) {
      delete v.attributes_type;
      delete v.attributes_url;
      delete v.Account_attributes_type;
      delete v.Account_attributes_url;
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
              {item.CaseNumber}
            </a>
          </td>
          <td className="cell">{item.Case_Age_Business_Days__c}</td>
          <td className="cell">
            {item.CreatedDate
              ? moment(item.CreatedDate).format("YYYY-MM-DD")
              : ""}
          </td>
          <td className="cell">
            {item.ClosedDate
              ? moment(item.ClosedDate).format("YYYY-MM-DD")
              : ""}
          </td>
          <td className="cell">{this.HandleBoolData(item.Elevated__c)}</td>
          <td className="cell">{this.HandleBoolData(item.IsEscalated)}</td>
          <td className="cell">{item.Region__c}</td>
          <td className="cell">{item.Severity__c}</td>
          <td className="cell">{item.Status}</td>
        </tr>
      );
    });
    return (
      <Fragment>
        {this.state.data !== null && this.state.data.length > 0 && (
          <Fragment>
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
                      title="Filter using: Case Number, Account Name, Status, etc.,

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
                    <span title="Export data is limited to filters applied ">
                      <ExportReactCSVData
                        csvData={episodes}
                        fileName="IncidentsRawData.xls"
                      >
                        Export
                      </ExportReactCSVData>
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
                        key="CaseNumber"
                        filterkey="CaseNumber"
                        className="cell "
                        casesensitive={"false"}
                        showsearch={"false"}
                        width="220px"
                      >
                        CaseNumber
                      </th>
                      <th
                        key="Case_Age_Business_Days__c"
                        filterkey="Case_Age_Business_Days__c"
                        className="cell "
                        width="220px"
                        showsearch={"false"}
                      >
                        Case Age
                      </th>
                      <th
                        key="CreatedDate"
                        filterkey="CreatedDate"
                        className="cell "
                        width="220px"
                        showsearch={"false"}
                      >
                        Created Date (UTC)
                      </th>

                      <th
                        key="ClosedDate"
                        filterkey="ClosedDate"
                        className="cell "
                        width="220px"
                        showsearch={"false"}
                      >
                        Closed Date (UTC)
                      </th>
                      <th
                        key="Elevated__c"
                        // filterkey="Elevated__c"
                        className="cell "
                        width="220px"
                        showsearch={"false"}
                      >
                        Elevated
                      </th>
                      <th
                        key="IsEscalated"
                        // filterkey="IsEscalated"
                        className="cell "
                        width="220px"
                        showsearch={"false"}
                      >
                        IsEscalated
                      </th>
                      <th
                        key="Region__c"
                        filterkey="Region__c"
                        className="cell "
                        width="220px"
                        showsearch={"false"}
                      >
                        Region
                      </th>
                      <th
                        key="Severity__c"
                        filterkey="Severity__c"
                        className="cell "
                        width="200px"
                        showsearch={"false"}
                      >
                        Severity
                      </th>
                      <th
                        key="Status"
                        filterkey="Status"
                        className="cell "
                        width="200px"
                      >
                        Status
                      </th>
                    </TableFilter>
                  </thead>
                  <tbody>
                    {elementsHtml}

                    {this.state.applySearch && elementsHtml.length === 0 && (
                      <tr>
                        <td colSpan="9">No Results Found</td>
                      </tr>
                    )}

                    {/* {!this.state.applySearch && ( */}
                    <tr>
                      <td colSpan="9" align="center">
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
                {/* </div> */}
              </div>
            </div>
          </Fragment>
        )}
        {this.state.data === null && <p align="center">Loading Data...</p>}
      </Fragment>
    );
  }
}
export default CasesRawData;
