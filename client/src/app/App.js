import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { connect } from "react-redux";

import Login from '../components/Login';
import Signup from '../components/Signup';
import AppHeader from '../components/AppHeader';
import NotFound from '../components/NotFound';
import LoadingIndicator from '../components/LoadingIndicator';
import PostList from '../components/PostList';
import NewPost from '../components/NewPost';
import PrivateRoute from '../components/PrivateRoute';
import Post from '../components/Post';
import Profile from '../components/Profile';
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
                            <Route exact path="/" render={(props) => <PostList {...props} />} />
                            <Route path="/waitingPosts" render={(props) => <PostList {...props} />} />
                            <Route path="/login" render={(props) => <Login {...props} />}/>
                            <Route path="/signup" render={(props) => <Signup {...props} />}/>
                            <PrivateRoute exact path="/post/new" ComponentToRender={NewPost}/>
                            <Route path="/post/edit/:id" render={(props) => <NewPost {...props} />}/>
                            <Route path="/post/:id" render={(props) => <Post {...props} />}/>
                            <Route path="/users/:username" render={(props) => <Profile {...props} />}/>
                            
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