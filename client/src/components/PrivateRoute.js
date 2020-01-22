import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
  
  
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            this.props.isAuth ? (
                <Component {...rest} {...props} />
            ) : (
                <Redirect
                    to={{
                    pathname: '/login',
                    state: { from: props.location }
                    }}
                />
            )
        }
    />
);

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth
    }
};
  
export default connect(mapStateToProps)(PrivateRoute);