import { useHistory, useLocation } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { showE3T } from "../../Redux/utils/showE3T";
import { ModeContext } from "../ModeProvider";

const SOWTabs = () => {
  const location = useLocation();

  const [selected, setSelected] = useState("customer");

  const showE3t = useSelector((state) => showE3T(state));
  const history = useHistory();
  const { isView, isEdit, isClone } = useContext(ModeContext);

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.indexOf("e3t") > -1) {
      setSelected("pricing");
    } else if (pathname.indexOf("summary") > -1) {
      setSelected("summary");
    } else if (pathname.indexOf("dynamic") > -1) {
      setSelected("dynamic");
    } else if (pathname.indexOf("generate") > -1) {
      setSelected("preview");
    } else {
      setSelected("customer");
    }
  }, [location]);

  const handleTabSelection = (eventKey) => {
    const pathname = location.pathname;
    const sp = pathname.split("/");
    if (eventKey === "pricing" && selected !== "pricing") {
      selected === "customer" ? sp[sp.length] = "e3t" : sp[sp.length - 1] = "e3t";
      history.push(sp.join("/"));
    } else if (eventKey === "summary" && selected !== "summary") {
      selected === "customer" ? sp[sp.length] = "summary" : sp[sp.length - 1] = "summary";
      history.push(sp.join("/"));
    } else if (eventKey === "dynamic" && selected !== "dynamic") {
      selected === "customer" ? sp[sp.length] = "dynamic-data" : sp[sp.length - 1] = "dynamic-data";
      history.push(sp.join("/"));
    } else if (eventKey === "preview" && selected !== "preview") {
      selected === "customer" ? sp[sp.length] = "generate-preview" : sp[sp.length - 1] = "generate-preview";
      history.push(sp.join("/"));
    } else if (eventKey === "customer" && selected !== "customer") {
      sp.pop();
      history.push(sp.join("/"));
    }
  }
  return (
    <Tabs activeKey={selected} className="myTabs" onSelect={handleTabSelection}>
      <Tab disabled={!(isView || isClone || isEdit)}
        eventKey="customer"
        title={
          <>
            <i className="fas fa-database mr-2" style={{ color: "#0d5265" }} />
            Customer Data
          </>
        }
      ></Tab>
      <Tab disabled={!(isView || isClone || isEdit)}
        eventKey="dynamic"
        title={
          <>
            <i className="fas fa-server mr-2" />
            Dynamic Data
          </>
        }
      >
        <></>
      </Tab>
      {showE3t && (
        <Tab disabled={!(isView || isClone || isEdit)}
          eventKey="pricing"
          title={
            <>
              <i className="fas fa-calculator mr-2" />
              Costing
            </>
          }
        >
          <></>
        </Tab>
      )}

      {showE3t && (
        <Tab disabled={!(isView || isClone || isEdit)}
          eventKey="summary"
          title={
            <>
              <i className="fas fa-file-contract mr-2" />
              Pricing &amp; Summary
            </>
          }
        >
          <></>
        </Tab>
      )}

      <Tab disabled={!(isView || isClone || isEdit)}
        eventKey="preview"
        title={
          <>
            <i className="fas fa-binoculars mr-2" />
            {/* <i className="fas fa-eye mr-2" /> */}
            Preview
          </>
        }
      >
        <></>
      </Tab>
    </Tabs>
  );
};

export default SOWTabs;
