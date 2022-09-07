import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import TrackingService from "./TrackingService";
import Cookies from "js-cookie";
import ReactPlayer from "react-player";
import URLConfig from "./URLConfig";
import map from "lodash/map";
import _ from "lodash";

const KMNuggets = () => {
  const signal = axios.CancelToken.source();
  const [nugflixKMData, setNugflixKMData] = useState([]);
  const [showModal, setShow] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [fileName, setFileName] = useState(null);
  const trackingService = new TrackingService();
  const handleClose = () => setShow(false);

  const handleShow = (file, url) => {
    setShow(true);
    console.log(file, "file");
    trackingService.LogKNVideolinkClick(Cookies.get("empnumber"), file, true);
    setVideoURL(url);
    setFileName(file);
  };

  const getNugflixData = async (cancelToken) => {
    const nugflixurl = URLConfig.getNugFlixCategorisedVideoData();
    return await axios.get(nugflixurl, { cancelToken });
  };

  useEffect(() => {
    Promise.all([getNugflixData(signal.token)]).then((results) => {
      const nugflix = results[0];
      setNugflixKMData(nugflix.data.grouped.document_type.groups);
    });
  }, []);

  return (
    <>
      <div className="accordion" id="KMVideoAcc">
        {map(nugflixKMData, (category, index) => (
          <div className="card" align="left" key={`nugflixKMData${index}`}>
            <h5 className="mb-0 in-flex">
              <button
                className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                type="button"
                data-toggle="collapse"
                aria-expanded="false"
                data-target={`#KMV${index}`}
                aria-controls={`KMV${index}`}
              >
                {category.groupValue}
              </button>
            </h5>

            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#KMVideoAcc"
              aria-expanded="false"
              id={`KMV${index}`}
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div className="card-body ml-0 mr-0 mt-0 ml-3">
                <div
                  className="accordion"
                  id={`KMV${category.groupValue + index}`}
                >
                  {category.doclist.docs.map((value, index) => (
                    <Fragment key={value.id}>
                      <div className="col-12 row p-0 mt-2">
                        <div className="col-1">
                          <a className="fa fa-file-video xl-file"></a>
                        </div>
                        <div className="col-10">
                          <a
                            className="breakall_word fileurl pointer"
                            onClick={() => handleShow(value.file, value.url)}
                          >
                            {value.file}
                          </a>
                          <p align="left" className="pointer mb-0">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal
        show={showModal}
        onHide={handleClose}
        dialogClassName="modal-90w"
        centered
      >
        <Modal.Header>
          <Modal.Title>{fileName}</Modal.Title>
          <button
            type="button"
            translate="no"
            onClick={() => handleClose()}
            class="close"
            data-dismiss="modal"
          >
            <i className="fa fa-times" style={{ fontSize: "15px" }}></i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <ReactPlayer
            url={videoURL}
            controls={true}
            width="1100"
            height="360"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default KMNuggets;
