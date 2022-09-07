import React, { useState, useEffect } from "react";
import axios from "axios";
import { map, uniq, some, trim, split, reduce, isEmpty, orderBy } from "lodash";
import { Row, Col, Form, Button, Container, Spinner } from "react-bootstrap";

import {
  GEO,
  OPP_ID,
  COUNTRY,
  PRICING,
  BUSINESS,
  COUNTRY_NAME,
  ACCOUNT_NAME,
  SOW_TEMPLATE,
  PRODUCT_LINE,
  BUSINESS_NAME,
  CONTRACT_TERM,
  REVENUE_RECOGNITION,
  DYNAMIC,
} from "./Constants";
import URLConfig from "../URLConfig";
import SingleOrMultiSelectDropDown from "./SingleOrMultiSelectDropDown";

const StandardData = ({
  loader,
  isEdit,
  setLoader,
  setActiveKey,
  standardFields,
  skuSelectedValue,
  setStandardFields,
  setSKUSelectedValue,
  standardFieldsLogData,
}) => {
  const [countryDD, setCountryDD] = useState([]);
  const [businessDD, setBusinessDD] = useState([]);
  const [templateDD, setTemplateDD] = useState([]);
  const [productLineDD, setProductLineDD] = useState([]);
  const [contractTermsDD, setContractTermsDD] = useState([]);
  const [revenueRecgnDD, setRevenueRecgnDD] = useState([]);
  const [errorData, setErrorData] = useState({});
  // const [defaultTemplate, setDefaultTemplate] = useState(false);
  const [showOppInfo, setShowOppInfo] = useState(false);
  const [skuList, setSKUList] = useState([]);

  useEffect(() => {
    fetchDropdownDetails();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setStandardFields(setDefaultValues(standardFieldsLogData));
    }
  }, [standardFieldsLogData]);

  const setDefaultValues = (fields) => {
    return reduce(
      fields,
      (acc, field) => {
        return {
          ...acc,
          [field?.standardField?.fieldName]: field?.fieldDefaultValue,
        };
      },
      {}
    );
  };

  const fetchDropdownDetails = async () => {
    const URL1 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetCountryDropdown";
    const URL2 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetBusinessDropdown";
    const URL3 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetContractTermsDropdown";
    const URL4 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetRevRecogDropdown";

    const getCountryDropdown = axios.get(URL1);
    const getBusinessDropdown = axios.get(URL2);
    const getContractTermDropdown = axios.get(URL3);
    const getRevenueRecDropdown = axios.get(URL4);

    try {
      const [countryRes, businessRes, contractTermRes, revenueRecRes] =
        await Promise.all([
          getCountryDropdown,
          getBusinessDropdown,
          getContractTermDropdown,
          getRevenueRecDropdown,
        ]);
      if (!isEmpty(countryRes?.data)) {
        /* set country data */
        setCountryDD(countryRes.data);
      }
      if (!isEmpty(businessRes?.data)) {
        /* set business data */
        setBusinessDD(businessRes?.data);
        /* set standard fields*/
        // if (!isEdit) {
        //   setStandardFields((prevState) => ({
        //     ...prevState,
        //     [BUSINESS]: businessRes?.data[0]?.value,
        //   }));
        // }
      }
      /* set contract term list */
      if (!isEmpty(contractTermRes?.data)) {
        const contractTermValues = orderBy(contractTermRes?.data, [
          "displayOrder",
        ]);
        setContractTermsDD(contractTermValues);
        /* set statndard fields*/
        if (!isEdit) {
          setStandardFields((prevState) => ({
            ...prevState,
            [CONTRACT_TERM]: contractTermValues[0]?.contractTerm,
          }));
        }
      }
      /* set revenue rec list */
      if (!isEmpty(revenueRecRes?.data)) {
        const revenueRecValues = orderBy(revenueRecRes?.data, ["displayOrder"]);
        setRevenueRecgnDD(revenueRecValues);
        /* set statndard fields*/
        if (!isEdit) {
          setStandardFields((prevState) => ({
            ...prevState,
            [REVENUE_RECOGNITION]: revenueRecValues[0]?.revRecognMethod,
          }));
        }
      }
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  // const getProductLine = async () => {
  //   const URL = URLConfig.getURLDeltaSOWAPI() + "SOWE3T/GetProductLineDropdown";
  //   try {
  //     const res = await axios.get(URL);
  //     if (res?.data) {
  //       setProductLineDD(
  //         map(
  //           filter(res?.data, (item) => item?.productLine !== ""),
  //           (product) => product?.productLine
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //   }
  // };

  /* get service type according to productLine */
  const getServiceType = async (productLine) => {
    const URL =
      URLConfig.getURLDeltaSOWAPI() + "SOWE3T/GetServiceTypeMappingData";
    try {
      const res = await axios.get(URL, { params: { productLine } });
      if (res?.data) {
        // getSKUList(res?.data?.business?.description, productLine);
        setStandardFields((prevState) => ({
          ...prevState,
          [BUSINESS]: res?.data?.business?.value,
        }));
        setSKUList(
          map(res?.data?.sowSkuPlMappings, (s) => ({
            ...s,
            value: s.sku,
            label: `${s.sku} - ${s.skuDescription}`,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const getSKUList = async (serviceType, productLine) => {
  //   if (toSafeInteger(standardFields[SOW_TEMPLATE]) === 15) {
  //     setLoader(true);

  //     const URL = URLConfig.getSKUListUrl(serviceType, productLine);
  //     try {
  //       const res = await axios(URL);
  //       if (res?.data?.response?.docs) {
  //         const skuList = res?.data?.response?.docs;
  //         setSKUList(
  //           map(skuList, (s) => ({
  //             ...s,
  //             value: s.sku,
  //             label: `${s.sku}-${s.sku_description}`,
  //           }))
  //         );
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoader(false);
  //     }
  //   }
  // };

  useEffect(() => {
    if (standardFields[PRODUCT_LINE]) {
      getServiceType(standardFields[PRODUCT_LINE]);
    }
  }, [standardFields[PRODUCT_LINE]]);

  useEffect(() => {
    if (standardFields[BUSINESS]) {
    }
  }, [standardFields[BUSINESS]]);

  const getOpportunityDetails = async (oppId) => {
    setLoader(true);
    const URL = URLConfig.getSOWSFDCUrl(oppId);
    try {
      const res = await axios(URL);
      if (res?.data?.response) {
        setShowOppInfo(false);
        setStandardFields((prevState) => ({
          ...prevState,
          [ACCOUNT_NAME]: res?.data?.response?.records[0]?.Account?.Name,
          [GEO]:
            res?.data?.response?.records[0]?.Account?.WorldRegion_Region__c,
          [COUNTRY_NAME]: res?.data?.response?.records[0]?.Country__c,
          // Setting Country Dropdown value
          [COUNTRY]: res?.data?.response?.records[0]?.Country__c,
          [BUSINESS_NAME]: res?.data?.response?.records[0]?.Business_Group2__c,
          [PRODUCT_LINE]: trim(
            split(
              res?.data?.response?.records[0]?.OpportunityLineItems?.records[0]
                ?.Product_Line__c,
              "-",
              1
            )
          ),
        }));
        setProductLineDD(
          uniq(
            map(
              res?.data?.response?.records[0]?.OpportunityLineItems?.records,
              (product) => trim(split(product?.Product_Line__c, "-", 1))
            )
          )
        );
        checkError(
          ACCOUNT_NAME,
          res?.data?.response?.records[0]?.Account?.Name
        );
        checkError(
          GEO,
          res?.data?.response?.records[0]?.Account?.WorldRegion_Region__c
        );
        checkError(COUNTRY_NAME, res?.data?.response?.records[0]?.Country__c);
        checkError(COUNTRY, res?.data?.response?.records[0]?.Country__c);
        checkError(
          BUSINESS_NAME,
          res?.data?.response?.records[0]?.Business_Group2__c
        );
        checkError(
          PRODUCT_LINE,
          trim(
            split(
              res?.data?.response?.records[0]?.OpportunityLineItems?.records[0]
                ?.Product_Line__c,
              "-",
              1
            )
          )
        );

        /* get service type and list of SKU's according to that */
        // getServiceType(res.data.response[0].Product_Line__c);
      } else {
        setStandardFields((prevState) => ({
          ...prevState,
          [ACCOUNT_NAME]: "",
          [GEO]: "",
          [COUNTRY_NAME]: "",
          // Setting Country Dropdown value
          [COUNTRY]: "",
          [BUSINESS_NAME]: "",
          [PRODUCT_LINE]: "",
        }));
        setShowOppInfo(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // if (defaultTemplate) {
    // fetchTemplateDropdownDetails("Australia");
    // } else
    if (standardFields[COUNTRY] && standardFields[BUSINESS]) {
      fetchTemplateDropdownDetails("Australia", standardFields[BUSINESS]);
    }
    // else {
    //   setTemplateDD({});
    //   setStandardFields((prevState) => {
    //     delete prevState[SOW_TEMPLATE];
    //     return {
    //       ...prevState,
    //     };
    //   });
    // }
  }, [standardFields[COUNTRY], standardFields[BUSINESS]]);

  const fetchTemplateDropdownDetails = async (countryName, businessName) => {
    setLoader(true);
    const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetTemplateDropdown";
    try {
      const res = await axios.get(URL, {
        params: { countryName, businessName },
      });
      if (res?.data) {
        setTemplateDD(res.data);
        setStandardFields((prevState) => ({
          ...prevState,
          [SOW_TEMPLATE]: res.data[0]?.id,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === OPP_ID) {
      setShowOppInfo(false);
    }
    checkError(name, value);

    setStandardFields((standardFields) => {
      return { ...standardFields, [name]: value };
    });
  };

  const checkIfValidOppId = (oppId) => {
    if (
      oppId?.length > 2 &&
      (oppId.toUpperCase().indexOf("OPP") === 0 ||
        oppId.toUpperCase().indexOf("OPE") === 0) &&
      oppId.trim().length === 14
    ) {
      return false;
    }
    return true;
  };

  const checkError = (field, value) => {
    setErrorData((prevState) => {
      if (prevState[field]) delete prevState[field];
      return { ...prevState };
    });

    if (isEmpty(value)) {
      setErrorData((prevState) => ({ ...prevState, [field]: true }));
    }
  };

  const checkErrors = (errorData = {}) => {
    const existingErrorData = errorData;

    if (!standardFields[OPP_ID]) existingErrorData[OPP_ID] = true;
    if (!standardFields[BUSINESS]) existingErrorData[BUSINESS] = true;
    if (!standardFields[COUNTRY]) existingErrorData[COUNTRY] = true;
    if (!standardFields[SOW_TEMPLATE]) existingErrorData[SOW_TEMPLATE] = true;

    if (!standardFields[ACCOUNT_NAME]) existingErrorData[ACCOUNT_NAME] = true;
    if (!standardFields[GEO]) existingErrorData[GEO] = true;
    if (!standardFields[COUNTRY_NAME]) existingErrorData[COUNTRY_NAME] = true;
    if (!standardFields[BUSINESS_NAME]) existingErrorData[BUSINESS_NAME] = true;
    if (!standardFields[PRODUCT_LINE]) existingErrorData[PRODUCT_LINE] = true;

    setErrorData({ ...existingErrorData });
  };

  const handleNext = () => {
    checkErrors(errorData);

    if (!some(errorData, (item) => item === true)) {
      // Need to Remove this later
      setActiveKey(process.env.REACT_APP_ENV === "UAT" ? PRICING : DYNAMIC);

      // if (defaultTemplate) {
      //   triggerSaveCustomerLog();
      // }
    }
    // setActiveKey(DYNAMIC);

    // setValidated(true);
  };

  // const triggerSaveCustomerLog = async () => {
  //   const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/SOWCustomerLog";
  //   const data = {
  //     employeeName: Cookies.get("name"),
  //     dateAccessed: moment(),
  //     country: Cookies.get("country"),
  //     oppId: standardFields[OPP_ID],
  //     isCheckboxChecked: defaultTemplate,
  //   };
  //   try {
  //     await axios.post(URL, data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleCheckDefault = (event) => {
  //   const { checked } = event.target;
  //   setDefaultTemplate(checked);
  // };

  /* handle SKU list values */
  const handleSKUchange = (e) => {
    setSKUSelectedValue(Array.isArray(e) ? e : []);
  };

  const customSelectStyles = {
    option: (base) => ({
      ...base,
      overflowX: "hidden",
    }),
  };

  return (
    <Container bsPrefix="container container-fluid mt-4">
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
          <Container bsPrefix="container sow-container">
            <Form noValidate>
              <Form.Group as={Row} controlId="oppId">
                <Col sm={2}>
                  <Form.Label>
                    <strong>Opportunity ID</strong>
                  </Form.Label>
                </Col>
                <Col sm={5}>
                  <Form.Control
                    size="sm"
                    name={OPP_ID}
                    type="text"
                    placeholder="Enter Opportunity Id"
                    value={standardFields[OPP_ID] || ""}
                    onChange={(e) => handleChange(e)}
                  />
                  {errorData[OPP_ID] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                  {showOppInfo && (
                    <Form.Control.Feedback>
                      Please try another Opportunity ID as this is not tied to a
                      Product Line
                    </Form.Control.Feedback>
                  )}
                </Col>
                <Col sm={2}>
                  <Button
                    bsPrefix="btn btn-sm btn-primary info-button"
                    // size="sm"
                    disabled={checkIfValidOppId(standardFields[OPP_ID])}
                    onClick={() =>
                      getOpportunityDetails(standardFields[OPP_ID])
                    }
                  >
                    Get Info
                  </Button>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={2}>
                  <Form.Label>
                    <strong>Business</strong>
                  </Form.Label>
                </Col>
                <Col sm={5}>
                  <Form.Control
                    as="select"
                    size="sm"
                    name={BUSINESS}
                    type="text"
                    value={standardFields[BUSINESS] || ""}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="">Select</option>
                    {map(businessDD, (item) => (
                      <option key={item.id} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </Form.Control>
                  {errorData[BUSINESS] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="country">
                <Col sm={2}>
                  <Form.Label>
                    <strong>Country</strong>
                  </Form.Label>
                </Col>
                <Col sm={5}>
                  <Form.Control
                    as="select"
                    size="sm"
                    name={COUNTRY}
                    type="text"
                    value={standardFields[COUNTRY] || ""}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="">Select</option>
                    {map(countryDD, (item, idx) => (
                      <option key={idx} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Control>
                  {errorData[COUNTRY] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                </Col>
              </Form.Group>

              {/* contract terms */}
              <Form.Group as={Row} controlId="contractTerms">
                <Col sm={2}>
                  <Form.Label>
                    <strong>Contract Term</strong>
                  </Form.Label>
                </Col>
                <Col sm={5}>
                  <Form.Control
                    as="select"
                    size="sm"
                    name={CONTRACT_TERM}
                    type="text"
                    value={standardFields[CONTRACT_TERM] || ""}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="">Select</option>
                    {map(contractTermsDD, (item) => (
                      <option key={item.id} value={item.contractTerm}>
                        {item.contractTerm}
                      </option>
                    ))}
                  </Form.Control>
                  {errorData[CONTRACT_TERM] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                </Col>
              </Form.Group>
              {/* contract terms ends */}
              {/* revenue recogition */}
              <Form.Group as={Row} controlId="revenueRecognition">
                <Col sm={2}>
                  <Form.Label>
                    <strong>Revenue Recogition</strong>
                  </Form.Label>
                </Col>
                <Col sm={5}>
                  <Form.Control
                    as="select"
                    size="sm"
                    name={REVENUE_RECOGNITION}
                    type="text"
                    value={standardFields[REVENUE_RECOGNITION] || ""}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="">Select</option>
                    {map(revenueRecgnDD, (item) => (
                      <option key={item.id} value={item.revRecognMethod}>
                        {item.revRecognMethod}
                      </option>
                    ))}
                  </Form.Control>
                  {errorData[REVENUE_RECOGNITION] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                </Col>
              </Form.Group>
              {/* revenue recogition ends */}
              <Form.Group as={Row} controlId="sowTemplate">
                <Col sm={2}>
                  <Form.Label>
                    <strong>SOW Template</strong>
                  </Form.Label>
                </Col>
                <Col sm={5}>
                  <Form.Control
                    as="select"
                    size="sm"
                    name={SOW_TEMPLATE}
                    type="text"
                    value={standardFields[SOW_TEMPLATE] || ""}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="">Select</option>
                    {map(templateDD, (item, idx) => (
                      <option key={idx} value={item.id}>
                        {item.templateInputName}
                      </option>
                    ))}
                  </Form.Control>
                  {errorData[SOW_TEMPLATE] && (
                    <Form.Control.Feedback>
                      Required Field
                    </Form.Control.Feedback>
                  )}
                </Col>
                {/* <Col sm={2}>
                  <Form.Check type="checkbox" id="defaultTemplateCheckbox">
                    <Form.Check.Input
                      type="checkbox"
                      checked={defaultTemplate}
                      disabled={
                        isEmpty(standardFields[OPP_ID]) ||
                        isEmpty(standardFields[COUNTRY]) ||
                        standardFields[COUNTRY] === "Australia"
                      }
                      onChange={(e) => handleCheckDefault(e)}
                    />
                    <Form.Check.Label bsPrefix="form-check-label custom-form-check-label">
                      Select Default
                    </Form.Check.Label>
                  </Form.Check>
                </Col> */}
              </Form.Group>

              <h6>Customer Data</h6>
              <hr className="sow-titleline" />

              <Row>
                <Col>
                  <Form.Group as={Row} controlId="accountName">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Account Name</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        size="sm"
                        name={ACCOUNT_NAME}
                        type="text"
                        value={standardFields[ACCOUNT_NAME] || ""}
                        onChange={(e) => handleChange(e)}
                      />
                      {errorData[ACCOUNT_NAME] && (
                        <Form.Control.Feedback>
                          Required Field
                        </Form.Control.Feedback>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row} controlId="geo">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Geo</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        size="sm"
                        name={GEO}
                        type="text"
                        value={standardFields[GEO] || ""}
                        onChange={(e) => handleChange(e)}
                      />
                      {errorData[GEO] && (
                        <Form.Control.Feedback>
                          Required Field
                        </Form.Control.Feedback>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="countryName">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Country</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        size="sm"
                        name={COUNTRY_NAME}
                        type="text"
                        value={standardFields[COUNTRY_NAME] || ""}
                        onChange={(e) => handleChange(e)}
                      />
                      {errorData[COUNTRY_NAME] && (
                        <Form.Control.Feedback>
                          Required Field
                        </Form.Control.Feedback>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row}>
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Business Name</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        size="sm"
                        name={BUSINESS_NAME}
                        type="text"
                        value={standardFields[BUSINESS_NAME] || ""}
                        onChange={(e) => handleChange(e)}
                      />
                      {errorData[BUSINESS_NAME] && (
                        <Form.Control.Feedback>
                          Required Field
                        </Form.Control.Feedback>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="productLine">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Product Line</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        as="select"
                        size="sm"
                        name={PRODUCT_LINE}
                        type="text"
                        value={standardFields[PRODUCT_LINE] || ""}
                        onChange={(e) => handleChange(e)}
                      >
                        <option value="">Select</option>
                        {map(productLineDD, (item, idx) => (
                          <option key={idx} value={item}>
                            {item}
                          </option>
                        ))}
                      </Form.Control>
                      {errorData[PRODUCT_LINE] && (
                        <Form.Control.Feedback>
                          Required Field
                        </Form.Control.Feedback>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
                {parseInt(standardFields[SOW_TEMPLATE]) === 15 ? (
                  <Col>
                    <Form.Group as={Row} controlId="skus">
                      <Col sm={4}>
                        <Form.Label>
                          <strong>Select SKU</strong>
                        </Form.Label>
                      </Col>
                      <Col sm={8}>
                        <SingleOrMultiSelectDropDown
                          isMulti
                          customSelectStyles={customSelectStyles}
                          menuPlacement="top"
                          name="SKU"
                          placeholder="SKU"
                          classNamePrefix="SKU"
                          handlechange={handleSKUchange}
                          value={skuList.filter((obj) =>
                            skuSelectedValue.some(
                              (sku) => sku.value === obj.value
                            )
                          )}
                          options={skuList}
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                            ClearIndicator: () => null,
                          }}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                ) : (
                  <Col />
                )}
              </Row>
            </Form>
          </Container>
          <Row>
            <Col>
              <Button
                bsPrefix="btn btn-success btn-sm float-right action-button"
                onClick={handleNext}
                disabled={
                  !standardFields[SOW_TEMPLATE] ||
                  !standardFields[PRODUCT_LINE] ||
                  !standardFields[BUSINESS_NAME]
                }
              >
                Next
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default StandardData;
