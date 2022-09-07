import React, { Fragment } from "react";
import { post } from "axios";
import Cookies from "js-cookie";
import URLConfig from "./URLConfig";

class FeedBackForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "get-id-from-somewhere",
      file: null,
      title: "",
      comments: "",
      filesUrl: null,
    };
  }
  async submit(e) {
    e.preventDefault();
    const url = URLConfig.getURL_SiteFeedBack() + "/uploadDocument";
    const formData = new FormData();
    for (var index = 0; index < this.state.files.length; index++) {
      var element = this.state.files[index];
      formData.append("body", element);
    }
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    post(url, formData, config).then((res) => {
      if (res.data) {
        this.setState({ filesUrl: res.data });
      }
    });
  }
  titleChanged(e) {
    this.setState({ title: e.target.value });
  }
  feedbackCommentChanged(e) {
    this.setState({ comments: e.target.value });
  }
  setFile(e) {
    this.setState({ files: e.target.files });
  }
  async submitFeedback(e) {
    e.preventDefault();

    const url = URLConfig.getURL_SiteFeedBack();
    post(url, {
      title: this.state.title,
      detailedFeedBack: this.state.comments,
      userId: Cookies.get("empnumber"),
      urls: this.state.filesUrl,
      userName: Cookies.get("name"),
    }).then((res) => {
      if (res.data) {
        this.setState({ title: "", comments: "", filesUrl: null });
        document.getElementById("feedBackModal").classList.toggle("show");
        document
          .getElementsByClassName("modal-backdrop")[0]
          .classList.toggle("show");
      }
    });
  }
  render() {
    return (
      <Fragment>
        <a className="pointer" data-toggle="modal" data-target="#feedBackModal">
          Feedback
        </a>
        <div
          className="modal fade"
          id="feedBackModal"
          role="dialog"
          aria-labelledby="deploymentModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deploymentModalLabel">
                  Delta Feedback
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  translate="no"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body document-data-modal">
                <div className="modal-body">
                  <div className="col-12">
                    <div className="form-group-sm">
                      <label htmlFor="feedbacktitle">
                        <strong>Title</strong>
                      </label>
                      <input
                        type="text"
                        id="feedbacktitle"
                        className="form-control feedbacktitle"
                        value={this.state.title}
                        onChange={(e) => this.titleChanged(e)}
                      ></input>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="form-group-sm">
                      <label htmlFor="feedbacktitle">
                        <strong>Detailed Feedback</strong>
                      </label>
                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        value={this.state.comments}
                        onChange={(e) => this.feedbackCommentChanged(e)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12 mt-2 row" align="left">
                    <form className="form-inline">
                      <div className="form-group mx-sm-3">
                        {/* <button type="submit" className="btn btn-primary btn-sm browsebtn">Browse</button>
                        <input type="password" className="form-control form-control-sm feedbacktitle fileuploadform" id="fileupload"></input> */}
                        <input
                          type="file"
                          multiple
                          onChange={(e) => this.setFile(e)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm fileuploadbtn"
                        onClick={(e) => this.submit(e)}
                      >
                        Upload
                      </button>
                      <br />
                      {this.state.filesUrl != null &&
                        this.state.filesUrl.map((list, index) => (
                          <div className="col-12" key={index}>
                            <a
                              target="_blank"
                              href={
                                URLConfig.getURL_SiteFeedBack_Upload() + list
                              }
                            >
                              {list}
                            </a>
                          </div>
                        ))}
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={(e) => this.submitFeedback(e)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default FeedBackForm;
