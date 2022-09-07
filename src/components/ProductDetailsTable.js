import React, { Component } from "react";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";
import moment from "moment";

class ProductDetailsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      episodes: this.props.Sales,
      Type: this.props.Type,
      count: this.props.count,
      search: "",
      activePage: 1,
      itemsCountPerPage: 10,
      applySearch: false,
    };
    this._filterUpdated = this._filterUpdated.bind(this);
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
  selectProductID(id) {
    const { onselectProductID } = this.props;
    const selectedChannel = this.props.selectedChannel;
    onselectProductID(selectedChannel, id);
  }
  _filterUpdated(newData, filtersObject) {
    this.setState({
      episodes: newData,
      activePage: 1,
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
  modifyDateComponent = (value) => {
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
        list.serialNumber
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.service_Start_Date
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.service_End_date
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.final_Service
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1
      );
    });
    const elementsHtml = episodes.slice(begin, end).map((item, index) => {
      return (
        <tr key={"row_" + index}>
          <td className="cell">{item.serialNumber}</td>
          <td className="cell">
            {this.modifyDateComponent(item.service_Start_Date)}
          </td>
          <td className="cell">
            {this.modifyDateComponent(item.service_End_date)}
          </td>
          <td className="cell">{item.final_Service}</td>
        </tr>
      );
    });
    return (
      <div>
        <div className="examples">
          <div className="basic">
            <input
              type="text"
              value={this.state.search}
              placeholder="Filter"
              className="filterInput"
              onChange={this.updateSearch.bind(this)}
            />
            <table
              className="table table-sm table-bordered table-striped table-font-size"
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
                >
                  <th
                    key="product_Id"
                    className="cell tbheadersnoborderrad"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    Serial No - {this.state.count}
                  </th>
                  <th
                    key="product_Type"
                    className="cell tbheadersnoborderrad"
                    width="160px"
                  >
                    Service Start Date (UTC)
                  </th>
                  <th
                    key="count"
                    className="cell tbheadersnoborderrad"
                    alignleft={"true"}
                    width="160px"
                  >
                    Service End Date (UTC)
                  </th>
                  <th
                    key="count"
                    className="cell tbheadersnoborderrad"
                    alignleft={"true"}
                  >
                    Final Service
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {elementsHtml}
                {this.state.applySearch && elementsHtml.length === 0 && (
                  <tr>
                    <td colSpan="3">No Results Found</td>
                  </tr>
                )}
                {!this.state.applySearch && (
                  <tr>
                    <td colSpan="4" align="center">
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemsCountPerPage}
                        totalItemsCount={this.props.Sales.length}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange.bind(this)}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default ProductDetailsTable;
