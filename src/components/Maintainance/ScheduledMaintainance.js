import React from "react";
import RoboImage from "../../img/outage-robot.jpg";
const ScheduledMaintainance = () => {
  return (
    <div align="center" className="container">
      <div className=" p-3">
        <div align="center" style={{ marginTop: 0 }}>
          <p>
            <img src={RoboImage} width="125" height="188" alt="" />
          </p>
          <h4>
            <strong>Planned Outage</strong>
          </h4>
        </div>
        <div className="col-12 fontx14" align="">
          <p>
            <b>“Knowledge Management Center” </b> is under a scheduled outage
            from (time AM/PM) to (time AM/PM) UTC. We will notify once solution
            is functional.
            <br />
            You may write to us for any queries or feedback to &nbsp;
            <a style={{ color: "blue" }} href="mailto:mailbox.kmcenter@hpe.com">
              mailbox.kmcenter@hpe.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ScheduledMaintainance;
