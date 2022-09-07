import React from "react";
const DocRatingSummary = ({
  average,
  totalRating,
  ratingCard,
  docViews,
  bgClass,
}) => {
  return (
    <>
      {ratingCard && (
        <div className="row">
          <div className={bgClass}>
            <div style={{ fontSize: "14px" }} className="mt-2">
              <b>{average ? average : 0} </b>
              <i className="fas fa-star fa-sm"></i>
            </div>
            <p className="pl-2" style={{ fontSize: "9px" }}>
              {totalRating} Ratings & <br />
              {docViews[0]?.count ? docViews[0]?.count : 0} Views
            </p>
          </div>
          <div className="rating-bar0 mt-1 ml-2">
            <table className="text-left mx-auto">
              <tr>
                <td className="rating-label">
                  5 <i className="fas fa-star fa-xs rating-star"></i>
                </td>
                <td className="rating-bar">
                  <div className="bar-container">
                    <div className="bar-5"></div>
                  </div>
                </td>
                <td className="text-right">
                  {ratingCard[0]?.fiveStar ? ratingCard[0]?.fiveStar : 0}
                </td>
              </tr>
              <tr>
                <td className="rating-label">
                  4 <i className="fas fa-star fa-xs rating-star"></i>
                </td>
                <td className="rating-bar">
                  <div className="bar-container">
                    <div className="bar-4"></div>
                  </div>
                </td>
                <td className="text-right">
                  {ratingCard[0]?.fourStar ? ratingCard[0]?.fourStar : 0}
                </td>
              </tr>
              <tr>
                <td className="rating-label">
                  3 <i className="fas fa-star fa-xs rating-star"></i>
                </td>
                <td className="rating-bar">
                  <div className="bar-container">
                    <div className="bar-3"></div>
                  </div>
                </td>
                <td className="text-right">
                  {ratingCard[0]?.threeStar ? ratingCard[0]?.threeStar : 0}
                </td>
              </tr>
              <tr>
                <td className="rating-label">
                  2 <i className="fas fa-star fa-xs rating-star"></i>
                </td>
                <td className="rating-bar">
                  <div className="bar-container">
                    <div className="bar-2"></div>
                  </div>
                </td>
                <td className="text-right">
                  {ratingCard[0]?.secondStar ? ratingCard[0]?.secondStar : 0}
                </td>
              </tr>
              <tr>
                <td className="rating-label">
                  1 <i className="fas fa-star fa-xs rating-star"></i>
                </td>
                <td className="rating-bar">
                  <div className="bar-container">
                    <div className="bar-1"></div>
                  </div>
                </td>
                <td className="text-right">
                  {ratingCard[0]?.firstStar ? ratingCard[0]?.firstStar : 0}
                </td>
              </tr>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
export default DocRatingSummary;
