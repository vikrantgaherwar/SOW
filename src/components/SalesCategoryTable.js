import React, { Component } from "react";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import Pagination from "react-js-pagination";
import { sum } from "../utils/math";
import { ExportReactCSVData } from "./ExportReactCSVData";

class SalesCategoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      episodes: this.props.Sales,
      type: this.props.Type,
      search: "",
      activePage: 1,
      itemsCountPerPage: 10,
      applySearch: false,
      totalItemsCount: this.props.Sales.length,
      filterApplied: false,
    };
    this._filterUpdated = this._filterUpdated.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.Sales !== prevProps.Sales) {
      this.setState({ episodes: this.props.Sales });
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
  selectProductID(id, count) {
    const { onselectProductID } = this.props;
    const selectedChannel = this.props.selectedChannel;
    onselectProductID(selectedChannel, id, count);
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
        list.product_Id
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1 ||
        list.product_Type
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1 ||
        list.count.toString().indexOf(this.state.search) !== -1
      );
    });
    const elementsHtml = episodes.slice(begin, end).map((item, index) => {
      return (
        <tr key={"row_" + index}>
          <td className="cell">
            <a
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => this.selectProductID(item.product_Id, item.count)}
            >
              {item.product_Id}
            </a>
          </td>
          <td className="cell">{item.product_Type}</td>
          <td className="cell">{item.count}</td>
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
            </div>
            <div className="col-md-4 text-right">
            {this.state.filterApplied === true &&
                  <button 
                    className="btn btn-sm filter-remove" 
                    onClick={() =>{
                      this.tableFilterNode.reset(this.props.Sales, true);
                      this._filterUpdated(this.props.Sales)}}
                    >
                    <i class="fa fa-times" aria-hidden="true"></i> Clear all Filter
                  </button>
                }
                
            <ExportReactCSVData
              csvData={this.state.episodes}
              fileName="ProductLineData.xls"
            >
              Export
            </ExportReactCSVData>
            </div>
            </div>
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
                  ref={ (node) => {this.tableFilterNode = node}}
                >
                  <th
                    key="product_Id"
                    className="cell tbheadersnoborderrad"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    Product ID
                  </th>
                  <th
                    key="product_Type"
                    filterkey="product_Type"
                    className="cell tbheadersnoborderrad"
                    width="220px"
                  >
                    Product Type
                  </th>
                  <th
                    key="count"
                    className="cell tbheadersnoborderrad"
                    alignleft={"true"}
                    width="200px"
                  >
                    Product count - {sum(this.props.Sales, "count")}
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
                    <td colSpan="3" align="center">
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
          </div>
        </div>
      </div>
    );
  }
}
export default SalesCategoryTable;
