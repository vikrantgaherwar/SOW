import React, { Fragment } from 'react';
class AssetCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          asset_creator : []
            };
    };   
    componentDidMount() { 
     
    }
    static getDerivedStateFromProps(props, state) { 
      if(props.asset_creator.length !== state.asset_creator.length){
        const asset_creator = props.asset_creator;
        return {asset_creator, UpdateFilters : props.UpdateFilters};
      }
      return null;
    }
    
    render() {
        return(
        <Fragment>
           <div className="card">
              <div id="assetcreatormain" className="" align="left">
                <h5 className="mb-0 cardbg">
                  <button type="button" data-toggle="collapse" data-target="#assetcreator" aria-expanded="false" className="btn custom-btn pt-0 pb-0 collapsed" aria-controls="assets">ASSET CREATOR</button>
                </h5>
              </div>
          
            <div id="assetcreator" className="collapse" aria-labelledby="filetype" data-parent="#sidefilters"  aria-expanded="false">
            <div className="selections_container col"style={{color: "#000"}}>
            {/* <div className="row">
              <input type="text" placeholder="Type in Email" className="form-control form-control-sm mb-2 mt-1 col ml-3"/><i className="fas fa-plus-square mt-2 pl-1"></i>
            </div> */}
            {this.state.asset_creator.length && this.state.asset_creator.map((item,index) => 
                <div className="row pl-3 pb-1" key={index}>
                    <label className="mb-0">
                    <input type="checkbox" value={item} name="asset_creator" className="mr-2" onClick={()=>{this.state.UpdateFilters(false)}}/>
                    {item}
                    </label>
                </div>
            )}
            </div>
            </div>
            </div>
        </Fragment>
        )
    }
}
export default AssetCreator