import Cookies from "js-cookie";
import React, { useState, useEffect, props, useContext } from "react";
import { SurveyDetails } from './SurveyDetails'
import URLConfig from "../URLConfig";
import axios, { post } from "axios";
import { toast } from "react-toastify";
const Surveys = ({ searchTerm, isClose }) => {
  const [isEnable, setisEnable] = useState(true);
  useEffect(() => {
    setisEnable()
  }, []);
  //setisEnable(isSurvey);
  let isChecked = false;
  const SurveyDetail = () => {
    let PostRequests = [];
    var surveyDetails = new SurveyDetails();
    surveyDetails.UserID = Cookies.get("mail");
    surveyDetails.SearchItem = searchTerm;
    surveyDetails.Survey = isChecked;

    const url = URLConfig.AddSurveyDetails();
    PostRequests.push(axios.post(url, surveyDetails));
    isClose(false);
    axios
      .all(PostRequests)
      .then(
        axios.spread((...responses) => {
          const response = responses;
          if (response[0].data === true) {
            toast.info("Thanks for your feedback..", {
              position: "bottom-left",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            })


          }
        })
      )
      .catch((errors) => {
        console.log(errors);
      });

  }

  const surveySubmit = (e) => {
    e.preventDefault();
    if (e.target.value === "Yes")
      isChecked = true;
    SurveyDetail();
  }

  const closeSurvey = () => {
    setisEnable(false);
    isClose(false);
  }

  return (
    <form
      name="surveyform"
      id="surveyform"
      className="feedback"
      encType="multipart/form-data"

    >
      {(
        <div>
       
          <div className="fixed-bottom">
            <div className="col-12">
              <div className="relevancy-main">
                <div className="relevancy-inside">
                <i class="fas fa-times-circle relevancy-close" onClick={() => closeSurvey()}></i>
                  <p className="pt-3 text-left pl-3">
                    <span className="pr-3">
                     Found Relevant Results?</span>
                    <button className="btn btn-sm btn-success mr-2" id="n1" title="Yes" value="Yes" onClick={(e) => surveySubmit(e)}>Yes</button>
                    <button className="btn btn-sm btn-danger" id="n3" title="No" value="No" onClick={(e) => surveySubmit(e)}>No</button>
                    <small className="hidden"> Reset </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
    </form>

  )
}


export default Surveys;
