import React from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

import {
  Row,
  Col,
  Button,
  Container,
  ProgressBar,
  Spinner,
} from "react-bootstrap";

import URLConfig from "../URLConfig";
import { DYNAMIC, TEMPLATE_OUTPUT_PATH } from "./Constants";

const Preview = ({
  loader,
  setLoader,
  generatedSOW,
  setActiveKey,
  downloadLoader,
  downloadProgress,
  downloadGeneratedSOW,
}) => {
  const getDoconutURL = (previewFilePath) => {
    let filepath = CryptoJS.enc.Utf8.parse(previewFilePath);
    filepath = CryptoJS.enc.Base64.stringify(filepath);
    const URL = URLConfig.getURL_SOWDocViewer();
    console.log({ url: URL + filepath });
    return URL + filepath;
  };

  console.log({ generatedSOW });

  return (
    <Container bsPrefix="container container-fluid mt-2">
      {loader ? (
        <div className="d-flex flex-column align-items-center">
          <div className="p-2">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
          <div className="p-2">Loading...</div>
        </div>
      ) : (
        <>
          <Container bsPrefix="container sow-preview-container p-0">
            <div className="sow-preview">
              <iframe
                frameBorder="0"
                allowFullScreen
                src={getDoconutURL(generatedSOW[TEMPLATE_OUTPUT_PATH])}
                onLoad={() => {
                  setLoader(false);
                }}
              />
            </div>
          </Container>
          <Row>
            <Col>
              <Button
                bsPrefix="btn btn-success btn-sm float-right action-button"
                onClick={downloadGeneratedSOW}
                disabled={downloadLoader}
              >
                {downloadLoader ? `Dowloading...` : `Download SOW`}
              </Button>
              <Button
                bsPrefix="btn btn-success btn-sm float-right mr-2 ml-2 btn-warning"
                onClick={() => setActiveKey(DYNAMIC)}
                disabled={downloadLoader}
              >
                Previous
              </Button>
              {downloadLoader && (
                <ProgressBar
                  animated
                  now={downloadProgress}
                  label={`${downloadProgress}%`}
                />
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Preview;
