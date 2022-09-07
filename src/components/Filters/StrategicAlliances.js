import React, { Fragment } from 'react';
class StrategicAlliances extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          system_integrators : [],
          technology_partners : [],
          isAllSystemIntegratorsSelected : false,
          isAllTechnologyPartnersSelected : false
          };
    };   
    
    static getDerivedStateFromProps(props, state) { 
      if(props.system_integrators.length !== state.system_integrators.length || props.technology_partners.length !== state.technology_partners.length){
        const system_integrators = props.system_integrators.map((item, index) => {
          return {name : item, checked: false};
        });
        const technology_partners = props.technology_partners.map((item, index) => {
          return {name : item, checked: false};
        });
  
        return {system_integrators, technology_partners,
          isAllSystemIntegratorsSelected : false,
          isAllTechnologyPartnersSelected : false,
          UpdateFilters : props.UpdateFilters
        };
      }
      return null;
  }
    onSystemIntegratorBoxChange(checkName, isChecked) {
      let isAllChecked = (checkName === 'all' && isChecked);
      let isAllUnChecked = (checkName === 'all' && !isChecked);
      const checked = isChecked;
      const checkList = this.state.system_integrators.map((item, index) => {
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
      let isAllSystemIntegratorsSelected = (checkList.findIndex((item) => item.checked === false) === -1) || isAllChecked;
      this.setState({
        system_integrators : checkList,
        isAllSystemIntegratorsSelected,
      },()=>{this.state.UpdateFilters();});
  }

  onTechnologyPartnersBoxChange(checkName, isChecked) {
    let isAllChecked = (checkName === 'all' && isChecked);
    let isAllUnChecked = (checkName === 'all' && !isChecked);
    const checked = isChecked;
    const checkList = this.state.technology_partners.map((item, index) => {
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
    let isAllTechnologyPartnersSelected = (checkList.findIndex((item) => item.checked === false) === -1) || isAllChecked;
    this.setState({
       technology_partners : checkList,
        isAllTechnologyPartnersSelected,
    },()=>{this.state.UpdateFilters(false);});
}
      
    render() {
        return(
        <Fragment>
          {(this.state.system_integrators.length >0 || this.state.technology_partners.length>0) &&
          <div className="card" align="left">
              <h5 className="mb-0 cardbg">
                <button className="btn custom-btn btn-full pt-0 pb-0 collapsed" type="button" data-toggle="collapse" aria-expanded="false" data-target="#strategic_alliance" aria-controls="businessall">STRATEGIC ALLIANCES
                </button>
              </h5>
          
          <div className="collapse" aria-labelledby="headingHPSE" data-parent="#sidefilters" aria-expanded="false"  id="strategic_alliance"><div className="card-body ml-1 mr-0">
            <div className="collapse show" aria-labelledby="headingHPSE" data-parent="#accordionSERCategories" aria-expanded="false"  id="businesssegitems">
            
            {this.state.system_integrators.length >0 &&
           <div className="card-body ml-1 mr-1 mt-2"><div className="accordion" id="">
          
          
          <div className="card" align="left">
            <h5 className="mb-0 in-flex cardBorder">
              <input type="checkbox" checked={this.state.isAllSystemIntegratorsSelected} className="mr-2" onChange={(e) => this.onSystemIntegratorBoxChange("all", e.target.checked)}/>
              <button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" data-target="#sint" aria-controls="systemint">System Integrators</button></h5>
          </div>
          <div className="collapse" aria-labelledby="headingHPSE" data-parent="#strategic_alliance"  aria-expanded="false" id="sint">
                <div className="selections_container col" style={{color: "#000"}}>
                {this.state.system_integrators && this.state.system_integrators.map((list,index) =>
                 <Fragment key={index}>
                   {list && list !== undefined && list !== "" &&
                      <div className="row pl-3 pb-1">
                       <label className="mb-0">
                       <input type="checkbox" className="mr-2" value={list.name} checked={list.checked} name="system_integrators" onChange={(e) => this.onSystemIntegratorBoxChange(list.name, e.target.checked)} />
                       {list.name}
                       </label>
                       </div>
                   }
                  </Fragment>
                )} 
            
          </div>
          </div>
          </div>
          </div>
            }
           {this.state.technology_partners.length >0 &&
           <div className="card-body ml-1 mr-1"><div className="accordion" id="">
          <div className="card" align="left"><h5 className="mb-0 in-flex cardBorder">
            <input type="checkbox" checked={this.state.isAllTechnologyPartnersSelected} className="mr-2" onChange={(e) => this.onTechnologyPartnersBoxChange("all", e.target.checked)} />
            <button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" data-target="#tpa" aria-controls="techpa">Technology Partners</button></h5></div>
            <div className="collapse" aria-labelledby="headingHPSE" data-parent="#strategic_alliance"  aria-expanded="false" id="tpa">
            <div className="selections_container col" style={{color: "#000"}}>
            {this.state.technology_partners && this.state.technology_partners.map((list,index) =>
            <Fragment key={index}>
            {list && list !== undefined && list !== "" &&
            <div className="row pl-3 pb-1">
            <label className="mb-0">
            <input type="checkbox" className="mr-2" value={list.name} checked={list.checked} name="technology_partners" onChange={(e) => this.onTechnologyPartnersBoxChange(list.name, e.target.checked)} />
            {list.name}
            </label>
            </div>
           }
            </Fragment>
        )} 
          </div>
          </div>
          
          </div>
          </div>
           }
          </div>
          </div>
          </div>
          </div>
           }
        </Fragment>
        )
    }
}
export default StrategicAlliances