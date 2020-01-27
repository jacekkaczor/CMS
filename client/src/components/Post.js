import React, { Component } from 'react';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { getPost } from '../util/APIUtils';
import NotFound from './NotFound';
import LoadingIndicator from './LoadingIndicator';
import ServerError from './ServerError';

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
                            <span className="post-creator-name">
                                {post.createdBy.name}
                            </span>
                            <span className="post-creator-username">
                                @{post.createdBy.username}
                            </span>
                            <span className="post-creation-date">
                                {new Date(post.creationDateTime).toLocaleString()}
                            </span>
                        </Link>
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

export default Post;