import React, { Fragment } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import TrackingService from "./TrackingService";
import Pagination from "react-js-pagination";
import URLConfig from "./URLConfig";
import EOC from "./EOC";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import _ from "lodash";

class Services extends React.Component {
  constructor(props) {
    super(props);
    this.serviceRef = React.createRef();
    this.state = {
      initialServiceList: [],
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      searchTerm: "",
      applySearch: false,
      ServiceList: [],
      filters: "",
      servicebgcolor: "#f9f9f9",
      sersubcategoryhighlight: "",
    };
  }

  logDocClick = (documentDetails) => {
    if (!this.TrackingService) {
      this.TrackingService = new TrackingService();
    }
    this.TrackingService.OpenLink(Cookies.get("empnumber"), documentDetails);
  };

  formatDate = (date) => {
    if (date === "" || date === undefined) {
      return "";
    }
    var dt = date.split("T");
    return dt[0];
  };

  handlePageChange = (pageNumber) => {
    const begin =
      pageNumber * this.state.itemsCountPerPage - this.state.itemsCountPerPage;
    const url =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=file,url,creation_date,rating,disclosure_level,title,id,doc_source,modified_date,file_type,description,go_to_market,service_name,service_type&fq=document_type:%22Services%22%20AND%20document_type_details:%22" +
      encodeURIComponent(this.state.popupHeader) +
      "%22&indent=on&q=" +
      this.state.searckKey +
      "&&rows=10&start=" +
      begin +
      "&wt=json"
      +(this.state.filters.indexOf("&fq=nda:\"True\"") === -1 ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles() : "") +
      this.state.filters;
    axios.get(url).then((res) => {
      if (res.data.response.docs) {
        this.setState({
          ServiceList: res.data.response,
          InitialServiceData: res.data.response,
          totalItemsCount: res.data.response.numFound,
        });
      }
    });
    this.setState({ activePage: pageNumber });
    this.serviceRef.current.scrollTop = 0;
  };

  componentDidMount() {
    const data = this.props.data !== null ? this.props.data : [];
    const filters = this.props.filters !== null ? this.props.filters : "";
    const searckKey = document
      .getElementsByClassName("react-autosuggest__input")[0]
      .value.replace(/[#?&@]/g, " ");
    this.props.isServices
      ? this.setState({
          servicebgcolor: "#0d5265",
          sersubcategoryhighlight: this.props.subcategoryhighlight,
        })
      : this.setState({
          servicebgcolor: "#f9f9f9",
          sersubcategoryhighlight: "",
        });

    this.setState({
      ServiceList: [],
      initialServiceList: data.groups,
      totalItemsCount: data.length,
      TotalCount: data.matches,
      searckKey: searckKey,
      filters: filters,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      const data = this.props.data !== null ? this.props.data : [];
      const filters = this.props.filters !== null ? this.props.filters : "";
      const searckKey = document
        .getElementsByClassName("react-autosuggest__input")[0]
        .value.replace(/[#?&@]/g, " ");
      this.setState({
        ServiceList: [],
        initialServiceList: data.groups,
        totalItemsCount: data.length,
        TotalCount: data.matches,
        searckKey: searckKey,
        filters: filters,
      });
    }
    if (!_.isEqual(prevProps.isServices, this.props.isServices)) {
      this.props.isServices
        ? this.setState({
            servicebgcolor: "#0d5265",
            sersubcategoryhighlight: this.props.subcategoryhighlight,
          })
        : this.setState({
            servicebgcolor: "#f9f9f9",
            sersubcategoryhighlight: "",
          });
    }
  }

  ShowMore = (categoryName) => {
    const URLServices =
      URLConfig.get_APIHost() +
      "solr/sharepoint_index/select?fl=file,url,creation_date,rating,disclosure_level,title,id,doc_source,modified_date,file_type,description,go_to_market,service_name,service_type&fq=document_type:%22Services%22%20AND%20document_type_details:%22" +
      encodeURIComponent(categoryName) +
      "%22&indent=on&q=" +
      this.state.searckKey +
      "&&rows=10&start=0&wt=json"
      + (this.state.filters.indexOf("&fq=nda:\"True\"") === -1 ? "&fq=-nda:%22True%22" + URLConfig.GetUserRoles() : "") +
      this.state.filters;
    axios.get(URLServices).then((res) => {
      if (res.data.response) {
        this.setState({
          ServiceList: res.data.response,
          popupHeader: categoryName,
          activePage: 1,
          totalItemsCount: res.data.response.numFound,
        });
      }
    });
  };
  replaceSymbol = (symbol, string) => {
    if (string.indexOf(symbol) < 0) {
      return string;
    }
    while (string.indexOf(symbol) > -1) {
      string = string.replace(symbol, "");
    }
    string = string.replace(/;/g, " ");
    return string;
  };
  render() {
    return (
      <>
        {this.state.initialServiceList !== undefined &&
          this.state.initialServiceList.length > 0 &&
          (this.props.isServices ? (
            <div
              className="card-header catgeorybg"
              style={{ background: this.state.servicebgcolor }}
            >
              <h5 className="mb-0 in-flex">
                <button
                  className="btn btn-link btn-full collapsed fontwhite"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  data-target="#Services"
                  aria-controls="Services"
                >
                  Services
                </button>
                <span className="circle-count">
                  <span className="count-inner">{this.state.TotalCount}</span>
                </span>
              </h5>
            </div>
          ) : (
            <div
              className="card-header"
              style={{ background: this.state.servicebgcolor }}
            >
              <h5 className="mb-0 in-flex">
                <button
                  className="btn btn-link btn-full collapsed"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  data-target="#Services"
                  aria-controls="Services"
                >
                  Services
                </button>
                <span className="circle-count">
                  <span className="count-inner">{this.state.TotalCount}</span>
                </span>
              </h5>
            </div>
          ))}
        {this.state.initialServiceList !== undefined &&
          this.state.initialServiceList.length > 0 && (
            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#Services"
              aria-expanded="false"
              id="Services"
              data-parent="#accordionExample"
            >
              <div className="card-body ml-2 mr-2 mt-2">
                <div className="accordion" id="accordionServiceCategories">
                  {this.state.initialServiceList.map((list, index) => (
                    <Fragment key={index}>
                      {list.groupValue === "Education and MoC" && (
                        <EOC
                          searchTerm={this.state.searckKey}
                          filters={this.state.filters}
                          highlight={this.state.sersubcategoryhighlight}
                        />
                      )}
                      {list.groupValue !== "Education and MoC" && (
                        <>
                          <div className="card-header">
                            <h5 className="mb-0 in-flex">
                              <button
                                className="btn btn-link btn-full collapsed pt-1 pb-1"
                                type="button"
                                data-toggle="collapse"
                                aria-expanded="false"
                                data-target={"#servicesCategory" + index}
                                aria-controls="servicesCategory"
                              >
                                {list.groupValue}
                              </button>
                              <span className="circle-count-sub">
                                <span className="count-inner-sub">
                                  {list.doclist.numFound}
                                </span>
                              </span>
                            </h5>
                          </div>
                          <div
                            className="collapse"
                            aria-labelledby="headingHPSE"
                            data-parent="#accordionServiceCategories"
                            aria-expanded="false"
                            id={"servicesCategory" + index}
                          >
                            <div className="left-border card-body">
                              <div className="col-12 p-0 mb-1 ml-1 row border-bottom">
                                <table
                                  className="table table-sm table-bordered table-font-size"
                                  width="100%"
                                  cellSpacing="0"
                                  cellPadding="0"
                                  border="0"
                                  align="center"
                                >
                                  <thead>
                                    <TableFilter
                                      onFilterUpdate={this._filterUpdated}
                                    >
                                      <th
                                        className="cell servicetbheadersnoborderrad"
                                        casesensitive={"false"}
                                        showsearch={"false"}
                                        width="15%"
                                      >
                                        Service Name
                                      </th>
                                      <th
                                        className="cell servicetbheadersnoborderrad"
                                        width="15%"
                                      >
                                        Description
                                      </th>
                                      <th
                                        className="cell servicetbheadersnoborderrad"
                                        alignleft={"true"}
                                        width="15%"
                                      >
                                        Service Type
                                      </th>
                                      <th
                                        className="cell servicetbheadersnoborderrad"
                                        alignleft={"true"}
                                        width="15%"
                                      >
                                        Go to Market
                                      </th>
                                      <th
                                        className="cell servicetbheadersnoborderrad"
                                        alignleft={"true"}
                                        width="15%"
                                      >
                                        Added (UTC)
                                      </th>
                                      <th
                                        className="cell servicetbheadersnoborderrad"
                                        alignleft={"true"}
                                        width="15%"
                                      >
                                        Service Datasheet
                                      </th>
                                    </TableFilter>
                                  </thead>
                                  <tbody>
                                    {list.doclist.docs.map(
                                      (doclist, index) =>
                                        index < 4 && (
                                          <>
                                            <tr>
                                              <td>{doclist.service_name}</td>
                                              <td>{doclist.description}</td>
                                              <td>
                                                {doclist.service_type &&
                                                  this.replaceSymbol(
                                                    "#",
                                                    doclist.service_type
                                                  )}
                                              </td>
                                              <td>{doclist.go_to_market}</td>
                                              <td>
                                                {this.formatDate(
                                                  doclist.creation_date
                                                )}
                                              </td>
                                              <td>
                                                <a
                                                  href={doclist.url}
                                                  className="breakall_word fileurl"
                                                  target="_blank"
                                                  rel="noreferrer"
                                                >
                                                  Datasheet
                                                </a>
                                              </td>
                                            </tr>
                                          </>
                                        )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              {list.doclist.docs.length > 4 && (
                                <div className="col-12 pt-2 pb-4 more-wrapper mb-1 ml-1">
                                  <i className="fas fa-arrow-right float-right mr-3 pointer"></i>
                                  <b
                                    className="float-right mr-1 pointer"
                                    data-toggle="modal"
                                    data-target="#ServicesMore"
                                    onClick={() => {
                                      this.ShowMore(list.groupValue);
                                    }}
                                  >
                                    More
                                  </b>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        <div
          className="modal fade"
          id="ServicesMore"
          role="dialog"
          aria-labelledby="deploymentModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deploymentModalLabel">
                  {this.state.popupHeader}
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
                ref={this.serviceRef}
              >
                {this.state.ServiceList.docs &&
                  this.state.ServiceList.docs.length > 0 && (
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
                  )}

                {this.state.ServiceList.docs &&
                  this.state.ServiceList.docs.length > 0 && (
                    // this.state.ServiceList.docs.map((doclist,index) =>
                    <div className="col-12 p-0 mb-1 ml-1 row border-bottom">
                      <table
                        className="table table-sm table-bordered table-font-size"
                        width="100%"
                        cellSpacing="0"
                        cellPadding="0"
                        border="0"
                        align="center"
                      >
                        <thead>
                          <TableFilter onFilterUpdate={this._filterUpdated}>
                            <th
                              className="cell servicetbheadersnoborderrad"
                              casesensitive={"false"}
                              showsearch={"false"}
                              width="15%"
                            >
                              Service Name
                            </th>
                            <th
                              className="cell servicetbheadersnoborderrad"
                              width="15%"
                            >
                              Description
                            </th>
                            <th
                              className="cell servicetbheadersnoborderrad"
                              alignleft={"true"}
                              width="15%"
                            >
                              Service Type
                            </th>
                            <th
                              className="cell servicetbheadersnoborderrad"
                              alignleft={"true"}
                              width="15%"
                            >
                              Go to Market
                            </th>
                            <th
                              className="cell servicetbheadersnoborderrad"
                              alignleft={"true"}
                              width="15%"
                            >
                              Added (UTC)
                            </th>
                            <th
                              className="cell servicetbheadersnoborderrad"
                              alignleft={"true"}
                              width="15%"
                            >
                              Service Datasheet
                            </th>
                          </TableFilter>
                        </thead>
                        <tbody>
                          {this.state.ServiceList.docs.map((doclist, index) => (
                            <>
                              <tr>
                                <td>{doclist.service_name}</td>
                                <td>{doclist.description}</td>
                                <td>
                                  {doclist.service_type &&
                                    this.replaceSymbol(
                                      "#",
                                      doclist.service_type
                                    )}
                                </td>
                                <td>{doclist.go_to_market}</td>
                                <td>
                                  {this.formatDate(doclist.creation_date)}
                                </td>
                                <td>
                                  <a
                                    href={doclist.url}
                                    className="breakall_word fileurl"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Datasheet
                                  </a>
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                {this.state.ServiceList.docs &&
                  this.state.ServiceList.docs.length > 0 && (
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
                  )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Services;
