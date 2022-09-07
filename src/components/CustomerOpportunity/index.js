import axios from "axios";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import URLConfig from "../URLConfig";
import _ from "lodash";
const CustomerOpportunity = ({ AccountSTID }) => {
  const [result, setResult] = useState([]);
  const [budata, setData] = useState([]);
  useEffect(() => {
    fetchBifurcatedOppData();
  }, [AccountSTID]);
  const fetchBifurcatedOppData = () => {
    // var url =
    //   "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=Select%20Owner_s_Global_Business_Unit__c,Description,%20Id,%20Opportunity_ID__c,%20convertCurrency(Amount),%20Win_Loss_Reason__c,%20Type,%20CreatedDate,%20Opportunity_Sales_Stage__c%20,%20Status__c%20from%20Opportunity%20WHERE%20Opportunity_Sales_Stage__c%20!=%27HPE%20Not%20Pursued%27%20AND%20" +
    //   AccountSTID +
    //   "%27%20Order%20By%20SystemModstamp%20DESC";
    // url = URLConfig.ApplyAuth(url);

    let url = URLConfig.getCustomerOpportunityBUUrl(AccountSTID);

    try {
      axios(url).then((res) => {
        var grps = _(res.data.response)
          .groupBy((x) => x.Owner_s_Global_Business_Unit__c)
          .map((value, key) => ({ BU: key, data: value }))
          .value();

        grps = _.sortBy(grps, "BU");

        setResult(grps);
        arrangetheData(grps);
      });
    } catch (error) {
      console.log("API Error", error);
    }
  };

  const arrangetheData = (data) => {
    const buArray = { anps: 0, gl: 0, os: 0, others: 0 };
    data.map((item) => {
      switch (item.BU) {
        case "A&PS":
          buArray.anps = item.data.length;
          break;
        case "Greenlake":
          buArray.gl = item.data.length;
          break;
        case "Operational Services":
          buArray.os = buArray.os + item.data.length;
          break;
        case "Ops":
          buArray.os = buArray.os + item.data.length;
          break;
        default:
          buArray.others = buArray.others + item.data.length;
      }
    });
    setData(buArray);
  };
  const data = [
    ["BU", "Single BU"],
    ["A&PS", budata.anps],
    ["OS", budata.os],
    ["GL", budata.gl],
    ["Others", budata.others],
  ];

  const options = {
    title: "Opportunity Bifurcation",
    is3D: true,
    slices: {
      0: { offset: 0.1 },
    },
    colors: ["#01A982", "#00739D", "#32DAC8", "#7630EA"],
  };
  return (
    <div
      className="modal fade"
      id="BUbifurcationModal"
      role="dialog"
      aria-labelledby="BUbifurcationModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-graph" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title bold" id="BUbifurcationModalLabel">
              Bifurcation
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
            {result.length ? (
              <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={"100%"}
                height={"400px"}
              />
            ) : (
              <p>Loading</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerOpportunity;
