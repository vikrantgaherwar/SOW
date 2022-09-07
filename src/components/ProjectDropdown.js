// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import map from "lodash/map";
// import { toast } from "react-toastify";

// import URLConfig from "./URLConfig";

// const ProjectDropdown = ({
//   setActiveFilterAndValue,
//   onSubmit,
//   onCustomerSubmit,
// }) => {
//   const signal = axios.CancelToken.source();
//   const [projectDropdownData, setProjectDropdownData] = useState([]);

//   useEffect(() => {
//     fetchPracticeData(signal.token);
//     return () => {
//       signal.cancel("Request Cancelled");
//     };
//   }, []);

//   const fetchPracticeData = async (cancelToken) => {
//     const URL =
//       URLConfig.get_CustomerCapsule_API_Host() +
//       "services/data/v38.0/sobjects/query2?q=SELECT%20Opportunity_ID__c,%20Account.Name,%20Account.Account_ST_Name__c,%20OwnerId,%20Owner.Username%20FROM%20Opportunity%20WHERE%20StageName%20IN%20(%2701%20-%20Understand%20Customer%27,%2702%20-%20Validate%20Opportunity%27,%20%2703%20-%20Qualify%20the%20Opportunity%27,%20%2704A%20-%20Develop%20Solution%27,%20%2704B%20-%20Propose%20Solution%27,%20%2705%20-%20Negotiate%20%40%20Close%27)%20AND%20Owner.Legacy_Employee_Ref__c=%27" +
//       // Cookies.get("empnumber") +
//       "20077866" +
//       "%27";
//     const config = URLConfig.ApplyAuth(URL);
//     try {
//       const res = await axios({ ...config, cancelToken });
//       if (res.data && res.data.response) {
//         setProjectDropdownData([...res.data.response]);
//       }
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log("Request canceled", error.message);
//       } else {
//         console.log("API Error", error);
//       }
//     }
//   };

//   const handleOppSelect = async (event, item) => {
//     event.preventDefault();
//     setActiveFilterAndValue("OPP ID", item.Opportunity_ID__c);

//     const Config = URLConfig.GetSearchKeyByOppID(this.state.fineSearch.trim());

//     try {
//       const res = await axios(Config);
//       if (res.data && res.data.response) {
//         onSubmit(res.data.response.replace(/[#?&@]/g, " "));
//         onCustomerSubmit(
//           item.Opportunity_ID__c.trim()
//             .replace(/[#?&@]/g, " ")
//             .toUpperCase()
//             .split(".")[0]
//         );
//       } else if (res.data && res.data.error) {
//         toast.error(res.data.error, {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//       }
//     } catch (error) {
//       toast.error(error, {
//         position: "top-right",
//         autoClose: 4000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   return (
//     <>
//       {/* <button
//         className="btn btn-success dropdown-toggle btn-sm header_button dropdown_btn_width"
//         type="button"
//         // data-toggle="dropdown"
//         data-toggle={
//           projectDropdownData && projectDropdownData.length > 0
//             ? "dropdown"
//             : ""
//         }
//         aria-haspopup="true"
//         aria-expanded="false"
//       >
//         My Projects
//       </button> */}
//       <button
//         className="btn btn-sm practicebtn"
//         type="button"
//         // data-toggle="dropdown"
//         data-toggle={
//           projectDropdownData && projectDropdownData.length > 0
//             ? "dropdown"
//             : ""
//         }
//         aria-haspopup="true"
//         aria-expanded="false"
//       >
//         My Projects
//       </button>
//       <div
//         className="dropdown-menu fontx12"
//         aria-labelledby="myprojects"
//         style={{
//           width: "250px",
//           maxHeight: "250px",
//           overflowY: "auto",
//         }}
//       >
//         {map(projectDropdownData, (item, idx) => (
//           <a
//             key={item.Opportunity_ID__c}
//             className="dropdown-item"
//             href="#"
//             onClick={(e) => handleOppSelect(e, item)}
//             style={{
//               backgroundColor: idx % 2 ? "" : "rgba(0, 0, 0, 0.05)",
//             }}
//           >
//             <span className="header-word-break">
//               {`${item.Opportunity_ID__c} (${item.Account_Account_ST_Name__c})`}
//             </span>
//           </a>
//         ))}
//       </div>
//     </>
//   );
// };

// export default ProjectDropdown;

import React, { useState, useEffect } from "react";
import axios from "axios";
import TrackingService from "./TrackingService";
import Cookies from "js-cookie";
import map from "lodash/map";
import { toast } from "react-toastify";

import URLConfig from "./URLConfig";

const ProjectDropdown = ({
  setActiveFilterAndValue,
  onSubmit,
  onCustomerSubmit,
}) => {
  const signal = axios.CancelToken.source();
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [psaProjectData, setPsaProjectData] = useState([]);
  const trackingService = new TrackingService();
  useEffect(() => {
    fetchPracticeData(signal.token);
    fetchOwnerID(signal.token);
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  const fetchData = (data) => {
    const URL =
      URLConfig.get_CustomerCapsule_API_Host() +
      "services/data/v38.0/sobjects/query2?q=Select%20Id,OwnerId,%20Name,%20CurrencyIsoCode,%20CreatedDate,%20pse__Billed__c,%20pse__Billing_Type__c,%20pse__End_Date__c,%20pse__Is_Active__c,%20pse__Is_Template__c,%20pse__Opportunity__r.Opportunity_ID__c,%20pse__Planned_Hours__c,%20pse__Practice__r.Name,%20pse__Project_ID__c,%20pse__Project_Phase__c,%20pse__Project_Status__c,%20pse__Project_Type__c,%20pse__Revenue__c,%20pse__Stage__c,%20pse__Start_Date__c,%20pse__Total_Costs__c,%20PSA_Funded__c,%20PSA_Product_Family__c,%20PSA_Overall_Status__c,%20pse__Region__c,%20PSA_Location_Country__c,%20%20pse__Account__r.Name,%20pse__Account__r.Focus_Account__c,%20pse__Account__r.Account_ST_ID__c,%20pse__Account__r.Account_ST_Name__c,%20pse__Account__r.Top_Parent_ST_ID__c,%20pse__Account__r.Top_Parent_ST_Name__c,%20pse__Account__r.WorldRegion_Region__c,%20pse__Account__r.WorldRegion_SubRegion1__c,%20pse__Account__r.Country_Code__c%20from%20pse__Proj__c%20where%20OwnerId=%27" +
      data +
      "%27%20AND%20pse__Project_Status__c%20NOT%20IN%20(%27Completed%27,%20%27Complete%27)%20AND%20pse__Project_Phase__c%20NOT%20IN%20(%27Closed%27) AND CreatedDate >= LAST_N_YEARS:1";
    const config = URLConfig.ApplyAuth(URL);
    axios(config).then((res) => {
      if (res?.data && res?.data?.response) {
        setPsaProjectData([...res.data.response]);
      }
    });
  };
  const fetchOwnerID = async (cancelToken) => {
    const URL =
      URLConfig.get_CustomerCapsule_API_Host() +
      "services/data/v38.0/sobjects/query2?q=Select%20Id,Username,EmployeeNumber,Legacy_Employee_Ref__c,LastName,FirstName,Name%20from%20User%20where%20Legacy_Employee_Ref__c=%27" +
      Cookies.get("empnumber") +
      // "20077866" +
      // "21767492" +
      "%27";
    const config = URLConfig.ApplyAuth(URL);
    try {
      const res = await axios({ ...config, cancelToken });
      if (res.data && res.data.response) {
        fetchData(res.data.response[0].Id);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.log("API Error", error);
      }
    }
  };
  const fetchPracticeData = async (cancelToken) => {
    const URL =
      URLConfig.get_CustomerCapsule_API_Host() +
      "services/data/v38.0/sobjects/query2?q=SELECT%20Opportunity_ID__c,%20Account.Name,%20Id,%20Account.Account_ST_Name__c,%20OwnerId,%20Owner.Username%20FROM%20Opportunity%20WHERE%20StageName%20IN%20(%2701%20-%20Understand%20Customer%27,%2702%20-%20Validate%20Opportunity%27,%20%2703%20-%20Qualify%20the%20Opportunity%27,%20%2704A%20-%20Develop%20Solution%27,%20%2704B%20-%20Propose%20Solution%27,%20%2705%20-%20Negotiate%20%40%20Close%27)%20AND%20Owner.Legacy_Employee_Ref__c=%27" +
      Cookies.get("empnumber") +
      // "20077866" +
      // "21767492" +
      "%27 AND CreatedDate >= LAST_N_YEARS:1";
    const config = URLConfig.ApplyAuth(URL);
    try {
      const res = await axios({ ...config, cancelToken });
      if (res.data && res.data.response) {
        setProjectDropdownData([...res.data.response]);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.log("API Error", error);
      }
    }
  };
  const handleOppSelect = async (event, item) => {
    event.preventDefault();
    setActiveFilterAndValue("OPP ID", item.Opportunity_ID__c);

    const Config = URLConfig.GetSearchKeyByOppID(item.Opportunity_ID__c.trim());

    try {
      const res = await axios(Config);
      if (res.data && res.data.response) {
        onSubmit(res.data.response.replace(/[#?&@]/g, " "));
        onCustomerSubmit(
          item.Opportunity_ID__c.trim()
            .replace(/[#?&@]/g, " ")
            .toUpperCase()
            .split(".")[0]
        );
      } else if (res.data && res.data.error) {
        toast.error(res.data.error, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const handlePSAProjectSelect = async (event, item) => {
    event.preventDefault();
    onCustomerSubmit(
      item.pse__Project_ID__c
        .trim()
        .replace(/[#?&@]/g, " ")
        .toUpperCase()
        .split(".")[0]
    );
  };
  const MyProjectlink = (item) => {
    console.log(item, "MyProjectlink");
    trackingService.LogMyProjectlinkClick(Cookies.get("empnumber"), item, true);
  };
  return (
    <>
      {/* <button
        className="btn btn-success dropdown-toggle btn-sm header_button dropdown_btn_width"
        type="button"
        // data-toggle="dropdown"
        data-toggle={
          projectDropdownData && projectDropdownData.length > 0
            ? "dropdown"
            : ""
        }
        aria-haspopup="true"
        aria-expanded="false"
      >
        My Projects
      </button> */}
      {/* <button
        className="btn btn-sm practicebtn"
        type="button"
        // data-toggle="dropdown"
        data-toggle={
          projectDropdownData && projectDropdownData.length > 0
            ? "dropdown"
            : ""
        }
        aria-haspopup="true"
        aria-expanded="false"
      >
        My Projects
      </button> */}
      {/* <div
        className="dropdown-menu fontx12"
        aria-labelledby="myprojects"
        style={{
          width: "250px",
          maxHeight: "250px",
          overflowY: "auto",
        }}
      > */}

      {/* </div> */}
      <div className="accordion">
        {projectDropdownData.length == 0 && psaProjectData.length == 0 && (
          <div style={{ height: "50px", overflowY: "auto" }} className="ml-2">
            <p className="projectstext">No Opportunity/PSA Projects</p>
          </div>
        )}
        {projectDropdownData.length > 0 && (
          <>
            <div className="card" align="left">
              <h5 className="mb-0 in-flex">
                <button
                  className="btn btn-link btn-full pt-0 pb-0 pl-2 collapsed"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  aria-controls="projectSFDC"
                  data-target="#projectSFDC"
                >
                  Opportunities ({projectDropdownData.length})
                </button>
              </h5>
            </div>
            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#projectSFDC"
              aria-expanded="false"
              id="projectSFDC"
            >
              <div
                style={{ height: "250px", overflowY: "auto" }}
                className="selections_container col"
              >
                {map(projectDropdownData, (item, idx) => (
                  <div
                    className="row"
                    key={item.id}
                    style={{
                      paddingLeft: "20px",
                      backgroundColor: idx % 2 ? "" : "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <a
                      target="_blank"
                      title="Click to open SFDC"
                      href={`https://hp.my.salesforce.com/${item.Id}`}
                    >
                      {/* {dom.domainName} */}
                      <span className="header-word-break">
                        {`${item.Opportunity_ID__c} (${item.Account_Account_ST_Name__c})`}
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {psaProjectData.length > 0 && (
          <>
            <div className="card" align="left">
              <h5 className="mb-0 in-flex">
                <button
                  className="btn btn-link btn-full pt-0 pb-0 pl-2 collapsed"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  aria-controls="projectPSA"
                  data-target="#projectPSA"
                >
                  PSA Projects ({psaProjectData.length})
                </button>
              </h5>
            </div>
            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#projectPSA"
              aria-expanded="false"
              id="projectPSA"
            >
              <div
                style={{ height: "250px", overflowY: "auto" }}
                className="selections_container col"
              >
                {map(psaProjectData, (item, idx) => (
                  <div
                    className="row "
                    key={item.id}
                    style={{
                      paddingLeft: "20px",
                      backgroundColor: idx % 2 ? "" : "rgba(0, 0, 0, 0.05)",
                    }}
                    onClick={() => MyProjectlink(item.Name)}
                  >
                    <a
                      target="_blank"
                      title="Click to open SFDC"
                      href={`https://hp.my.salesforce.com/${item.Id}`}
                    >
                      {/* {dom.domainName} */}
                      <span className="header-word-break">{item.Name}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProjectDropdown;
