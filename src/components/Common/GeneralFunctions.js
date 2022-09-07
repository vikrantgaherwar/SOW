import { useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import URLConfig from "../URLConfig";
import {
  UPDATE_FEEDBACK,
  UPDATE_BOOKMARK,
  UPDATE_DELTASHARE,
} from "../../UserContext";

export const fetchUserFeedbackDetails = async (dispatch) => {
  const URL =
    URLConfig.getURL_UserBookMark() +
    "/UserFeedback/" +
    Cookies.get("empnumber");
  try {
    const res = await axios.get(URL);
    if (res.data) {
      dispatch({ type: UPDATE_FEEDBACK, payload: [...res.data] });
    }
  } catch (error) {
    console.log("API Error", error);
  }
};

export const fetchUserBookmarkDetails = async (dispatch) => {
  const URL =
    URLConfig.getURL_UserBookMark() +
    "/UserBookmark/" +
    Cookies.get("empnumber");
  try {
    const res = await axios.get(URL);
    if (res.data) {
      dispatch({ type: UPDATE_BOOKMARK, payload: [...res.data] });
    }
  } catch (error) {
    console.log("API Error", error);
  }
};

export const fetchUserDeltaShareDetails = async (dispatch) => {
  const URL =
    URLConfig.getURL_UserBookMark() + "/UserDeltaShare/" + Cookies.get("mail");
  try {
    const res = await axios.get(URL);
    if (res.data) {
      dispatch({ type: UPDATE_DELTASHARE, payload: [...res.data] });
    }
  } catch (error) {
    console.log("API Error", error);
  }
};
