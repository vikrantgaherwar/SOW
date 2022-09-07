import React, { Fragment } from "react";
import { sum } from "../utils/math";
import {} from "react-table-filter/lib/styles.css";
import { ExportReactCSV } from "./ExportReactCSV";
class InstallBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Sales: this.props.Sales,
      Type: this.props.Type,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.Sales !== prevProps.Sales) {
      this.setState({ Sales: this.props.Sales });
    }
  }
  selectSaleCatgoryItem = (channel, productdescription) => {
    const { onProductSelect } = this.props;
    onProductSelect(channel, productdescription);
  };
  render() {
    return (
      <Fragment>
        {/* <table className="table-condensed table-bordered table-striped no-margin" width="100%" cellSpacing="0" cellPadding="0" border="0" align="center"> */}
        <ExportReactCSV
          csvData={this.props.Sales}
          fileName="ProductsORServices.xls"
        >
          Export
        </ExportReactCSV>
        <table
          className="table table-sm table-bordered table-striped table-font-size"
          width="100%"
          cellSpacing="0"
          cellPadding="0"
          border="0"
          align="center"
        >
          <thead style={{ backgroundColor: "#0d5265" }}>
            <tr>
              <td className="cell tbheadersnoborderrad">Products/Services</td>
              <td className="cell tbheadersnoborderrad">
                No. of Units - {sum(this.state.Sales, "saleCount")}
              </td>
            </tr>
          </thead>
          <tbody>
            {/* <tr>
                <th className="tbheaders" height="20" colSpan="2">{this.state.Type} - {sum(this.state.Sales,"saleCount")}</th>
                </tr>   */}

            {this.state.Sales.map((list, index) => (
              <tr key={index}>
                <td>
                  <a
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => {
                      this.selectSaleCatgoryItem(
                        this.state.Type,
                        list.saleCategory
                      );
                    }}
                  >
                    {list.saleCategory}
                  </a>
                </td>
                <td>{list.saleCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}
export default InstallBase;
