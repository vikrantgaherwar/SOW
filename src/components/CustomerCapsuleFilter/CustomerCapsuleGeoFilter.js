import React, { Fragment } from "react";
import axios from "axios";
import _ from "lodash";
import URLConfig from "../URLConfig";

class CustomerCapsuleFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      geoData: [],
      Regions: [],
      AllGeoRegionsSelected: false,
      AllGeoindeterminate: false,
      AllCountriesSelected: false,
      AllCountriesIndeterminate: false,
      isCheckedCC: false,
      indeterminate: false,
    };
  }
  componentDidMount() {
    this.getGeoData(this.props.AccountId);
  }
  componentDidUpdate(prevProps) {
    if (this.props.AccountId !== prevProps.AccountId) {
      this.getGeoData(this.props.AccountId);
    }
  }

  getGeoData = (accountid) => {
    var stid = accountid.replace("Account.Account_ST_ID__c%20=%20%27", "");
    const geourl =
      "https://hpedelta.com:5003/services/data/account/account_id?q=" + stid;
    const config = URLConfig.ApplyAuth(geourl);
    axios(config).then((res) => {
      if (res.data) {
        this.setState({ geoData: res.data.response }, () =>
          this.getFilteredRegionData()
        );
      }
    });
  };
  getFilteredRegionData = () => {
    var Data = this.state.geoData;
    const isCheckedCC = false;
    Data = Data.map((v, i) => {
      return Object.assign({}, v, {
        isCheckedCC,
      });
    });
    Data = _.sortBy(Data, "country");

    var grps = _(Data)
      .groupBy((x) => x.WorldRegion_Region__c)
      .map((value, key) => ({
        region: key,
        data: value,
        isCheckedCC: false,
        indeterminate: false,
      }))
      .value();
    var grpsByCCCluster = [];
    grps.map((value, index) => {
      var clusterArray = _(value.data)
        .groupBy((x) => x.WorldRegion_SubRegion1__c)
        .map((value, key) => ({
          cluster: key,
          data: value,
          isCheckedCC: false,
          indeterminate: false,
        }))
        .value();
      clusterArray = _.sortBy(clusterArray, "cluster");
      grpsByCCCluster.push({
        region: value.region,
        data: clusterArray,
        isCheckedCC: false,
        indeterminate: false,
      });
    });
    grpsByCCCluster = _.sortBy(grpsByCCCluster, "region");
    this.setState({
      Regions: grpsByCCCluster,
      AllGeoRegionsSelected: false,
      GeoRegionsGeoDefaultData: Data,
      FormattedGeoRegionsDefault: grpsByCCCluster,
      isCheckedCC: false,
      indeterminate: false,
    });
  };
  OnCountryCheckboxValueChange(checkName, level, Checked) {
    const isCheckedCC = Checked;
    var GeofilteredData;
    var GeoDefaultData = this.state.GeoRegionsGeoDefaultData;
    if (level === "country") {
      GeofilteredData = GeoDefaultData.map((v, i) => {
        if (v.Country_Code__c == checkName) {
          return Object.assign({}, v, {
            isCheckedCC,
          });
        }
        return v;
      });
    } else if (level === "cluster") {
      GeofilteredData = GeoDefaultData.map((v, i) => {
        if (v.WorldRegion_SubRegion1__c == checkName) {
          return Object.assign({}, v, {
            isCheckedCC,
          });
        }
        return v;
      });
    } else if (level === "region" || level == "all") {
      GeofilteredData = GeoDefaultData.map((v, i) => {
        if (level === "region" && v.WorldRegion_Region__c == checkName) {
          return Object.assign({}, v, {
            isCheckedCC,
          });
        } else if (level === "all") {
          return Object.assign({}, v, {
            isCheckedCC,
          });
        }
        return v;
      });
    }
    var grps = _(GeofilteredData)
      .groupBy((x) => x.WorldRegion_Region__c)
      .map((value, key) => ({ region: key, data: value }))
      .value();
    var grpsByCCCluster = [];
    grps.map((value, index) => {
      var clusterArray = _(value.data)
        .groupBy((x) => x.WorldRegion_SubRegion1__c)
        .map((value, key) => ({
          cluster: key,
          data: value,
          isCheckedCC:
            value.findIndex((item) => item.isCheckedCC === false) === -1,
          indeterminate:
            value.filter((x) => x.isCheckedCC == true).length > 0 &&
            value.filter((x) => x.isCheckedCC == true).length < value.length,
        }))
        .value();
      clusterArray = _.sortBy(clusterArray, "cluster");
      grpsByCCCluster.push({
        region: value.region,
        data: clusterArray,
        isCheckedCC:
          clusterArray.findIndex((item) => item.isCheckedCC === false) === -1,
        indeterminate:
          clusterArray.filter(
            (x) => x.indeterminate == true || x.isCheckedCC == true
          ).length > 0 &&
          clusterArray.filter((x) => x.isCheckedCC == true).length <
            clusterArray.length,
      });
    });
    grpsByCCCluster = _.sortBy(grpsByCCCluster, "region");
    this.setState(
      {
        Regions: grpsByCCCluster,
        GeoRegionsGeoDefaultData: GeofilteredData,
        AllGeoRegionsSelected:
          grpsByCCCluster.findIndex((item) => item.isCheckedCC === false) ===
          -1,
        AllGeoindeterminate:
          grpsByCCCluster.filter(
            (x) => x.indeterminate === true || x.isCheckedCC === true
          ).length > 0 &&
          grpsByCCCluster.filter((x) => x.isCheckedCC == true).length <
            grpsByCCCluster.length,
      },
      () => {
        this.props.UpdateCCFilters(false);

        let countries = "";
        if (this.state.AllGeoRegionsSelected) {
          countries = "All";
        } else {
          var SelectedRegions = grpsByCCCluster.filter(
            (x) => x.isCheckedCC == true || x.indeterminate == true
          );
          for (let i = 0; i < SelectedRegions.length; i++) {
            if (i > 0) {
              countries += " | ";
            }
            var element = SelectedRegions[i];
            countries += "<b>" + element.region + "</b> > ";
            if (
              element.data.length ===
              element.data.filter((x) => x.isCheckedCC == true).length
            ) {
              countries += "All  ";
              continue;
            }
            const Clusters = element.data.filter(
              (x) => x.isCheckedCC == true || x.indeterminate == true
            );
            for (let j = 0; j < Clusters.length; j++) {
              if (j > 0) {
                countries += ", ";
              }
              var cluster = Clusters[j];
              countries += cluster.cluster + "> ";
              if (
                cluster.data.length ===
                cluster.data.filter((x) => x.isCheckedCC == true).length
              ) {
                countries += "All  ";
                continue;
              }
              var SelectedCountries = cluster.data
                .filter((x) => x.isCheckedCC == true)
                .map((x) => x.country)
                .join(", ");
              countries += SelectedCountries;
            }
          }
        }
        this.props.OnCCGeoChange(countries);
      }
    );
  }
  render() {
    return (
      <Fragment>
        <div className="card mb-1" align="left">
          <h5 className="mb-0 cc_cardbg">
            <button
              className="btn custom-btn btn-full pt-0 pb-0 collapsed"
              type="button"
              data-toggle="collapse"
              aria-expanded="false"
              data-target="#cclocalization"
              aria-controls="cclocalization"
            >
              LOCALIZATION
            </button>
          </h5>
          <div
            className="collapse"
            aria-labelledby="cclocalization"
            data-parent="#customercapsule_accordion"
            aria-expanded="false"
            id="cclocalization"
          >
            <div className="card-body ml-1 mr-0 mt-2">
              <div
                className="collapse show"
                aria-labelledby="cclocalization"
                data-parent="#cclocalization"
                aria-expanded="false"
                id="cclocalizationItems"
              >
                <div className="card-body ml-1 mr-1 mt-2">
                  <div className="accordion" id="cclocalizationsubcategorygeo">
                    {this.state.Regions && this.state.Regions.length > 0 && (
                      <div className="card mb-1 ccoverflow" align="left">
                        <h5 className="mb-0 ml-2 in-flex cardBorder">
                          <input
                            type="checkbox"
                            checked={this.state.AllGeoRegionsSelected}
                            ref={(el) =>
                              el &&
                              (el.indeterminate = this.state.AllGeoindeterminate)
                            }
                            className="ml-2 mt-1 inputclass"
                            onChange={(e) =>
                              this.OnCountryCheckboxValueChange(
                                "all",
                                "all",
                                e.target.checked
                              )
                            }
                          />
                          <button
                            className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                            type="button"
                            data-toggle="collapse"
                            aria-expanded="false"
                            aria-controls="ccgeographyfilter"
                            data-target="#ccgeographyfilter"
                          >
                            Geography
                          </button>
                        </h5>
                        <div
                          className="collapse"
                          aria-labelledby="cclocalization"
                          aria-expanded="false"
                          id="ccgeographyfilter"
                          data-parent="#cclocalizationsubcategorygeo"
                        >
                          <div className="selections_container col pr-1 pl-0">
                            {this.state.Regions &&
                              this.state.Regions.length > 0 &&
                              this.state.Regions.map((value, index) => (
                                <div className="card" align="left" key={index}>
                                  <h5 className="mb-0 ml-3 pl-1 in-flex cardBorder">
                                    <input
                                      type="checkbox"
                                      checked={value.isCheckedCC}
                                      ref={(el) =>
                                        el &&
                                        (el.indeterminate = value.indeterminate)
                                      }
                                      className="ml-2 mt-1 inputclass"
                                      name="georegion"
                                      onChange={(e) =>
                                        this.OnCountryCheckboxValueChange(
                                          value.region,
                                          "region",
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <button
                                      className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                                      type="button"
                                      data-toggle="collapse"
                                      aria-expanded="false"
                                      aria-controls={"ccgeoams" + index}
                                      data-target={"#ccgeoams" + index}
                                    >
                                      {value.region}
                                    </button>
                                  </h5>
                                  <div
                                    className="collapse"
                                    aria-labelledby="cclocalization"
                                    data-parent="#ccgeographyfilter"
                                    aria-expanded="false"
                                    id={"ccgeoams" + index}
                                  >
                                    <div className="selections_container col pr-1 pl-0">
                                      {value.data.map((v, i) => (
                                        <div
                                          className="card mb-1"
                                          align="left"
                                          key={i}
                                        >
                                          <h5 className="mb-0 ml-4 pl-2 in-flex cardBorder">
                                            <input
                                              type="checkbox"
                                              checked={v.isCheckedCC}
                                              ref={(el) =>
                                                el &&
                                                (el.indeterminate =
                                                  v.indeterminate)
                                              }
                                              name="geocluster"
                                              className="ml-2 mt-1 inputclass"
                                              onChange={(e) =>
                                                this.OnCountryCheckboxValueChange(
                                                  v.cluster,
                                                  "cluster",
                                                  e.target.checked
                                                )
                                              }
                                            />
                                            <button
                                              className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                                              type="button"
                                              data-toggle="collapse"
                                              aria-expanded="false"
                                              aria-controls={"ccnams" + i}
                                              data-target={"#ccnams" + i}
                                            >
                                              {v.cluster}
                                            </button>
                                          </h5>
                                          <div
                                            className="collapse"
                                            data-parent={"#ccgeoams" + index}
                                            aria-expanded="false"
                                            id={"ccnams" + i}
                                          >
                                            <div className="selections_container col pr-1 pl-0">
                                              {v.data.map((c, index) => (
                                                <Fragment key={index}>
                                                  <div className="row pl-4 pb-1">
                                                    <label className="mb-0 ml-5">
                                                      <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        name="geocountry"
                                                        checked={c.isCheckedCC}
                                                        value={
                                                          c.Country_Code__c
                                                        }
                                                        onChange={(e) =>
                                                          this.OnCountryCheckboxValueChange(
                                                            c.Country_Code__c,
                                                            "country",
                                                            e.target.checked
                                                          )
                                                        }
                                                      />
                                                      {
                                                        c.World_Region1__r_Country_Name__c
                                                      }
                                                      <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        name="geocountryname"
                                                        checked={c.isCheckedCC}
                                                        value={
                                                          c.World_Region1__r_Country_Name__c
                                                        }
                                                        style={{
                                                          visibility: "hidden",
                                                        }}
                                                      />
                                                    </label>
                                                  </div>
                                                </Fragment>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default CustomerCapsuleFilter;
