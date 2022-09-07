import React, { Fragment } from "react";
import Pagination from "react-js-pagination";
import { JsonToExcel } from "react-json-excel";
import Cookies from "js-cookie";
import TrackingService from "./TrackingService";
class SKUList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialList: [],
      groupData: [],
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      searchTerm: "",
      applySearch: false,
    };
  }

  // GroupBy Logic:
  groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      // get the nested propert value
      const objKey = this.nestedObjectByString(currentValue, key);
      result[objKey] = (result[objKey] || []).concat(currentValue);
      return result;
    }, {});
  };

  // return value of nested property of an object
  nestedObjectByString = (obj, key) => {
    key = key.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    key = key.replace(/^\./, ""); // strip a leading dot
    const a = key.split(".");
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i];
      if (k in obj) {
        obj = obj[k];
      } else {
        return;
      }
    }
    return obj;
  };

  OnClickMore = (GroupName) => {
    const data = this.state.groupData.filter(
      (x) => x[0].service_type === GroupName
    )[0];
    const pageSize = this.state.itemsCountPerPage;
    this.setState({
      skuList: data.slice(0, pageSize),
      totalItemsCount: data.length,
      activePage: 1,
      pageData: data,
    });
  };

  componentDidMount() {
    var data = this.props.data.map((e, index) => {
      return Object.assign(
        {
          status:
            new Date(e.End_of_Support_Date) > new Date() ? "Active" : "Retired",
        },
        e
      );
    });
    data = data.map((e, index) => {
      return Object.assign({ SKU_XL: e.sku.replace(/,/g, "|").trim() }, e);
    });
    const groupData = Object.values(this.groupBy(data, "service_type"));
    this.setState({
      skuList: [],
      initialList: data,
      // totalItemsCount: this.props.data.length,
      groupData: groupData,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      var data = this.props.data.map((item) =>
        Object.assign(
          {
            status:
              new Date(item.End_of_Support_Date) > new Date()
                ? "Active"
                : "Retired",
          },
          item
        )
      );
      data = data.map((e) =>
        Object.assign({ SKU_XL: e.sku.replace(/,/g, "|").trim() }, e)
      );
      const groupData = Object.values(this.groupBy(data, "service_type"));
      this.setState({
        // skuList: [],
        initialList: data,
        // totalItemsCount: this.props.data.length,
        groupData: groupData,
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
    const list = this.state.pageData.slice(begin, end);
    this.setState({ activePage: pageNumber, skuList: list });
  };

  handleSearch = (evt) => {
    const searchKey = evt.target.value.trim();
    this.setState({
      searchTerm: searchKey,
    });
    if (searchKey.length > 2) {
      const IdLength = this.state.initialList[0].sku.length;
      if (searchKey.length < IdLength) {
        const filterArray = this.state.initialList.filter(
          (x) => x.sku.indexOf(searchKey) !== -1
        );
        if (filterArray.length > 0) {
          this.setState({ skuList: filterArray, applySearch: true });
        } else {
          this.setState({ skuList: [], applySearch: true });
        }
      } else {
        const filterArray = this.state.initialList.filter(
          (x) => x.sku === searchKey
        );
        if (filterArray.length > 0) {
          this.setState({ skuList: filterArray, applySearch: true });
        } else {
          this.setState({ skuList: [], applySearch: true });
        }
      }
    }
    if (searchKey.length === 0) {
      this.setState({ applySearch: false });
      this.handlePageChange(this.state.activePage);
    }
  };

  logDocClick = (docLink) => {
    this.TrackingService.OpenLink(Cookies.get("empnumber"), docLink);
  };

  handleArrowClass = (index) => {
    let id = document.querySelector("#arrow" + index);
    id.className === "fas fa-arrow-circle-right pl-4"
      ? (id.className = "fas fa-arrow-circle-down pl-4 text-success")
      : (id.className = "fas fa-arrow-circle-right pl-4");
  };

  handleListArrowClass = (index) => {
    let id = document.querySelector("#listarrow" + index);
    id.className === "fas fa-arrow-circle-right pl-4"
      ? (id.className = "fas fa-arrow-circle-down pl-4 text-success")
      : (id.className = "fas fa-arrow-circle-right pl-4");
  };

  render() {
    const className = "export-button",
      filename = "SKU",
      fields = {
        SKU_XL: "SKU",
        sku_description: "SKU Description",
        service_type: "Service Type",
        status: "SKU Status",
        url: "Data Sheet",
        sdg_url: "SDG",
      },
      style = {
        padding: "5px",
        marginBottom: "5px",
      };
    return (
      <>
        {this.state.initialList !== undefined &&
          this.state.initialList.length > 0 && (
            <div className="card-header">
              <h5 className="mb-0 in-flex">
                <button
                  className="btn btn-link btn-full collapsed"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  data-target="#SKU"
                  aria-controls="SKU"
                >
                  SKU
                </button>
                <span className="circle-count">
                  <span className="count-inner">
                    {this.state.initialList.length}
                  </span>
                </span>
              </h5>
            </div>
          )}
        {this.state.initialList !== undefined &&
          this.state.initialList.length > 0 && (
            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#SKU"
              aria-expanded="false"
              id="SKU"
              data-parent="#accordionExample"
            >
              <div className="card-body ml-2 mr-2 mt-2">
                <div className="accordion" id="accordionSKUCategories">
                  {this.state.groupData.map((list, index) => (
                    <Fragment key={index}>
                      <div className="card-header">
                        <h5 className="mb-0 in-flex">
                          <button
                            className="btn btn-link btn-full collapsed pt-1 pb-1"
                            type="button"
                            data-toggle="collapse"
                            aria-expanded="false"
                            data-target={"#skuCategory" + index}
                            aria-controls="SKUCategory"
                          >
                            {list[0].service_type}
                          </button>
                          <span className="circle-count-sub">
                            <span className="count-inner-sub">
                              {list.length}
                            </span>
                          </span>
                        </h5>
                      </div>
                      <div
                        className="collapse"
                        aria-labelledby="headingHPSE"
                        data-parent="#accordionSKUCategories"
                        aria-expanded="false"
                        id={"skuCategory" + index}
                      >
                        <div className="card-body ml-2 mr-2 mt-2">
                          <table
                            id="skusdg"
                            className="table table-bordered"
                            width="1%"
                          >
                            <tbody>
                              <tr>
                                <th width="75">SKU</th>
                                <th>SKU Description</th>
                                <th width="100">SKU Status</th>
                                <th>Documents</th>
                              </tr>
                              {list.map(
                                (sublist, index) =>
                                  index < 10 && (
                                    <Fragment key={index}>
                                      <tr
                                        colSpan="5"
                                        data-toggle="collapse"
                                        data-target={"#sku" + index}
                                        className="accordion-toggle"
                                        aria-expanded="true"
                                        key={index}
                                      >
                                        <td
                                          title={
                                            sublist.document.toLowerCase() ===
                                              "sdg" &&
                                            "Click here to get options to navigate to SDG Bookmarks."
                                          }
                                        >
                                          {sublist.sku}
                                        </td>
                                        <td
                                          title={
                                            sublist.document.toLowerCase() ===
                                              "sdg" &&
                                            "Click here to get options to navigate to SDG Bookmarks."
                                          }
                                        >
                                          {sublist.sku_description}
                                        </td>
                                        <td
                                          title={
                                            sublist.document.toLowerCase() ===
                                              "sdg" &&
                                            "Click here to get options to navigate to SDG Bookmarks."
                                          }
                                        >
                                          {new Date(
                                            sublist.End_of_Support_Date
                                          ) > new Date() ? (
                                            <p className="text-success">
                                              Active
                                            </p>
                                          ) : (
                                            <p className="text-danger">
                                              Retired
                                            </p>
                                          )}
                                        </td>
                                        <td>
                                          {sublist.url && (
                                            <a
                                              href={sublist.url}
                                              target="_blank"
                                              //   onClick={() =>
                                              //     this.logDocClick(sublist.url)
                                              //   }
                                            >
                                              {sublist.document_type}
                                              <br />
                                            </a>
                                          )}
                                          <a
                                            href={sublist.sdg_url}
                                            target="_blank"
                                          >
                                            {sublist.document}
                                          </a>

                                          {sublist.document !== "" && (
                                            <i
                                              className="fas fa-arrow-circle-right pl-4"
                                              id={"arrow" + index}
                                              onClick={() =>
                                                this.handleArrowClass(index)
                                              }
                                            ></i>
                                          )}
                                        </td>
                                      </tr>
                                      {sublist.document.toLowerCase() ===
                                        "sdg" &&
                                        sublist.sdg_url && (
                                          <tr className="p">
                                            <td
                                              colSpan="5"
                                              className="hiddenRow"
                                            >
                                              <div
                                                id={"sku" + index}
                                                aria-expanded="true"
                                                className="accordian-body p-1 collapse"
                                              >
                                                <div>
                                                  <strong>
                                                    Choose the desired options
                                                    to be redirected to SDG
                                                  </strong>
                                                </div>
                                                <div className="row col-12 m-0 p-1">
                                                  <div className="pt-2 pb-2">
                                                    <a
                                                      href={
                                                        sublist.sdg_url +
                                                        "#ServiceInformation_Deliverables"
                                                      }
                                                      target="_blank"
                                                      className="styledAnchor"
                                                    >
                                                      <i
                                                        className="fa fa-hourglass-end iColor"
                                                        aria-hidden="true"
                                                      ></i>
                                                      &nbsp;Deliverables &nbsp;
                                                    </a>
                                                  </div>
                                                  <div className="pl-1 pt-2 pb-2">
                                                    <a
                                                      href={
                                                        sublist.sdg_url +
                                                        "#ServiceInformation_Pre-requisites"
                                                      }
                                                      target="_blank"
                                                      className="styledAnchor"
                                                    >
                                                      <i
                                                        className="fa fa-question-circle iColor"
                                                        aria-hidden="true"
                                                      ></i>
                                                      &nbsp; Pre-requisites
                                                      &nbsp;
                                                    </a>
                                                  </div>
                                                  <div className="pl-1 pt-2 pb-2">
                                                    <a
                                                      href={
                                                        sublist.sdg_url +
                                                        "#Readiness_Skills"
                                                      }
                                                      target="_blank"
                                                      className="styledAnchor"
                                                    >
                                                      <i
                                                        className="fa fa-certificate iColor"
                                                        aria-hidden="true"
                                                      ></i>
                                                      &nbsp; Skills &nbsp;
                                                    </a>
                                                  </div>
                                                  <div className="pl-1 pt-2 pb-2">
                                                    <a
                                                      href={
                                                        sublist.sdg_url +
                                                        "#Readiness_Training"
                                                      }
                                                      target="_blank"
                                                      className="styledAnchor"
                                                    >
                                                      <i
                                                        className="fa fa-book iColor"
                                                        aria-hidden="true"
                                                      />
                                                      &nbsp;Training &nbsp;
                                                    </a>
                                                  </div>
                                                  <div className="pl-1 pt-2 pb-2">
                                                    <a
                                                      href={
                                                        sublist.sdg_url +
                                                        "#DeliveryTasks"
                                                      }
                                                      target="_blank"
                                                      className="styledAnchor"
                                                    >
                                                      <i
                                                        className="fa fa-upload iColor"
                                                        aria-hidden="true"
                                                      />
                                                      &nbsp; Delivery Tasks
                                                      &nbsp;
                                                    </a>
                                                  </div>
                                                  <div className="pl-1 pt-2 pb-2">
                                                    <a
                                                      href={
                                                        sublist.sdg_url +
                                                        "#Reference_Contacts"
                                                      }
                                                      target="_blank"
                                                      className="styledAnchor"
                                                    >
                                                      <i
                                                        className="fa fa-address-book iColor"
                                                        aria-hidden="true"
                                                      />
                                                      &nbsp; Contacts &nbsp;
                                                    </a>
                                                  </div>
                                                  <div className="pl-1 pt-2 pb-2">
                                                    <a
                                                      href={
                                                        sublist.sdg_url +
                                                        "#Readiness_Tools"
                                                      }
                                                      target="_blank"
                                                      className="styledAnchor"
                                                    >
                                                      <i
                                                        className="fa fa-cogs iColor"
                                                        aria-hidden="true"
                                                      />
                                                      &nbsp; Tools
                                                    </a>
                                                  </div>
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                    </Fragment>
                                  )
                              )}
                              <tr>
                                <td colSpan="5">
                                  {list.length > 10 && (
                                    <div className="col-12 p-2 mb-2 more-wrapper">
                                      <i className="fas fa-arrow-right float-right mr-3 pointer" />
                                      <b
                                        className="float-right mr-1 pointer"
                                        data-toggle="modal"
                                        data-target="#skuMore"
                                        onClick={() =>
                                          this.OnClickMore(list[0].service_type)
                                        }
                                      >
                                        More
                                      </b>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        <div
          className="modal fade"
          id="skuMore"
          role="dialog"
          aria-labelledby="deploymentModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog sku-data-modal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deploymentModalLabel">
                  SKU
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body document-data-modal">
                {this.state.initialList !== undefined &&
                  this.state.initialList.length > 0 && (
                    <>
                      <input
                        type="text"
                        placeholder="Search SKU"
                        value={this.state.searchTerm}
                        onChange={(evt) => this.handleSearch(evt)}
                      />
                      <JsonToExcel
                        data={this.state.initialList}
                        className={className}
                        filename={filename}
                        fields={fields}
                        style={style}
                      />
                    </>
                  )}
                <table
                  className="table table-sm table-bordered"
                  width="100%"
                  cellSpacing="0"
                  cellPadding="0"
                  border="0"
                >
                  <tbody>
                    <tr>
                      <th>SKU</th>
                      <th width="50%">SKU Description</th>
                      <th>Service Type</th>
                      <th>SKU Status</th>
                      <th>Documents</th>
                    </tr>
                    {this.state.skuList !== undefined &&
                      this.state.skuList.map((list, index) => (
                        <>
                          <tr
                            data-toggle="collapse"
                            className="accordion-toggle"
                            aria-expanded="true"
                            data-target={"#popupsku" + index}
                            key={index}
                          >
                            <td
                              title={
                                list.document.toLowerCase() === "sdg" &&
                                "Click here to get options to navigate to SDG Bookmarks."
                              }
                            >
                              {list.sku}
                            </td>
                            <td
                              title={
                                list.document.toLowerCase() === "sdg" &&
                                "Click here to get options to navigate to SDG Bookmarks."
                              }
                            >
                              {list.sku_description}
                            </td>
                            <td
                              title={
                                list.document.toLowerCase() === "sdg" &&
                                "Click here to get options to navigate to SDG Bookmarks."
                              }
                            >
                              {list.service_type}
                            </td>
                            <td
                              title={
                                list.document.toLowerCase() === "sdg" &&
                                "Click here to get options to navigate to SDG Bookmarks."
                              }
                            >
                              {new Date(list.End_of_Support_Date) >
                              new Date() ? (
                                <span className="text-success">Active</span>
                              ) : (
                                <span className="text-danger">Retired</span>
                              )}
                            </td>
                            <td>
                              {list.url !== undefined ? (
                                <a
                                  href={list.url}
                                  target="_blank"
                                  // onClick={() => this.logDocClick(list.url)}
                                >
                                  {list.document_type}
                                </a>
                              ) : (
                                ""
                              )}
                              {list.sdg_url !== "" ? (
                                <>
                                  <a href={list.sdg_url} target="_blank">
                                    {" "}
                                    | {list.document}
                                  </a>
                                  {list.document !== "" && (
                                    <i
                                      className="fas fa-arrow-circle-right pl-4"
                                      id={"listarrow" + index}
                                      onClick={() =>
                                        this.handleListArrowClass(index)
                                      }
                                    ></i>
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                          {list.document.toLowerCase() === "sdg" && (
                            <tr className="p">
                              <td colSpan="5" className="hiddenRow">
                                <div
                                  id={"popupsku" + index}
                                  aria-expanded="true"
                                  className="accordian-body p-1 collapse"
                                >
                                  <div>
                                    <strong>
                                      Choose the desired options to be
                                      redirected to SDG
                                    </strong>
                                  </div>
                                  <div className="row col-12">
                                    <div className="pl-1 pt-2 pb-2">
                                      <a
                                        href={
                                          list.sdg_url +
                                          "#ServiceInformation_Deliverables"
                                        }
                                        target="_blank"
                                        className="styledAnchor"
                                      >
                                        <i
                                          className="fa fa-hourglass-end iColor"
                                          aria-hidden="true"
                                        ></i>
                                        &nbsp;Deliverables &nbsp;
                                      </a>
                                    </div>
                                    <div className="pl-1 pt-2 pb-2">
                                      <a
                                        href={
                                          list.sdg_url +
                                          "#ServiceInformation_Pre-requisites"
                                        }
                                        target="_blank"
                                        className="styledAnchor"
                                      >
                                        <i
                                          className="fa fa-question-circle iColor"
                                          aria-hidden="true"
                                        ></i>
                                        &nbsp; Pre-requisites &nbsp;
                                      </a>
                                    </div>
                                    <div className="pl-1 pt-2 pb-2">
                                      <a
                                        href={
                                          list.sdg_url + "#Readiness_Skills"
                                        }
                                        target="_blank"
                                        className="styledAnchor"
                                      >
                                        <i
                                          className="fa fa-certificate iColor"
                                          aria-hidden="true"
                                        ></i>
                                        &nbsp; Skills &nbsp;
                                      </a>
                                    </div>
                                    <div className="pl-1 pt-2 pb-2">
                                      <a
                                        href={
                                          list.sdg_url + "#Readiness_Training"
                                        }
                                        target="_blank"
                                        className="styledAnchor"
                                      >
                                        <i
                                          className="fa fa-book iColor"
                                          aria-hidden="true"
                                        />
                                        &nbsp;Training &nbsp;
                                      </a>
                                    </div>
                                    <div className="pl-1 pt-2 pb-2">
                                      <a
                                        href={list.sdg_url + "#DeliveryTasks"}
                                        target="_blank"
                                        className="styledAnchor"
                                      >
                                        <i
                                          className="fa fa-upload iColor"
                                          aria-hidden="true"
                                        />
                                        &nbsp; Delivery Tasks &nbsp;
                                      </a>
                                    </div>
                                    <div className="pl-1 pt-2 pb-2">
                                      <a
                                        href={
                                          list.sdg_url + "#Reference_Contacts"
                                        }
                                        target="_blank"
                                        className="styledAnchor"
                                      >
                                        <i
                                          className="fa fa-address-book iColor"
                                          aria-hidden="true"
                                        />
                                        &nbsp; Contacts &nbsp;
                                      </a>
                                    </div>
                                    <div className="pl-1 pt-2 pb-2">
                                      <a
                                        href={list.sdg_url + "#Readiness_Tools"}
                                        target="_blank"
                                        className="styledAnchor"
                                      >
                                        <i
                                          className="fa fa-cogs iColor"
                                          aria-hidden="true"
                                        />
                                        &nbsp; Tools
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    {this.state.applySearch && this.state.skuList.length === 0 && (
                      <tr>
                        <td colSpan="5">No Results Found</td>
                      </tr>
                    )}
                    {!this.state.applySearch && (
                      <tr>
                        <td colSpan="6">
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
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default SKUList;
