import React, { Component } from 'react';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { getPost, deletePost } from '../util/APIUtils';
import { APP_NAME } from '../constants';
import NotFound from './NotFound';
import LoadingIndicator from './LoadingIndicator';
import ServerError from './ServerError';
import { connect } from 'react-redux';
import { Button, notification, Modal } from 'antd';
const { confirm } = Modal;

class Post extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            feed: props.feed || false,
            post: null,
            isLoading: true
        }
        this.loadPost = this.loadPost.bind(this);
        this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
        this.onEditButtonPress = this.onEditButtonPress.bind(this);
        this.showConfirmDelete = this.showConfirmDelete.bind(this);
    }

    loadPost(postId) {
        this.setState({
            isLoading: true
        });

        getPost(postId)
        .then(response => {
            if (this._isMounted) {
                this.setState({
                    post: response,
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

    onEditButtonPress() {
        const { post } = this.state.feed ? this.props : this.state;
        this.props.history.push("/posts/edit/" + post.id, post);
    }

    showConfirmDelete() {
        const onOk = this.onDeleteButtonPress;
        confirm({
            title: 'Are you sure delete this post?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                onOk();
            },
            onCancel() { },
        });
    }

    onDeleteButtonPress() {
        const { post } = this.state.feed ? this.props : this.state;
        deletePost(post.id)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Post has been deleted",
            });
            this.props.history.push("/");
        }).catch(error => {
            notification.error({
                message: APP_NAME,
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            }); 
            this.props.history.push("/");
        });
    }

    componentDidMount() {
        this._isMounted = true;
        if (!this.state.feed) {
            const postId = this.props.match.params.id;
            this.loadPost(postId);
        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    componentDidUpdate(nextProps) {
        if(!this.state.feed && this.props.match.params.id !== nextProps.match.params.id) {
            this.loadPost(nextProps.match.params.id);
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
        const { feed } = this.state;
        const { post } = feed ? this.props : this.state;
        const { user } = this.props;
        let bodyText = post.body;
        if (feed && post.body.length > 255 ) {
            bodyText = bodyText.slice(0, 255) + '...';
        }
        const body = bodyText.split('\n').map((i, index) => {
            return <p key={index}>{i}</p>
        });
        return (
            <div className={feed ? "post-content-feed" : "post-content"}>
                <div className="post-header">
                    <div className="post-creator-info">
                        <Link className="creator-link" to={`/posts/${post.createdBy.username}`}>
                            <Avatar className="post-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(post.createdBy.name)}} >
                                {post.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <div style={post.updatedDateTime === post.creationDateTime ? {paddingTop: '8px'} : {}}>
                                <span className="post-creator-name">
                                    {post.createdBy.name}
                                </span>
                                <span className="post-creator-username">
                                    @{post.createdBy.username}
                                </span>
                                <span className="post-creation-date">
                                    Created: {new Date(post.creationDateTime).toLocaleString()}
                                </span>
                                {post.updatedDateTime !== post.creationDateTime ?
                                <span className="post-creation-date">
                                    Last update: {new Date(post.updatedDateTime).toLocaleString()}
                                </span> : null}
                            </div>
                        </Link>
                        {!feed && !!user ?            
                        <div className="post-admin" align="right">
                            <Button type="primary" shape="round" icon="edit" onClick={this.onEditButtonPress}>Edit</Button>
                            <Button type="danger" shape="round" icon="delete" onClick={this.showConfirmDelete}>Delete</Button>
                        </div> : null }
                    </div>
                    <div className="post-title">
                        {post.title}
                    </div>
                </div>
                <div className="post-body">
                    { body }
                </div>
                { feed ?
                <div align="right">
                    <Link to={`/posts/${post.id}`} className="btn btn-primary">
                        Read More
                    </Link>
                </div>
                : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
};

export default connect(mapStateToProps)(Post);