import React from "react";
import { Bar } from "react-chartjs-2";

class ActiveUserMatrics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        UserMetrics: this.props.UserMetrics,
    };
  }
  render() {
    const dataPoints = this.state.UserMetrics;
    const data = {
      labels: dataPoints.map((s) => s.quarter),
      datasets: [
        {
          label: 'Active Users',
          data: dataPoints.map((c) => c.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1      
        },
      ],
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      };
    return (
      <div style={{width:"60%", margin:"0px auto"}}>
        <Bar
          data={data}
          options={{
            legend: {
              position: "bottom",
              align: "start", 
            },
            scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    min: 0
                  }    
                }]
              },
              tooltips: {
                mode: "label",
              },
              elements: {
                line: {
                  fill: true,
                },
              },
          }}
        />
      </div>
    );
  }
}
export default ActiveUserMatrics;
