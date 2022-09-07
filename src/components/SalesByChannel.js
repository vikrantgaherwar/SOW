import React from "react";
import { Doughnut } from "react-chartjs-2";
import SalesTable from "./SalesTable";

class SalesByChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSales: this.props.dataSales,
      type: this.props.type,
    };
  }
  ClickHandle = (channel, label) => {
    const { onProductSelect } = this.props;
    onProductSelect(channel, label);
  };

  componentDidUpdate(prevProps) {
    if (this.props.dataSales !== prevProps.dataSales) {
      this.setState({ dataSales: this.props.dataSales });
    }
  }
  render() {
    const dataPoints = this.state.dataSales;
    const type = this.state.type;
    const data = {
      labels: dataPoints.map((s) => s.saleCategory),
      datasets: [
        {
          data: dataPoints.map((c) => c.saleCount),
          backgroundColor: [
            "#00a982",
            "#7630ea",
            "#0e5265",
            "#33dac8",
            "#55b4e6",
            "#c140ff",
            "#fec901",
            "#6caf6a",
            "#6c126b",
            "5a7d14",
          ],
          hoverBackgroundColor: [
            "#00a982",
            "#7630ea",
            "#0e5265",
            "#33dac8",
            "#55b4e6",
            "#c140ff",
            "#fec901",
            "#6caf6a",
            "#6c126b",
            "5a7d14",
          ],
          borderColor: ["#ffffff"],
          borderWidth: [0.5, 0.5],
          hoverBorderWidth: 5,
          hoverBackgroundColor: [
            "#00a982",
            "#7630ea",
            "#0e5265",
            "#33dac8",
            "#55b4e6",
            "#c140ff",
            "#fec901",
            "#6caf6a",
            "#6c126b",
            "5a7d14",
          ],
        },
      ],
    };
    const options = {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          fontSize: 8,
        },
        position: "bottom",
      },
    };
    return (
      <div>
        <Doughnut
          data={data}
          options={options}
          onElementsClick={(elems) => {
            if (elems[0] !== undefined && elems[0]._model !== undefined) {
              this.ClickHandle(type, elems[0]._model.label);
            }
          }}
        />
        <SalesTable
          onProductSelect={this.ClickHandle}
          Sales={dataPoints}
          Type={type}
        />
      </div>
    );
  }
}
export default SalesByChannel;
