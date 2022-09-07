import { Card, Col, Form, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import E3TExpensesForm from "../E3TExpensesForm";
import E3TFormResourceTable from "../E3TFormResourceTable";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import MyRow from "../MyRow";
import {
  actionE3TResourceTableSizingChange,
  actionE3TUpgradeTshirtSize,
  actionE3TValueChanged,
} from "../../Redux/Actions/E3T";
import { parseInteger } from "./e3tFormData";
import LoadingComponent from "../LoadingComponent";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { useEffect } from "react";
import { useRef } from "react";
import {
  actionE3TGetCostingEstimationV2,
  actionE3TRegionalDataCountryChanged,
} from "../../Redux/Actions/E3TData";

const E3TForm = ({ isView, isEdit, isClone }) => {
  const dispatch = useDispatch();
  const {
    e3t,
    regionalData,
    regionalDataV2,
    e3tTshirtSizes,
    e3tTshirtSizesV2,
    e3tRemoteSTDs,
    e3tCostingEstimation,
    e3tCostingEstimationFetchState,
    country,
  } = useSelector(
    (state) => ({
      e3t: state.e3t,
      regionalData: state.e3tData.e3tRegionalData,
      e3tTshirtSizesV2: state.e3tData.e3tTshirtSizesV2,
      e3tTshirtSizes: state.e3tData.e3tTshirtSizes,
      e3tRemoteSTDs: state.e3tData.e3tRemoteSTDs,
      e3tCostingEstimation: state.e3tData.e3tCostingEstimation,
      e3tCostingEstimationFetchState:
        state.e3tData.e3tCostingEstimationV2FetchState,
      country: state.masterData.country,
      regionalDataV2: state.e3tData.e3tRegionalDataV2,
    }),
    shallowEqual
  );
  const onSizeEstChange = (e) => {
    dispatch(
      actionE3TResourceTableSizingChange(
        e.target.name,
        parseInteger(e.target.value)
      )
    );
    dispatch(
      actionE3TGetCostingEstimationV2(true, e.target.name, e.target.value)
    );
  };

  const bootedRef = useRef(true);

  useEffect(() => {
    if (bootedRef.current === true) {
      bootedRef.current = false;
    }
  }, []);
  useEffect(() => {
    if (
      e3tCostingEstimationFetchState === APIFetchStatus.FETCHING &&
      bootedRef.current === false
    ) {
      toast.success("Pricing and Costing changed !");
    }
  }, [e3tCostingEstimationFetchState]);

  return (
    <>
      {/* <MyRow>
        <Col>
          <Form.Group as={Row}>
            <Col sm={2} className="d-flex flex-row align-items-center">
              <Form.Label>
                <div className="vert-aligned">
                  <strong>Sizing Estimate</strong>
                </div>
              </Form.Label>
            </Col>
            <Col sm={4}>
              
              {e3tTshirtSizes.map((tShirt, i) => (
                <Form.Check
                  disabled={isView}
                  id={`form_${i}_${tShirt.tshirtSize}`}
                  checked={e3t.tShirtSize === tShirt.id}
                  type={"radio"}
                  key={`${tShirt.tshirtSize}_${i}`}
                  inline
                  label={tShirt.tshirtSize}
                  value={tShirt.id}
                  name={"tShirtSize"}
                  onChange={onSizeEstChange}
                />
              ))}
            </Col>
          </Form.Group>
        </Col>
      </MyRow> */}
      <MyRow>
        <Col>
          <Form.Group as={Row}>
            <Col sm={2} className="d-flex flex-row align-items-center">
              <Form.Label>
                <div className="vert-aligned">
                  <strong>Default Resource Origin</strong>
                </div>
              </Form.Label>
            </Col>
            <Col sm={4}>
              <Form.Control
                disabled={isView}
                size="sm"
                name={"e3tRegionalDataType"}
                required
                as={"select"}
                onChange={(e) => {
                  dispatch(
                    actionE3TRegionalDataCountryChanged(
                      parseInteger(e.target.value)
                    )
                  );
                }}
                value={e3t.selectedCountry}
              >
                {regionalDataV2.map((element, index) => (
                  <option value={element.id} key={`${element}_${index}`}>
                    {element.sdtLookup}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>
        </Col>
      </MyRow>
      <MyRow>
        <Col sm={12}>
          <Card>
            <Card.Header as="h5" bsPrefix="sow-sectionline">
              Resource Details
            </Card.Header>
          </Card>
        </Col>
      </MyRow>
      <MyRow>
        <Col>
          <Form.Group as={Row}>
            <Col sm={12}>
              {e3tCostingEstimationFetchState === APIFetchStatus.FETCHING ? (
                <LoadingComponent />
              ) : (
                <E3TFormResourceTable
                  isView={isView}
                  isEdit={isEdit}
                  isClone={isClone}
                  country={country}
                  resourceTable={e3t.resourceTable}
                  e3tRemoteSTDs={e3tRemoteSTDs}
                  totalResourceCost={e3t.totalResourceCost}
                  regionalData={regionalData}
                  e3tCostingEstimation={e3tCostingEstimation}
                  e3t={e3t}
                  e3tTshirtSizes={e3tTshirtSizesV2}
                  onSizeEstChange={onSizeEstChange}
                />
              )}
            </Col>
          </Form.Group>
        </Col>
      </MyRow>
      <MyRow>
        <E3TExpensesForm
          isView={isView}
          expenses={{
            ...e3t,
            travel: e3t.travel,
            software: e3t.software,
            hardware: e3t.hardware,
            thirdParty: e3t.thirdParty,
            total: e3t.total,
            riskReserve: e3t.riskReserve,
            totalCostWithRiskReserve: e3t.totalCostWithRiskReserve,
            egm: e3t.egm,
            totalContractValue: e3t.totalContractValue,
            totalResourceCost: e3t.totalResourceCost,
            travelDescription: e3t.travelDescription,
            softwareDescription: e3t.softwareDescription,
            hardwareDescription: e3t.hardwareDescription,
            thirdPartyDescription: e3t.thirdPartyDescription,
            currency: regionalData[0].fx,
            totalRemoteValues: e3t.totalRemoteCost,
            onsiteTCV: e3t.onsiteTCV,
            remoteTCV: e3t.remoteTCV,
          }}
        />
      </MyRow>
      <ToastContainer toastClassName="toast-container-body-sow" />
    </>
  );
};

export default E3TForm;
