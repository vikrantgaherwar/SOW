import React from "react";
import "bootstrap";
import HeaderForm from "./HeaderForm";
import "../css/anps.css";
import URLConfig from "./URLConfig";
class DocumentViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
    };
  }

  componentDidMount() {
    const CryptoJS = require("crypto-js");
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("u")) {
      var bytes = CryptoJS.AES.decrypt(
        urlParams.get("u").replace(/ /g, "+"),
        URLConfig.getEncKey()
      );
      var decryptedUrl = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.setState({ url: decryptedUrl[0].url });
    }
  }

  render() {
    return (
      <div>
        <HeaderForm />
        <div className="embed-container">
          <iframe src={this.state.url} />
        </div>
        <footer>
          © Copyright 2020 Hewlett Packard Enterprise - Process Automation, CSC
          Bangalore
        </footer>
      </div>
    );
  }
}
export default DocumentViewer;
