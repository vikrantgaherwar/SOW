import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import Cookies from "js-cookie";
import CountUp from "react-countup";
import UserDashBoard from "./UserDashBoard";
import LeaderDashBoard from "./LeaderDashBoard";
import { Spinner } from "react-bootstrap";
import URLConfig from "../URLConfig";
import {
  Modal,
  Button,
  Row,
  Col,
  Container,
  ModalBody,
} from "react-bootstrap/";
import Header from "./Header";

const Gamification = () => {
  const [error, setError] = useState(false);
  const [checkURL, setCheckURL] = useState(false);
  const [UserScore, setUserScore] = useState();
  const [TopFive, setTopFive] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [UserMetrics, setUserMetrics] = useState([]);

  const getUserGamificationDetails = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      UserId: Cookies.get("empnumber"),
      host: window.location.origin + "/",
      // UserId: "60066521",
      // host: "https://delta.app.hpecorp.net/",
    });

    var config = {
      method: "post",
      url: URLConfig.getURLDeltaAPI() + "UserGamificationDashboard",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        debugger;
        if (response.data) {
          setLoading(false);
          setUserScore(response.data);
          if (response.data.dashboardType == "Leader") {
            getTopFive();
            getActiveUserMetrics();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getActiveUserMetrics = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      UserId: Cookies.get("empnumber"),
      host: window.location.origin + "/",

      // UserId: "60066521",
      // host: "https://delta.app.hpecorp.net/",
    });

    var config = {
      method: "post",
      url:
        URLConfig.getURLDeltaAPI() +
        "UserGamificationDashboard/GetActiveUserDetails",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setUserMetrics(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTopFive = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      UserId: Cookies.get("empnumber"),
      host: window.location.origin + "/",
    });

    var config = {
      method: "post",
      url: URLConfig.getURLDeltaAPI() + "Topfive",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setTopFive(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserGamificationDetails();
    // const data = {
    //   achievementBonus: 250,
    //   activitiesCount: 669,
    //   activitiesTotal: 3345,
    //   badge: "Bronze",
    //   dashboardType: "Leader",
    //   documentContribution: 1,
    //   documentContributionTotal: 50,
    //   documentReUse: 0,
    //   feedbackCount: 2,
    //   myProjectUsageCount: 52,
    //   myProjectUsageTotal: 1560,
    //   onboarding: 100,
    //   searchReleavencyFeedback: 0,
    //   shareCount: 3,
    //   totalPoints: 5055,
    //   uniqueUsers: 0,
    //   viewCount: 664,
    // };
    // setUserScore(data);
  }, []);

  return (
    <>
      <Header></Header>
      {UserScore !== null && UserScore?.dashboardType == "Leader" && (
        <LeaderDashBoard
          UserScore={UserScore}
          TopFive={TopFive}
          UserMetrics={UserMetrics}
        ></LeaderDashBoard>
      )}

      {UserScore !== null && UserScore?.dashboardType != "Leader" && (
        <UserDashBoard UserScore={UserScore}></UserDashBoard>
      )}
      {Loading && (
        <div className="d-flex flex-column align-items-center">
          <div className="p-2">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        </div>
      )}
    </>
  );
};

export default Gamification;
