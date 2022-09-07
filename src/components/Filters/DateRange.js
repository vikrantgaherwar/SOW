import React, { Fragment } from 'react';
import DatePicker from "react-datepicker";
import _ from 'lodash';
import {addMonths,subYears } from 'date-fns';



class DateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createdFromDate: new Date(),
            createdToDate: new Date(),
            publishedFromDate: new Date(),
            publishedToDate: new Date(),
            lastModifiedFromDate: new Date(),
            lastModifiedToDate: new Date(),
            creation_date : [], 
            modified_date : [],
            publish_date : [],
            isCreatedDateChange : false,
            isPublishedDateChange : false,
            isModifiedDateChange : false
            };
    };
    formatDate = (date) => {
      var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  
      if (month.length < 2) 
      month = '0' + month;
      if (day.length < 2) 
      day = '0' + day;
  
      return [year, month, day].join('-');     
      }    
      handleCreatedFromDate = createdFromDate => {      
        this.setState({createdFromDate: createdFromDate, isCreatedDateChange : true},
          ()=>{
            this.state.UpdateFilters(false);
            this.props.OnCreatedDateChange(this.formatDate(this.state.createdFromDate) + " To " + this.formatDate(this.state.createdToDate));
          });   
      }
      handleCreatedToDate = createdToDate => {      
        this.setState({createdToDate: createdToDate, isCreatedDateChange : true},
          ()=>{
            this.state.UpdateFilters(false);
            this.props.OnCreatedDateChange(this.formatDate(this.state.createdFromDate) + " To " + this.formatDate(this.state.createdToDate));
          });   
      }
      handlePublishedFromDate = publishedFromDate => {      
        this.setState({publishedFromDate: publishedFromDate, isPublishedDateChange : true},
        ()=>{
          this.state.UpdateFilters(false);
          this.props.onPublishDateChange(this.formatDate(this.state.publishedFromDate) + " To " + this.formatDate(this.state.publishedToDate));
        });   
      }
      handlePublishedToDate = publishedToDate => {      
        this.setState({publishedToDate: publishedToDate, isPublishedDateChange : true},
          ()=>{
            this.state.UpdateFilters(false);
            this.props.onPublishDateChange(this.formatDate(this.state.publishedFromDate) + " To " + this.formatDate(this.state.publishedToDate)); 
          });   
      }
      handleLastModifiedFromDate = lastModifiedFromDate => {      
        this.setState({lastModifiedFromDate: lastModifiedFromDate, isModifiedDateChange : true},
        ()=>{
          this.state.UpdateFilters(false);
          this.props.onModifiedDateChange(this.formatDate(this.state.lastModifiedFromDate) + " To " + this.formatDate(this.state.lastModifiedToDate)); 
        });   
      }
      handleLastModifiedToDate = lastModifiedToDate => {      
        this.setState({lastModifiedToDate: lastModifiedToDate, isModifiedDateChange : true},
          ()=>{
            this.state.UpdateFilters(false);
            this.props.onModifiedDateChange(this.formatDate(this.state.lastModifiedFromDate) + " To " + this.formatDate(this.state.lastModifiedToDate)); 
          });
      }
      ClearDates = (Type)=> {
         if(Type === "CreatedDate"){
          var createdFromDate= new Date(new Date().setFullYear(new Date().getFullYear() - 3));
          var createdToDate= new Date();
          this.setState({createdFromDate,createdToDate, isCreatedDateChange : false}, 
            ()=>{
                this.state.UpdateFilters(true);
                this.props.OnCreatedDateChange("");
            });
         }
         else if(Type ==="ModifiedDate"){
          var lastModifiedFromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3));
          var lastModifiedToDate= new Date();
          this.setState({lastModifiedFromDate,lastModifiedToDate, isModifiedDateChange : false}, 
            ()=>{
                this.state.UpdateFilters(true);
                this.props.onModifiedDateChange("");
            });
         }
         else if(Type ==="PublishDate"){
          var publishedFromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3)); 
          var publishedToDate =  new Date();
          this.setState({publishedFromDate,publishedToDate, isPublishedDateChange : false}, 
            ()=>{
                this.state.UpdateFilters(true);
                this.props.onPublishDateChange("");
            });
        }
      }   
      static getDerivedStateFromProps(props, state) { 
        if(props.creation_date.length !== state.creation_date.length || props.modified_date.length !== state.modified_date.length
           || props.publish_date.length !== state.publish_date.length){
          
          //const creation_date = _.cloneDeep(props.creation_date);
          //const C_dates = creation_date.map((date, index) => {
          //  return new Date(date);
          //});

          //const modified_date = _.cloneDeep(props.modified_date);
          //const M_dates = modified_date.map((date, index) => {
          //  return new Date(date);
          //});

          //const publish_date = _.cloneDeep(props.publish_date);
          //const P_dates = publish_date.map((date, index) => {
           // return new Date(date);
          //});
          //var createdToDate= C_dates.length >0 ? new Date(Math.max.apply(null,C_dates)): new Date();
          //var createdFromDate= C_dates.length >0 ? new Date(Math.min.apply(null,C_dates)) : new Date();

          //var lastModifiedFromDate = M_dates.length >0 ? new Date(Math.min.apply(null,M_dates)) : new Date();
          //var lastModifiedToDate= M_dates.length > 0? new Date(Math.max.apply(null,M_dates)) : new Date();

         //var publishedFromDate = P_dates.length >0 ? new Date(Math.min.apply(null,P_dates)) : new Date();
         //var publishedToDate = P_dates.length >0 ? new Date(Math.max.apply(null,P_dates)) : new Date();

          
          var createdFromDate= new Date(new Date().setFullYear(new Date().getFullYear() - 3));
          var createdToDate= new Date();

          var lastModifiedFromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3));
          var lastModifiedToDate= new Date();

          var publishedFromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3)); 
          var publishedToDate =  new Date();

          return {creation_date: props.creation_date,modified_date: props.modified_date,publish_date: props.publish_date,
                  createdToDate, createdFromDate,
                  lastModifiedFromDate, lastModifiedToDate, 
                  publishedFromDate, publishedToDate, UpdateFilters : props.UpdateFilters
                };
        }
        return null;
      }
   
    
    render() {
        return(
        <Fragment>
            {(this.state.creation_date.length >0 || this.state.modified_date.length>0 || this.state.publish_date.length >0) && 
            <div className="card mb-0" align="left">
              <h5 className="mb-0 cardbg">
                  <button className="btn custom-btn btn-full pt-0 pb-0 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="SKUCategory" data-target="#date_range">DATE RANGE            
                    </button>
                </h5>
          
                <div className="collapse" aria-labelledby="headingHPSE" data-parent="#sidefilters" aria-expanded="false"  id="date_range">
                <div className="card-body ml-1 mr-0 mt-2">
                    <div className="collapse show" aria-labelledby="headingHPSE" data-parent="#accordionExample" aria-expanded="false"  id="document_filter_categories">
                        <div className="card-body ml-1 mr-1 mt-2">
                            <div className="accordion" id="accordionSERCategories"> 
                                <div className="row pl-3 pb-1" style={{maxHeight:'300px',overflowX:'hidden',overflowY:'auto',color:'#000'}}>
                                 {this.state.creation_date.length >0 &&
                                 <table className="table-sm" cellSpacing="0" cellPadding="0" border="0">
                                    <tbody>
                                       <tr>
                                          <td className="d1">
                                            <DatePicker 
                                            className="form-control form-control-sm custom-datePicker creation_date_start" 
                                            selected={this.state.createdFromDate}
                                             onChange={createdFromDate => this.handleCreatedFromDate(createdFromDate)}                                            
                                             showYearDropdown
                                            dateFormatCalendar="MMMM"
                                            yearDropdownItemNumber={10}
                                            scrollableYearDropdown
                                            maxDate={addMonths(new Date(), 3)}
                                            />

                                            <input type="checkbox" value={this.state.isCreatedDateChange} name="createdToDate" className="display-none"></input>
                                          </td>
                                          <td className="d2"><DatePicker className="form-control form-control-sm custom-datePicker creation_date_end" selected={this.state.createdToDate} onChange={createdToDate => this.handleCreatedToDate(createdToDate)} 
                                          showYearDropdown
                                          dateFormatCalendar="MMMM"
                                          yearDropdownItemNumber={10}
                                          scrollableYearDropdown
                                          maxDate={addMonths(new Date(), 3)}/>
                                          </td>
                                       </tr>
                                   </tbody>
                                  </table>
                                 }
                                 {this.state.publish_date.length >0 &&
                                  <table className="table-sm" cellSpacing="0" cellPadding="0" border="0">
                                    <tbody>
                                       <tr>
                                          <td className="d3">
                                            <DatePicker className="form-control form-control-sm custom-datePicker published_date_start" selected={this.state.publishedFromDate} onChange={publishedFromDate => this.handlePublishedFromDate(publishedFromDate)}
                                             showYearDropdown
                                             dateFormatCalendar="MMMM"
                                             yearDropdownItemNumber={10}
                                             scrollableYearDropdown
                                             maxDate={addMonths(new Date(), 3)}
                                             />
                                            <input type="checkbox" value={this.state.isPublishedDateChange} name="publishedToDate" className="display-none"></input>
                                          </td>
                                          <td className="d4"><DatePicker className="form-control form-control-sm custom-datePicker published_date_end" selected={this.state.publishedToDate} onChange={publishedToDate => this.handlePublishedToDate(publishedToDate)} /></td>
                                       </tr>
                                   </tbody>
                                  </table>
                                  } 
                                  {this.state.modified_date.length >0 &&
                                  <table className="table-sm" cellSpacing="0" cellPadding="0" border="0">
                                    <tbody>
                                       <tr>
                                          <td className="d5">
                                            <DatePicker className="form-control form-control-sm custom-datePicker modified_date_start" selected={this.state.lastModifiedFromDate} onChange={lastModifiedFromDate => this.handleLastModifiedFromDate(lastModifiedFromDate)} 
                                             showYearDropdown
                                             dateFormatCalendar="MMMM"
                                             yearDropdownItemNumber={10}
                                             scrollableYearDropdown
                                             maxDate={addMonths(new Date(), 3)}/>
                                            <input type="checkbox" value={this.state.isModifiedDateChange} name="modifiedToDate" className="display-none"></input>
                                            </td>
                                          <td className="d6"><DatePicker className="form-control form-control-sm custom-datePicker modified_date_end" selected={this.state.lastModifiedToDate} onChange={lastModifiedToDate => this.handleLastModifiedToDate(lastModifiedToDate)} 
                                          showYearDropdown
                                          dateFormatCalendar="MMMM"
                                          yearDropdownItemNumber={10}
                                          scrollableYearDropdown
                                          maxDate={addMonths(new Date(), 3)}/></td>
                                       </tr>
                                   </tbody>
                                  </table>
                                   }
                                  {/* <div className="row pl-3 pb-1">
                                      <input type="checkbox" className="mr-2" />
                                      <div className="font11">Include Archived Documents</div>
                                  </div>  */}
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
export default DateRange