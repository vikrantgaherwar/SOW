import React, { Fragment } from "react";
import axios from "axios";
import URLConfig from "./URLConfig";
import TrackingService from "./TrackingService";
import Cookies from "js-cookie";
class UseFullLinks extends React.Component {
  constructor(props) {
    super(props);
    this.TrackingService = new TrackingService();
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    const URL_FooterLinks = URLConfig.getURL_FooterLinks();
    axios(URL_FooterLinks)
      .then((response) => response.data)
      .then((links) => {
        if (links.data && links.data.length > 0) {
          links.data.sort(function (a, b) {
            var nameA = a.DisplayName.toUpperCase();
            var nameB = b.DisplayName.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });

          this.setState({ data: links.data });
        }
      });
  }
  loglinks = (displayName, Path, URL) => {
    this.TrackingService.LogLinksClick(
      Cookies.get("empnumber"),
      displayName,
      Path,
      URL,
      true
    );
  };
  render() {
    const { data } = this.state;
    const style = {
      color: "black",
      listStyleType: "none",
      float: "left",
      width: "20%",
      fontSize: "12px",
      fontFamily: "Arial,Helvetica,sans-serif",
    };
    return (
      <Fragment>
        <div className="row col-12 m-0 pt-2 footerMainDiv ">
          <div className="col-1 p-0 footerlink"></div>
          <div className="col-11 p-0 footerlinks">
            {/* <div id="anpslinks" className="p-1">
          <div><strong>A&amp;PS Links</strong></div>
        </div> */}
            <a
              href="mailto:pointnextservices_knowledgesupportoffice@hpe.com"
              target="_top"
              className="p-1"
              style={style}
            >
              Ask Knowledge Management Center
            </a>

            {data !== undefined &&
              data.map((link, index) => (
                <div
                  key={index}
                  onClick={() =>
                    this.loglinks(link.DisplayName, link.Path, link.URL)
                  }
                >
                  <a
                    href={link.URL}
                    target="_blank"
                    className="p-1 pr-2"
                    rel="noreferrer"
                    style={style}
                  >
                    {link.DisplayName}
                  </a>
                </div>
              ))}
          </div>
        </div>
      </Fragment>
    );
  }
}
export default UseFullLinks;
