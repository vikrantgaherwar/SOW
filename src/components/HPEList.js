import React from "react";
import Pagination from "react-js-pagination";

class HPEList extends React.Component {
  constructor(props) {
    super(props);
    this.hpelistRef = React.createRef();
    this.state = {
      initialList: [],
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      searchTerm: "",
      applySearch: false,
    };
  }

  componentDidMount = () => {
    var data = this.props.data;
    const pageSize = this.state.itemsCountPerPage;
    this.setState({
      hpseList: data.slice(0, pageSize),
      initialList: data,
      totalItemsCount: this.props.data.length,
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      var data = this.props.data;
      const pageSize = this.state.itemsCountPerPage;
      this.setState({
        hpseList: data.slice(0, pageSize),
        initialList: data,
        totalItemsCount: this.props.data.length,
      });
    }
  }

  handlePageChange = (pageNumber) => {
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const end =
      pageNumber * this.state.itemsCountPerPage > this.state.initialList.length
        ? this.state.initialList.length
        : pageNumber * this.state.itemsCountPerPage;
    const list = this.state.initialList.slice(begin, end);
    this.setState({ activePage: pageNumber, hpseList: list });
    this.hpelistRef.current.scrollTop = 0;
  };

  render() {
    return (
      <>
        {this.state.initialList !== undefined &&
          this.state.initialList.length > 0 && (
            <>
              <div className="card-header" id={"headingHPSE"}>
                <h5 className="mb-0 in-flex">
                  <button
                    className="btn btn-link btn-full collapsed"
                    type="button"
                    data-toggle="collapse"
                    aria-expanded="false"
                    data-target="#serviceHPSE"
                    aria-controls="serviceHPSE"
                  >
                    HPE Support Center
                  </button>
                  <span className="circle-count">
                    <span className="count-inner">
                      {this.state.initialList.length}
                    </span>
                  </span>
                </h5>
              </div>
              <div
                className="left-border collapse"
                aria-labelledby="headingHPSE"
                data-parent="#accordionExample"
                aria-expanded="false"
                id="serviceHPSE"
              >
                <div className="card-body ml-4">
                  {this.state.hpseList.map((list) => (
                    <div
                      className="col-12 p-0 mb-1 row border-bottom"
                      key={list.UniqueId}
                    >
                      <div className="col-1 pr-0 pt-1">
                        <a className="fa fa-external-link-square-alt file-ext-link"></a>
                      </div>
                      <div className="col-10 p-1 row ml-1">
                        <a
                          href={
                            "https://internal.support.hpe.com/hpsc/doc/public/display?docId=" +
                            (list.raw.kmdocid !== undefined&&list.raw.kmdocid.indexOf("||")!==-1?list.raw.kmdocid.substr(0,list.raw.kmdocid.indexOf("||")):list.raw.kmdocid)
                          }
                          target="_blank"
                        >
                          {list.raw.title}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {this.state.initialList.length > 10 && (
                  <div className="col-12 pt-2 pb-4 more-wrapper">
                    <i className="fas fa-arrow-right float-right mr-3 pointer"></i>
                    <b
                      className="float-right mr-1 pointer"
                      data-toggle="modal"
                      data-target="#HPESCMore"
                    >
                      More
                    </b>
                  </div>
                )}
              </div>
            </>
          )}
        <div
          className="modal fade"
          id="HPESCMore"
          role="dialog"
          aria-labelledby="deploymentModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog hpesc-data-modal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deploymentModalLabel">
                  HPE Support Center
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  translate="no"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                className="modal-body document-data-modal"
                ref={this.hpelistRef}
              >
                {this.state.initialList !== undefined &&
                  this.state.initialList.length > 0 && (
                    <>
                      <div className="text-center">
                        <Pagination
                          prevPageText="<"
                          nextPageText=">"
                          firstPageText="<<"
                          lastPageText=">>"
                          activePage={this.state.activePage}
                          itemsCountPerPage={this.state.itemsCountPerPage}
                          totalItemsCount={this.state.totalItemsCount}
                          pageRangeDisplayed={5}
                          onChange={this.handlePageChange}
                        />
                      </div>

                      <div className="card-body ml-4">
                        {this.state.hpseList.map((list) => (
                          <div
                            className="col-12 p-0 mb-1 row border-bottom"
                            key={list.UniqueId}
                          >
                            <div className="col-1 pr-0 pt-1">
                              <a className="fa fa-external-link-square-alt file-ext-link"></a>
                            </div>
                            <div className="col-11 p-1 row">
                              <a
                                href={
                                  "https://internal.support.hpe.com/hpsc/doc/public/display?docId=" +
                                  (list.raw.kmdocid !== undefined &&list.raw.kmdocid.indexOf("||")!==-1?list.raw.kmdocid.substr(0,list.raw.kmdocid.indexOf("||")):list.raw.kmdocid)
                                }
                                target="_blank"
                              >
                                {list.raw.title}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <Pagination
                          prevPageText="<"
                          nextPageText=">"
                          firstPageText="<<"
                          lastPageText=">>"
                          activePage={this.state.activePage}
                          itemsCountPerPage={this.state.itemsCountPerPage}
                          totalItemsCount={this.state.totalItemsCount}
                          pageRangeDisplayed={5}
                          onChange={this.handlePageChange}
                        />
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default HPEList;
