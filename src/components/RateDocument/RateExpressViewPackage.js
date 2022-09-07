import React, { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import Modal from "react-bootstrap/Modal";
import DocRatingSummary from "./DocRatingSummary";
import Cookies from "js-cookie";
import { post } from "axios";
import axios from "axios";
import { toast } from "react-toastify";
import URLConfig from "../URLConfig";
export default function RateExpressViewPackage({ packageName }) {
  const signal = axios.CancelToken.source();
  const [ratingComments, showRatingComments] = useState(false);
  const [ratingstatus, setRatingstatus] = useState(null);
  const [docRatingSummary, showDocRatingSummary] = useState(false);
  const [Comments, setComment] = useState(null);
  const [RatingId, setRatingId] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [initialRatingValue, setInitialRatingValue] = useState(0);
  const [placeholder, setPlaceholder] = useState(false);
  const [commentsErr, setCommentsErr] = useState(false);
  // states for over all rating and views
  const [average, setAverage] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [ratingCard, setRatingCard] = useState(null);
  const [docViews, setDocViews] = useState(0);
  const [bgClass, setbgClass] = useState("rating-boxs ml-4 ratingbox-default");
  useEffect(() => {
    findInitialRatingbyUser();
  }, [packageName]);
  const handleRating = (rate) => {
    setUserRating(rate);
    showRatingComments(true);
    findRatingData(rate);
  };
  const findRatingData = (rate) => {
    switch (rate) {
      case 20:
        setRatingId(1);
        setPlaceholder(true);
        break;
      case 40:
        setRatingId(2);
        setPlaceholder(true);
        break;
      case 60:
        setRatingId(3);
        setPlaceholder(true);
        break;
      case 80:
        setRatingId(4);
        setPlaceholder(false);
        break;
      case 100:
        setRatingId(5);
        setPlaceholder(false);
        break;
    }
  };
  const handleStatus = () => {
    showDocRatingSummary(true);
    // fetchDocRatingDatabyUser(feedbackRatingbyUser);
  };
  const submitFeedback = (e) => {
    e.preventDefault();
    const url = URLConfig.getURL_AddExpressViewRating();
    post(url, {
      RatingId: RatingId,
      Package: packageName,
      UserId: Cookies.get("empnumber"),
      Comments: Comments,
    }).then((res) => {
      showRatingComments(false);
      toast.info("Thank you for submitting your feedback", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  };

  const findInitialRatingbyUser = () => {
    const url = URLConfig.getURL_GetExpressViewRatingByUser();
    var config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        UserId: Cookies.get("empnumber"),
      },
    };
    try {
      axios(config).then(function (response) {
        console.log(response);
        setInitialRatingValue(
          response.data.filter(
            (x) => JSON.stringify(x.package) == JSON.stringify(packageName)
          )
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  // function calls for overall rating and views
  useEffect(() => {
    fetchDocRatingData();
  }, [packageName]);
  // function implementations
  const calculateAVerageRating = (ratingCard) => {
    let fiveStar = ratingCard[0]?.fiveStar ? ratingCard[0]?.fiveStar : 0;
    let fourStar = ratingCard[0]?.fourStar ? ratingCard[0]?.fourStar : 0;
    let threeStar = ratingCard[0]?.threeStar ? ratingCard[0]?.threeStar : 0;
    let twoStar = ratingCard[0]?.secondStar ? ratingCard[0]?.secondStar : 0;
    let firstStar = ratingCard[0]?.firstStar ? ratingCard[0]?.firstStar : 0;
    let totalRating = fiveStar + fourStar + threeStar + twoStar + firstStar;
    let average =
      (fiveStar * 5 +
        fourStar * 4 +
        threeStar * 3 +
        twoStar * 2 +
        firstStar * 1) /
      (fiveStar + fourStar + threeStar + twoStar + firstStar);
    setAverage(Math.round(average));
    setTotalRating(totalRating);
    switch (Math.round(average)) {
      case 1:
        setbgClass("rating-boxs ml-4 ratingbox-red");
        break;
      case 2:
        setbgClass("rating-boxs ml-4 ratingbox-amber");
        break;
      case 3:
        setbgClass("rating-boxs ml-4 ratingbox-green");
        break;
      case 4:
        setbgClass("rating-boxs ml-4 ratingbox-green");
        break;
      case 5:
        setbgClass("rating-boxs ml-4 ratingbox-green");
        break;
      default:
        setbgClass("rating-boxs ml-4 ratingbox-default");
    }
  };

  const fetchDocRatingData = () => {
    const url = URLConfig.getURL_GetStarRatingCalculationforExpressView();
    var config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        host: window.location.href,
        type: "Open_Document_Link",
      },
    };
    try {
      axios(config).then(function (response) {
        setRatingCard(
          response.data.lstFeedbackRating.filter(
            (x) => JSON.stringify(x.package) == JSON.stringify(packageName)
          )
        );
        calculateAVerageRating(
          response.data.lstFeedbackRating.filter(
            (x) => JSON.stringify(x.package) == JSON.stringify(packageName)
          )
        );
        setDocViews(
          response.data.lstDocfilenameCount.filter(
            (x) => JSON.stringify(x.package) == JSON.stringify(packageName)
          )
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        className="RatingApp"
        onMouseEnter={handleStatus}
        onMouseLeave={() => showDocRatingSummary(false)}
      >
        <Rating
          onClick={handleRating}
          ratingValue={rating}
          size={13}
          initialValue={initialRatingValue[0]?.ratingId}
        />
        <span>{ratingstatus}</span>
      </div>
      {ratingComments && (
        <Modal show={ratingComments}>
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext alignheader col-12" as="div">
              <a className="btn btn-sm btn-transp">Leave your comment</a>
              <a
                className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                onClick={() => showRatingComments(false)}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12">
              <div className="col-12 row pb-2">
                <div className="col-12">
                  {`Please provide your feedback ${
                    placeholder ? "(required)" : "(optional)"
                  }`}
                </div>
              </div>
              <div id="emailbox" className="col-12 row">
                <div className="form-group col-12 pl-2">
                  <textarea
                    className="form-control"
                    id="comment"
                    onChange={(e) => setComment(e.target.value)}
                    value={Comments ? Comments : ""}
                    placeholder="Enter Feedback"
                    rows="3"
                  />
                </div>
              </div>
              <div className="col-12">
                {commentsErr ? <p>Please provide your comments</p> : ""}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={(e) => submitFeedback(e)}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => showRatingComments(false)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
      {docRatingSummary && (
        <div id="eratingdivMsg">
          <DocRatingSummary
            packageName={packageName}
            average={average}
            totalRating={totalRating}
            ratingCard={ratingCard}
            docViews={docViews}
            bgClass={bgClass}
          />
        </div>
      )}
    </>
  );
}
