import React, { Component } from "react";
import axios from "axios";
import { ExportReactCSV } from "../ExportReactCSV";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";

class PurchasedServiceCreditsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search2: "",
      episodes2: [],
      exportData2: [],
      activePage2: 1,
      itemsCountPerPage2: 10,
      applySearch2: false,
      totalItemsCount2: this.props.data.length,
    };
    this._filterUpdated2 = this._filterUpdated2.bind(this);
  }
  componentDidMount = () => {
    if (this.props.AccountSTID) {
      this.fetchTableData2(this.props.data);
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.AccountSTID !== this.props.AccountSTID) {
      this.fetchTableData2(this.props.data);
    }
  };
  fetchTableData2 = (data) => {
    this.setState({ episodes2: data, exportData2: data }, () => {
      this.updateExportData2();
    });
  };
  updateExportData2 = () => {
    const newFile = this.state.exportData2.map((item) => {
      return {
        ProjectID: item.ProjectId,
        ProjectName: item.ProjectName,
        PracticeName: item.PracticeName,
        PurchasedCredits:
          item.credits && item.credits.length > 0
            ? item.credits.length > 1
              ? item.credits[1].creditSum +
                item.credits[0].creditSum +
                item.ActiveCredits
              : item.credits[0].creditSum + item.ActiveCredits
            : item.ActiveCredits,
        ContractEndDate: this.formatDate(item.ProjectContractEndDate),
      };
    });
    this.setState({ exportData2: newFile });
  };

  // pagination
  handlePageChange2(pageNumber) {
    this.setState({ activePage2: pageNumber });
    const begin2 =
      pageNumber * this.state.itemsCountPerPage2 -
      this.state.itemsCountPerPage2;
    const end2 =
      pageNumber * this.state.itemsCountPerPage2 > this.state.episodes2.length
        ? this.state.episodes2.length
        : pageNumber * this.state.itemsCountPerPage2;
  }
  // Search/Filter
  _filterUpdated2(newData, filtersObject) {
    this.setState({
      episodes2: newData,
      totalItemsCount2: newData.length,
      activePage2: 1,
    });
  }
  // format the date UTC
  formatDate = (date) => {
    if (date === "" || date === undefined) {
      return "";
    }
    var dt = date.split("T");
    return dt[0];
  };
  updateSearch2(event) {
    this.setState({
      search2: event.target.value,
      activePage2: 1,
      applySearch2: true,
    });
    if (event.target.value.length === 0) {
      this.setState({ applySearch2: false });
    }
  }
  render() {
    const begin2 =
      this.state.activePage2 * this.state.itemsCountPerPage2 -
      this.state.itemsCountPerPage2;
    const end2 =
      this.state.activePage2 * this.state.itemsCountPerPage2 >
      this.state.episodes2.length
        ? this.state.episodes2.length
        : this.state.activePage2 * this.state.itemsCountPerPage2;
    const episodes2 = this.state.episodes2.filter((list) => {
      if (this.state.episodes2.length > 0) {
        return (
          list.ProjectId.toLowerCase().indexOf(
            this.state.search2.toLowerCase()
          ) !== -1 ||
          list.ProjectName.toLowerCase().indexOf(
            this.state.search2.toLowerCase()
          ) !== -1 ||
          list.PracticeName.toLowerCase().indexOf(
            this.state.search2.toLowerCase()
          ) !== -1 ||
          list.ProjectContractEndDate.indexOf(
            this.state.search2.toLowerCase()
          ) !== -1
        );
      }
    });

    const elementsHtml2 = episodes2.slice(begin2, end2).map((item, index) => {
      return (
        <tr key={`project` + item.ProjectId}>
          <td>{item.ProjectId}</td>
          <td>{item.ProjectName}</td>
          <td>{item.PracticeName}</td>
          {/* purchased Credits = Active Credits + Delivered Credits + Converted(Not Delivered) Credits*/}
          <td>
            {item.credits && item.credits.length > 0
              ? item.credits.length > 1
                ? item.credits[1].creditSum +
                  item.credits[0].creditSum +
                  item.ActiveCredits
                : item.credits[0].creditSum + item.ActiveCredits
              : item.ActiveCredits}
          </td>
          <td>{this.formatDate(item.ProjectContractEndDate)}</td>
        </tr>
      );
    });
    return (
      <>
        <input
          type="text"
          value={this.state.updateSearch2}
          placeholder="Filter"
          className="filterInput float-left custom-width"
          onChange={this.updateSearch2.bind(this)}
        />
        <i
          className="fas fa-info-circle helptextservice"
          title="Filter using: Project ID,Project Name & Practice Name
 "
        ></i>
        <ExportReactCSV
          csvData={this.state.exportData2}
          fileName="PurchasedServiceCreditsDetails.xls"
        >
          Export
        </ExportReactCSV>
        <table
          className="table table-bordered"
          width="100%"
          cellSpacing="0"
          cellPadding="0"
          border="0"
          align="center"
        >
          <thead>
            <TableFilter rows={episodes2} onFilterUpdate={this._filterUpdated2}>
              <th className="" width="90">
                Project ID
              </th>
              <th className="">Project Name</th>
              <th className="">Practice Name</th>
              <th className="">Purchased Credits</th>
              <th className="">Contract End Date</th>
            </TableFilter>
          </thead>
          <tbody>
            {elementsHtml2}
            {this.state.applySearch2 && elementsHtml2.length === 0 && (
              <tr>
                <td colSpan="10">No Results Found</td>
              </tr>
            )}

            {!this.state.applySearch2 && (
              <tr>
                <td colSpan="10" align="center">
                  <Pagination
                    activePage={this.state.activePage2}
                    itemsCountPerPage={this.state.itemsCountPerPage2}
                    totalItemsCount={this.state.totalItemsCount2}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange2.bind(this)}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
}
export default PurchasedServiceCreditsTableData;
