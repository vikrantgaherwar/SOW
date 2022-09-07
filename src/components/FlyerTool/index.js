import React, { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { map, each, reduce, includes } from "lodash";
import { saveAs } from "file-saver";
import {
  Row,
  Col,
  Form,
  Modal,
  Button,
  Spinner,
  Container,
} from "react-bootstrap";
import TrackingService from "../TrackingService";

// import FlyerIcon from "../../img/flyer-btn.png";
import FlyerIcon from "../../img/flyer-icon.png";
import HeaderLogo from "../../img/element-popup-headers.png";
import URLConfig from "../URLConfig";
import FlyerFormFields from "./FlyerFormFields";
import FlyerConfigurePromotedServices from "./FlyerConfigurePromotedServices";
import { flyerContactFields } from "./FlyerFields";
import { UPDATE_FLYER, useFlyer } from "./FlyerContext";

const FlyerTool = ({ right }) => {
  const [flyerContextState, dispatch] = useFlyer();
  const [loader, setLoader] = useState(true);
  const [productsAndServices, setProductsAndServices] = useState([]);
  const [contactDetails, setContactDetails] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [shareViaEmail, setShareViaEmail] = useState(false);
  const [disableAction, setDisableAction] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const trackingService = new TrackingService();
  useEffect(() => {
    if (flyerContextState?.flyerFlag) {
      fetchProductsAndServices();
      setContactDetails({
        hpeName: Cookies.get("name"),
        hpeEmail: Cookies.get("mail"),
      });
    } else {
      setContactDetails({});
      setSelectedProducts([]);
      setSelectedServices([]);
    }
  }, [flyerContextState?.flyerFlag]);

  const fetchProductsAndServices = async () => {
    setLoader(true);
    const URL = URLConfig.getFlyerProductServiceURL();
    try {
      const res = await axios.get(URL);
      if (res?.data) {
        setProductsAndServices(
          map(res.data?.grouped?.product_family_en?.groups, (item) => ({
            productName: item?.groupValue,
            servicesList: item?.doclist?.docs,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const handleOpenCloseFlyerTool = (value) => {
    dispatch({
      type: UPDATE_FLYER,
      payload: value,
    });

    trackingService.LogFlyerLinkClick(Cookies.get("empnumber"), true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      downloadFlyerPDF();
    }
  };

  const downloadFlyerPDF = async () => {
    setDisableAction(true);
    const data = {
      ...contactDetails,
      shareViaEmail,
      selectedServicesList: reduce(
        productsAndServices,
        (servicesList, product) => {
          each(product?.servicesList, (service) => {
            if (includes(selectedServices, service?.uid))
              servicesList = [
                ...servicesList,
                {
                  productFamily: service?.product_family_en,
                  serviceDescription: service?.service_description_en,
                  serviceDefinition: service?.service_definition_en,
                  datasheetURL: service?.datasheet_url,
                },
              ];
          });
          return servicesList;
        },
        []
      ),
    };
    const URL = URLConfig.getURLFlyerAPI() + "Flyer/ProcessFlyer";
    try {
      const res = await axios.post(URL, data, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) =>
          setDownloadProgress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          ),
      });
      if (res?.data) {
        saveAs(res.data, `Flyer_Document.pdf`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisableAction(false);
      setDownloadProgress(0);
      // handleOpenCloseFlyerTool(false);
    }
  };

  return (
    <>
      <div
        title="HPE Lifecycle Services Flyer"
        className="flyertool-icon"
        style={{ right: right }}
      >
        <img
          className="flyer-icon pointer"
          src={FlyerIcon}
          alt="flyer icon"
          onClick={() => {
            handleOpenCloseFlyerTool(true);
          }}
        />
      </div>

      <Modal
        show={flyerContextState?.flyerFlag}
        // onHide={() => handleOpenCloseFlyerTool(false)}
        centered
        dialogClassName="prescriptive-modal"
      >
        <Modal.Header>
          <Modal.Title>
            <img
              src={HeaderLogo}
              width="90px"
              className="pr-2"
              alt="HPE Logo"
            />
            <strong>HPE Lifecycle Services Flyer</strong>
          </Modal.Title>
          <button
            type="button"
            translate="no"
            onClick={() => handleOpenCloseFlyerTool(false)}
            class="close"
            disabled={disableAction}
            data-dismiss="modal"
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body bsPrefix="practice-modal-body">
          <Container>
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
              <Form id="flyerForm" onSubmit={handleSubmit}>
                <Row>
                  <h6>
                    <strong>Contact Details</strong>
                  </h6>
                </Row>
                <Row>
                  {map(flyerContactFields, (item, idx) => (
                    <Fragment key={idx}>
                      <Col sm={6}>
                        <FlyerFormFields
                          field={item[0]}
                          disableAction={disableAction}
                          contactDetails={contactDetails}
                          setContactDetails={setContactDetails}
                        />
                      </Col>
                      {item[1] && (
                        <Col sm={6}>
                          <FlyerFormFields
                            field={item[1]}
                            disableAction={disableAction}
                            contactDetails={contactDetails}
                            setContactDetails={setContactDetails}
                          />
                        </Col>
                      )}
                    </Fragment>
                  ))}
                </Row>
                <Row bsPrefix="row border-top pt-2">
                  <h6>
                    <strong>Configure Promoted Services</strong>
                  </h6>
                </Row>
                <Row>
                  <FlyerConfigurePromotedServices
                    disableAction={disableAction}
                    selectedProducts={selectedProducts}
                    selectedServices={selectedServices}
                    productsAndServices={productsAndServices}
                    setSelectedProducts={setSelectedProducts}
                    setSelectedServices={setSelectedServices}
                  />
                </Row>
              </Form>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Form.Check
            type="checkbox"
            id="shareViaEmail"
            label="Send Flyer via Email"
            style={{ fontSize: "14px" }}
            checked={shareViaEmail}
            disabled={disableAction}
            onChange={(e) => setShareViaEmail(e.target.checked)}
          />
          <Button
            variant="success"
            size="sm"
            type="submit"
            form="flyerForm"
            disabled={disableAction}
          >
            {disableAction
              ? "Downloading"
              : shareViaEmail
              ? "Send & Download"
              : "Download"}
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleOpenCloseFlyerTool(false)}
            disabled={disableAction}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FlyerTool;
