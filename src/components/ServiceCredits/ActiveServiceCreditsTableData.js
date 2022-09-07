import React, { Component } from "react";
import axios from "axios";
import { map, each, find, sumBy } from "lodash";
import { ExportReactCSV } from "../ExportReactCSV";
import TableFilter from "react-table-filter/lib/bundle";
import "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";
class ActiveServiceCreditsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      episodes: [],
      exportData: [],
      activePage: 1,
      itemsCountPerPage: 10,
      applySearch: false,
      totalItemsCount: this.props.data.length,
    };
    this._filterUpdated = this._filterUpdated.bind(this);
  }
  componentDidMount = () => {
    if (this.props.AccountSTID) {
      this.tableData(this.props.AccountSTID);
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.AccountSTID !== this.props.AccountSTID) {
      this.tableData(this.props.AccountSTID);
    }
  };

  tableData = async () => {
    let securl =
      "https://delta.app.hpecorp.net:8983/solr/service_credit/select?fl=ProjectId,ProjectName,PracticeName,ActiveCredits,ExpiryStatus,ProjectContractEndDate&group.field=ProjectId&group.mincount=1&group.limit=1&group=true&indent=on&json.facet=%7Bcategories:%7Btype%20:%20terms,limit:1000,field%20:%20ProjectId,facet:%7Bprojects:%20%7Btype%20:%20terms,%20field:%20Status,%20facet:%7BSUM%20:%20%22sum(CreditValue)%22%7D%7D%7D%7D%7D&&q=Account_ST_ID:%22" +
      this.props.AccountSTID +
      "%22&rows=10000&wt=json";

    try {
      const res = await axios.get(securl);
      const projectsGrouped = [...res?.data?.grouped?.ProjectId?.groups];
      const credits = [...res?.data?.facets?.categories?.buckets];

      let projects = [];
      each(projectsGrouped, (item) => {
        projects = [...projects, ...item.doclist.docs];
      });

      const newCredits = map(credits, (item1) => ({
        ...item1,
      }));
      //console.log({ newCredits });
      const finalProjects = map(projects, (item) => {
        const matchingCredit = find(
          newCredits,
          (credit) => credit.val === item.ProjectId
        );

        if (matchingCredit?.projects?.buckets.length > 0) {
          const credits = map(matchingCredit.projects.buckets, (credit) => ({
            creditName: credit.val,
            creditSum: credit.SUM,
          }));
          return {
            ...item,
            credits: [...credits],
          };
        }
        return { ...item };
      });
      this.setState(
        { episodes: finalProjects, exportData: finalProjects },
        () => {
          this.updateExportData();
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  updateExportData = () => {
    const newFile = this.state.exportData.map((item) => {
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

        ConvertedCredits:
          item.credits && item.credits.length > 0
            ? item.credits.length > 1
              ? item.credits[1].creditSum + item.credits[0].creditSum
              : item.credits[0].creditSum
            : 0,
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
        ActiveCredits: item.ActiveCredits,
        ExpiryInDays: item.ExpiryStatus,
        ContractEndDate: this.formatDate(item.ProjectContractEndDate),
      };
    });
    this.setState({ exportData: newFile });
  };

  // pagination
  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const end =
      pageNumber * this.state.itemsCountPerPage > this.state.episodes.length
        ? this.state.episodes.length
        : pageNumber * this.state.itemsCountPerPage;
  }
  // Search/Filter
  _filterUpdated(newData, filtersObject) {
    this.setState({
      episodes: newData,
      totalItemsCount: newData.length,
      activePage: 1,
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
      if (this.state.episodes.length > 0) {
        return (
          list.ProjectId.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) !== -1 ||
          list.ProjectName.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) !== -1 ||
          list.PracticeName.toLowerCase().indexOf(
            this.state.search.toLowerCase()
          ) !== -1 ||
          list.ProjectContractEndDate.indexOf(
            this.state.search.toLowerCase()
          ) !== -1 ||
          list.ExpiryStatus.indexOf(this.state.search.toLowerCase()) !== -1
        );
      }
    });

    const elementsHtml = episodes.slice(begin, end).map((item, index) => {
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
          {/* Converted Credits = Delivered Credits + Converted(Not Delivered) Credits */}
          <td>
            {item.credits && item.credits.length > 0
              ? item.credits.length > 1
                ? item.credits[1].creditSum + item.credits[0].creditSum
                : item.credits[0].creditSum
              : 0}
          </td>
          {/* Delivered Credits */}
          <td>
            {item.credits && item.credits.length > 0
              ? item.credits.length > 1
                ? item.credits[1].creditName === "Delivered Credits"
                  ? item.credits[1].creditSum
                  : item.credits[0].creditSum
                : item.credits[0].creditName === "Delivered Credits"
                ? item.credits[0].creditSum
                : item.credits[0].creditSum
              : 0}
          </td>
          {/*Converted (Not Delivered) Credits */}
          <td>
            {item.credits && item.credits.length > 0
              ? item.credits.length > 1
                ? item.credits[1].creditName === "Converted Not Delivered"
                  ? item.credits[1].creditSum
                  : item.credits[0].creditSum
                : item.credits[0].creditName === "Converted Not Delivered"
                ? item.credits[0].creditSum
                : 0
              : 0}
          </td>
          <td>{item.ActiveCredits ? item.ActiveCredits : 0}</td>
          <td>{item.ExpiryStatus}</td>
          <td>{this.formatDate(item.ProjectContractEndDate)}</td>
        </tr>
      );
    });
    return (
      <>
        <>
          <input
            type="text"
            value={this.state.search}
            placeholder="Filter"
            className="filterInput float-left custom-width"
            onChange={this.updateSearch.bind(this)}
          />
          <i
            className="fas fa-info-circle helptextservice"
            title="Filter using: Project ID,Project Name,Practice Name & Expiry in Days "
          ></i>
          <ExportReactCSV
            csvData={this.state.exportData}
            fileName="ActiveServiceCreditsDetails.xls"
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
              <TableFilter rows={episodes} onFilterUpdate={this._filterUpdated}>
                <th className="" width="90">
                  Project ID
                </th>
                <th className="">Project Name</th>
                <th className="">Practice Name</th>
                <th className="">Purchased Credits</th>
                <th className="">Converted Credits</th>
                <th className="">Delivered Credits</th>
                <th className="">Converted (Not Delivered)</th>
                <th className="">Active Credits</th>
                <th className="">Expiry in Days</th>
                <th className="">Contract End Date</th>
              </TableFilter>
            </thead>
            <tbody>
              {elementsHtml.length > 0 ? (
                elementsHtml
              ) : (
                <tr>
                  <td colSpan="10">
                    <div align="center">Loading...</div>
                  </td>
                </tr>
              )}

              {this.state.applySearch && elementsHtml.length === 0 && (
                <tr>
                  <td colSpan="10">No Results Found</td>
                </tr>
              )}

              {!this.state.applySearch && elementsHtml.length > 0 && (
                <tr>
                  <td colSpan="10" align="center">
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.itemsCountPerPage}
                      totalItemsCount={this.state.totalItemsCount}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange.bind(this)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      </>
    );
  }
}
export default ActiveServiceCreditsTableData;
