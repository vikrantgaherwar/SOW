import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import URLConfig from "./URLConfig";

const HeaderCounts = () => {
  const signal = axios.CancelToken.source();
  const [headerCountsData, setHeaderCountsData] = useState({});
  const [showContrMenu, setShowContrMenu] = useState(false);

  useEffect(() => {
    getHeaderCountsData(signal.token);
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  const getHeaderCountsData = async (cancelToken) => {
    const URL =
      URLConfig.getURLDeltaAPI() + "DocumentCounts/" + Cookies.get("empnumber");
    try {
      const res = await axios.get(URL, { cancelToken });
      if (res.data) {
        setHeaderCountsData({ ...res.data });
      }
    } catch (error) {
      console.log("API Error", error);
    }
  };

  return (
    <>
      {/* <div className="col-2 pl-1 pr-1">
        <div className="hometopboxes">
          <div className="col-12 fontx10">
            Contributed
            <div className="col-12 hometopboxesnumbers" align="center">
              Contributed:  {headerCountsData.contributed || 0}
            </div>
          </div>
        </div>
      </div>
      <div className="col-2 pl-1 pr-1">
        <div className="hometopboxes">
          <div className="col-12 fontx10">
            Published
            <div className="col-12 hometopboxesnumbers" align="center">
              Published: {headerCountsData.published || 0}
            </div>
          </div>
        </div>
      </div>
      <div className="col-2 pl-1 pr-1">
        <div className="hometopboxes">
          <div className="col-12 fontx10">
            Downloads
            <div className="col-12 hometopboxesnumbers" align="center">
              Downloads: {headerCountsData.downloads || 0}
            </div>
          </div>
        </div>
      </div>
      <div className="col-2 pl-1 pr-1">
        <div className="hometopboxes">
          <div className="col-12 fontx10">
            Up for Archival
            <div className="col-12 hometopboxesnumbers" align="center">
              Up for Archival: {headerCountsData.upForArchival || 0}
            </div>
          </div>
        </div>
      </div>
      <div className="col-2 pl-1 pr-1">
        <div className="hometopboxes">
          <div className="col-12 fontx10">
            Archived
            <div className="col-12 hometopboxesnumbers" align="center">
             Archived:  {headerCountsData.archived || 0}
            </div>
          </div>
        </div>
      </div>
      <div className="col-2 pl-1 pr-1">
        <div className="hometopboxes">
          <div className="col-12 fontx10">
            Solution Re-use
            <div className="col-12 hometopboxesnumbers" align="center">
              Solution Re-use: {headerCountsData.solutionReUse || 0}
            </div>
          </div>
        </div>
      </div> */}

      {/* <div> */}
      {/* <button
          className="btn dropdowns-toggle btn-sm practicebtn"
          type="button"
          onClick={() => setShowContrMenu((prevState) => !prevState)}
        >
          KSO Contributions
        </button> */}

      {/* {showContrMenu && ( */}
      {/* <div id="contributions">
            <div className="col-12 pl-0 pr-0">
              <div className="accordion" id="contributionsDropdown">
                <div className="card" align="left">
                  <div className="card-body ml-0 mr-0 mt-0"> */}
      <table
        className="pl-2 ml-2 table table-sm table-striped"
        style={{ width: "90%" }}
      >
        <tbody>
          <tr>
            <td>Contributed</td>
            <td>:</td>
            <td> {headerCountsData.contributed || 0}</td>
          </tr>
          <tr>
            <td>Published</td>
            <td>:</td>
            <td>{headerCountsData.published || 0}</td>
          </tr>
          <tr>
            <td>Downloads</td>
            <td>:</td>
            <td>{headerCountsData.downloads || 0}</td>
          </tr>
          <tr>
            <td>Up for Archival</td>
            <td>:</td>
            <td>{headerCountsData.upForArchival || 0}</td>
          </tr>
          <tr>
            <td>Archived</td>
            <td>:</td>
            <td>{headerCountsData.archived || 0}</td>
          </tr>
          <tr>
            <td>Solution Re-use</td>
            <td>:</td>
            <td>{headerCountsData.solutionReUse || 0}</td>
          </tr>
        </tbody>
      </table>
      {/* </div>
                </div>
              </div>
            </div>
          </div>
        )} */}
      {/* </div> */}
    </>
  );
};

export default HeaderCounts;
