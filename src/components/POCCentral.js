import React, { Fragment } from "react";
import Pagination from "react-js-pagination";
import _ from "lodash";
class POCCentral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      POCList: [],
      searchTerm: "",
      POCactivePage: 1,
      POCitemsCountPerPage: 10,
      POCtotalItemsCount: props.data !== undefined ? props.data.length : 0,
    };
  }

  processFilters = (docs) => {};
  componentDidMount() {
    const pageSize = this.state.POCitemsCountPerPage;
    this.setState({
      POCList: this.props.data.slice(0, pageSize),
      POCtotalItemsCount:
        this.props.data !== undefined ? this.props.data.length : 0,
      POCDataList: this.props.data,
      TotalCount: this.props.data !== undefined ? this.props.data.length : 0,
    });
  }

  componentDidUpdate = (prevProps) => {
    const pageSize = this.state.POCitemsCountPerPage;
    if (prevProps.data.length !== this.props.data.length) {
      this.setState({
        searchTerm: this.props.searchTerm,
        POCList: this.props.data.slice(0, pageSize),
        TotalCount: this.props.data !== undefined ? this.props.data.length : 0,
        POCtotalItemsCount:
          this.props.data !== undefined ? this.props.data.length : 0,
        POCDataList: this.props.data,
      });
    }
  };

  handlePageChange = (pageNumber) => {
    const begin =
      pageNumber * this.state.POCitemsCountPerPage -
      this.state.POCitemsCountPerPage;
    const end =
      pageNumber * this.state.POCitemsCountPerPage > this.props.data.length
        ? this.props.data.length
        : pageNumber * this.state.POCitemsCountPerPage;
    const list = this.props.data.slice(begin, end);
    this.setState({ POCactivePage: pageNumber, POCList: list });
  };
  render() {
    return (
      <Fragment>
        {this.state.POCList && this.state.POCList.length > 0 && (
          <Fragment>
            <div className="card-header">
              <h5 className="mb-0 in-flex">
                <button
                  className="btn btn-link btn-full collapsed"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  data-target="#POCCentral"
                  aria-controls="POCCentral"
                >
                  POC Central
                </button>
                <span className="circle-count">
                  <span className="count-inner">{this.state.TotalCount}</span>
                </span>
              </h5>
            </div>
            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#POCCentral"
              aria-expanded="false"
              id="POCCentral"
              data-parent="#accordionExample"
            >
              <div className="card-body ml-2 mr-2 mt-2">
                <table
                  className="table table-bordered"
                  width="90%"
                  cellSpacing="0"
                  cellPadding="0"
                  border="0"
                >
                  <tbody>
                    <tr>
                      <th align="left">Category</th>
                      <th align="left">PoC ID</th>
                      <th align="left">Title</th>
                      <th align="left">Solution Stack</th>
                      <th align="left">Status</th>
                    </tr>
                    {this.state.POCList.map((list, index) => (
                      <tr key={index}>
                        <td align="left">{list.category}</td>
                        <td align="left">{list.poc_id}</td>
                        <td align="left">{list.title}</td>
                        <td align="left">{list.solution_stack}</td>
                        <td align="left">
                          <strong>{list.status}</strong>
                          &nbsp;(
                          {list.demo_url && (
                            <a target="_blank" href={list.demo_url}>
                              Demo
                            </a>
                          )}
                          {list.video_url && (
                            <a target="_blank" href={list.video_url}>
                              , Video
                            </a>
                          )}
                          {list.document_url && (
                            <a target="_blank" href={list.document_url}>
                              , Documents
                            </a>
                          )}
                          )
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="5">
                        <div className="text-center">
                          <Pagination
                            prevPageText="<"
                            nextPageText=">"
                            firstPageText="<<"
                            lastPageText=">>"
                            activePage={this.state.POCactivePage}
                            itemsCountPerPage={this.state.POCitemsCountPerPage}
                            totalItemsCount={this.state.POCtotalItemsCount}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
export default POCCentral;
