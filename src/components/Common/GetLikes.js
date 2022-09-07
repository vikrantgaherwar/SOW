import React, { useEffect, useState } from "react";
import axios from "axios";

import URLConfig from "../URLConfig";

const GetLikes = ({ documentID, isLiked, feedbacks }) => {
  const signal = axios.CancelToken.source();
  const [loader, setLoader] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  useEffect(() => {
    getLikeDislikeCount(documentID, isLiked, signal.token);
  }, [feedbacks]);

  const getLikeDislikeCount = async (documentID, isLiked, cancelToken) => {
    const URL = URLConfig.getURL_UserFeedBack() + "/Likes";
    const data = { documentID: documentID, isLiked: isLiked };
    try {
      const res = await axios.put(URL, data, { cancelToken });
      if (res.data && res.data.length > 0) {
        setCount(res.data.length);
      } else {
        setCount(0);
      }
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
  };

  if (loader) {
    return "";
  } else {
    return count > 0 ? count : "";
  }
};

export default GetLikes;
