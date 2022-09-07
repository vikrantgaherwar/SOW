import React, { Component } from "react";
import ReactWordcloud from "react-wordcloud";
import axios from "axios";
import { select } from "d3-selection";
import "d3-transition";
class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.getCallback = this.getCallback.bind(this);
  }
  state = {
    words: [],
    searchterm: this.props.searchText,
    nosuggestions: false,
  };

  componentDidMount = () => {
    const WordCloudURL =
      "https://hpedelta.com:8983/solr/sharepoint_index/clustering?fl=file&indent=on&q=" +
      this.state.searchterm +
      "&wt=json";
    axios.get(WordCloudURL).then((res) => {
      if (res.data.response) {
        var originaldata = res.data.clusters;
        var str = JSON.stringify(originaldata);
        for (var i = 0; i <= res.data.clusters.length; i++) {
          str = str.replace("labels", "text");
          str = str.replace("score", "value");
        }
        var updated_data = JSON.parse(str);
        this.setState({ words: updated_data, nosuggestions: false });
      } else {
        this.setState({ nosuggestions: true });
      }
      if (res.data.clusters.length === 0) {
        this.setState({ nosuggestions: true });
      }
    });
  };

  getCallback(callback) {
    return (word, event) => {
      const isActive = callback !== "onWordMouseOut";
      const element = event.target;
      const text = select(element);
      text
        .on("click", () => {
          if (isActive) {
            console.log(word.text, "***********");

            this.props.onCloudSubmit(`${word.text}`);
          }
        })
        .transition()
        .attr("background", "white")
        .attr("font-size", isActive ? "300%" : "100%")
        .attr("text-decoration", isActive ? "underline" : "none");
    };
  }

  render() {
    const data = this.state.words;

    const callbacks = {
      onWordClick: this.getCallback("onWordClick"),
      onWordMouseOut: this.getCallback("onWordMouseOut"),
      onWordMouseOver: this.getCallback("onWordMouseOver"),
    };
    const options = {
      colors: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
      ],
      enableTooltip: false,
      deterministic: true,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSizes: [15, 40],
      fontStyle: "normal",
      fontWeight: "normal",
      padding: 4,
      rotations: 1,
      rotationAngles: [0, 180],
      scale: "sqrt", //log,linear,sqrt
      spiral: "archimedean", //archimedean,rectangular
      transitionDuration: 0,
      enableTransition: false,
    };
    const resizeStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "solid 1px #ddd",
      background: "#f0f0f0",
    };

    return (
      <div style={{ width: "100%", height: "100%" }}>
        {this.state.nosuggestions && (
          <h5 className="wordcloud_error">
            Oops...! Sorry No Word Cloud Suggestions Available
          </h5>
        )}
        {!this.state.nosuggestions && (
          <ReactWordcloud
            options={options}
            words={data}
            callbacks={callbacks}
            resizeStyle={resizeStyle}
          />
        )}
      </div>
    );
  }
}
export default WordCloud;
