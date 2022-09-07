import React, { Component } from "react";
import { ExportReactCSV } from "../ExportReactCSV";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";

class DeliveredServiceCreditsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search3: "",
      episodes3: [],
      exportData3: [],
      activePage3: 1,
      itemsCountPerPage3: 10,
      applySearch3: false,
      totalItemsCount3: this.props.data.length,
    };
    this._filterUpdated3 = this._filterUpdated3.bind(this);
  }
  componentDidMount = () => {
    if (this.props.AccountSTID) {
      this.fetchTableData3(this.props.data);
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.AccountSTID !== this.props.AccountSTID) {
      this.fetchTableData3(this.props.data);
    }
  };

  updateExportData3 = () => {
    const newFile = this.state.exportData3.map((item) => {
      return {
        ProjectID: item.ProjectId,
        ProjectName: item.ProjectName,
        PracticeName: item.PracticeName,
        DeliveredCredits:
          item.credits && item.credits.length > 0
            ? item.credits.length > 1
              ? item.credits[1].creditName === "Delivered Credits"
                ? item.credits[1].creditSum
                : item.credits[0].creditSum
              : item.credits[0].creditName === "Delivered Credits"
              ? item.credits[0].creditSum
              : item.credits[0].creditName === "Delivered Credits"
              ? item.credits[0].creditSum
              : 0
            : 0,
        ContractEndDate: this.formatDate(item.ProjectContractEndDate),
      };
    });
    this.setState({ exportData3: newFile });
  };
  fetchTableData3 = (data) => {
    this.setState({ episodes3: data, exportData3: data }, () => {
      this.updateExportData3();
    });
  };

  // pagination
  handlePageChange3(pageNumber) {
    this.setState({ activePage3: pageNumber });
    const begin3 =
      pageNumber * this.state.itemsCountPerPage3 -
      this.state.itemsCountPerPage3;
    const end3 =
      pageNumber * this.state.itemsCountPerPage3 > this.state.episodes3.length
        ? this.state.episodes3.length
        : pageNumber * this.state.itemsCountPerPage3;
  }
  // Search/Filter
  _filterUpdated3(newData, filtersObject) {
    this.setState({
      episodes3: newData,
      totalItemsCount3: newData.length,
      activePage3: 1,
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
  updateSearch3(event) {
    this.setState({
      search3: event.target.value,
      activePage3: 1,
      applySearch3: true,
    });
    if (event.target.value.length === 0) {
      this.setState({ applySearch3: false });
    }
  }
  render() {
    const begin3 =
      this.state.activePage3 * this.state.itemsCountPerPage3 -
      this.state.itemsCountPerPage3;
    const end3 =
      this.state.activePage3 * this.state.itemsCountPerPage3 >
      this.state.episodes3.length
        ? this.state.episodes3.length
        : this.state.activePage3 * this.state.itemsCountPerPage3;
    const episodes3 = this.state.episodes3.filter((list) => {
      if (this.state.episodes3.length > 0) {
        return (
          list.ProjectId.toLowerCase().indexOf(
            this.state.search3.toLowerCase()
          ) !== -1 ||
          list.ProjectName.toLowerCase().indexOf(
            this.state.search3.toLowerCase()
          ) !== -1 ||
          list.PracticeName.toLowerCase().indexOf(
            this.state.search3.toLowerCase()
          ) !== -1 ||
          list.ProjectContractEndDate.indexOf(
            this.state.search3.toLowerCase()
          ) !== -1
        );
      }
    });

    const elementsHtml3 = episodes3.slice(begin3, end3).map((item, index) => {
      return (
        <tr key={`project` + item.ProjectId}>
          <td>{item.ProjectId}</td>
          <td>{item.ProjectName}</td>
          <td>{item.PracticeName}</td>
          {/* Delivered Credits */}
          <td>
            {item.credits && item.credits.length > 0
              ? item.credits.length > 1
                ? item.credits[1].creditName === "Delivered Credits"
                  ? item.credits[1].creditSum
                  : item.credits[0].creditSum
                : item.credits[0].creditName === "Delivered Credits"
                ? item.credits[0].creditSum
                : item.credits[0].creditName === "Delivered Credits"
                ? item.credits[0].creditSum
                : 0
              : 0}
          </td>
          <td>{this.formatDate(item.ProjectContractEndDate)}</td>
        </tr>
      );
    });
    return (
      <>
        <input
          type="text"
          value={this.state.search3}
          placeholder="Filter"
          className="filterInput float-left custom-width"
          onChange={this.updateSearch3.bind(this)}
        />
        <i
          className="fas fa-info-circle helptextservice"
          title="Filter using: Project ID,Project Name & Practice Name
 "
        ></i>
        <ExportReactCSV
          csvData={this.state.exportData3}
          fileName="DeliveredServiceCreditsDetails.xls"
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
            <TableFilter rows={episodes3} onFilterUpdate={this._filterUpdated3}>
              <th className="" width="90">
                Project ID
              </th>
              <th className="">Project Name</th>
              <th className="">Practice Name</th>
              <th className="">Delivered Credits</th>
              <th className="">Contract End Date</th>
            </TableFilter>
          </thead>
          <tbody>
            {elementsHtml3.length > 0 ? (
              elementsHtml3
            ) : (
              <tr>
                <td colSpan="10">
                  <div align="center">Loading...</div>
                </td>
              </tr>
            )}
            {this.state.applySearch3 && elementsHtml3.length === 0 && (
              <tr>
                <td colSpan="10">No Results Found</td>
              </tr>
            )}

            {!this.state.applySearch3 && (
              <tr>
                <td colSpan="10" align="center">
                  <Pagination
                    activePage={this.state.activePage3}
                    itemsCountPerPage={this.state.itemsCountPerPage3}
                    totalItemsCount={this.state.totalItemsCount3}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange3.bind(this)}
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
export default DeliveredServiceCreditsTableData;
