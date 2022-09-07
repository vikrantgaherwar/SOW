import React from "react";
import { useEffect, useState } from "react";
import {
  Widget,
  addResponseMessage,
  addLinkSnippet,
  toggleMsgLoader,
} from "react-chat-widget";
import axios from "axios";
import Cookies from "js-cookie";
import botAvatar from "../img/botAvatar.png";
import userAvatar from "../img/userAvatar.jpg";
import CryptoJS from "crypto-js";
import "react-chat-widget/lib/styles.css";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import TrackingService from "./TrackingService";
const DOC_PREVIEW = "docPreview";
const trackingService = new TrackingService();
function ChatBot() {
  const [previewURL, setPreviewURL] = useState([{ url: "", doc_Link: "" }]);
  const [modal, setModal] = useState({
    [DOC_PREVIEW]: false,
  });
  useEffect(() => {
    addResponseMessage(
      "Hello " + Cookies.get("name") + ", Thanks for choosing to chat with me."
    );
  }, []);

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    console.log(Cookies.get("empnumber"), "chatbot", newMessage);
    trackingService.LogChatbotClick(Cookies.get("empnumber"), newMessage);
    var data = JSON.stringify({
      message: newMessage,
      employee_id: Cookies.get("empnumber"),
    });

    var config = {
      method: "post",
      url: "https://delta.app.hpecorp.net:5002/deltabot",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    toggleMsgLoader();

    axios(config)
      .then(function (response) {
        debugger;
        toggleMsgLoader();

        if (response.data.answer.split("href").length > 1) {
          const title = response.data.answer
            .split("href")[0]
            .replace("<b><u><a ", "");
          const link = response.data.answer
            .split("href")[1]
            .replace('="', "")
            .split('"')[0];

          addLinkSnippet({
            title: title,
            link: link,
            target: "_blank",
          });

          if (link.indexOf("8082") > 0) {
            var Ele =
              document.getElementsByClassName("rcw-link")[
                document.getElementsByClassName("rcw-link").length - 1
              ];
            Ele.onclick = function (ele) {
              handlePreview(ele.target.href);
              return false;
            };
          }
        } else {
          addResponseMessage(response.data.answer);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    // Now send the message throught the backend API
    //addResponseMessage(response);
  };

  const handlePreview = (url) => {
    var filepath =
      "F:\\AnPS\\Sharepointfiles\\" +
      url
        .replace("https://hpedelta.com:8082/", "")
        .replace(/ /g, "%20")
        .split("/")
        .join("\\");
    filepath = CryptoJS.enc.Utf8.parse(filepath);
    filepath = CryptoJS.enc.Base64.stringify(filepath);
    const previewURL = "https://hpedelta.com/Viewer.aspx?file=" + filepath;
    console.log(previewURL);
    setPreviewURL((prevState) => ({
      ...prevState,
      url: previewURL,
      doc_Link: url,
    }));
    handleModalOpen(DOC_PREVIEW);
  };
  const handleModalOpen = (item) => {
    console.log(Cookies.get("empnumber"), "chatbot");
    setModal((prevState) => ({ ...prevState, [item]: true }));
  };
  const handleModalClose = (item) => {
    setModal((prevState) => ({ ...prevState, [item]: false }));
  };
  const logChatbot = () => {};
  return (
    <>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        showTimeStamp={false}
        toggleMsgLoader={true}
        title={"Delta Chat support"}
        subtitle={"Hi, My name is Dot. How can I help you?"}
        profileAvatar={botAvatar}
        profileClientAvatar={userAvatar}
      />

      {/* Document Preview Modal */}
      {modal[DOC_PREVIEW] && (
        <Modal
          show={modal[DOC_PREVIEW]}
          onHide={() => handleModalClose(DOC_PREVIEW)}
          dialogClassName="preview-modal"
          onClick={logChatbot}
        >
          <Modal.Header>
            <Modal.Title>Document Preview</Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleModalClose(DOC_PREVIEW)}
              class="close"
              data-dismiss="modal"
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body dialogClassName="preview-body">
            <div className="preview_iframe">
              <iframe frameborder="0" allowfullscreen src={previewURL.url} />
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleModalClose(DOC_PREVIEW)}
              >
                Close
              </button>
            </Modal.Footer> */}
        </Modal>
      )}
    </>
  );
}

export default ChatBot;
