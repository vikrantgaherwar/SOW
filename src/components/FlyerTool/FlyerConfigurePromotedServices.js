import React from "react";
import { Col, Card, Form, Accordion } from "react-bootstrap";
import { map, uniq, find, filter, includes } from "lodash";
import FlyerContextAwareToggle from "./FlyerContextAwareToggle";

const FlyerConfigurePromotedServices = ({
  disableAction,
  selectedProducts,
  selectedServices,
  productsAndServices,
  setSelectedProducts,
  setSelectedServices,
}) => {
  const removeRelatedServices = (value) => {
    setSelectedServices((prevSelectedServices) => {
      const productRelatedServiceUIDs = map(
        find(productsAndServices, (product) => product.productName === value)
          ?.servicesList,
        (item) => item.uid
      );
      return filter(
        prevSelectedServices,
        (service) => !includes(productRelatedServiceUIDs, service)
      );
    });
  };

  const handleProductsCheckChange = (event) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (event.target.checked) {
        return uniq([...prevSelectedProducts, event.target.value]);
      } else {
        removeRelatedServices(event.target.value);
        return filter(
          prevSelectedProducts,
          (item) => item !== event.target.value
        );
      }
    });
  };

  const handleServicesCheckChange = (event) => {
    setSelectedServices((prevSelectedServices) => {
      if (event.target.checked && prevSelectedServices.length <= 3) {
        return uniq([...prevSelectedServices, event.target.value]);
      } else {
        return filter(
          prevSelectedServices,
          (item) => item !== event.target.value
        );
      }
    });
  };

  return (
    <>
      <Col sm={4}>
        <Form.Label>
          Please Select the Product you installed for the Customer
        </Form.Label>
        <div className="d-flex flex-column">
          {map(productsAndServices, (item) => (
            <Form.Check
              key={item?.productName}
              type="checkbox"
              id={item?.productName}
              bsPrefix="form-check d-flex flex-row"
            >
              <Form.Check.Input
                type="checkbox"
                value={item?.productName}
                checked={includes(selectedProducts, item?.productName)}
                onChange={(e) => handleProductsCheckChange(e)}
                disabled={disableAction}
                required={selectedProducts.length === 0}
              />
              <Form.Check.Label
                bsPrefix="form-check-label"
                style={{ fontSize: "14px" }}
              >
                {item?.productName}
              </Form.Check.Label>
            </Form.Check>
          ))}
        </div>
      </Col>
      <Col bsPrefix="col-sm-8 border-left">
        {selectedProducts.length > 0 && (
          <>
            <Form.Label>
              Please Select the Service you installed for the Customer (Max
              Allowed is 4)
            </Form.Label>
            <Form.Text>
              <strong>{selectedServices.length} Services Selected</strong>
            </Form.Text>
            {map(selectedProducts, (selectedProduct) => {
              const services = find(
                productsAndServices,
                (product) => product.productName === selectedProduct
              )?.servicesList;
              return (
                <Accordion
                  key={selectedProduct}
                  defaultActiveKey={`${selectedProduct}`}
                >
                  <Card>
                    <FlyerContextAwareToggle
                      as="h5"
                      eventKey={`${selectedProduct}`}
                    >
                      {selectedProduct}
                    </FlyerContextAwareToggle>
                    <Accordion.Collapse
                      eventKey={`${selectedProduct}`}
                      style={{ borderBottom: 0 }}
                    >
                      <Card.Body>
                        {map(services, (service) => {
                          return (
                            <Form.Check
                              key={service?.uid}
                              type="checkbox"
                              id={service?.uid}
                              bsPrefix="form-check d-flex flex-row"
                            >
                              <Form.Check.Input
                                type="checkbox"
                                value={service?.uid}
                                checked={includes(
                                  selectedServices,
                                  service?.uid
                                )}
                                onChange={(e) => handleServicesCheckChange(e)}
                                disabled={disableAction}
                                required={selectedServices.length === 0}
                              />
                              <Form.Check.Label
                                bsPrefix="form-check-label"
                                style={{ fontSize: "14px" }}
                              >
                                {service?.service_definition_en}
                              </Form.Check.Label>
                            </Form.Check>
                          );
                        })}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              );
            })}
          </>
        )}
      </Col>
    </>
  );
};

export default FlyerConfigurePromotedServices;
