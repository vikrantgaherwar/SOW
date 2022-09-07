import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import URLConfig from "../URLConfig";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios, { post } from "axios";
import { FeedbackDetails } from "./FeedbackDetails";
const Feedback = ({ onFeedbackFormClose }) => {
  const [feedbackType, setFeedackType] = useState(null);
  const [feedbackCategory, setFeedackCategory] = useState(null);
  const [feedbackContent, setFeedackContent] = useState(null);
  const [files, setFiles] = useState([]);
  const [feedbackTypeErrorMsg, setFeedbackTypeErrorMsg] = useState(false);
  const [feedbackCategoryErrorMsg, setFeedbackCategoryErrorMsg] = useState(
    false
  );
  const [contentErrorMessage, setContentErrorMessage] = useState(false);
  const [feedbackContentErrorMsg, setFeedbackContentErrorMsg] = useState(false);
  const [leftContent, setLeftContent] = useState(8000);
  const [showCharacterLimit, setShowCharacterLimit] = useState(false);
  const [showFileSizeExceedError, setShowFileSizeExceedError] = useState(false);
  const [showFileExtensionError, setShowFileExtensionError] = useState(false);
  const [showSubmissionFailed, setShowSubmissionFailed] = useState(false);
  const [attachmentMandatory, setAttachmentMandatory] = useState(false);
  const [placeholderValue, setPlaceholderValue] = useState("Feedback Type");
  const [placeholderValue2, setPlaceholderValue2] = useState(
    "Please select the Category"
  );
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [feedbackCategories, setFeedbackCategories] = useState([]);
  const [feedbackTypeName, setFeedbackTypeName] = useState(null);
  const signal = axios.CancelToken.source();
  useEffect(() => {
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);
  useEffect(() => {
    getFeedbackTypes();
    getFeedbackCategory();
  }, []);
  const getFeedbackTypes = async (cancelToken) => {
    const url = URLConfig.getFeedbackTypesURL();
    try {
      const { data } = await axios.get(url, { cancelToken });
      setFeedbackTypes(data);
    } catch (error) {
      console.log("API Error", error);
    }
  };
  const getFeedbackCategory = async (cancelToken) => {
    const url = URLConfig.getFeedbackCategoryURL();
    try {
      const { data } = await axios.get(url, { cancelToken });
      setFeedbackCategories(data);
    } catch (error) {
      console.log("API Error", error);
    }
  };
  const feedbackSubmit = (e) => {
    e.preventDefault();

    if (feedbackType === null) {
      setFeedbackTypeErrorMsg(true);
    }

    if (feedbackCategory === null) {
      setFeedbackCategoryErrorMsg(true);
    }
    if (feedbackContent === null) {
      setFeedbackContentErrorMsg(true);
    }
    if (
      !feedbackTypeErrorMsg &&
      !feedbackCategoryErrorMsg &&
      !feedbackContentErrorMsg &&
      !showFileExtensionError &&
      !showFileSizeExceedError
    ) {
      if (feedbackTypeName.toLowerCase() === "defect") {
        if (files && files.length > 0) {
          setAttachmentMandatory(false);
          const url = URLConfig.UploadFeedbackAttachment();
          const formData = new FormData();
          if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              formData.append("files", files[i]);
            }
            const config = {
              headers: {
                "content-type": "multipart/form-data",
              },
            };
            post(url, formData).then((res) => {
              if (res.data) {
                SaveFeedbackDetails();
              }
            });
          } else {
            SaveFeedbackDetails();
          }
        } else {
          setAttachmentMandatory(true);
        }
      } else {
        const url = URLConfig.UploadFeedbackAttachment();
        const formData = new FormData();
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
          }
          const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
          };
          post(url, formData).then((res) => {
            if (res.data) {
              SaveFeedbackDetails();
            }
          });
        } else {
          SaveFeedbackDetails();
        }
      }
    } else {
      setShowSubmissionFailed(true);
    }
  };
  const SaveFeedbackDetails = () => {
    let PostRequests = [];
    let fileList = [];
    var feedbackDetails = new FeedbackDetails();
    feedbackDetails.FeedbackId = "";
    feedbackDetails.Type = feedbackType;
    feedbackDetails.Types = {
      Id: feedbackType,
      Type: feedbackTypeName,
    };
    feedbackDetails.Category = feedbackCategory;
    feedbackDetails.Description = feedbackContent;
    // feedbackDetails.Attachment = files.length > 0 ? files[0].name : "";
    // feedbackDetails.Attachment = "Doc1.docx,Doc2.docx";
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        fileList.push(files[i].name);
      }
    }
    feedbackDetails.Attachment = fileList.toString();
    feedbackDetails.UserId = Cookies.get("empnumber");
    feedbackDetails.UserName = Cookies.get("name");
    feedbackDetails.UserEmail = Cookies.get("mail");
    const url = URLConfig.AddFeedbackDetails();
    PostRequests.push(axios.post(url, feedbackDetails));

    axios
      .all(PostRequests)
      .then(
        axios.spread((...responses) => {
          const response = responses;
          if (response[0].data === true) {
            onFeedbackFormClose();
          }
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  };
  const handleFeedbackType = (e) => {
    var feedbacktype = e.target.value;
    if (feedbacktype === null || feedbacktype.length == 0) {
      setFeedbackTypeErrorMsg(true);
    } else {
      setFeedbackTypeErrorMsg(false);
      setFeedackType(e.target.value);
      setFeedbackTypeName(e.target.options[e.target.selectedIndex].text);
    }
  };
  const handleFeedbackCategory = (e) => {
    var feedbackcategory = e.target.value;
    if (feedbackcategory === null || feedbackcategory.length == 0) {
      setFeedbackCategoryErrorMsg(true);
    } else {
      setFeedbackCategoryErrorMsg(false);
      setFeedackCategory(e.target.value);
    }
  };
  const handleFeedbackContent = (e) => {
    let content = e.target.value;
    if (content === null || content.length == 0) {
      setLeftContent(8000);
      setFeedbackContentErrorMsg(true);
      setContentErrorMessage(false);
    } else {
      let contentLength = content.length;
      setShowCharacterLimit(true);
      let leftContent = 8000 - contentLength;
      leftContent >= 0 ? setLeftContent(leftContent) : setLeftContent(0);
      if (contentLength < 8000) {
        setFeedbackContentErrorMsg(false);
        setContentErrorMessage(false);
        setFeedackContent(e.target.value);
      } else {
        setContentErrorMessage(true);
        setFeedbackContentErrorMsg(false);
      }
    }
  };
  const handleFeedbackAttachment = (e) => {
    const fi = document.getElementById("files");
    if (fi.files.length > 0) {
      for (var i = 0; i < fi.files.length; ++i) {
        var file1 = fi.files.item(i).name;
        if (file1) {
          var file_size = fi.files.item(i).size;
          file_size = Math.round(file_size / 1024);
          if (file_size < 4096) {
            var ext = file1.split(".").pop().toLowerCase();
            if (
              ext.indexOf("jpg") == -1 &&
              ext.indexOf("jpeg") == -1 &&
              ext.indexOf("png") == -1 &&
              ext.indexOf("gif") == -1 &&
              ext.indexOf("bmp") == -1 &&
              ext.indexOf("docx") == -1 &&
              ext.indexOf("pdf") == -1
            ) {
              setShowFileExtensionError(true);
              setShowFileSizeExceedError(false);
              setFiles(e.target.files);
              return false;
            } else {
              setShowFileExtensionError(false);
              setShowFileSizeExceedError(false);
              setFiles(e.target.files);
              setAttachmentMandatory(false);
            }
          } else {
            setShowFileSizeExceedError(true);
            setFiles(e.target.files);
            setAttachmentMandatory(false);
            return false;
          }
        }
      }
    } else {
      setFiles([]);
      document.getElementById("files").value = "";
      setShowFileSizeExceedError(false);
      setShowFileExtensionError(false);
    }
  };
  const feedbackReset = () => {
    setFeedackType(null);
    setFeedackCategory(null);
    setFeedackContent(null);
    setFiles([]);
    setFeedbackTypeErrorMsg(false);
    setFeedbackCategoryErrorMsg(false);
    setFeedbackContentErrorMsg(false);
    setLeftContent(8000);
    setShowCharacterLimit(false);
    setShowFileSizeExceedError(false);
    setShowFileExtensionError(false);
    setShowSubmissionFailed(false);
    setAttachmentMandatory(false);
    setContentErrorMessage(false);
  };
  const removeAttachment = () => {
    setFiles([]);
    document.getElementById("files").value = "";
    setShowFileSizeExceedError(false);
    setShowFileExtensionError(false);
  };
  return (
    <div id="feedbackcontainer" align="center">
      <div className="col-12 p-3" id="feedbackcontainer">
        <form
          name="feedbackform"
          id="feedbackform"
          className="feedback"
          encType="multipart/form-data"
        >
          <div className="row pr-3 pl-3 col-12">
            <div className="col-11">
              <div className="input-group">
                <select
                  className="form-control form-control-sm custom-feedback-field"
                  onChange={handleFeedbackType}
                  defaultValue={placeholderValue}
                >
                  <option value="Feedback Type" disabled selected hidden>
                    Feedback Type
                  </option>
                  {feedbackTypes.map((value, index) => (
                    <option value={value.id}>{value.type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-1 pl-0 red">
              <span className="pl-0 pt-0">
                *
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="feedbacktooltip" className="feedbacktooltip">
                      <table>
                        <tr className="pb-1">
                          <td>Defect</td>
                          <td>:</td>
                          <td className="pl-1">
                            When the functionality is not working as per the
                            designed feature.
                          </td>
                        </tr>
                        <tr className="pb-1">
                          <td>Enhancement</td>

                          <td>:</td>
                          <td className="pl-1">
                            New feature request that is not part of existing
                            functionality or logic.
                          </td>
                        </tr>
                        <tr className="pb-1">
                          <td>Change Request</td>
                          <td>:</td>
                          <td className="pl-1">
                            Any modification to the existing functionality.
                          </td>
                        </tr>
                        <tr className="pb-1">
                          <td>Inquiry/Feedback</td>
                          <td>:</td>
                          <td className="pl-1">
                            Any general inquiry or a positive feedback
                          </td>
                        </tr>
                      </table>
                    </Tooltip>
                  }
                >
                  <i className="fas fa-info-circle helptext2 ml-0 pl-0 pt-0" />
                </OverlayTrigger>
              </span>
            </div>

            {feedbackTypeErrorMsg && (
              <div className="errorMsg pr-3 pl-3">
                Select an appropriate feedback type
              </div>
            )}
          </div>

          <div className="row pr-3 pl-3 col-12 mt-2">
            <div className="col-11">
              <select
                className="form-control form-control-sm custom-feedback-field"
                onChange={handleFeedbackCategory}
                defaultValue={placeholderValue2}
              >
                <option
                  value="Please select the Category"
                  disabled
                  selected
                  hidden
                >
                  Please select the Category
                </option>
                {feedbackCategories.map((value, index) => (
                  <option value={value.id}>{value.category}</option>
                ))}
              </select>
            </div>
            <div className="col-1 pl-0 red"> *</div>
            {feedbackCategoryErrorMsg && (
              <div className="errorMsg pr-3 pl-3">
                Select an appropriate feedback category
              </div>
            )}
          </div>

          <div className="row pr-3 pl-3 col-12 mt-2">
            <div className="col-11">
              <textarea
                maxLength="8000"
                className="form-control custom-feedback-field"
                id="typefeedback"
                rows="4"
                placeholder="Your detailed feedback here..."
                onChange={handleFeedbackContent}
              ></textarea>
            </div>
            <div className="col-1 pl-0 red">
              *{/* Image attachment */}
              {/* ends image */}
            </div>
            {showCharacterLimit && (
              <div className="pr-3 pl-3" align="right">
                {leftContent} characters left
              </div>
            )}

            {feedbackContentErrorMsg && (
              <div className="errorMsg pr-3 pl-3">
                Please leave your comments
              </div>
            )}
            {contentErrorMessage && (
              <div className="errorMsg pr-3 pl-3">
                You have reached your maximum limit of characters allowed
              </div>
            )}
          </div>

          <div className="row pr-3 pl-3 col-12 pt-3">
            <div className="col-5 text-left pb-2">
              <input
                type="file"
                className="form-control-file fas fa-paperclip custom-feedback-attachment"
                id="files"
                onChange={(e) => handleFeedbackAttachment(e)}
                multiple
              />
              {files.length > 0 && (
                <span
                  className="red pl-0 pointer"
                  onClick={removeAttachment}
                  title="Remove the attachment"
                  translate="no"
                >
                  <b> X</b>
                </span>
              )}
            </div>
            {/* {files.length > 0 && (
              <span
                className="red pr-0 pointer"
                onClick={removeAttachment}
                title="Remove the attachment"
              >
                <b> X</b>
              </span>
            )} */}
            {feedbackType === "Defect" && (
              <div className="col-4 text-left pb-2 pl-0 red">*</div>
            )}
            {showFileSizeExceedError && (
              <div className=" row errorMsg pr-3 pl-4 col-12">
                Please select a file less than 4MB
              </div>
            )}
            {showFileExtensionError && (
              <div className="row errorMsg pr-3 pl-4 col-12">
                Unsupported file format (Please upload files with extensions
                docx,pdf,png,jpg,jpeg,gif,bmp)
              </div>
            )}
            {attachmentMandatory && (
              <div className="row errorMsg pr-3 pl-3">
                Please attach the screenshot. Mandatory for Defect.
              </div>
            )}
            <div className="pr-3 pl-4 mt-1 custom-feedbackNote row col-12">
              <table>
                <tr>
                  <td>
                    <p className="fontx12">
                      <u>Note</u>: Please furnish all the required details above
                      (For ex: Description including snapshot with timestamp &
                      keyword (if any))
                      <br />
                      <span className="pl-4 ml-1">
                        File should not be larger than 4 MB. Only Image
                        files,.docx and .pdf files are allowed.
                      </span>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
            {showSubmissionFailed && (
              <div className=" row errorMsg pr-3 pl-3">
                Could not submit your feedback. Please check if you have met the
                conditions prior to submitting the form
              </div>
            )}
            <div className="row pl-2 col-12 mt-2">
              <div class="col-3">
                <button
                  class="btn btn-success btn-sm custom-feedbackBtn mr-1"
                  onClick={(e) => feedbackSubmit(e)}
                >
                  Submit
                </button>
                <input
                  type="reset"
                  class="btn btn-warning btn-sm custom-feedbackBtn"
                  value="Reset"
                  onClick={feedbackReset}
                />
              </div>
              <div class="col-9 ml-2"></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Feedback;
