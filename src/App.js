import React, { useEffect, useContext, lazy, Suspense } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/anps.css";
import "./css/gamification.css";

import DocumentViewer from "./components/DocumentViewer";
import FeedbackReview from "./components/FeedbackReview";
import ReUpload from "./components/DocumentAnalysis/ReUpload";
import URLConfig from "./components/URLConfig";
import TrackingService from "./components/TrackingService";
import { UPDATE_STATE, UserContext } from "./UserContext";
import Gamification from "./components/GamificationDashboard/Gamification";
import SearchResults from "./components/SearchResults";
import {
  fetchUserFeedbackDetails,
  fetchUserBookmarkDetails,
  fetchUserDeltaShareDetails,
} from "./components/Common/GeneralFunctions";
import { SowAdminRoutes } from "./components/SOWAdmin/Pages/SOWAdminRoutes";
import { ToastContainer } from "react-toastify";

const Home = lazy(() =>
  import(/* webpackChunkName: "Home" */ `./components/Home`)
);

const Maintainance = lazy(() =>
  import(
    /* webpackChunkName: "Maintainance" */ `./components/Maintainance/Maintainance`
  )
);

const ScheduledMaintainance = lazy(() =>
  import(
    /* webpackChunkName: "ScheduledMaintainance" */ `./components/Maintainance/ScheduledMaintainance`
  )
);

const SOW = lazy(() =>
  import(/* webpackChunkName: "SOW" */ `./components/SOW`)
);

const SowRoutes = lazy(() =>
  import(/* webpackChunkName: "SowRoutes" */ `./components/SOW/Pages/SowRoutes`)
);

const ServerMonitor = lazy(() =>
  import(/* webpackChunkName: "ServerMonitor" */ `./components/ServerMonitor`)
);

const App = () => {
  const trackingService = new TrackingService();
  const [, dispatch] = useContext(UserContext);
  const scheduledOutage = false; //set value as true to show the Scheduled Outage Template

  useEffect(() => {
    if (URLConfig.isOAuthLoginEnabled()) {
      forceLogin();
    } else {
      dispatch({
        type: UPDATE_STATE,
        payload: {
          Name: "Cahill, Roy",
          Country: "United States (EN)",
        },
      });
      Cookies.set("name", "Unknown User");
      Cookies.set("country", "India");
    }
  }, []);

  useEffect(() => {
    const newInterval = setInterval(() => {
      if (document.getElementsByClassName("search-base").length) {
        fetchUserDeltaShareDetails(dispatch);
      }
    }, 1000 * 60 * 2);
    return () => clearInterval(newInterval);
  }, []);

  const forceLogin = () => {
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("redirect")) {
      //save redirect param
      localStorage.setItem("redirect", urlParams.get("redirect"));
    }

    if (urlParams.has("u") && Cookies.get("empnumber") === undefined) {
      // Detect User
      var encoded = Buffer.from(urlParams.get("u"), "base64").toString();
      urlParams = new URLSearchParams(encoded);
      var empNumber = urlParams.get("empNumber");
      //this.getEmployeeDetails(empNumber);
      Cookies.set("empnumber", empNumber);
      // window.location.href =
      //   window.location.protocol +
      //   "//" +
      //   window.location.host +
      //   window.location.pathname;
      window.history.replaceState({}, document.title, "/" + "");
      if (localStorage.getItem("redirect") !== null) {
        //Redirect Exists
        const RedirectURL = localStorage.getItem("redirect");
        localStorage.removeItem("redirect");
        window.location.href = RedirectURL;
      }
    } else if (Cookies.get("empnumber") === undefined) {
      //redirect for Auth
      if (urlParams.has("q")) {
        Cookies.set("q", urlParams.get("q"));
      }
      window.location.href = URLConfig.getURL_OAuth();
    }
    if (Cookies.get("empnumber") !== undefined) {
      getEmployeeDetails(Cookies.get("empnumber"));
      fetchUserFeedbackDetails(dispatch);
      fetchUserBookmarkDetails(dispatch);
      fetchUserDeltaShareDetails(dispatch);
      if (window.location.href.indexOf("gamification") === -1)
        trackingService.PageVisit(Cookies.get("empnumber"));
      if (localStorage.getItem("redirect") !== null) {
        //Redirect Exists
        const RedirectURL = localStorage.getItem("redirect");
        localStorage.removeItem("redirect");
        window.location.href = RedirectURL;
      }
      if (Cookies.get("q") != undefined && Cookies.get("q") != "") {
        var query = Cookies.get("q");
        Cookies.set("q", "");
        setTimeout(()=>{window.location.href = window.location.origin +"/search/?q=" + query;},500);
      }
    }
  };

  const getEmployeeDetails = async (empNumber) => {
    const URL = URLConfig.getURL_EmployeeAPI().toString() + empNumber;
    try {
      const res = await axios.get(URL);
      if (res?.data) {
        const Name = res.data.name;
        const Country = res.data.country;
        const mail = res.data.email;
        Cookies.set("name", Name);
        Cookies.set("country", Country);
        Cookies.set("empnumber", empNumber);
        Cookies.set("mail", mail);
        Cookies.set("UserLang", res.data.languagePreference);
        //Set User Roles
        if (res.data.roles.length > 0) {
          Cookies.set("roles", res.data.roles.join(","));
        } else {
          Cookies.set("roles", "Guest");
        }
        var RoleNames = [];
        res.data.roles.forEach((element) => {
          RoleNames.push(
            res.data.allRoles.filter((x) => x.roleSolar === element)[0].role
          );
        });
        RoleNames.length >= 1
          ? Cookies.set("roleNames", RoleNames.join(","))
          : Cookies.set("roleNames", "Guest");
        Cookies.set("doc_source", undefined);
        dispatch({
          type: UPDATE_STATE,
          payload: {
            Name: Cookies.get("name"),
            Country: Cookies.get("country"),
            empNumber: Cookies.get("empnumber"),
            isLoggedIn: true,
            UserRoles: res.data.roles,
            AllRoles: res.data.allRoles,
          },
        });
        trackingService.LogUserLogin(empNumber);
      } else {
        console.log("No Employee Data Found!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="AppContainer">
          <Suspense
            fallback={
              <div className="d-flex flex-column align-items-center">
                <div className="p-2">
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
              </div>
            }
          >
            <ToastContainer />
            <Switch>
              {scheduledOutage ? (
                <Route path="/" component={ScheduledMaintainance} exact />
              ) : (
                <>
                  <Route path="/" component={Home} exact />
                  {Cookies.get("empnumber") ? (
                    <Route exact path="/search" component={SearchResults} />
                  ) : (
                    <Route path="/" component={Home} exact />
                  )}
                  <Route path="/error" component={Maintainance} exact />
                  {process.env.REACT_APP_ENV === "UAT" && (
                    <>
                      <Route path="/sow-old" component={SOW} exact />
                      <Route path="/sow-old/:id" component={SOW} exact />
                    </>
                  )}
                  <Route path="/sow" component={SowRoutes} />
                  <Route path="/sow-admin" component={SowAdminRoutes} />
                  <Route path="/docview" component={DocumentViewer} />
                  <Route path="/feedbacks" component={FeedbackReview} />
                  <Route path="/ReUpload" component={ReUpload} />
                  <Route path="/server-monitor" component={ServerMonitor} />
                  <Route path="/gamification" component={Gamification} />
                </>
              )}
            </Switch>
          </Suspense>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
