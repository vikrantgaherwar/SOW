import React, { Fragment } from 'react';
import {ConvertTOMillion, sum} from '../utils/math';
import {ExportReactCSV} from './ExportReactCSV'
class SalesTablePL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        Sales : this.props.Sales,
        Type: this.props.Type,
        ChannelName:this.props.ChannelName
        };
       };

  componentDidUpdate(prevProps){
    if(this.props.Sales !== prevProps.Sales){
      this.setState({Sales:this.props.Sales});
  }
   }
  selectSaleCatgoryItem = (channel,label) => {
    const {onProductLineSelect} = this.props;
    onProductLineSelect(channel,label);   
    }
  
  render() {
    return (  
        <Fragment>
           {/* <table className="table-condensed table-bordered table-striped no-margin" width="100%" cellSpacing="0" cellPadding="0" border="0" align="center"> */}
           <ExportReactCSV csvData={this.props.Sales} fileName="ProductLineDetails.xls">Export</ExportReactCSV>
           <table className="table table-sm table-bordered table-striped table-font-size" width="100%" cellSpacing="0" cellPadding="0" border="0" align="center">
            <tbody>
                {/* <tr>
                <th className="tbheaders" height="20" colSpan="3">{this.state.Type} - {sum(this.state.Sales,"saleCount")}</th>
                </tr>  */}
                <tr style={{backgroundColor:'#0d5265'}}>
                    <td className="tbheadersnoborderrad">Product Description</td>
                    <td className="tbheadersnoborderrad">No. of units - {sum(this.state.Sales,"saleCount")}</td>
                </tr> 
               {this.state.Sales.map((list,index) => 
                <tr key={index}>
                {/* <td>{list.saleCategory}</td> */}
                <td >
                <a 
                  style={{textDecoration:'underline',cursor: 'pointer'}} 
                  onClick={()=> {this.selectSaleCatgoryItem(this.state.ChannelName, list.saleCategory)}}>
                    {list.productDescription}
                   </a> 
                   </td>
                <td>{list.saleCount}</td>
                </tr>
               )}
            </tbody>
            </table>          
        </Fragment>
      );
  };
}
export default SalesTablePL;