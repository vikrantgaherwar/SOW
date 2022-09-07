import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Table } from "react-bootstrap";
import URLConfig from "./URLConfig";
import { map, sortBy } from "lodash";
import ContactInfoIcon from "../img/contact-info-user-btn.png";
import TrackingService from "./TrackingService";
import Cookies from "js-cookie";
const ServiceContactInformation = ({ searchText }) => {
  const signal = axios.CancelToken.source();
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(true);
  const [serviceContactInfo, setServiceContactInfo] = useState([]);
  const trackingService = new TrackingService();
  useEffect(() => {
    return () => {
      signal.cancel("Request Cancelled");
    };
  }, []);

  const handleModalOpen = () => {
    setModal(true);

    fetchServiceContactInformation(signal.token);
    console.log(Cookies.get("empnumber"), "Contact INfo");
    trackingService.LogContactInfolinkClick(Cookies.get("empnumber"), true);
  };

  const handleModalClose = () => {
    setModal(false);
  };

  const fetchServiceContactInformation = async (cancelToken) => {
    setLoader(true);
    const URL =
      URLConfig.getURLDeltaAPI() +
      "ServiceContact/FindServiceContactInfo/" +
      searchText;
    try {
      const res = await axios.get(URL, { cancelToken });
      if (res && res.data && res.data.length > 0) {
        setServiceContactInfo(sortBy(res.data, "serviceName"));
        // setServiceContactInfo(uniqBy(res.data, "highLevelServiceName"));
      } else {
        setServiceContactInfo([]);
      }
    } catch (error) {
      console.log("API Error", error);
    }
    setLoader(false);
  };

  return (
    <>
      {/* <i
        className="fas fa-user-tie pointer contactIcon"
        onClick={handleModalOpen}
      /> */}
      <img
        src={ContactInfoIcon}
        className="contactIcon pointer"
        onClick={() => handleModalOpen()}
        title="Contact Information"
      />

      {/* Service Contact Information Modal */}
      {modal && (
        <Modal
          show={modal}
          onHide={() => handleModalClose()}
          dialogClassName="contact-modal"
        >
          <Modal.Header>
            <Modal.Title>Contact Information</Modal.Title>
            <button
              type="button"
              translate="no"
              onClick={() => handleModalClose()}
              class="close"
              data-dismiss="modal"
            >
              <i className="fa fa-times" style={{ fontSize: "15px" }}></i>
            </button>
          </Modal.Header>
          <Modal.Body dialogClassName="document-data-modal">
            {loader ? (
              "Loading..."
            ) : (
              <>
                {serviceContactInfo.length > 0 ? (
                  <Table striped bordered responsive size="sm">
                    <thead>
                      <tr>
                        {/* <th>High Level Service Name</th> */}
                        <th>Service Name</th>
                        <th>Practice Lead</th>
                        <th>Practice Lead Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {map(serviceContactInfo, (item) => (
                        <tr>
                          {/* <td>{item.highLevelServiceName}</td> */}
                          <td>{item.serviceName}</td>
                          <td>{item.practiceLead}</td>
                          <td>
                            <a href={`mailto:${item.practiceLeadEmail}`}>
                              {item.practiceLeadEmail}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  "No Contact Information Found"
                )}
              </>
            )}
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
};

export default ServiceContactInformation;
