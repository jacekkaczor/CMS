import React, { Component } from 'react';
import { getAllPosts, getUserAllPosts } from '../util/APIUtils';
import Post from './Post';
import { Button, Icon } from 'antd';
import { POST_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import { setPosts } from '../actions/posts';
import { connect } from 'react-redux';

class PostList extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.loadPostList = this.loadPostList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        if (this.props.match.url.includes("waiting")) {
            if (this.props.user ? !this.props.user.admin : true)
                this.props.history.push("/");
        }
    }

    loadPostList(searchText, page = 0, size = POST_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            promise = getUserAllPosts(this.props.username, page, size, true);
        } else {
            promise = getAllPosts(searchText, page, size, !this.props.match.url.includes("waiting"));
        }
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });

        promise.then(response => {
            let posts = this.props.posts.slice();
            if (this.props.page < response.page) {
                posts = posts.concat(response.content);
            } else {
                posts = response.content;
            }
            this.props.dispatch(setPosts(
                posts,
                response.page,
                response.size,
                response.totalElements,
                response.totalPages,
                response.last,
            ));
            if (this._isMounted) {
                this.setState({
                    isLoading: false
                });
            }
        }).catch(error => {
            if (this._isMounted) {
                this.setState({
                    isLoading: false
                });
            }
        });  
        
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadPostList(this.props.searchText);
    }

    componentDidUpdate(nextProps) {
        if(this.props.searchText !== nextProps.searchText)
            this.loadPostList(this.props.searchText);
        if(this.props.match.url !== nextProps.match.url)
            this.loadPostList(this.props.searchText);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleLoadMore() {
        this.loadPostList(this.props.searchText, this.props.page + 1);
    }

    render() {
        const postViews = [];        
        this.props.posts.forEach((post, postIndex) => {
            postViews.push(
                <Post 
                    feed={true}
                    key={post.id} 
                    post={post} />
            );
        });

        return (
            <div className="posts-container">
                {postViews}
                {
                    !this.state.isLoading && this.props.posts.length === 0 ? (
                        <div className="no-posts-found">
                            <span>No Posts Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.props.last ? (
                        <div className="load-more-posts"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts.posts,
        page: state.posts.page,
        size: state.posts.size,
        totalElements: state.posts.totalElements,
        totalPages: state.posts.totalPages,
        last: state.posts.last,
        searchText: state.posts.searchText
    }
};

export default connect(mapStateToProps)(withRouter(PostList));