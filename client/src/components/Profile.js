import React, { Component } from 'react';
import PostList from './PostList';
import { getUserProfile } from '../util/APIUtils';
import { Avatar } from 'antd';
import { getAvatarColor } from '../util/Colors';
import LoadingIndicator  from './LoadingIndicator';
import NotFound from './NotFound';
import ServerError from './ServerError';

class Profile extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });
        getUserProfile(username)
        .then(response => {
            if (this._isMounted) {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }
        }).catch(error => {
            if (this._isMounted) {
                if(error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });        
                }
            }
        });        
    }
      
    componentDidMount() {
        this._isMounted = true;
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (
            <div>
                { 
                    this.state.user ? (
                        <div>
                            <div className="user-details-profile">
                                <div className="user-avatar-profile">
                                    <Avatar className="user-avatar-circle-profile" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                        {this.state.user.name[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary-profile">
                                    <div className="full-name-profile">{this.state.user.name}</div>
                                    <div className="username-profile">@{this.state.user.username}</div>
                                    <div className="user-joined-profile">
                                        Joined {new Date(this.state.user.joinedAt).toLocaleString()}
                                    </div>
                                    <div>
                                        {`Posts: ${this.state.user.postCount}`}
                                    </div>
                                </div>
                            </div>
                            <div className="user-post-details-profile">
                                <PostList username={this.props.match.params.username} />
                            </div>  
                        </div>  
                    ): null               
                }
            </div>
        );
    }
}

export default Profile;