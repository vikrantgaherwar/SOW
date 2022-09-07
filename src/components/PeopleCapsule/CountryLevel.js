import React, { useState, Fragment, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart } from "chartjs-plugin-labels";
import axios from "axios";
const CountryLevel = ({
  countryLevelInitialData,
  region,
  skillType,
  searchTerm,
  closeModal,
}) => {
  const [allSkillLevels, setAllSkillLevels] = useState();
  const [skillLevel, setSkillLevel] = useState("Skill Level");
  const [countryLevelData, setCountryLevelData] = useState(
    countryLevelInitialData
  );
  const [skillTypeSelected, setSkillTypeSelected] = useState(skillType);
  const CapabilityWrapperRef2 = useRef(null);
  useEffect(() => {
    getSkillLevels();
  }, []);
  const getSkillLevels = () => {
    let url =
      "https://delta.app.hpecorp.net:8983/solr/rmc/select?fl=skill_level&group.field=skill_level&group.mincount=1&group=true&indent=on&q=*:*&rows=100&wt=json";
    axios.get(url).then((res) => {
      if (res) {
        // setAllSkillTypes(res.data.grouped.skill_type.groups);
        setAllSkillLevels(res.data);
      }
    });
  };
  const updateSkillLevel = (e) => {
    setSkillLevel(e.target.value);
    getUpdatedCountryLevelData(e.target.value);
  };

  const data = {
    labels: countryLevelData?.facets?.categories?.buckets
      .map((s) => s.val)
      .map(
        (label, index) =>
          `${label}: ${
            countryLevelData?.facets?.categories?.buckets.map((s) => s.SUM)[
              index
            ]
          }`
      ),
    datasets: [
      {
        label: countryLevelData?.facets?.categories?.buckets.map((s) => s.val),
        data: countryLevelData?.facets?.categories?.buckets.map((s) => s.SUM),
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
          "5a7d14",
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
          "5a7d14",
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
  // const lineOptions = {
  //   maintainAspectRatio: true,
  //   tooltips: {
  //     enabled: true,
  //     callbacks: {
  //       label: function (tooltipItem, data) {
  //         var dataset = data.datasets[tooltipItem.datasetIndex];
  //         var total = dataset.data.reduce(function (
  //           previousValue,
  //           currentValue,
  //           currentIndex,
  //           array
  //         ) {
  //           return previousValue + currentValue;
  //         });
  //         var currentValue = dataset.data[tooltipItem.index];
  //         // var percentage = Math.floor((currentValue / total) * 100 + 0.5);
  //         // return percentage + "%";
  //         return currentValue;
  //       },
  //       title: function (tooltipItem, data) {
  //         return data.labels[tooltipItem[0].index];
  //       },
  //     },
  //   },
  //   legend: {
  //     display: false,
  //   },
  //   layout: {
  //     padding: {
  //       left: -120,
  //       right: 0,
  //       top: 10,
  //       bottom: 30,
  //     },
  //   },
  //   animation: {
  //     duration: 1,
  //     onComplete: function () {
  //       var chartInstance = this.chart,
  //         radian = 0,
  //         tmpRadian,
  //         middleRadian,
  //         ctx = chartInstance.ctx;
  //       Chart.defaults.global.defaultFontSize = 14;
  //       Chart.defaults.global.defaultFontColor = "#fff";
  //       Chart.defaults.global.defaultFontFamily =
  //         "Arial, Helvetica, sans-serif";
  //       Chart.defaults.global.defaultFontStyle = "600";
  //       ctx.font = Chart.helpers.fontString(
  //         Chart.defaults.global.defaultFontSize,
  //         Chart.defaults.global.defaultFontStyle,
  //         Chart.defaults.global.defaultFontFamily,
  //         Chart.defaults.global.defaultFontColor
  //       );
  //       ctx.textAlign = "center";
  //       ctx.textBaseline = "bottom";

  //       this.data.datasets.forEach(function (dataset, i) {
  //         var meta = chartInstance.controller.getDatasetMeta(i);
  //         meta.data.forEach(function (bar, index) {
  //           var data = dataset.data[index],
  //             x,
  //             y,
  //             r,
  //             dataPercentage,
  //             canvasWidth,
  //             canvasHeight,
  //             dataName,
  //             centerAngle;
  //           r =
  //             (chartInstance.chartArea.bottom - chartInstance.chartArea.top) /
  //               2 +
  //             20;
  //           // arc length
  //           centerAngle = bar._model.circumference;
  //           // arc center
  //           radian = radian + centerAngle;
  //           tmpRadian = radian;
  //           middleRadian = tmpRadian - centerAngle / 2;
  //           // x, y coordinates
  //           canvasWidth = bar._chart.chartArea.right;
  //           canvasHeight = bar._chart.chartArea.bottom;
  //           x = canvasWidth / 2 + Math.sin(middleRadian) * r;
  //           y = (canvasHeight + 60) / 2 - Math.cos(middleRadian) * r;
  //           // Percentage
  //           dataPercentage = Math.floor((data / meta.total) * 100 + 0.5);
  //           dataName = bar._model.label;
  //           ctx.fillStyle = "#222";
  //           // ctx.fillText(dataName + ":" + data, x, y, 50);
  //           ctx.fillText(dataName, x, y, 50);
  //         });
  //       });
  //     },
  //   },
  // };
  //   const CViewClickHandler = (region) => {
  //     setRegionName(region);
  //     alert(region);
  //   };
  const getUpdatedCountryLevelData = (level) => {
    if (level == "All") {
      var url =
        "https://delta.app.hpecorp.net:8983/solr/rmc/select?fq=skill_type:%22" +
        skillTypeSelected +
        "%22 AND cluster:%22" +
        region +
        "%22 AND skill_level:(%22Basic%22,%22Expert%22,%22Advanced%22,%22Intermediate%22)&indent=on&json.facet={categories:{type%20:%20terms,field%20:%20country,facet:{SUM%20:%20%22sum(total)%22}}}&q=" +
        searchTerm +
        "&rows=1&wt=json";
    } else {
      var url =
        "https://delta.app.hpecorp.net:8983/solr/rmc/select?fq=skill_type:%22" +
        skillTypeSelected +
        "%22 AND cluster:%22" +
        region +
        "%22 AND skill_level:%22" +
        level +
        "%22&indent=on&json.facet={categories:{type%20:%20terms,field%20:%20country,facet:{SUM%20:%20%22sum(total)%22}}}&q=" +
        searchTerm +
        "&rows=1&wt=json";
    }

    axios.get(url).then((res) => {
      if (res) {
        setCountryLevelData(res.data);
      }
    });
  };
  return (
    <>
      <>
        <div>
          {/* Graphical representation */}
          <>
            <i className="fa fa-filter pr-1 " style={{ fontSize: "11px" }}></i>
            <select
              className="custom-PeopleSelect"
              onChange={(e) => updateSkillLevel(e)}
              defaultValue={skillLevel}
            >
              <option value="Skill Level" disabled selected hidden>
                Skill Level
              </option>
              <option value="All">All</option>
              {allSkillLevels?.grouped?.skill_level?.groups?.length > 0 &&
                allSkillLevels?.grouped?.skill_level?.groups.map(
                  (value, index) => (
                    <option
                      //   selected={
                      //     skillLevel === value.groupValue ? "selected" : ""
                      //   }
                      value={value.groupValue}
                    >
                      {value.groupValue}
                    </option>
                  )
                )}
            </select>
            <button
              className="btn-danger m-1"
              onClick={closeModal}
              style={{ float: "right" }}
            >
              Back
            </button>
            <div align="left" className="mt-2 ">
              <span className="chart-span char-span-color">
                <b>Skill</b>&nbsp;:&nbsp;{searchTerm}
              </span>
              <span className="chart-span char-span-color">
                <b>Geo</b>&nbsp;:&nbsp;{region}
              </span>
              <span className="chart-span char-span-color">
                <b>Skill Type</b>&nbsp;:&nbsp;{skillTypeSelected}
              </span>
              {skillLevel === "Skill Level" && (
                <span className="chart-span char-span-color">
                  <b>Skill Level</b>&nbsp;:&nbsp;All
                </span>
              )}
            </div>
            {countryLevelData?.facets?.categories?.buckets?.length > 0 ? (
              <>
                <div
                  style={{ width: "80%" }}
                  align="center"
                  className="ml-5 pl-5"
                >
                  <Doughnut
                    data={data}
                    options={options}
                    // redraw={true}
                    ref={CapabilityWrapperRef2}
                    height={20}
                    width={20}
                  />
                </div>
              </>
            ) : (
              <div align="center">No Data Found</div>
            )}
          </>
        </div>
      </>
    </>
  );
};

export default CountryLevel;
