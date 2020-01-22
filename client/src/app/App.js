import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { connect } from "react-redux";

import Login from '../components/Login';
import AppHeader from '../components/AppHeader';
import NotFound from '../components/NotFound';
import LoadingIndicator from '../components/LoadingIndicator';
import { loadCurrentUser } from '../util/AppUtils';

import { Layout } from 'antd';
const { Content } = Layout;

class App extends Component {
    componentDidMount() {
        loadCurrentUser(this.props.dispatch);
    }

    render() {
        if(this.props.isLoading) {
            return <LoadingIndicator />
        }
        return (
            <Layout className="app-container">
                <AppHeader />
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route path="/login" render={(props) => <Login {...props} />}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.common.isLoading 
    }
};

export default connect(mapStateToProps)(withRouter(App));