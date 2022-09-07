import { Button, InputGroup } from 'react-bootstrap';
import moment from "moment";
const CustomModulesWorkPackages=(props)=>{
return(
    <tr id="tr_parent_workPackages">
    <td colSpan={8}>
        <table id="table_workPackages" className="table table-sm">
            <thead>
                <tr>
                    <th>Package Name</th>
                    <th>Is Active</th>
                    <th>Created By</th>
                    <th>Created On</th>
                    <th>Actions</th>
                </tr>
            </thead>
            {props.packagelist.map((packageItem, index) => {
                return (
                    <tbody key={`PackageItem` + packageItem.id}>
                        <tr key={packageItem.id}>
                            <td style={{ width: '200px' }}>
                                {packageItem.workPackage}
                            </td>
                            <td style={{ width: '100px' }}>
                                {packageItem.isActive ? <i style={{ color: 'green' }} className="fa fa-check"></i> :
                                    <i style={{ color: 'red' }} className="fa-solid fa-square-xmark"></i>}
                            </td>
                            <td style={{ width: '200px' }}>
                                {packageItem.createdBy}
                            </td>
                            <td style={{ width: '200px' }}>
                                {moment(packageItem.createdDate, moment.ISO_8601)
                                    .format("YYYY-MM-DD#HH:mm")
                                    .replace("#", " at ")}
                            </td>
                            <td style={{ width: '100px' }}>
                                <InputGroup>
                                    <Button style={{ borderColor: 'white' }} variant="outline-secondary"
                                        className="btn btn-sm" 
                                        onClick={() => props.handleWorkPackageShowClick(props.customModule, packageItem)}
                                        disabled={props.LoadingGlobalText ===
                                            `handleWorkPackageEditClickLoading_${packageItem.id}_${props.customModule.id}`}
                                        title='View Package Data'
                                        >
                                        {props.LoadingGlobalText ===
                                            `handleWorkPackageEditClickLoading_${packageItem.id}_${props.customModule.id}` ? (
                                            <i style={{ color: "dodgerblue" }} className="fa fa-spinner fa-spin" />
                                        ) : (
                                            <i style={{ color: '#0d5265' }} className=" fa fa-eye pr-2"></i>
                                        )}
                                        
                                    </Button>
                                </InputGroup>
                            </td>
                        </tr>
                    </tbody>)
            })}
        </table>
    </td>
</tr>
)
}

export default CustomModulesWorkPackages;