import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ authenticated, children, ...rest }) => {
    useEffect(() => {
    }, [authenticated])
    return (
        <Route {...rest}
            render={(props) => (
                authenticated ? <>{React.cloneElement((children), { ...props })}</> : <Redirect to="/sow" />)
            }
        />
    );
}
export default PrivateRoute