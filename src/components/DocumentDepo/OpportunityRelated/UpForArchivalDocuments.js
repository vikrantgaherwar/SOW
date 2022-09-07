import React, { Component, Fragment } from "react";
import _ from "lodash";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import Pagination from "react-js-pagination";

class UpForArchivalDocuments extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      OppId: "",
      filesMetaData: [],
      MasterData: null,
      roleList: [],
      selectedValue: [],
      isLoading: false,
      upforarchivalCountPerPage: 10,
      upforarchivalactivePage: 1,
      upforarchival_documents: [],
    };
  }
  componentDidMount() {
    const OppId = this.props.oppId;
    const InProgressList = this.props.docs;
    this.setState({ OppId, InProgressList }, () => this.paginate());
    if (this.props.MasterData.geoRegions) {
      this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
        this.modifyGeoRegionData()
      );
    }
  }
  paginate = () => {
    const pageSize = this.state.upforarchivalCountPerPage;
    this.setState({
      upforarchival_documents: this.state.InProgressList.slice(0, pageSize),
      TotalCount: this.state.InProgressList.length,
      upforarchivaltotalCount: this.state.InProgressList.length,
    });
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.InProgressList;
    const begin =
      pageNumber * this.state.upforarchivalCountPerPage -
      this.state.upforarchivalCountPerPage;
    const end =
      pageNumber * this.state.upforarchivalCountPerPage >
      this.state.InProgressList.length
        ? this.state.InProgressList.length
        : pageNumber * this.state.upforarchivalCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({
      upforarchivalactivePage: pageNumber,
      upforarchival_documents: list,
    });
  };
  modifyGeoRegionData = () => {
    const transformedObject = {};
    transformedObject.isTouched = false;
    let data = [...this.state.geoRegions];

    let regionsObject = _.groupBy(data, "region");
    let regions = Object.keys(regionsObject);

    let regionsWithCheckBoxValue = regions.map((r) => {
      return { regionName: r, isChecked: true };
    });

    transformedObject.regions = regionsWithCheckBoxValue;

    for (let i = 0; i < transformedObject.regions.length; ++i) {
      let sameRegions = data.filter((c) => {
        return c.region === regions[i];
      });

      let clustersObject = _.groupBy(sameRegions, "cluster");
      let clusters = Object.keys(clustersObject);

      let clustersWithCheckBoxValue = clusters.map((c) => {
        return {
          clusterName: c,
          isChecked: true,
          countries: clustersObject[c].map((country) => {
            return { ...country, isChecked: true };
          }),
        };
      });

      transformedObject.regions[i].clusters = clustersWithCheckBoxValue;
    }
    this.setState({ geoRegionData: transformedObject });
  };

  showMetaInfoPopUp = (data) => {
    this.setState({ SelectedDoc: data });
  };
  render() {
    const MasterData = this.props.MasterData;
    return (
      <Fragment>
        {this.state.InProgressList && (
          <Fragment>
            <div className="col-12 mt-3">
              <table
                className="table table-striped table-bordered"
                width="100%"
              >
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none tab-background">
                      <strong>Opportunities</strong>
                    </td>
                    <td className="border-none tab-background" width="50%">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Planned Shelf Life (UTC)</strong>
                    </td>
                  </tr>
                  {this.state.upforarchival_documents.map((value, index) => (
                    <tr key={index}>
                      <td className="pt-2">{value.oppId}</td>
                      <td className="pt-2">
                        {
                          <a
                            className={identifyFileFormat(
                              value.name.toLowerCase()
                            )}
                          ></a>
                        }
                        <a>{value.name}</a>
                      </td>
                      <td className="pt-2">
                        {formatDate(
                          value.deltaDocumentDetails[0].plannedShelfLife
                        )}
                      </td>
                    </tr>
                  ))}
                  {this.state.InProgressList &&
                    this.state.InProgressList.length > 10 &&
                    this.state.upforarchival_documents.length > 0 && (
                      <tr>
                        <td colSpan="5">
                          <div className="text-center">
                            <Pagination
                              prevPageText="<"
                              nextPageText=">"
                              firstPageText="<<"
                              lastPageText=">>"
                              activePage={this.state.upforarchivalactivePage}
                              itemsCountPerPage={
                                this.state.upforarchivalCountPerPage
                              }
                              totalItemsCount={
                                this.state.upforarchivaltotalCount
                              }
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
          </Fragment>
        )}
      </Fragment>
    );
  }
}
export default UpForArchivalDocuments;
