import {useDispatch} from "react-redux";
import {useEffect} from "react";
import { actionMasterDropDownFetchAll } from "../../Redux/Actions/MasterDropDown";

const LoaderComponent = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        // dispatch(actionMasterDropDownFetchAll());
    },[])

    return (
        <></>
    );
}

export default LoaderComponent;