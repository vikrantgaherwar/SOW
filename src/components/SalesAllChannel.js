import React from "react";
import { Doughnut } from "react-chartjs-2";
import { ExportReactCSV } from "./ExportReactCSV";

class SalesAllChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSales: this.props.dataSales,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataSales !== prevProps.dataSales) {
      this.setState({ dataSales: this.props.dataSales });
    }
  }

  handleClick = (label) => {
    const { onChannelSelect } = this.props;
    onChannelSelect(label);
  };

  render() {
    const dataPoints = this.state.dataSales;
    var Colors = [];
    dataPoints.forEach((item, index) => {
      if (item.saleCategory === "Direct") {
        Colors.push("#01A982");
      } else {
        Colors.push("#FEC901");
      }
    });

    const data = {
      labels: dataPoints.map((s) => s.saleCategory),
      datasets: [
        {
          data: dataPoints.map((c) => c.saleCount),
          backgroundColor: Colors,
          hoverBackgroundColor: Colors,
          borderColor: ["#ffffff"],
          borderWidth: [1, 1],
          hoverBorderWidth: 5,
        },
      ],
    };

    const options = {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          fontSize: 10,
        },
        position: "bottom",
      },
    };

    return (
      <>
        <div>
          <Doughnut
            data={data}
            options={options}
            onElementsClick={(elems) => {
              if (elems[0] !== undefined && elems[0]._model !== undefined) {
                this.handleClick(elems[0]._model.label);
              }
            }}
          />
          <br />
          <br />
        </div>
      </>
    );
  }
}
export default SalesAllChannel;
