import React, {Component} from 'react';
import LoginForm from './LoginForm';
import { withRouter } from 'react-router-dom';
import { loadCurrentUser } from '../util/AppUtils';
import { connect } from "react-redux";
import { APP_NAME } from '../constants';

import { Form, notification } from 'antd';

class Login extends Component {

    onLogin = () => {
        notification.success({
            message: APP_NAME,
            description: "You're successfully logged in.",
        });
        loadCurrentUser(this.props.dispatch);
        this.props.history.push("/");
    }

    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.onLogin} />
                </div>
            </div>
        );
    }
}

export default connect()(withRouter(Login));