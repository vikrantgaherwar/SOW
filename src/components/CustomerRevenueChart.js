import React from "react";
import { Bar } from "react-chartjs-2";
import { ConvertTOMillion } from "../utils/math";
import axios from "axios";
import Griddle, {
  plugins,
  RowDefinition,
  ColumnDefinition,
} from "griddle-react";
import { connect } from "react-redux";
import URLConfig from "./URLConfig";
import { ExportReactCSV } from "./ExportReactCSV";
import moment from "moment";
import _ from "lodash";
import CustomerRevenueChartTable from "./CustomerRevenueChartTable";
const legendOpts = {
  display: true,
  position: "bottom",
  fullWidth: true,
  reverse: false,
  labels: {
    fontColor: "#000000",
  },
};
class CustomerRevenueChartNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AccountId: 0,
      data: null,
      showGraph: true,
      currentPage: 1,
      pageSize: 10,
      recordCount: 0,
      title: "Revenue in Pipeline",
      filterRawData: this.props.filterRawData,
    };
    this.ClickHandle = this.ClickHandle.bind(this);
  }
  //Gridle Related Items
  MyCustomComponent({ value, griddleKey, rowData }) {
    return (
      <a href={`https://hp.my.salesforce.com/${rowData.Id}`} target="_blank">
        {value}
      </a>
    );
  }
  HandleBoolData({ value }) {
    return <span>{value.toString()}</span>;
  }
  rowDataSelector = (state, { griddleKey }) => {
    return state
      .get("data")
      .find((rowMap) => rowMap.get("griddleKey") === griddleKey)
      .toJSON();
  };
  enhancedWithRowData = connect((state, props) => {
    return {
      // rowData will be available into MyCustomComponent
      rowData: this.rowDataSelector(state, props),
    };
  });
  modifyDateComponent = ({ value }) => {
    let formattedDate = null;
    if (value) {
      formattedDate = moment(value).format("YYYY-MM-DD");
    }
    return formattedDate;
  };
  ClickHandle(label) {
    this.setState({
      showGraph: false,
      title: label,
      dataExport: null,
      data: null,
    });
    if (label === "05 - Negotiate & Close") {
      var Opportunity_Sales_Stage__c =
        "%20Opportunity_Sales_Stage__c%20 LIKE '%Negotiate%'";
    } else {
      var Opportunity_Sales_Stage__c =
        "%20Opportunity_Sales_Stage__c%20=%20%27" +
        encodeURIComponent(label) +
        "%27%20";
    }

    if (this.props.filterRawData == "") {
      var URL =
        "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=Select%20Description,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20Win_Loss_Reason__c,%20Type,%20CreatedDate,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c%20!=%27HPE%20Not%20Pursued%27%20AND%20" +
        this.state.AccountId +
        "%27%20AND" +
        Opportunity_Sales_Stage__c +
        "AND%20IsClosed%20=%20false%20Order%20By%20SystemModstamp%20DESC";
    }
    if (this.props.filterRawData != "") {
      var URL =
        "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=Select%20Description,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20Win_Loss_Reason__c,%20Type,%20CreatedDate,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c%20!=%27HPE%20Not%20Pursued%27%20AND%20" +
        this.state.AccountId +
        "%27%20AND%20(" +
        this.props.filterRawData +
        ")%20AND" +
        Opportunity_Sales_Stage__c +
        "AND%20IsClosed%20=%20false%20Order%20By%20SystemModstamp%20DESC";
    }
    const config = URLConfig.ApplyAuth(URL);

    axios(config).then((res) => {
      if (res.data.response.length) {
        const data = res.data.response;
        let dataExport = _.cloneDeep(data);
        dataExport.forEach(function (v) {
          delete v.attributes_type;
          delete v.attributes_url;
          delete v.Id;
        });
        dataExport = dataExport.map(function (obj) {
          Object.keys(obj).forEach(function (key) {
            obj[key] =
              obj[key] !== null ? obj[key].toString().replace(/,/g, " ") : null;
          });
          return obj;
        });

        this.setState({ data: data, dataExport: dataExport });
      } else {
        console.log("No Opportunity Raw data found!!");
      }
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.AccountId !== state.AccountId) {
      return {
        AccountId: props.AccountId,
        data: null,
        dataExport: null,
        filterRawData: props.filterRawData,
      };
    }
    return null;
  }
  componentDidUpdate(prevProps) {
    if (this.props.filterRawData !== prevProps.filterRawData) {
      this.setState({ filterRawData: this.props.filterRawData });
    }
  }
  render() {
    const dataPoints = this.props.dataPoints;
    const options = {
      responsive: true,
      tooltips: {
        mode: "label",
      },
      elements: {
        line: {
          fill: false,
        },
      },
      scales: {
        xAxes: [
          {
            labels: dataPoints.map((m) => m.label),
            display: true,
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            gridLines: {
              display: false,
            },
            labels: {
              show: true,
            },
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              display: false,
            },
            labels: {
              show: true,
            },
            ticks: {
              callback(value, index) {
                return ConvertTOMillion(value);
              },
            },
          },
        ],
      },
    };
    const data = {
      datasets: [
        {
          label: "Count",
          type: "line",
          data: dataPoints.map((m) => m.c),
          fill: false,
          pointBorderColor: "rgba(13,82,101,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          yAxisID: "y-axis-1",
          backgroundColor: "rgba(13,82,101,0.4)",
          borderColor: "rgba(13,82,101,1)",
        },
        {
          type: "bar",
          label: "Revenue",
          data: dataPoints.map((m) => m.y),
          fill: true,
          backgroundColor: "rgba(1,169,130,0.6)",
          //borderColor: 'rgba(1,169,130,1)',
          borderWidth: 0,
          hoverBackgroundColor: "rgba(1,169,130,0.8)",
          hoverBorderColor: "rgba(255,131,0,6)",
          yAxisID: "y-axis-2",
        },
      ],
    };
    return (
      <>
        <div
          className="modal fade"
          id="revenueGraphModal"
          role="dialog"
          aria-labelledby="revenueGraphModalLabel"
          aria-hidden="true"
        >
          <div
            className={
              this.state.showGraph
                ? "modal-dialog modal-graph"
                : "modal-dialog modal-lg"
            }
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title bold" id="revenueGraphModalLabel">
                  {this.state.showGraph
                    ? "Revenue in Pipeline"
                    : this.state.title}
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
              <div className="modal-body">
                {this.state.showGraph && (
                  <Bar
                    data={data}
                    options={options}
                    legend={legendOpts}
                    onElementsClick={(elems) => {
                      var RevenueChartElement = elems.find(
                        (x) => (x._model.datasetLabel = "Revenue")
                      );
                      if (RevenueChartElement) {
                        var selectedItem =
                          RevenueChartElement._xScale.ticks[
                            RevenueChartElement._index
                          ];
                        this.ClickHandle(selectedItem);
                      }
                    }}
                  />
                )}
                {!this.state.showGraph && (
                  <>
                    {this.state.data !== null && this.state.data.length > 0 && (
                      <>
                        <button
                          className="btn-danger m-1"
                          onClick={() => {
                            this.setState({ showGraph: true });
                          }}
                        >
                          Back to Graph
                        </button>
                        {/* <ExportReactCSV
                          csvData={this.state.dataExport}
                          fileName="OpportunityRawData.xls"
                        /> */}
                        <CustomerRevenueChartTable data={this.state.data} />
                        {/* <Griddle
                          data={this.state.data}
                          plugins={[plugins.LocalPlugin]}
                        >
                          <RowDefinition>
                            <ColumnDefinition
                              id="Opportunity_ID__c"
                              title="Opportunity ID"
                              width={120}
                              customComponent={this.enhancedWithRowData(
                                this.MyCustomComponent
                              )}
                            />
                            <ColumnDefinition
                              width={300}
                              id="Description"
                              title="Description"
                            />
                            <ColumnDefinition
                              id="CreatedDate"
                              title="Created Date (UTC)"
                              customComponent={this.modifyDateComponent}
                            />
                            <ColumnDefinition
                              width={120}
                              id="TotalOpportunityQuantity"
                              title="Opportunity Sales"
                            />
                            <ColumnDefinition id="Type" title="Type" />
                            <ColumnDefinition
                              id="StageName"
                              title="StageName"
                            />
                            <ColumnDefinition
                              id="Win_Loss_Reason__c"
                              title="Win Loss Reason"
                            />
                            <ColumnDefinition
                              id="Amount"
                              title="Amount (USD)"
                            />
                          </RowDefinition>
                        </Griddle> */}
                      </>
                    )}
                    {this.state.data === null && (
                      <p align="center">Loading Data...</p>
                    )}
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
export default CustomerRevenueChartNew;
