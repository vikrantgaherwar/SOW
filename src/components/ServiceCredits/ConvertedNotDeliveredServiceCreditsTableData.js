import React, { Component } from "react";
import { ExportReactCSV } from "../ExportReactCSV";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";

class ConvertedNotDeliveredServiceCreditsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search4: "",
      episodes4: [],
      exportData4: [],
      activePage4: 1,
      itemsCountPerPage4: 10,
      applySearch4: false,
      totalItemsCount4: this.props.data.length,
    };
    this._filterUpdated4 = this._filterUpdated4.bind(this);
  }
  componentDidMount = () => {
    if (this.props.AccountSTID) {
      this.fetchTableData4(this.props.data);
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.AccountSTID !== this.props.AccountSTID) {
      this.fetchTableData4(this.props.data);
    }
  };
  fetchTableData4 = (data) => {
    this.setState({ episodes4: data, exportData4: data }, () => {
      this.updateExportData4();
    });
  };

  updateExportData4 = () => {
    const newFile = this.state.exportData4.map((item) => {
      return {
        ProjectID: item.ProjectId,
        ProjectName: item.ProjectName,
        PracticeName: item.PracticeName,
        ConvertedNotDeliveredCredits:
          item.credits && item.credits.length > 0
            ? item.credits.length > 1
              ? item.credits[1].creditName === "Converted Not Delivered"
                ? item.credits[1].creditSum
                : item.credits[0].creditSum
              : item.credits[0].creditName === "Converted Not Delivered"
              ? item.credits[0].creditSum
              : item.credits[0].creditName === "Converted Not Delivered"
              ? item.credits[0].creditSum
              : 0
            : 0,
        ExpiryInDays: item.ExpiryStatus,
        ContractEndDate: this.formatDate(item.ProjectContractEndDate),
      };
    });
    this.setState({ exportData4: newFile });
  };

  // pagination
  handlePageChange4(pageNumber) {
    this.setState({ activePage4: pageNumber });
    const begin4 =
      pageNumber * this.state.itemsCountPerPage4 -
      this.state.itemsCountPerPage4;
    const end4 =
      pageNumber * this.state.itemsCountPerPage4 > this.state.episodes4.length
        ? this.state.episodes4.length
        : pageNumber * this.state.itemsCountPerPage4;
  }
  // Search/Filter
  _filterUpdated4(newData, filtersObject) {
    this.setState({
      episodes4: newData,
      totalItemsCount4: newData.length,
      activePage4: 1,
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
  updateSearch4(event) {
    this.setState({
      search4: event.target.value,
      activePage4: 1,
      applySearch4: true,
    });
    if (event.target.value.length === 0) {
      this.setState({ applySearch4: false });
    }
  }
  render() {
    const begin4 =
      this.state.activePage4 * this.state.itemsCountPerPage4 -
      this.state.itemsCountPerPage4;
    const end4 =
      this.state.activePage4 * this.state.itemsCountPerPage4 >
      this.state.episodes4.length
        ? this.state.episodes4.length
        : this.state.activePage4 * this.state.itemsCountPerPage4;
    const episodes4 = this.state.episodes4.filter((list) => {
      if (this.state.episodes4.length > 0) {
        return (
          list.ProjectId.toLowerCase().indexOf(
            this.state.search4.toLowerCase()
          ) !== -1 ||
          list.ProjectName.toLowerCase().indexOf(
            this.state.search4.toLowerCase()
          ) !== -1 ||
          list.PracticeName.toLowerCase().indexOf(
            this.state.search4.toLowerCase()
          ) !== -1 ||
          list.ProjectContractEndDate.indexOf(
            this.state.search4.toLowerCase()
          ) !== -1 ||
          list.ExpiryStatus.indexOf(this.state.search4.toLowerCase()) !== -1
        );
      }
    });

    const elementsHtml4 = episodes4.slice(begin4, end4).map((item, index) => {
      return (
        <tr key={`project` + item.ProjectId}>
          <td>{item.ProjectId}</td>
          <td>{item.ProjectName}</td>
          <td>{item.PracticeName}</td>
          {/*Converted (Not Delivered) Credits */}
          <td>
            {item.credits && item.credits.length > 0
              ? item.credits.length > 1
                ? item.credits[1].creditName === "Converted Not Delivered"
                  ? item.credits[1].creditSum
                  : item.credits[0].creditSum
                : item.credits[0].creditName === "Converted Not Delivered"
                ? item.credits[0].creditSum
                : item.credits[0].creditName === "Converted Not Delivered"
                ? item.credits[0].creditSum
                : 0
              : 0}
          </td>
          <td>{item.ExpiryStatus}</td>
          <td>{this.formatDate(item.ProjectContractEndDate)}</td>
        </tr>
      );
    });
    return (
      <>
        <input
          type="text"
          value={this.state.search4}
          placeholder="Filter"
          className="filterInput float-left custom-width"
          onChange={this.updateSearch4.bind(this)}
        />
        <i
          className="fas fa-info-circle helptextservice"
          title="Filter using: Project ID,Project Name,Practice Name & Expiry in Days
 "
        ></i>
        <ExportReactCSV
          csvData={this.state.exportData4}
          fileName="ConvertedNotDeliveredServiceCreditsDetails.xls"
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
            <TableFilter rows={episodes4} onFilterUpdate={this._filterUpdated4}>
              <th className="" width="90">
                Project ID
              </th>
              <th className="">Project Name</th>
              <th className="">Practice Name</th>
              <th className="">Converted (Not Delivered)</th>
              <th className="">Expiry in Days</th>
              <th className="">Contract End Date</th>
            </TableFilter>
          </thead>
          <tbody>
            {elementsHtml4.length > 0 ? (
              elementsHtml4
            ) : (
              <tr>
                <td colSpan="6">
                  <div align="center">Loading...</div>
                </td>
              </tr>
            )}
            {this.state.applySearch4 && elementsHtml4.length === 0 && (
              <tr>
                <td colSpan="6">No Results Found</td>
              </tr>
            )}

            {!this.state.applySearch4 && (
              <tr>
                <td colSpan="6" align="center">
                  <Pagination
                    activePage={this.state.activePage4}
                    itemsCountPerPage={this.state.itemsCountPerPage4}
                    totalItemsCount={this.state.totalItemsCount4}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange4.bind(this)}
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
export default ConvertedNotDeliveredServiceCreditsTableData;
