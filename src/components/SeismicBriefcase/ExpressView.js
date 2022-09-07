import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import map from "lodash/map";
import { saveAs } from "file-saver";
import jsZip from "jszip";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import URLConfig from "../URLConfig";
import {
  includes,
  nth,
  remove,
  filter,
  uniqBy,
  concat,
  some,
  each,
  findIndex,
  indexOf,
} from "lodash";
import { identifyFileFormat } from "../../utils/FileType";
import RateExpressViewPackage from "../RateDocument/RateExpressViewPackage";
import TrackingService from "../TrackingService";
const ExpressView = ({ expressViewData = [], searchText, handleOnSelect }) => {
  const signal = axios.CancelToken.source();
  const [activeKey, setActiveKey] = useState(0);
  const [selectedData, setSelectedData] = useState([]);
  const [packageName, setPackageName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [docLike, setDocLike] = useState({ comment: "" });
  const [feedbacks, setFeedbacks] = useState([]);
  const [loader, setLoader] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [expressViewrating, setExpressViewRating] = useState(0);
  const trackingService = new TrackingService();
  useEffect(() => {
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  useEffect(() => {
    setActiveKey(0);
    setShowModal(false);
    setSelectedData([]);
    setDocLike({ comment: "" });
    fetchLikeDislike(signal.token);
  }, [searchText]);
  const fetchLikeDislike = async (cancelToken) => {
    if (searchText) {
      const URL =
        URLConfig.getURL_UserBookMark() +
        "/ExpressViewFeedback" +
        `/${Cookies.get("empnumber")}/${searchText}`;
      try {
        const { data } = await axios.get(URL, { cancelToken });
        setFeedbacks(data);
      } catch (error) {
        console.log("API Error", error);
      }
    } else {
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    initExpressViewData(expressViewData);
  }, [expressViewData]);

  const initExpressViewData = (expressViewData) => {
    if (
      expressViewData[0] &&
      expressViewData[0].doclist &&
      expressViewData[0].doclist.docs[0] &&
      expressViewData[0].doclist.docs[0].package
    ) {
      setPackageName(expressViewData[0].doclist.docs[0].package);
    }
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedData([
        ...filter(
          nth(expressViewData, activeKey).doclist.docs,
          (item) => !isDirectDownloadDisabled(item.url)
        ),
      ]);
    } else {
      setSelectedData([]);
    }
  };

  const handleSelect = (event, doc) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedData((prevState) => uniqBy(concat(prevState, doc), "id"));
    } else {
      setSelectedData((prevState) =>
        remove(prevState, (item) => item.id !== doc.id)
      );
    }
  };

  const isDirectDownloadDisabled = (url) => {
    return !includes(url, "https://hpedelta.com:8082/");
  };

  const handleDownload = () => {
    const zip = new jsZip();
    let count = 0;
    each(selectedData, async (doc) => {
      try {
        const response = await axios.get(doc.url, {
          responseType: "blob",
        });
        zip.file(`${doc.file}.${doc.file_type}`, response.data, {
          binary: true,
        });
        count += 1;

        if (count === selectedData.length) {
          zip
            .generateAsync({
              type: "blob",
            })
            .then(function (content) {
              saveAs(content, `Express-View-${new Date()}.zip`);
            });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleDirectDownload = async () => {
    setDownloadProgress(0);
    setLoader(true);
    const URL = `https://hpedelta.com/viewer.aspx?requestType=EV`;
    const files = [];
    each(selectedData, (item) => {
      files.push(
        "F:\\AnPS\\Sharepointfiles\\" +
          item.url
            .replace("https://hpedelta.com:8082/", "")
            .replace(/ /g, "%20")
            .split("/")
            .join("\\")
      );
    });
    if (files.length > 0) {
      try {
        const response = await axios.post(
          URL,
          { files },
          {
            responseType: "blob",
            onDownloadProgress: (progressEvent) =>
              setDownloadProgress(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              ),
          }
        );
        if (files.length > 0 && files.length == 1) {
          saveAs(
            response.data,
            files[0].replace(/^.*[\\\/]/, "").replace(/%20/g, " ")
          );
        } else if (files.length > 1) {
          saveAs(response.data, `Express-View-${new Date()}.zip`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    trackingService.LogExpressPackageDocView(
      Cookies.get("empnumber"),
      packageName,
      searchText,
      "Express_Package_Download"
    );
    setLoader(false);
  };

  const handleLikeDislike = (bool) => {
    if (docLike.isLiked || (!docLike.isLiked && docLike.comment)) {
      const feedback = {
        userId: Cookies.get("empnumber"),
        searchString: searchText,
        package: packageName,
        isLiked: docLike.isLiked,
        Comments: docLike.comment,
      };
      const URL = URLConfig.getURL_UserBookMark() + "/ExpressViewFeedback";
      axios
        .put(URL, feedback)
        .then(() => {
          setFeedbacks((prevState) => {
            const index = findIndex(prevState, {
              searchString: feedback.searchString,
              package: feedback.package,
              userId: feedback.userId,
            });
            return index === -1
              ? [...prevState, feedback]
              : [
                  ...prevState.slice(0, index),
                  feedback,
                  ...prevState.slice(index + 1),
                ];
          });
          setShowModal(false);
          toast.info("Thanks for your feedback..", {
            position: "bottom-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCommentChange = (event) => {
    const value = event.target.value;
    setDocLike((prevState) => ({ ...prevState, comment: value }));
  };

  const isLikeDislike = (feedbacks, packageName, bool) => {
    return some(feedbacks, {
      searchString: searchText,
      package: packageName,
      isLiked: bool,
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="stickers_click" id="stickersClick">
        <div id="expressView">
          <div className="col-12 mt-3">
            <h5 className="briefcase_header">
              Express View
              <span
                className="close"
                translate="no"
                onClick={() => handleOnSelect()}
              >
                &times;
              </span>
            </h5>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-8">
                <h6>{packageName}</h6>
              </div>
              <div className="col-3 p-0" align="right">
                <RateExpressViewPackage
                  count={5}
                  // rating={rating}
                  onRating={(rate) => setExpressViewRating(rate)}
                  packageName={packageName}
                  //  DocId={doc.id}
                  //  DocName={doc.file + "." + doc.file_type}
                />

                {/* <>
                    <span align="right" className="col-1 p-1">
                      {isLikeDislike(feedbacks, packageName, true) ? (
                        <i
                          className="far fa-thumbs-up like-active disable fa"
                          title="Liked"
                        />
                      ) : (
                        <i
                          className="far fa-thumbs-up pointer"
                          title="Like"
                          onClick={() => {
                            setDocLike({
                              comment: "",
                              isLiked: true,
                            });
                            setShowModal(true);
                            // handleLikeDislike(true);
                          }}
                        />
                      )}
                    </span>
                    <span align="right" className="col-1 p-1">
                      {isLikeDislike(feedbacks, packageName, false) ? (
                        <i
                          className="far fa-thumbs-down like-down fa"
                          title="Disliked"
                        />
                      ) : (
                        <i
                          className="far fa-thumbs-down pointer"
                          title="Dislike"
                          onClick={() => {
                            setDocLike({
                              comment: "",
                              isLiked: false,
                            });
                            setShowModal(true);
                            // handleLikeDislike(false);
                          }}
                        />
                      )}
                    </span>
                  </> */}
              </div>
            </div>

            <div className="col-12 p-0 mt-2 row">
              <div
                style={{ borderRight: "1px solid #ccc" }}
                className="col-4 mr-4"
              >
                {map(expressViewData, (group, index) => (
                  <div className="mb-1">
                    <button
                      className={`btn btn-primary btn-sm ${
                        activeKey === index
                          ? "expressview_btn_active"
                          : "expressview_btn"
                      }`}
                      onClick={() => {
                        setActiveKey(index);
                        setSelectedData([]);
                      }}
                    >
                      {group.groupValue}
                    </button>
                  </div>
                ))}
              </div>
              <div className="col-7 express_files_view">
                <div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    disabled={
                      filter(
                        nth(expressViewData, activeKey).doclist.docs,
                        (item) => !isDirectDownloadDisabled(item.url)
                      ).length === 0
                    }
                    checked={
                      filter(
                        nth(expressViewData, activeKey).doclist.docs,
                        (item) => !isDirectDownloadDisabled(item.url)
                      ).length !== 0 &&
                      filter(
                        nth(expressViewData, activeKey).doclist.docs,
                        (item) => !isDirectDownloadDisabled(item.url)
                      ).length === selectedData.length
                    }
                    id="selectall"
                    onChange={handleSelectAll}
                  />
                  <strong>Select All</strong>
                </div>
                {map(nth(expressViewData, activeKey).doclist.docs, (doc) => (
                  <div key={doc.id}>
                    <input
                      type="checkbox"
                      checked={some(selectedData, (item) => item.id === doc.id)}
                      disabled={isDirectDownloadDisabled(doc.url)}
                      id={"file-checkbox" + doc.id}
                      className="form-check-input mr-1"
                      onChange={(e) => handleSelect(e, doc)}
                    />
                    {doc.file_type && indexOf(doc.file_type, "vsd") !== -1 ? (
                      <img
                        src="https://delta.app.hpecorp.net/static/media/visio-icon.jpg"
                        className="visio-icon"
                      />
                    ) : (
                      <a
                        className={`${identifyFileFormat(doc.file_type)} mr-1`}
                      />
                    )}
                    {isDirectDownloadDisabled(doc.url) ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackingService.LogExpressPackageDocView(
                            Cookies.get("empnumber"),
                            packageName,
                            searchText,
                            "Express_Package_File_Click"
                          )
                        }
                      >
                        {`(${doc.document_type_details}) - ${doc.file}`}
                      </a>
                    ) : (
                      <span>
                        {`(${doc.document_type_details}) - ${doc.file}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 pl-0 mt-2" align="right">
              <div className="col-8">
                <button
                  className="btn btn-success btn-sm pr-3 pl-3 expressview_download"
                  disabled={selectedData.length === 0 || loader}
                  onClick={() => handleDirectDownload()}
                >
                  {loader
                    ? `Downloading Selected Documents ${downloadProgress}%`
                    : `Download Selected Documents`}
                </button>
              </div>
            </div>
            <div className="col-12 briefcase_note pl-1 mt-1">
              <strong>Please note: </strong>
              <br />
              The files with Seismic Link cannot be selected. You need to have
              access to Seismic and click on the file directly to download the
              same.
            </div>
          </div>
        </div>
      </div>

      {/* Like/Dislike Modal */}
      {showModal && (
        <Modal show={showModal} onHide={() => handleModalClose()} centered>
          <Modal.Header>
            <Modal.Title>{`${
              docLike.isLiked ? "Like" : "Dislike"
            } Package`}</Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleModalClose()}
              class="close"
              data-dismiss="modal"
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12">
              <div className="col-12 row pb-2">
                <div className="col-12">
                  {`Please provide your feedback ${
                    docLike.isLiked ? "(optional)" : "(required)"
                  }`}
                </div>
              </div>
              <div id="emailbox" className="col-12 row">
                <div className="form-group col-12 pl-2">
                  <textarea
                    className="form-control"
                    id="comment"
                    onChange={handleCommentChange}
                    value={docLike.comment || ""}
                    placeholder="Enter Feedback"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleLikeDislike()}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleModalClose()}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ExpressView;
