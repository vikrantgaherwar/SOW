import React, { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import URLConfig from "./URLConfig";
import { map } from "lodash";

import DefaultBannerImage from "../img/basic-banner.png";

const CampignBanner = () => {
  const signal = axios.CancelToken.source();
  const [campaignData, setCampaignData] = useState([]);

  useEffect(() => {
    fetchCampaignData(signal.token);
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  const fetchCampaignData = async (cancelToken) => {
    const URL =
      URLConfig.getURLDeltaAPI() + "DeltaCampaign/GetCurrentDeltaCampaigns";
    try {
      const res = await axios.get(URL, { cancelToken });
      if (res.data) {
        setCampaignData([...res.data]);
      }
    } catch (error) {
      console.log("API Error", error);
    }
  };

  return (
    <div align="center" className="col-12 mt-1" style={{ height: "200px" }}>
      <Carousel>
        {campaignData.length > 0 ? (
          map(campaignData, (item) => (
            <Carousel.Item key={item.id}>
              <img
                src={`https://hpedelta.com:8083/${item.imageId}`}
                style={{
                  width: "100%",
                  height: "200px",
                }}
                alt={`${item.campaignDescription}`}
              />
              <Carousel.Caption>
                {item.campaignUrl && (
                  <h5 style={{ filter: "invert(1) grayscale(1) contrast(9)" }}>
                    <a href={item.campaignUrl}> {item.campaignTitle}</a>
                  </h5>
                )}
              </Carousel.Caption>
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img
              src={DefaultBannerImage}
              style={{ width: "100%", height: "200px" }}
              alt="Knowledge Management Center"
            />
          </Carousel.Item>
        )}
      </Carousel>
    </div>
  );
};

export default CampignBanner;
