import React, { Component } from "react";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";
import { ExportReactCSVData } from "./ExportReactCSVData";
import moment from "moment";
class CustomerRevenueChartTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      episodes: this.props.data,
      search: "",
      activePage: 1,
      itemsCountPerPage: 10,
      applySearch: false,
      totalItemsCount: this.props.data.length,
      filterApplied: false,
    };
    this._filterUpdated = this._filterUpdated.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ episodes: this.props.data });
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
        list.Opportunity_ID__c.toLowerCase().indexOf(this.state.search) != -1 ||
        (list.Description !== null &&
          list.Description.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) != -1) ||
        (list.TotalOpportunityQuantity &&
          list.TotalOpportunityQuantity.toString().indexOf(this.state.search) !=
            -1) ||
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
          <td className="cell">{item.TotalOpportunityQuantity}</td>
          <td className="cell">{item.Type}</td>
          <td className="cell">{item.StageName}</td>
          <td className="cell">{item.Win_Loss_Reason__c}</td>
          <td className="cell">{item.Amount}</td>
        </tr>
      );
    });
    return (
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
              {this.state.filterApplied === true &&
                  <button 
                    className="btn btn-sm filter-remove mr-2 mb-1" 
                    onClick={() =>{
                      this.tableFilterNode.reset(this.props.data, true);
                      this._filterUpdated(this.props.data)}}
                    >
                    <i class="fa fa-times" aria-hidden="true"></i> Clear all Filter
                  </button>
                }
            <span
              title="Export data is limited to filters applied
              "
            >
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
                  ref={ (node) => {this.tableFilterNode = node}}
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
                  <th
                    key="TotalOpportunityQuantity"
                    filterkey="TotalOpportunityQuantity"
                    className="cell "
                    width="220px"
                  >
                    Opportunity Sales
                  </th>
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
    );
  }
}
export default CustomerRevenueChartTable;
