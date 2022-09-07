import React, { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import Modal from "react-bootstrap/Modal";
import DocRatingSummary from "./DocRatingSummary";
import Cookies from "js-cookie";
import { post } from "axios";
import axios from "axios";
import { toast } from "react-toastify";
import URLConfig from "../URLConfig";
export default function Rate({
  DocId,
  onRating,
  count,
  DocName,
  DocURL,
  docList,
}) {
  const [ratingComments, showRatingComments] = useState(false);
  const [docRatingSummary, showDocRatingSummary] = useState(false);
  const [Comments, setComment] = useState(null);
  const [RatingId, setRatingId] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [initialRatingValue, setInitialRatingValue] = useState(0);
  const [placeholder, setPlaceholder] = useState(false);
  const [commentsErr, setCommentsErr] = useState(false);
  const [commentsErr2, setCommentsErr2] = useState(false);
  // values for over all rating
  const [average, setAverage] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [ratingCard, setRatingCard] = useState(null);
  const [docViews, setDocViews] = useState(0);
  const [bgClass, setbgClass] = useState("rating-boxs ml-4 ratingbox-default");
  const [starSize, setStarSize] = useState(11);
  useEffect(() => {
    findInitialRatingbyUser();
  }, [DocId]);
  useEffect(() => {
    resizeStarIcon();
  }, [docList]);
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
  };
  const submitFeedback = (e) => {
    e.preventDefault();
    //validations
    if (Comments === null && placeholder) {
      setCommentsErr(true);
    } else if (initialRatingValue[0]?.ratingValue === RatingId) {
      setCommentsErr2(true);
    } else {
      const url = URLConfig.DeltaDocumentRating();
      post(url, {
        RatingId: RatingId,
        DocId: DocId,
        UserId: Cookies.get("empnumber"),
        Comments: Comments,
        DocName: DocName,
        DocURL: DocURL,
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
    }
  };

  const findInitialRatingbyUser = () => {
    const url = URLConfig.GetDocRatingByUser();
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
        setInitialRatingValue(
          response.data.filter(
            (x) => JSON.stringify(x.docId) == JSON.stringify(DocId)
          )
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch the over all rating and views for the document
  const fetchDocRatingData = () => {
    let url = URLConfig.GetAllDocRatings();
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
          response?.data?.lstFeedbackRating?.filter(
            (x) => JSON.stringify(x.docid) == JSON.stringify(DocId)
          )
        );
        calculateAVerageRating(
          response?.data?.lstFeedbackRating?.filter(
            (x) => JSON.stringify(x.docid) == JSON.stringify(DocId)
          )
        );
        setDocViews(
          response?.data?.lstDocfilenameCount?.filter(
            (x) => JSON.stringify(x.fileName) == JSON.stringify(DocName)
          )
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDocRatingData();
  }, [DocId]);
  // function implementations
  const calculateAVerageRating = (ratingCard) => {
    // console.log(ratingCard);
    let fiveStar = ratingCard[0]?.fiveStar ? ratingCard[0]?.fiveStar : 0;
    let fourStar = ratingCard[0]?.fourStar ? ratingCard[0]?.fourStar : 0;
    let threeStar = ratingCard[0]?.thirdStar ? ratingCard[0]?.thirdStar : 0;
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
    setAverage(average == NaN ? 0 : Math.round(average));
    setTotalRating(totalRating);
    // console.log(Math.round(average));
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

  const resizeStarIcon = () => {
    const ele = document.getElementsByClassName("capsule-container");
    if (ele.length > 2) {
      setStarSize(11);
    } else if (ele.length == 1) {
      setStarSize(13);
    }
    if (ele.length == 2) {
      setStarSize(13);
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
          size={starSize}
          initialValue={initialRatingValue[0]?.ratingId}
        />
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
                    value={Comments}
                    placeholder="Enter Feedback"
                    rows="3"
                  />
                </div>
              </div>
              <div className="col-12">
                {commentsErr ? (
                  <p className="custom-feedbackNote fontx12">
                    Please provide your comments
                  </p>
                ) : (
                  ""
                )}
                {commentsErr2 ? (
                  <p className="custom-feedbackNote fontx12">
                    New rating provided is same as the old
                  </p>
                ) : (
                  ""
                )}
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
        <div id="ratingdivMsg">
          <DocRatingSummary
            DocId={DocId}
            DocName={DocName}
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
