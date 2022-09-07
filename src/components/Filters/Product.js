import React, { Fragment } from 'react';
class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              product_line : [],
              products : [{name:"Big Data", code : "G5"}, {name:"BlueData Professional Services", code : "RL"}, {name:"Cloud Consulting", code : "60"}, {name:"Cloud Technology Partners", code : "NO"}, {name:"Data Center Platforms Consulting", code : "G4"}, {name:"Data Center Technology Services", code : "EA"}, {name:"Education Services", code : "4J"}, {name:"Installation and Packaged Services", code : "UW"}, {name:"Network Consulting", code : "1Z"}, {name:"SGI Prof Services", code : "H3"}, {name:"Storage Infrastructure", code : "6C"}, {name:"Workforce Mobility", code : "5V"}],
              getProductNameByCode : this.getProductNameByCode.bind(this),
              isAllProductsSelected :false
            };
    };   
    static getDerivedStateFromProps(props, state) { 
        if(props.product_line.length !== state.product_line.length){
            const product_line = props.product_line.map((item, index) => {
                return {name : state.getProductNameByCode(item), checked: false, value : item};
              });
            return {product_line, isAllProductsSelected : false, UpdateFilters : props.UpdateFilters};
        }
        return null;
    }
    getProductNameByCode=(code)=>{
        const data =  this.state.products.filter(x=>x.code == code);
        return data[0].name;
    }
    onProductsChecksBoxChange(checkName, isChecked) {
        let isAllChecked = (checkName === 'all' && isChecked);
        let isAllUnChecked = (checkName === 'all' && !isChecked);
        const checked = isChecked;
        const checkList = this.state.product_line.map((item, index) => {
            if(isAllChecked || item.name === checkName) {
                return Object.assign({}, item, {
                    checked,
                });
            } else if (isAllUnChecked) {
                return Object.assign({}, item, {
                    checked: false,
                });
            }
            return item;
        });
        let isAllProductsSelected = (checkList.findIndex((item) => item.checked === false) === -1) || isAllChecked;
        this.setState({
            product_line : checkList,
            isAllProductsSelected,
        },()=>{this.state.UpdateFilters(false);});
    }
    render() {
        return(
        <Fragment>
         {this.state.product_line.length >0 &&
         <div className="card mb-0" align="left">
              <h5 className="mb-0 cardbg"><button className="btn custom-btn btn-full pt-0 pb-0 collapsed" type="button"
                      data-toggle="collapse" aria-expanded="false" aria-controls="productlines" data-target="#productlines">PRODUCT</button></h5>
          
              <div className="collapse" aria-labelledby="headingHPSE" data-parent="#sidefilters" aria-expanded="false"
                   id="productlines">
                  <div className="card-body ml-1 mr-0 mt-2">
                      <div className="collapse show" aria-labelledby="headingHPSE" data-parent="#accordionExample"
                          aria-expanded="false"  id="productlinesitems">
                          <div className="card-body ml-1 mr-1 mt-2">
                              <div className="accordion" id="">
                                    <div className="card" align="left">
                                      <h5 className="mb-0 in-flex cardBorder">
                                          <input type="checkbox" className="ml-2 mt-1 inputclass" checked={this.state.isAllProductsSelected} onChange={(e) => this.onProductsChecksBoxChange("all", e.target.checked)}/>
                                          <button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                                              type="button" data-toggle="collapse" aria-expanded="false"
                                              aria-controls="serviceline1" data-target="#serviceline1">Advisory & Professional Services</button>
                                      </h5>
                                  </div>
                                  <div className="collapse" aria-labelledby="headingHPSE" data-parent="#productlines"
                                       aria-expanded="false" id="serviceline1">
                                      <div className="selections_container col">
                                          { this.state.product_line && this.state.product_line.length > 0 && this.state.product_line.map((item,index) =>
                                          <Fragment key={index}>
                                          <div className="row pl-3 pb-1">
                                              <label className="mb-0">
                                              <input type="checkbox" className="mr-2" name="product_line" checked={item.checked} value={item.value} onChange={(e) => this.onProductsChecksBoxChange(item.name, e.target.checked)}/>
                                              {item.name}
                                              </label>
                                          </div>
                                          </Fragment>
                                          )}
                                      </div>
                                  </div>
          
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
    }
         </Fragment>    
        )
    }
}
export default Product