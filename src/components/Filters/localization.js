import React, { Component, Fragment } from "react";
import axios from "axios";
import _ from "lodash";

class LOCALIZATION extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language_s: [],
      Regions: [],
      country: [],
      AllRegionsSelected: false,
      AllIndeterminate: false,
      AllLangIndeterminate: false,
      languages: {
        en: "English",
        da: "Danish",
        it: "Italian",
        de: "German",
        fr: "French",
        pt: "Portugese",
        es: "Spanish",
        nl: "Dutch",
        ru: "Russian",
        ro: "Romanian",
        sv: "Swedish",
        ja: "Japanese",
        af: "Afrikaans",
        sk: "Slovakian",
        sl: "Slovenian",
        no: "Norwegian",
        id: "Indonesian",
        cs: "Czech",
        et: "Estonian",
        so: "Congo",
        "zh-TW": "Taiwanese",
        tl: "Tagalog",
        pl: "Polish",
        hr: "Croatian",
        hu: "Hungarian",
        sq: "Albanian",
        lv: "Latvian",
        ko: "Korean",
        vi: "Vietnamese",
        lt: "Lithuanian",
        sw: "Swahili",
        bn: "Malay",
        tr: "Turkish",
        th: "Thai",
        fi: "Finnish",
        he: "Hebrew",
        uk: "Ukrainian",
        lb: "Luxembourgish",
        bg: "Bulgarian",
        "zh-CN": "Chinese",
      },
      getLanguageByCode: this.getLanguageByCode.bind(this),
    };
  }

  componentDidMount = () => {
    const geoData = this.props.geoData;
    var Data = geoData
      .filter((x) => this.props.country.indexOf(x.code) !== -1)
      .map((obj) => ({ ...obj }));
    Data = _.sortBy(Data, "country");
    var grps = _(Data)
      .groupBy((x) => x.region)
      .map((value, key) => ({ region: key, data: value }))
      .value();
    if (this.props.region.indexOf("Worldwide") === -1)
      grps = grps.filter((x) => this.props.region.indexOf(x.region) !== -1);
    var grpsByCluster = [];
    grps.map((value, index) => {
      var clusterArray = _(value.data)
        .groupBy((x) => x.cluster)
        .map((value, key) => ({
          cluster: key,
          data: value,
          isChecked: false,
          indeterminate: false,
        }))
        .value();
      clusterArray = _.sortBy(clusterArray, "cluster");
      grpsByCluster.push({
        region: value.region,
        data: clusterArray,
        isChecked: false,
        indeterminate: false,
      });
    });
    grpsByCluster = _.sortBy(grpsByCluster, "region");
    this.setState({
      Regions: grpsByCluster,
      AllRegionsSelected: false,
      RegionsDefaultData: Data,
      FormattedRegionsDefault: grpsByCluster,
    });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.language_s.length !== state.language_s.length) {
      let language_s = props.language_s.map((language, index) => {
        return {
          name: state.getLanguageByCode(language),
          checked: false,
          value: language,
        };
      });
      language_s = _.sortBy(language_s, "name");
      return {
        language_s,
        isAllSelected: false,
        UpdateFilters: props.UpdateFilters,
        defaultLanguages: language_s,
      };
    }
    return null;
  }

  getLanguageByCode = (code) => {
    return this.state.languages[code];
  };

  ClearLocalization = (FilterType) => {
    if (FilterType === "language") {
      const DefaultData = this.state.defaultLanguages;
      this.setState(
        {
          language_s: DefaultData,
          AllLangIndeterminate: false,
          isAllSelected: false,
        },
        () => {
          this.props.OnLanguagesChange("");
          this.state.UpdateFilters(true);
        }
      );
    } else if (FilterType === "geo") {
      const geoData = this.props.geoData;
      var Data = geoData
        .filter((x) => this.props.country.indexOf(x.code) !== -1)
        .map((obj) => ({ ...obj }));
      Data = _.sortBy(Data, "country");
      const Regions = this.state.FormattedRegionsDefault;
      this.setState(
        {
          Regions,
          AllRegionsSelected: false,
          AllIndeterminate: false,
          RegionsDefaultData: Data,
        },
        () => {
          this.props.OnGeoChange("");
          this.state.UpdateFilters(true);
        }
      );
    }
  };

  onCountryBoxChange = (checkName, level, Checked) => {
    const isChecked = Checked;
    var filteredData;
    var DefaultData = this.state.RegionsDefaultData;
    if (level === "country") {
      filteredData = DefaultData.map((v, i) => {
        if (v.country == checkName) {
          return Object.assign({}, v, {
            isChecked,
          });
        }
        return v;
      });
    } else if (level === "cluster") {
      filteredData = DefaultData.map((v, i) => {
        if (v.cluster == checkName) {
          return Object.assign({}, v, {
            isChecked,
          });
        }
        return v;
      });
    } else if (level === "region" || level == "all") {
      filteredData = DefaultData.map((v, i) => {
        if (level === "region" && v.region == checkName) {
          return Object.assign({}, v, {
            isChecked,
          });
        } else if (level === "all") {
          return Object.assign({}, v, {
            isChecked,
          });
        }
        return v;
      });
    }
    var grps = _(filteredData)
      .groupBy((x) => x.region)
      .map((value, key) => ({ region: key, data: value }))
      .value();
    if (this.props.region.indexOf("Worldwide") === -1)
      grps = grps.filter((x) => this.props.region.indexOf(x.region) !== -1);
    var grpsByCluster = [];
    grps.map((value) => {
      var clusterArray = _(value.data)
        .groupBy((x) => x.cluster)
        .map((value, key) => ({
          cluster: key,
          data: value,
          isChecked: value.findIndex((item) => item.isChecked === false) === -1,
          indeterminate:
            value.filter((x) => x.isChecked == true).length > 0 &&
            value.filter((x) => x.isChecked == true).length < value.length,
        }))
        .value();
      clusterArray = _.sortBy(clusterArray, "cluster");
      grpsByCluster.push({
        region: value.region,
        data: clusterArray,
        isChecked:
          clusterArray.findIndex((item) => item.isChecked === false) === -1,
        indeterminate:
          clusterArray.filter(
            (x) => x.indeterminate == true || x.isChecked == true
          ).length > 0 &&
          clusterArray.filter((x) => x.isChecked == true).length <
            clusterArray.length,
      });
    });
    grpsByCluster = _.sortBy(grpsByCluster, "region");
    this.setState(
      {
        Regions: grpsByCluster,
        RegionsDefaultData: filteredData,
        AllRegionsSelected:
          grpsByCluster.findIndex((item) => item.isChecked === false) === -1,
        AllIndeterminate:
          grpsByCluster.filter(
            (x) => x.indeterminate === true || x.isChecked === true
          ).length > 0 &&
          grpsByCluster.filter((x) => x.isChecked == true).length <
            grpsByCluster.length,
      },
      () => {
        this.state.UpdateFilters(false);

        let countries = "";
        if (this.state.AllRegionsSelected) {
          countries = "All";
        } else {
          var SelectedRegions = grpsByCluster.filter(
            (x) => x.isChecked == true || x.indeterminate == true
          );
          for (let i = 0; i < SelectedRegions.length; i++) {
            if (i > 0) {
              countries += " | ";
            }
            var element = SelectedRegions[i];
            countries += "<b>" + element.region + "</b> > ";
            if (
              element.data.length ===
              element.data.filter((x) => x.isChecked == true).length
            ) {
              countries += "All  ";
              continue;
            }
            const Clusters = element.data.filter(
              (x) => x.isChecked == true || x.indeterminate == true
            );
            for (let j = 0; j < Clusters.length; j++) {
              if (j > 0) {
                countries += ", ";
              }
              var cluster = Clusters[j];
              countries += cluster.cluster + "> ";
              if (
                cluster.data.length ===
                cluster.data.filter((x) => x.isChecked == true).length
              ) {
                countries += "All  ";
                continue;
              }
              var SelectedCountries = cluster.data
                .filter((x) => x.isChecked == true)
                .map((x) => x.country)
                .join(", ");
              countries += SelectedCountries;
            }
          }
        }
        this.props.OnGeoChange(countries);
      }
    );
  };

  onLanguageBoxChange = (checkName, isChecked) => {
    let isAllChecked = checkName === "all" && isChecked;
    let isAllUnChecked = checkName === "all" && !isChecked;
    const checked = isChecked;
    const checkList = this.state.language_s.map((language, index) => {
      if (isAllChecked || language.name === checkName) {
        return Object.assign({}, language, {
          checked,
        });
      } else if (isAllUnChecked) {
        return Object.assign({}, language, {
          checked: false,
        });
      }
      return language;
    });
    let isAllSelected =
      checkList.findIndex((item) => item.checked === false) === -1 ||
      isAllChecked;
    let AllLangIndeterminate =
      checkList.filter((x) => x.checked).length > 0 && !isAllSelected;
    this.setState(
      {
        language_s: checkList,
        isAllSelected,
        AllLangIndeterminate,
      },
      () => {
        this.state.UpdateFilters(false);
        var SelectedLanguages = checkList
          .filter((x) => x.checked == true)
          .map((x) => x.name)
          .join(", ");
        if (
          checkList.length === checkList.filter((x) => x.checked == true).length
        ) {
          SelectedLanguages = "All";
        }
        this.props.OnLanguagesChange(SelectedLanguages);
      }
    );
  };

  render() {
    return (
      <>
        <h5 className="mb-0 cardbg">
          <button
            className="btn custom-btn btn-full pt-0 pb-0 collapsed"
            type="button"
            data-toggle="collapse"
            aria-expanded="false"
            data-target="#localization"
            aria-controls="localization"
          >
            LOCALIZATION
          </button>
        </h5>
        <div
          className="collapse"
          aria-labelledby="headingHPSE"
          data-parent="#sidefilters"
          aria-expanded="false"
          id="localization"
        >
          <div className="card-body ml-1 mr-0 mt-2">
            <div
              className="collapse show"
              aria-labelledby="headingHPSE"
              data-parent="#accordionExample"
              aria-expanded="false"
              id="localizationItems"
            >
              <div className="card-body ml-1 mr-1 mt-2">
                <div className="accordion" id="localizationsubcategorygeo">
                  {this.state.Regions && this.state.Regions.length > 0 && (
                    <div
                      className="card mb-1 "
                      align="left"
                      style={{
                        maxHeight: "300px",
                        overflowX: "hidden",
                        overflowY: "auto",
                        color: "#000",
                      }}
                    >
                      <h5 className="mb-0 ml-2 in-flex cardBorder">
                        <input
                          type="checkbox"
                          checked={this.state.AllRegionsSelected}
                          ref={(el) =>
                            el &&
                            (el.indeterminate = this.state.AllIndeterminate)
                          }
                          className="ml-2 mt-1 inputclass"
                          onChange={(e) =>
                            this.onCountryBoxChange(
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
                          aria-controls="geographyfilter"
                          data-target="#geographyfilter"
                        >
                          Geography
                        </button>
                      </h5>

                      <div
                        className="collapse"
                        aria-labelledby="headingHPSE"
                        aria-expanded="false"
                        id="geographyfilter"
                        data-parent="#localizationsubcategorygeo"
                      >
                        <div className="selections_container col pr-1 pl-0">
                          {this.state.Regions &&
                            this.state.Regions.length > 0 &&
                            this.state.Regions.map((value, index) => (
                              <div className="card" align="left" key={index}>
                                <h5 className="mb-0 ml-3 pl-1 in-flex cardBorder">
                                  <input
                                    type="checkbox"
                                    checked={value.isChecked}
                                    ref={(el) =>
                                      el &&
                                      (el.indeterminate = value.indeterminate)
                                    }
                                    className="ml-2 mt-1 inputclass"
                                    name="region"
                                    onChange={(e) =>
                                      this.onCountryBoxChange(
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
                                    aria-controls={"geoams" + index}
                                    data-target={"#geoams" + index}
                                  >
                                    {value.region}
                                  </button>
                                </h5>

                                <div
                                  className="collapse"
                                  aria-labelledby="headingHPSE"
                                  data-parent="#geographyfilter"
                                  aria-expanded="false"
                                  id={"geoams" + index}
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
                                            checked={v.isChecked}
                                            ref={(el) =>
                                              el &&
                                              (el.indeterminate =
                                                v.indeterminate)
                                            }
                                            name="cluster"
                                            className="ml-2 mt-1 inputclass"
                                            onChange={(e) =>
                                              this.onCountryBoxChange(
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
                                            aria-controls={"nams" + i}
                                            data-target={"#nams" + i}
                                          >
                                            {v.cluster}
                                          </button>
                                        </h5>

                                        <div
                                          className="collapse"
                                          data-parent={"#geoams" + index}
                                          aria-expanded="false"
                                          id={"nams" + i}
                                        >
                                          <div className="selections_container col pr-1 pl-0">
                                            {v.data.map((c, index) => (
                                              <Fragment key={index}>
                                                <div className="row pl-4 pb-1">
                                                  <label className="mb-0 ml-5">
                                                    <input
                                                      type="checkbox"
                                                      className="mr-2"
                                                      checked={c.isChecked}
                                                      value={c.code}
                                                      name="country"
                                                      onChange={(e) =>
                                                        this.onCountryBoxChange(
                                                          c.country,
                                                          "country",
                                                          e.target.checked
                                                        )
                                                      }
                                                    />
                                                    {c.country}
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
                  <div
                    className="card"
                    style={{
                      maxHeight: "300px",
                      overflowX: "hidden",
                      overflowY: "auto",
                      color: "#000"
                    }}
                    align="left"
                  >
                    <h5 className="mb-0 ml-2 in-flex cardBorder">
                      <input
                        type="checkbox"
                        checked={this.state.isAllSelected}
                        ref={(el) =>
                          el &&
                          (el.indeterminate = this.state.AllLangIndeterminate)
                        }
                        className="ml-2 mt-1 inputclass"
                        onChange={(e) =>
                          this.onLanguageBoxChange("all", e.target.checked)
                        }
                      />
                      <button
                        className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                        type="button"
                        data-toggle="collapse"
                        aria-expanded="false"
                        aria-controls="languagefilter"
                        data-target="#languagefilter"
                      >
                        Languages
                      </button>
                    </h5>
                    <div
                      className="collapse"
                      data-parent="#localizationsubcategorygeo"
                      aria-expanded="false"
                      id="languagefilter"
                    >
                      <div className="selections_container col pl-0">
                        {this.state.language_s &&
                          this.state.language_s.map((lang, index) => (
                            <div className="row pl-4 pb-1" key={index}>
                              <label className="mb-0 ml-4">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  value={lang.value}
                                  name="language"
                                  checked={lang.checked}
                                  onChange={(e) =>
                                    this.onLanguageBoxChange(
                                      lang.name,
                                      e.target.checked
                                    )
                                  }
                                />
                                {lang.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default LOCALIZATION;
