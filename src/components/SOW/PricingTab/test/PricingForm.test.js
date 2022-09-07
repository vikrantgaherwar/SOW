import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TestWrapper from "./TestWrapper";

describe("Pricing Form Component", () => {
  test("loads items eventually", async () => {
    const changeVal = (element, value) => {
      fireEvent.change(element, { target: { value: value } });
    };

    const clickButton = (element) => {
      fireEvent(
        element,
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      );
    };
    const { getByTestId } = await Promise.resolve(render(<TestWrapper />));
    const resourceType_0 = getByTestId("resourceType_0");
    const noOfResources_0 = getByTestId("noOfResources_0");
    const projectDuration_0 = getByTestId("projectDuration_0");
    const workingHours_0 = getByTestId("workingHours_0");
    const cost_0 = getByTestId("cost_0");
    const AddTableRow = getByTestId("AddTableRow");

    const travel = getByTestId("travel");
    const software = getByTestId("software");
    const softwareDescription = getByTestId("softwareDescription");
    const hardware = getByTestId("hardware");
    const hardwareDescription = getByTestId("hardwareDescription");
    const thirdParty = getByTestId("thirdParty");
    const thirdPartyDescription = getByTestId("thirdPartyDescription");
    const total = getByTestId("total");
    const riskReserve = getByTestId("riskReserve");
    const totalCostWithRiskReserve = getByTestId("totalCostWithRiskReserve");
    const egm = getByTestId("egm");
    const totalContractValue = getByTestId("totalContractValue");

    // TABLE
    expect(getByTestId("PricingTabComponent")).toBeTruthy();

    expect(resourceType_0).toBeTruthy();
    expect(noOfResources_0).toBeTruthy();
    expect(projectDuration_0).toBeTruthy();
    expect(workingHours_0).toBeTruthy();
    expect(cost_0).toBeTruthy();
    expect(AddTableRow).toBeTruthy();

    // Form
    expect(travel).toBeTruthy();
    expect(software).toBeTruthy();
    expect(softwareDescription).toBeTruthy();
    expect(hardware).toBeTruthy();
    expect(hardwareDescription).toBeTruthy();
    expect(thirdParty).toBeTruthy();
    expect(thirdPartyDescription).toBeTruthy();
    expect(total).toBeTruthy();
    expect(riskReserve).toBeTruthy();
    expect(totalCostWithRiskReserve).toBeTruthy();
    expect(egm).toBeTruthy();
    expect(totalContractValue).toBeTruthy();

    changeVal(resourceType_0, "Customer Proj/Prgm Mgr V");
    changeVal(noOfResources_0, "2");
    changeVal(projectDuration_0, "2");
    expect(workingHours_0.value).toBe("7.5");
  });
});
