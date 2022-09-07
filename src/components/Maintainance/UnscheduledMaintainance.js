import React from "react";
import RoboImage from "../../img/outage-robot.jpg";
const Maintainance = () => {
  return (
    <div align="center" className="container">
      <div className=" p-3">
        <div align="center" style={{ marginTop: 0 }}>
          <p>
            <img src={RoboImage} width="125" height="188" alt="" />
          </p>
          <h4>
            <strong>Unplanned Outage</strong>
          </h4>
        </div>
        <div className="col-12 fontx14" align="">
          <p>
            <b>“Knowledge Management Center” </b> is currently experiencing an
            unexpected interruption of service and our technical team is working
            on the issue resolution.
            <br />
            We apologize for any inconvenience.You may write to us for any
            queries or feedback to &nbsp;
            <a style={{ color: "blue" }} href="mailto:mailbox.kmcenter@hpe.com">
              mailbox.kmcenter@hpe.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Maintainance;
