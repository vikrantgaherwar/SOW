import React, { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart } from "chartjs-plugin-labels";
import axios from "axios";
import TrackingService from "../TrackingService";
import Cookies from "js-cookie";

import Modal from "react-bootstrap/Modal";
import { ExportReactCSVData } from "../ExportReactCSVData";
import CountryLevel from "./CountryLevel";
// The functional component starts
const PeopleCapsule = ({ peopleCapsuleData, searchTerm, AccountId }) => {
  // state and ref declarations
  const [region, setRegion] = useState();
  const [skillType, setSkillType] = useState("Experience");
  const [allSkillTypes, setAllSkillTypes] = useState();
  const trackingService = new TrackingService();
  const [capabilityViewData, setCapabilityViewData] =
    useState(peopleCapsuleData);
  const [countryLevelInitialData, setCountryLevelInitialData] = useState();
  const [showCountryLevel, setShowCountryLevel] = useState(false);
  const [exportData, setExportData] = useState();
  const [alignment, setAlignment] = useState("");
  const CapabilityWrapperRef = useRef(null);
  // invoke skill type and the export data once the component loaded
  useEffect(() => {
    getSkillTypes();
    getExportData();
  }, [searchTerm]);
  useEffect(() => {
    reAlignText();
  }, [searchTerm, AccountId]);
  // invoke the method to load data whenever the skillType changes/Skill Type filter applied
  useEffect(() => {
    getUpdatedCapabilityViewData();
  }, [skillType, searchTerm]);

  const getSkillTypes = () => {
    let url =
      "https://delta.app.hpecorp.net:8983/solr/rmc/select?fl=skill_type&group.field=skill_type&group.mincount=1&group=true&indent=on&q=*:*&rows=100&wt=json";
    axios.get(url).then((res) => {
      if (res) {
        setAllSkillTypes(res.data);
      }
    });
  };
  const updateSkillType = (e) => {
    setSkillType(e.target.value);
  };

  // Setting the data set and labels for the Dougnut graph
  const data = {
    labels: capabilityViewData?.facets?.categories?.buckets
      .map((s) => s.val)
      .map(
        (label, index) =>
          `${label}: ${
            capabilityViewData?.facets?.categories?.buckets.map((s) => s.SUM)[
              index
            ]
          }`
      ),
    datasets: [
      {
        label: capabilityViewData?.facets?.categories?.buckets.map(
          (s) => s.val
        ),
        data: capabilityViewData?.facets?.categories?.buckets.map((s) => s.SUM),
        backgroundColor: [
          "#00a982",
          "#7630ea",
          "#0e5265",
          "#33dac8",
          "#55b4e6",
          "#c140ff",
          "#fec901",
          "#6caf6a",
          "#6c126b",
          "#af94b5",
        ],
        hoverBackgroundColor: [
          "#00a982",
          "#7630ea",
          "#0e5265",
          "#33dac8",
          "#55b4e6",
          "#c140ff",
          "#fec901",
          "#6caf6a",
          "#6c126b",
          "#af94b5",
        ],

        borderColor: ["#A9A9A9", "#A9A9A9", "#A9A9A9"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    transition: 0.5,
    legend: {
      display: true,
      labels: {
        usePointStyle: true,
        fontSize: 9,
      },
      position: "right",
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 30,
      },
    },
    plugins: {
      labels: [
        {
          // render: function (args) {
          //   return args.value;
          // },
          arc: false,
          fontColor: "#fff",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontStyle: "normal",
          fontSize: 9,
          position: "inside",
        },
      ],
    },
    // title: {
    //   display: true,
    //   text: "Capability View Count",
    //   position: "top",
    // },
    tooltips: {
      // enabled: false,
      callbacks: {
        label: (tooltipItem, data) => {
          // Get the dataset label, global label or fall back to empty label
          let label =
            (data.datasets[0].label &&
              data.datasets[0].label[tooltipItem.index]) ||
            data.datasets[0].label[tooltipItem.index] ||
            "";
          if (label) {
            label += ": ";
          }

          // Apply the value and suffix
          label +=
            data.datasets[0].data[tooltipItem.index] +
            (data.datasets[0].labelSuffix || "");

          return label;
        },
      },
    },
  };
  const lineOptions = {
    maintainAspectRatio: true,
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var total = dataset.data.reduce(function (
            previousValue,
            currentValue,
            currentIndex,
            array
          ) {
            return previousValue + currentValue;
          });
          var currentValue = dataset.data[tooltipItem.index];
          // var percentage = Math.floor((currentValue / total) * 100 + 0.5);
          // return percentage + "%";
          return currentValue;
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: -120,
        right: 0,
        top: 10,
        bottom: 30,
      },
    },
    animation: {
      duration: 1,
      onComplete: function () {
        var chartInstance = this.chart,
          radian = 0,
          tmpRadian,
          middleRadian,
          ctx = chartInstance.ctx;
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.defaultFontColor = "#fff";
        Chart.defaults.global.defaultFontFamily =
          "Arial, Helvetica, sans-serif";
        Chart.defaults.global.defaultFontStyle = "600";
        ctx.font = Chart.helpers.fontString(
          Chart.defaults.global.defaultFontSize,
          Chart.defaults.global.defaultFontStyle,
          Chart.defaults.global.defaultFontFamily,
          Chart.defaults.global.defaultFontColor
        );
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        this.data.datasets.forEach(function (dataset, i) {
          var meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            var data = dataset.data[index],
              x,
              y,
              r,
              dataPercentage,
              canvasWidth,
              canvasHeight,
              dataName,
              centerAngle;
            r =
              (chartInstance.chartArea.bottom - chartInstance.chartArea.top) /
                2 +
              20;
            // arc length
            centerAngle = bar._model.circumference;
            // arc center
            radian = radian + centerAngle;
            tmpRadian = radian;
            middleRadian = tmpRadian - centerAngle / 2;
            // x, y coordinates
            canvasWidth = bar._chart.chartArea.right;
            canvasHeight = bar._chart.chartArea.bottom;
            x = canvasWidth / 2 + Math.sin(middleRadian) * r;
            y = (canvasHeight + 60) / 2 - Math.cos(middleRadian) * r;
            // Percentage
            dataPercentage = Math.floor((data / meta.total) * 100 + 0.5);
            dataName = bar._model.label;
            ctx.fillStyle = "#222";
            // ctx.fillText(dataName + ":" + data, x, y, 50);
            ctx.fillText(dataName, x, y, 50);
          });
        });
      },
    },
  };
  const CViewClickHandler = (region) => {
    setRegion(region);
    getCountryLevelInitialData(region);
  };
  const getUpdatedCapabilityViewData = () => {
    let url =
      "https://delta.app.hpecorp.net:8983/solr/rmc/select?fq=skill_type:%22" +
      skillType +
      "%22&indent=on&json.facet={categories:{type%20:%20terms,field%20:%20cluster,facet:{SUM%20:%20%22sum(total)%22}}}&q=" +
      searchTerm +
      "&rows=1&wt=json";

    axios.get(url).then((res) => {
      if (res) {
        setCapabilityViewData(res.data);
      }
    });
  };
  const getCountryLevelInitialData = (region) => {
    let url =
      "https://delta.app.hpecorp.net:8983/solr/rmc/select?fq=skill_type:%22" +
      skillType +
      "%22 AND cluster:%22" +
      region +
      "%22 &indent=on&json.facet={categories:{type%20:%20terms,field%20:%20country,facet:{SUM%20:%20%22sum(total)%22}}}&q=" +
      searchTerm +
      "&rows=1&wt=json";
    axios.get(url).then((res) => {
      if (res) {
        setCountryLevelInitialData(res.data);
        setShowCountryLevel(true);
      }
    });
  };
  const getExportData = () => {
    let url =
      "https://delta.app.hpecorp.net:8983/solr/rmc/select?fl=skill_type,cluster,country,skill_level,skill_name,total&indent=on&q=" +
      searchTerm +
      "&wt=json&rows=5000";
    axios.get(url).then((res) => {
      if (res) {
        setExportData(res.data);
      }
    });
  };
  const closeModal = () => {
    setShowCountryLevel(false);
  };
  const reAlignText = () => {
    const ele = document.getElementsByClassName("capsule-container");
    if (ele.length > 2) {
      for (var i = 0; i < ele.length; i++) {
        setAlignment("alignTitleCenter");
      }
    } else if (ele.length == 1) {
      setAlignment("alignTitleRight");
    }
    if (ele.length == 2) {
      for (var i = 0; i < ele.length; i++) {
        setAlignment("alignTitleRight");
      }
    }
  };

  const logCapabilityViewExport = (value) => {
    console.log(Cookies.get("empnumber"), value, "Capability View");
    trackingService.LogCapabilityViewExportClick(Cookies.get("empnumber"));
  };
  return (
    <>
      <>
        <div className="card-header" id="headingPeopleCapsule">
          <h5 className="mb-0 in-flex">
            <button
              className="btn btn-link btn-full collapsed"
              type="button"
              data-toggle="collapse"
              aria-expanded="false"
              data-target="#reusePeopleCapsule"
              aria-controls="reusePeopleCapsule"
              onClick={(skillType) => {
                console.log("2", skillType.value);
                trackingService.LogCapabilityViewExportClick(
                  Cookies.get("empnumber")
                );
              }}
            >
              Capability View
            </button>
          </h5>
        </div>
        <div
          className="collapse"
          aria-labelledby={"headingPeopleCapsule"}
          data-parent="#accordionReUse"
          aria-expanded="false"
          id={"reusePeopleCapsule"}
        >
          <div className="card-body ml-2 mr-2 mt-2">
            <div
              className="accordion"
              id="accordionPeopleCapsuleStages"
              style={{ minHeight: "300px" }}
            >
              <i class="fa fa-filter pr-1" style={{ fontSize: "11px" }}></i>
              <select
                className="custom-PeopleSelect"
                onChange={(e) => updateSkillType(e)}
              >
                {allSkillTypes?.grouped?.skill_type?.groups?.length > 0 &&
                  allSkillTypes?.grouped?.skill_type?.groups.map(
                    (value, index) => (
                      <option
                        selected={
                          skillType === value.groupValue ? "selected" : ""
                        }
                        value={value.groupValue}
                      >
                        {value.groupValue}
                      </option>
                    )
                  )}
              </select>
              {exportData?.response?.docs?.length > 0 && (
                <ExportReactCSVData
                  csvData={exportData?.response?.docs}
                  fileName="capabilitydata.xls"
                  title="Export Raw Data"
                  onClick={logCapabilityViewExport}
                >
                  Export Raw Data
                </ExportReactCSVData>
              )}

              <div align="left" className="mt-2">
                <span className="char-span-color">
                  <b>Skill</b>&nbsp;:&nbsp;{searchTerm}
                </span>
                <br />
                <span className="char-span-color">
                  <b>Geo</b>&nbsp;:&nbsp;All
                </span>
              </div>
              <p className={"people-title " + alignment}>
                Capability View Count
              </p>
              {capabilityViewData?.facets?.categories?.buckets?.length > 0 ? (
                <>
                  <Doughnut
                    data={data}
                    options={options}
                    ref={CapabilityWrapperRef}
                    onElementsClick={(elems) => {
                      if (
                        elems[0] !== undefined &&
                        elems[0]._model !== undefined
                      ) {
                        CViewClickHandler(elems[0]._model.label);
                      }
                    }}
                  />
                  <div className="align28">
                    <div class="form-check form-check-inline  ml-2">
                      <input
                        class="pl-0"
                        type="radio"
                        name="capabilityRadio"
                        id="skill"
                        value="Experience"
                        checked={skillType === "Experience"}
                        onChange={(e) => updateSkillType(e)}
                      />
                      <label class="p-1 m-0">Skill</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="pl-0"
                        type="radio"
                        name="capabilityRadio"
                        id="certification"
                        value="Certification"
                        checked={skillType === "Certification"}
                        onChange={(e) => updateSkillType(e)}
                      />
                      <label class="p-1 m-0">Certification</label>
                    </div>
                  </div>
                </>
              ) : (
                <div align="center">No Results Found</div>
              )}
            </div>
          </div>

          {showCountryLevel && (
            <Modal show={showCountryLevel} dialogClassName="capabilitymodal">
              <Modal.Header as="section">
                <Modal.Title
                  className="ibheadertext alignheader col-12"
                  as="div"
                >
                  <a className="btn btn-sm btn-transp">
                    Capability View &nbsp;&nbsp;
                    <i
                      class="fas fa-greater-than"
                      style={{ fontSize: "7px" }}
                    ></i>
                    <i
                      class="fas fa-greater-than"
                      style={{ fontSize: "7px" }}
                    ></i>
                    &nbsp;&nbsp;{region}
                  </a>
                  <a
                    className="float-right pointer"
                    onClick={() => setShowCountryLevel(false)}
                  >
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </a>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CountryLevel
                  searchTerm={searchTerm}
                  countryLevelInitialData={countryLevelInitialData}
                  region={region}
                  skillType={skillType}
                  closeModal={closeModal}
                />
              </Modal.Body>
            </Modal>
          )}
        </div>
      </>
    </>
  );
};

export default PeopleCapsule;
