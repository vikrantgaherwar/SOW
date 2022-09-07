import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import campignimage from "../img/homepage-slides1.jpg";
import feedbacksurveyimage from "../img/feedbacksurveybanner.png";

export default function CampaignBanner() {
  const [daysLeft, setDaysLeft] = useState(0);
  useEffect(() => {
    dataaa();
  }, []);
  const dataaa = () => {
    var countDownDate = new Date("Apr 16, 2022 00:00:00").getTime();
    var now = new Date().getTime();
    var timeleft = countDownDate - now;
    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    setDaysLeft(days);
  };
  return (
    <Carousel>
     
      <Carousel.Item interval={1500}>
        <img
          className="d-block w-100"
          src={feedbacksurveyimage}
          alt="Second slide"
        />
        <Carousel.Caption>
          <a
            className="custom-marquee pr-5"
            target="_blank"
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=YSBbEGm2MUuSrCTTBNGV3IwxyI_KEntIrjZ61N5dx7hUM1hMRkZVTE9IRExZWUdRVTRPOUczUjVSMC4u"
          >
            Knowledge Management Center [DELTA] User Experience Survey is now
            LIVE!! Hurry up and submit your feedback. We've {daysLeft} more days
            left to participate
          </a>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={1500}>
        <img className="d-block w-100" src={campignimage} alt="First slide" />
      </Carousel.Item>
    </Carousel>
  );
}
