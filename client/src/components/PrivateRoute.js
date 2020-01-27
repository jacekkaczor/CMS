import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
  
  
class PrivateRoute extends Component {
    render() {
        const {ComponentToRender, isAuth, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={props =>
                    isAuth ? (
                        <ComponentToRender {...rest} {...props} />
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
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth
    }
};
  
export default connect(mapStateToProps)(PrivateRoute);