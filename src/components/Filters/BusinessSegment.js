import React, { Fragment } from 'react';
class BusinessSegment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
            };
    };   
    componentDidMount() { 
     
    }
    
    render() {
        return(
        <Fragment>
          {/* <!-- Main Filter Item 09 Starts --> */}
          <div className="card mb-0" align="left">
              <h5 className="mb-0 cardbg"><button className="btn custom-btn btn-full pt-0 pb-0 collapsed" type="button"
                      data-toggle="collapse" aria-expanded="false" aria-controls="businessseg" data-target="#businessseg">BUSINESS
                      SEGMENT</button></h5>
          
              <div className="collapse" aria-labelledby="headingHPSE" data-parent="#sidefilters" aria-expanded="false"
                   id="businessseg">
                  <div className="card-body ml-1 mr-0 mt-2">
                      <div className="collapse show" aria-labelledby="headingHPSE" data-parent="#accordionExample"
                          aria-expanded="false"  id="businesssegitems">
                          <div className="card-body ml-1 mr-1 mt-2">
                              <div className="accordion" id="">
          
          
                                  <div className="card" align="left">
                                      <h5 className="mb-0 in-flex cardBorder">
                                          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/>
                                          <button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                                              type="button" data-toggle="collapse" aria-expanded="false"
                                              aria-controls="serviceline1" data-target="#serviceline1">Business Segment 1</button>
                                      </h5>
                                  </div>
                                  <div className="collapse" aria-labelledby="headingHPSE" data-parent="#businessseg"
                                       aria-expanded="false" id="serviceline1">
                                      <div className="selections_container col">
                                          <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2"/>
                                              <div className="">Service Line 1</div>
                                          </div>
                                          <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2"/>
                                              <div className="">Service Line 2</div>
                                          </div>
                                          <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2"/>
                                              <div className="">Service Line 3</div>
                                          </div>
                                          <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2"/>
                                              <div className="">Service Line 4</div>
                                          </div>
                                      </div>
                                  </div>
          
                              </div>
                          </div>
                          <div className="card-body ml-1 mr-1 mt-2">
                              <div className="accordion" id="">
          
          
                                  <div className="card" align="left">
                                      <h5 className="mb-0 in-flex cardBorder">
                                          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                                              type="button" data-toggle="collapse" aria-expanded="false"
                                              aria-controls="serviceline2" data-target="#serviceline2">Business Segment 2</button>
                                      </h5>
                                  </div>
                                  <div className="collapse" aria-labelledby="headingHPSE" data-parent="#businessseg"
                                       aria-expanded="false" id="serviceline2">
                                      <div className="selections_container col">
                                          <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2"/>
                                              <div className="">Service Line 1</div>
                                          </div>
                                          <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2"/>
                                              <div className="">Service Line 2</div>
                                          </div>
                                          <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2"/>
                                              <div className="">Service Line 3</div>
                                          </div>
                                          <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2"/>
                                              <div className="">Service Line 4</div>
                                          </div>
          
                                      </div>
                                  </div>
          
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
            {/* <!-- Main Filter Item 09 Ends --> */}
        </Fragment>
        )
    }
}
export default BusinessSegment