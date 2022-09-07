import { useState } from "react";
import { Col, ProgressBar, Button } from "react-bootstrap";
import GeneratePreviewBottom from "../../Components/GeneratePreviewBottom";
import GeneratePreviewComponent from "../../Components/GeneratePreviewComponent";
import SowRoutePageWrapper from "../../Components/RoutePageWrapper";

const GeneratePage = () => {
  return (
    <>
      <SowRoutePageWrapper>
        <GeneratePreviewComponent />
      </SowRoutePageWrapper>
      <GeneratePreviewBottom />
    </>
  );
};

export default GeneratePage;
