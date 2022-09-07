import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import each from "lodash/each";
import map from "lodash/map";
import some from "lodash/some";
import findIndex from "lodash/findIndex";
import includes from "lodash/includes";
import CryptoJS from "crypto-js";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";

import URLConfig from "../URLConfig";
import {
  identifyFileFormat,
  ISValidFileForPreview,
} from "../../utils/FileType";
import { UserContext } from "../../UserContext";
import {
  DOC_SHARE,
  DOC_PREVIEW,
  DOC_COMMENT,
  DOC_META,
  DOC_UPDATE,
  DOC_LIKE,
} from "./Constants";
import {
  fetchUserBookmarkDetails,
  fetchUserFeedbackDetails,
} from "./GeneralFunctions";
import GetLikes from "./GetLikes";
import FileDownload from "./FileDownload";
import RateDocument from "../RateDocument/RateDocuments";

const Documents = ({
  docList,
  size = 0,
  logDocClick,
  pursuitView,
  showPreview = true,
}) => {
  const signal = axios.CancelToken.source();
  const [userDetails, dispatch] = useContext(UserContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [previewURL, setPreviewURL] = useState([{ url: "", doc_Link: "" }]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loader, setLoader] = useState(false);
  const [errData, setErrData] = useState({});
  const [docShare, setDocShare] = useState({ via: "true", email: "" });
  const [docMeta, setDocMeta] = useState({ fileName: "", data: {} });
  const [docLike, setDocLike] = useState({ comment: "" });
  const [docUpdateOptions, setDocUpdateOptions] = useState([]);
  const [docUpdate, setDocUpdate] = useState({
    updateRequest: "",
    addComments: "",
  });
  const [modal, setModal] = useState({
    [DOC_PREVIEW]: false,
    [DOC_SHARE]: false,
    [DOC_UPDATE]: false,
    [DOC_META]: false,
    [DOC_COMMENT]: false,
  });
  const [button, setButton] = useState({
    [DOC_PREVIEW]: false,
    [DOC_SHARE]: true,
    [DOC_UPDATE]: false,
    [DOC_META]: false,
    [DOC_COMMENT]: false,
  });
  const [rating, setRating] = useState(0);
  useEffect(() => {
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  useEffect(() => {
    if (userDetails && userDetails.userBookmarks)
      setBookmarks([...userDetails.userBookmarks]);
    if (userDetails && userDetails.userFeedbacks)
      setFeedbacks([...userDetails.userFeedbacks]);
  }, [userDetails]);

  const fetchUpdateRequestStatus = async (cancelToken) => {
    setLoader(true);
    const URL =
      URLConfig.getURL_UserDocument() + "/DocumentRequestUpdateStatus";
    try {
      const res = await axios.get(URL, { cancelToken });
      if (res?.data?.length) {
        setDocUpdateOptions([...res.data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  // useEffect(() => {
  //   processData(docList);
  // }, [docList, activePage]);

  // const processData = (data) => {
  //   if (data && data.length > 0) {
  //     console.log({ data });
  //     // Remove docs that do not have Account_ST_Name
  //     const processedData = filter(
  //       data,
  //       (item) =>
  //         includes(trim(lowerCase(item.file)), trim(lowerCase(searchKey))) ||
  //         includes(trim(lowerCase(item.doc_source)), trim(lowerCase(searchKey)))
  //     );

  //     //   const processedData = [
  //     //     ..._.filter(data, (obj) => {
  //     //       return _.some(_.keys(obj), (key) => {
  //     //         return _.includes(obj[key], searchKey);
  //     //       });
  //     //     }),
  //     //   ];

  //     console.log({ processedData });
  //     setModalDocList(processedData);
  //   } else {
  //     setModalDocList([]);
  //   }
  // };

  const handleLikeDislike = () => {
    if (docLike.isLiked || (!docLike.isLiked && docLike.comment)) {
      const feedback = {
        userId: Cookies.get("empnumber"),
        documentID: docLike.docID,
        isLiked: docLike.isLiked,
        Comments: docLike.comment,
      };
      axios
        .put(URLConfig.getURL_UserFeedBack(), feedback)
        .then(() => {
          setFeedbacks((prevState) => {
            const index = findIndex(prevState, {
              documentID: feedback.documentID,
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
          fetchUserFeedbackDetails(dispatch);
          handleModalClose(DOC_LIKE);
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

  const handleModalOpen = (item) => {
    setModal((prevState) => ({ ...prevState, [item]: true }));
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

  const handleModalClose = (item) => {
    setModal((prevState) => ({ ...prevState, [item]: false }));
  };

  const handleCheckChange = (event) => {
    const value = event.target.value === "true" ? true : false;
    setDocShare((prevState) => ({ ...prevState, via: value }));
  };

  const validateEmail = (email) => {
    // const regEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    const regExHPE =
      /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@hpe\.com$/;
    return email.match(regExHPE);
  };

  // const handleEmailChange = (event) => {
  //   const value = trim(event.target.value);
  //   if (validateEmail(value)) {
  //     setErrData((prevState) => ({ ...prevState, email: "" }));
  //   } else {
  //     setErrData((prevState) => ({
  //       ...prevState,
  //       email: "Please enter one valid HPE Email Id",
  //     }));
  //   }
  //   setDocShare((prevState) => ({ ...prevState, email: value }));
  // };

  const checkEmailValidity = (email) => {
    if (isEmail(email) && validateEmail(email)) {
      setErrData((prevState) => ({ ...prevState, email: "" }));
    } else {
      setErrData((prevState) => ({
        ...prevState,
        email: "Please enter only valid HPE Email Ids",
      }));
    }
    return isEmail(email) && validateEmail(email);
  };

  const handleMultiEmailChange = (emails) => {
    checkEmailsValid(emails);
    setDocShare((prevState) => ({ ...prevState, emails: [...emails] }));
  };

  const checkEmailsValid = (emails) => {
    setErrData((prevState) => ({
      ...prevState,
      emails: [],
      guest: [],
      email: "",
    }));
    setButton((prevState) => ({ ...prevState, [DOC_SHARE]: true }));
    if (emails.length > 0) {
      each(emails, async (email) => {
        try {
          let URL =
            URLConfig.getURL_UserBookMark() + "/CheckEmailValid/" + email;
          const resCheckEmailValid = await axios.get(URL);
          if (!resCheckEmailValid.data) {
            setErrData((prevState) => {
              const errorEmails = [...prevState.emails, email];
              return { ...prevState, emails: errorEmails };
            });
          } else {
            URL = URLConfig.getURL_UserBookMark() + "/CheckUserValid/" + email;
            const resCheckUserValid = await axios.get(URL);
            if (!resCheckUserValid.data) {
              setErrData((prevState) => {
                const guestEmails = [...prevState.guest, email];
                return { ...prevState, guest: guestEmails };
              });
            }
          }
          setButton((prevState) => ({ ...prevState, [DOC_SHARE]: false }));
        } catch (error) {
          console.log(error);
          setButton((prevState) => ({ ...prevState, [DOC_SHARE]: false }));
        }
      });
    } else {
      setButton((prevState) => ({ ...prevState, [DOC_SHARE]: false }));
    }
  };

  const handleCommentChange = (event) => {
    const value = event.target.value;
    setDocLike((prevState) => ({ ...prevState, comment: value }));
  };

  const handleShare = async (item) => {
    setButton((prevState) => ({ ...prevState, [item]: true }));
    if (docShare.emails && docShare.emails.length > 0) {
      each(docShare.emails, async (email) => {
        setButton((prevState) => ({ ...prevState, [item]: true }));
        let shareDetails = {};
        let URL = "";
        if (docShare.via) {
          URL = URLConfig.getURL_UserBookMark() + "/ShareViaEmail";
          shareDetails = {
            documentName: docShare.doc.file,
            URL: encodeURI(docShare.doc.url),
            toEmailAddress: email,
            sharedByEmail: Cookies.get("mail"),
          };
        } else {
          URL = URLConfig.getURL_UserBookMark() + "/ShareViaDelta";
          shareDetails = {
            documentName: docShare.doc.file,
            documentURL: docShare.doc.url,
            emailID: email,
            userId: Cookies.get("empnumber"),
            sharedByName: Cookies.get("name"),
            isNew: true,
            isArchived: docShare.doc.isarchived || false,
          };
        }
        try {
          const res = await axios.post(URL, shareDetails);
          handleModalClose(DOC_SHARE);
          toast.info("Shared Document Successfully", {
            position: "bottom-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } catch (error) {
          console.log(error);
          toast.error("Share Document Failed - Check if Email Id is Valid", {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        setButton((prevState) => ({ ...prevState, [DOC_SHARE]: false }));
      });
    } else {
      setErrData((prevState) => ({
        ...prevState,
        email: "Please enter one valid HPE Email Id",
      }));
      setButton((prevState) => ({ ...prevState, [DOC_SHARE]: false }));
    }
  };

  const handleAddBookmark = (doc) => {
    const bookmark = {
      isBookmarked: true,
      documentID: doc.id,
      userId: Cookies.get("empnumber"),
      bookmarkURL: doc.url,
      documentName: doc.file,
      isArchived: doc.isarchived || false,
    };
    setBookmarks((prevState) => [...prevState, bookmark]);
    axios
      .post(URLConfig.getURL_UserBookMark() + "/userbookmark", bookmark)
      .then(() => {
        // setBookmarks((prevState) => [...prevState, bookmark]);
        fetchUserBookmarkDetails(dispatch);
        toast.info("Added to Bookmarks", {
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
  };

  // const fetchMetadata = (fileName) => {
  //   setLoader(true);
  //   const URL = `${URLConfig.get_APIHost()}solr/sharepoint_index/select?indent=on&q=file:%22${fileName}%22&wt=json`;
  //   axios.get(URL).then((res) => {
  //     if (res.data) {
  //       if (
  //         res.data.response &&
  //         res.data.response.numFound === 1 &&
  //         res.data.response.docs &&
  //         res.data.response.docs.length > 0
  //       ) {
  //         setDocMeta({ fileName, data: { ...res.data.response.docs[0] } });
  //       }
  //       setLoader(false);
  //     } else {
  //       console.log("No Metadata Found!!");
  //       setLoader(false);
  //     }
  //   });
  // };

  const handleDocUpdate = (event) => {
    const { name, value } = event.target;
    setDocUpdate((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDocUpdateSave = async (item) => {
    setButton((prevState) => ({ ...prevState, [item]: true }));
    if (docUpdate.updateRequest) {
      URL = URLConfig.getURL_UserDocument() + "/DocumentRequestUpdate";
      const updateRequestDetails = {
        documentID: docUpdate.docID,
        documentName: docUpdate.docName,
        documentURL: encodeURI(docUpdate.docURL),
        updateRequest: docUpdate.updateRequest,
        additionalComments: docUpdate.addComments,
        requestedBy: Cookies.get("empnumber"),
        requestedByEmail: Cookies.get("mail"),
      };
      try {
        await axios.post(URL, updateRequestDetails);

        handleModalClose(DOC_UPDATE);
        toast.info("Request Saved Successfully", {
          position: "bottom-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
    setButton((prevState) => ({ ...prevState, [item]: false }));
  };

  const isSize = (index, size) => {
    return size ? index < size : true;
  };

  const isBookmarked = (bookmarks, url) => {
    return some(bookmarks, {
      bookmarkURL: url,
      isBookmarked: true,
    });
  };

  const isLikeDislike = (feedbacks, docID, bool) => {
    return some(feedbacks, {
      documentID: docID,
      isLiked: bool,
    });
  };

  const ISEditable = (FileName) => {
    return (
      FileName.indexOf("doc") !== -1 ||
      FileName.indexOf("xl") !== -1 ||
      FileName.indexOf("ppt") !== -1
    );
  };

  const GetPursuitUrl = (doc_Url) => {
    var DocumentUrl = CryptoJS.enc.Utf8.parse(
      doc_Url + "$$$$" + Cookies.get("empnumber") + "$$$$" + Cookies.get("name")
    );
    DocumentUrl =
      "https://delta.app.hpecorp.net:444/Aceoffix/editWord?q=" +
      CryptoJS.enc.Base64.stringify(DocumentUrl);
    return DocumentUrl;
  };

  const isDirectDownloadDisabled = (url) => {
    return !includes(url, "https://hpedelta.com:8082/");
  };
  return (
    <>
      {docList.length > 0 &&
        docList.map(
          (doc, index) =>
            isSize(index, size) && (
              <div className="border-bottom" key={doc.id}>
                <div
                  className="col-12 pl-0 mb-1 ml-1 row pb-10"
                  onClick={() => {
                    console.log(doc);
                  }}
                >
                  <div className="col-1 row pr-0 pt-1 mr-3">
                    {doc.file_type && doc.file_type.indexOf("vsd") !== -1 ? (
                      <img
                        src="https://delta.app.hpecorp.net/static/media/visio-icon.jpg"
                        className="visio-icon"
                      />
                    ) : (
                      <a className={identifyFileFormat(doc.file_type)} />
                    )}
                  </div>
                  <div className="col-6 pl-1 row mr-1">
                    <div className="col-12 row pr-0">
                      {isDirectDownloadDisabled(doc.url) ? (
                        <a
                          href={doc.url}
                          className="breakall_word"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => logDocClick(doc)}
                        >
                          {doc.file}
                          {doc.isarchived && (
                            <span className="archivedDocs">A</span>
                          )}
                          {doc.isgoldcollateral && (
                            <span className="goldCol">G</span>
                          )}
                        </a>
                      ) : (
                        <>
                          <FileDownload doc={doc} />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-4 pl-3 pr-0 mt-1">
                    <div className="col-12 row pl-0 ml-2">
                      {showPreview &&
                      ISValidFileForPreview(doc.file_type) &&
                      doc.url.indexOf("https://hpedelta.com:8082/") !== -1 ? (
                        <div className="col-2 pl-0 mb-2" align="left">
                          <i
                            className="fas fa-eye pointer"
                            title="Document Preview"
                            onClick={() => handlePreview(doc.url)}
                          />
                        </div>
                      ) : (
                        <div className="col-2 pl-0 mb-2" align="left">
                          <i
                            className="fas fa-eye-slash"
                            style={{ color: "grey" }}
                            title="Document Preview Not Available"
                          ></i>
                        </div>
                      )}

                      <div className="col-2 pl-0">
                        {isBookmarked(bookmarks, doc.url) ? (
                          <i
                            className="fas fa-heart disable"
                            title="Added to Bookmark"
                          />
                        ) : (
                          <i
                            className="far fa-heart pointer"
                            title="Add to Bookmark"
                            onClick={() => handleAddBookmark(doc)}
                          />
                        )}
                      </div>
                      <div className="col-2 pl-0">
                        <i
                          className="fas fa-share-alt pointer"
                          title="Share"
                          onClick={() => {
                            setDocShare({
                              via: "",
                              email: "",
                              doc: doc,
                              url: doc.url,
                              docID: doc.id,
                              docName: doc.file,
                            });
                            setErrData({});
                            handleModalOpen(DOC_SHARE);
                            setButton((prevState) => ({
                              ...prevState,
                              [DOC_SHARE]: true,
                            }));
                          }}
                        />
                      </div>
                      <div className="col-2 pl-0">
                        <i
                          className="fas fa-crosshairs pointer"
                          title="Request for Update"
                          onClick={() => {
                            setDocUpdate({
                              updateRequest: "",
                              addComments: "",
                              docID: doc.id,
                              docURL: doc.url,
                              docName: doc.file,
                            });
                            fetchUpdateRequestStatus(signal.token);
                            handleModalOpen(DOC_UPDATE);
                          }}
                        />
                      </div>
                      {/* <div className="col-3 pl-0">
                        <i
                          className="far fa-file-alt pointer"
                          title="Metadata Details"
                          onClick={() => {
                            fetchMetadata(doc.file);
                            handleModalOpen(DOC_META);
                          }}
                        />
                      </div> */}
                      {/* <div className="col-3 pl-0" align="left">
                        <i
                          className="far fa-comment pointer"
                          title="Add Comment"
                          onClick={() => handleModalOpen(DOC_COMMENT)}
                        ></i>
                      </div> */}
                      <div className="col-2 pl-0" id={`tooltip-${doc.id}`}>
                        {/* <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id={`tooltip-${doc.id}`}>
                              {`Source: ${doc.doc_source}`}
                            </Tooltip>
                          }
                        > */}
                        <i
                          className="fas fa-database"
                          title={`Source: ${doc.doc_source}`}
                        />
                        {/* </OverlayTrigger> */}
                      </div>
                      {pursuitView && ISEditable(doc.file_type) && (
                        <div className="col-2 pl-0">
                          <a
                            href={
                              "javascript:AceBrowser.openWindowModeless('" +
                              GetPursuitUrl(doc.url) +
                              "','width=1200px;height=800px;');"
                            }
                          >
                            {/* <i className="fas fa-copy pointer" title="Re-Use" /> */}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-1 mt-1">
                    {/*  star rating starts*/}
                    <div className="row like_align">
                      <span align="" className="col-6 pl-0 ml-0">
                        <div align="center">
                          <RateDocument
                            count={5}
                            // rating={rating}
                            onRating={(rate) => setRating(rate)}
                            DocId={doc.id}
                            DocName={doc.file + "." + doc.file_type}
                            DocURL={doc.url}
                            docList={docList}
                          />
                        </div>
                      </span>
                    </div>
                    {/* star rating ends*/}
                    {/* comment from here */}
                    {/* <div className="row like_align">
                      <span align="" className="col-6 pl-1">
                        <div align="center">
                          {isLikeDislike(feedbacks, doc.id, true) ? (
                            <i
                              className="far fa-thumbs-up like-active disable fa"
                              id={"up" + doc.id}
                              title="Liked"
                            />
                          ) : (
                            <i
                              className="far fa-thumbs-up pointer"
                              id={"up" + doc.id}
                              title="Like"
                              onClick={() => {
                                setDocLike({
                                  comment: "",
                                  isLiked: true,
                                  docID: doc.id,
                                });
                                handleModalOpen(DOC_LIKE);
                              }}
                            />
                          )}
                          <br />
                          <GetLikes
                            documentID={doc.id}
                            isLiked={true}
                            feedbacks={userDetails.userFeedbacks}
                          />
                        </div>
                      </span>
                      <span className="col-6 pl-1">
                        <div align="center">
                          {isLikeDislike(feedbacks, doc.id, false) ? (
                            <i
                              className="far fa-thumbs-down like-down fa"
                              id={"down" + doc.id}
                              title="Disliked"
                            />
                          ) : (
                            <i
                              className="far fa-thumbs-down pointer"
                              id={"down" + doc.id}
                              title="Dislike"
                              onClick={() => {
                                setDocLike({
                                  comment: "",
                                  isLiked: false,
                                  docID: doc.id,
                                });
                                handleModalOpen(DOC_LIKE);
                              }}
                            />
                          )}
                          <br />
                          <GetLikes
                            documentID={doc.id}
                            isLiked={false}
                            feedbacks={userDetails.userFeedbacks}
                          />
                        </div>
                      </span>
                    </div> */}
                    {/* comment till 718 */}
                  </div>
                </div>
                <div className="col-12 row mr-0 pl-2">
                  <div className="col-1 pr-0"></div>
                  <div className="col-10 pl-0">
                    <span className="fontx9 mr-2 badge-doctype" align="left">
                      {doc.disclosure_level}
                    </span>
                    {doc.modified_date && (
                      <span className="fontx9" align="left">
                        <strong>Modified on: </strong>
                        {doc.modified_date.split("T") &&
                          doc.modified_date.split("T")[0] &&
                          doc.modified_date.split("T")[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
        )}

      {/* Document Preview Modal */}
      {modal[DOC_PREVIEW] && (
        <Modal
          show={modal[DOC_PREVIEW]}
          onHide={() => handleModalClose(DOC_PREVIEW)}
          dialogClassName="preview-modal"
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

      {/* DocShareModal */}
      {modal[DOC_SHARE] && (
        <Modal
          show={modal[DOC_SHARE]}
          onHide={() => handleModalClose(DOC_SHARE)}
          centered
        >
          <Modal.Header>
            <Modal.Title>Share Document</Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleModalClose(DOC_SHARE)}
              class="close"
              data-dismiss="modal"
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12" align="center">
              <div className="col-12 row pb-2">
                {/* <div className="col-4" > */}
                <i className="fas fa-share-alt mr-2 ml-2 mtop2" /> Share Via
                Knowledge Management Center
                {/* </div> */}
                {/* <div className="col-8">
                  <div className="row">
                    <input
                      type="radio"
                      name="viaemail"
                      className="form-check-input"
                      value="true"
                      onChange={handleCheckChange}
                      checked={docShare.via !== "" ? docShare.via : false}
                    />
                    <span>Share Via Email</span>
                  </div>
                  <div className="row">
                    <input
                      type="radio"
                      name="viadelta"
                      className="form-check-input"
                      value="false"
                      // onChange={handleCheckChange}
                      // checked={docShare.via !== "" ? !docShare.via : false}
                      checked="true"
                    />
                    <span>Share Via Knowledge Management Center</span>
                  </div>
                </div> */}
              </div>
              <div id="emailbox" className="col-12 row">
                {/* {docShare.via !== "" && ( */}
                <>
                  <div className="form-group col-12 pl-2">
                    <ReactMultiEmail
                      placeholder="Enter only valid HPE Email Ids"
                      emails={docShare.emails}
                      onChange={(_emails) => {
                        handleMultiEmailChange(_emails);
                      }}
                      validateEmail={(email) => {
                        return checkEmailValidity(email); // return boolean
                      }}
                      getLabel={(email, index, removeEmail) => {
                        return (
                          <div data-tag key={index}>
                            {email}
                            <i
                              data-tag-handle
                              className="fas fa-times"
                              onClick={() => removeEmail(index)}
                            />
                          </div>
                        );
                      }}
                    />
                    {errData.email && (
                      <div className="row pl-4 text-danger">
                        {errData.email}
                      </div>
                    )}
                    {errData.emails &&
                      errData.emails.length > 0 &&
                      map(errData.emails, (email) => (
                        <div className="row pl-4 text-danger">
                          "{email}" is an Invalid User
                        </div>
                      ))}
                    {errData.guest &&
                      errData.guest.length > 0 &&
                      map(errData.guest, (email) => (
                        <div className="row pl-4 text-warning">
                          "{email}" is a Guest User
                        </div>
                      ))}
                  </div>
                </>
                {/* )} */}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleShare(DOC_SHARE)}
              disabled={
                button[DOC_SHARE] ||
                (docShare.emails && docShare.emails.length <= 0) ||
                errData.email ||
                (errData.emails && errData.emails.length > 0)
              }
            >
              Share
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleModalClose(DOC_SHARE)}
              disabled={
                button[DOC_SHARE] &&
                docShare.emails &&
                docShare.emails.length > 0
              }
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* DocUpdateModal */}
      {modal[DOC_UPDATE] && (
        <Modal
          show={modal[DOC_UPDATE]}
          onHide={() => handleModalClose(DOC_UPDATE)}
          centered
        >
          <Modal.Header>
            <Modal.Title>Update Request Form</Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleModalClose(DOC_UPDATE)}
              class="close"
              data-dismiss="modal"
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            {loader ? (
              <p>Loading...</p>
            ) : (
              <div className="col-12 pr-0" id="updaterequest">
                <div className="col-12 row pr-0 mr-0">
                  <div className="row col-12">
                    <div className="col-6 pl-0 mb-2">Update Request</div>
                    <div className="col-6 mb-2">
                      <select
                        required
                        className="form-control form-control-sm"
                        onChange={handleDocUpdate}
                        name="updateRequest"
                        value={docUpdate.updateRequest}
                      >
                        {map(docUpdateOptions, (item) => (
                          <option value={item.name}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 row">
                    <div className="col-6 pl-0">Additional Comments</div>
                    <div className="col-6">
                      <textarea
                        className="form-control"
                        id="addcomments"
                        rows="2"
                        onChange={handleDocUpdate}
                        name="addComments"
                        value={docUpdate.addComments}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleDocUpdateSave(DOC_UPDATE)}
              disabled={button[DOC_UPDATE]}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleModalClose(DOC_UPDATE)}
              disabled={button[DOC_UPDATE]}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* MetaDetailsModal Starts */}
      {modal[DOC_META] && (
        <Modal
          show={modal[DOC_META]}
          onHide={() => handleModalClose(DOC_META)}
          centered
        >
          <Modal.Header>
            <Modal.Title>Document Metadata</Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleModalClose(DOC_META)}
              class="close"
              data-dismiss="modal"
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div id="matadata" className="col-12">
              <div className="row col-12 mb-2">
                <span>
                  <b>{`File Name: `}</b>
                  {`${docMeta.fileName}`}
                </span>
              </div>
              <div className="row">
                <div className="col-6 pl-0">
                  {/* <ul className="list-group list-group-flush">
                      {map(LIST_1, (value, key) => (
                        <li className="list-group-item metadata_items">
                          <b>{`${startCase(key)}: `}</b>
                          {`${docMeta.data[value]}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-6 pl-0">
                    <ul className="list-group list-group-flush">
                      {map(LIST_2, (value, key) => (
                        <li className="list-group-item metadata_items">
                          <b>{`${startCase(key)}: `}</b>
                          {`${docMeta.data[value]}`}
                        </li>
                      ))}
                    </ul> */}
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item metadata_items">
                      <b>Document ID: </b>
                      {docMeta.data.id}
                    </li>
                    <li className="list-group-item metadata_items">
                      <b>Document Type: </b>
                      {docMeta.data.document_type}
                    </li>
                    <li className="list-group-item metadata_items">
                      <b>Description: </b>
                      {docMeta.data.description}
                    </li>
                    <li className="list-group-item metadata_items">
                      <b>Disclosure: </b>
                      {docMeta.data.disclosure_level}
                    </li>
                  </ul>
                </div>

                <div className="col-6 p-0">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item metadata_items">
                      <b>Language: </b>
                      {docMeta.data.language_s}
                    </li>
                    <li className="list-group-item metadata_items">
                      <b>Keywords: </b>
                      {docMeta.data.keywords}
                    </li>
                    <li className="list-group-item metadata_items">
                      <b>Created Date (UTC): </b>
                      {docMeta.data.creation_date.split("T")[0] || ""}
                    </li>
                    <li className="list-group-item metadata_items">
                      <b>Modified Date (UTC): </b>
                      {docMeta.data.modified_date.split("T")[0] || ""}
                    </li>
                    <li className="list-group-item metadata_items">
                      <b>Source: </b>
                      {docMeta.data.source}
                    </li>
                    <li className="list-group-item metadata_items">
                      <b>Version: </b>
                      {docMeta.data.version}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleModalClose(DOC_META)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Like/Dislike Modal */}
      {modal[DOC_LIKE] && (
        <Modal
          show={modal[DOC_LIKE]}
          onHide={() => handleModalClose(DOC_LIKE)}
          centered
        >
          <Modal.Header>
            <Modal.Title>{`${
              docLike.isLiked ? "Like" : "Dislike"
            } Document`}</Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleModalClose(DOC_LIKE)}
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
              onClick={() => handleModalClose(DOC_LIKE)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* CommentModal */}
      {modal[DOC_COMMENT] && (
        <Modal
          show={modal[DOC_COMMENT]}
          onHide={() => handleModalClose(DOC_COMMENT)}
          centered
        >
          <Modal.Header>
            <Modal.Title>Document Comments</Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleModalClose(DOC_COMMENT)}
              class="close"
              data-dismiss="modal"
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body> Document Preview Content</Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleModalClose(DOC_COMMENT)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Documents;
