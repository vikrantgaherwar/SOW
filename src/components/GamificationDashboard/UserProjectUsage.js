import React from "react";
import { Doughnut } from "react-chartjs-2";

class UserProjectUsage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ProjectUsageDetails: this.props.ProjectUsageDetails,
    };
    this.ClickHandle = this.ClickHandle.bind(this);
  }
  ClickHandle(channel, label) {
    const { onProductLineSelect } = this.props;
    onProductLineSelect(channel, label);
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataSales !== prevProps.dataSales) {
      this.setState({ dataSales: this.props.dataSales });
    }
  }
  render() {
    // console.log("Inside UserProject++++", this.props.ProjectUsageDetails);

    const dataPoints = this.state.ProjectUsageDetails;
    const data = {
      labels: dataPoints.map((s) => s.searchTerm),
      datasets: [
        {
          data: dataPoints.map((c) => c.count),
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
          fontSize: 12,
        },
        position: "right",
      },
    };
    return (
      <div>
        <Doughnut data={data} options={options} />
      </div>
    );
  }
}
export default UserProjectUsage;
