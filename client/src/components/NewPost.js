import React, { Component } from 'react';
import { createPost } from '../util/APIUtils';
import  { handleLogout } from '../util/AppUtils';
import { POST_TITLE_MAX_LENGTH, APP_NAME } from '../constants';
import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input

class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                text: ''
            },
            body: {
                text: ''
            },
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const postData = {
            title: this.state.title.text,
            body: this.state.body.text
        };

        createPost(postData)
        .then(response => {
            this.props.history.push("/posts/"+response.id);
            notification.success({
                message: APP_NAME,
                description: "Your post has been successfully added",
            });
        }).catch(error => {
            if(error.status === 401) {
                handleLogout(this.props.dispatch, this.props.history, '/login', 'error', 'You have been logged out. Please login to create post.');
            } else {
                notification.error({
                    message: APP_NAME,
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    validateTitle = (titleText) => {
        if(titleText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your title!'
            }
        } else if (titleText.length > POST_TITLE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Title is too long (Maximum ${POST_TITLE_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleTitleChange(event) {
        const value = event.target.value;
        this.setState({
            title: {
                text: value,
                ...this.validateTitle(value)
            }
        });
    }

    validateBody = (bodyText) => {
        if(bodyText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your title!'
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleBodyChange(event) {
        const value = event.target.value;
        this.setState({
            body: {
                text: value,
                ...this.validateBody(value)
            }
        });
    }

    isFormInvalid() {
        if(this.state.title.validateStatus !== 'success') return true;
        if(this.state.body.validateStatus !== 'success') return true;
        return false;
    }

    render() {
        return (
            <div className="new-post-container">
                <h1 className="page-title">Create Post</h1>
                <div className="new-post-content">
                    <Form onSubmit={this.handleSubmit} className="create-post-form">
                        <FormItem validateStatus={this.state.title.validateStatus}
                            help={this.state.title.errorMsg} className="post-form-row">
                        <TextArea 
                            placeholder="Enter your post title"
                            style = {{ fontSize: '16px' }} 
                            autoSize={{ minRows: 3, maxRows: 6 }} 
                            name = "title"
                            value = {this.state.title.text}
                            onChange = {this.handleTitleChange} />
                        </FormItem>

                        <FormItem validateStatus={this.state.body.validateStatus}
                            help={this.state.body.errorMsg} className="post-form-row">
                        <TextArea 
                            placeholder="Enter your post body"
                            style = {{ fontSize: '16px' }} 
                            autoSize={{ minRows: 8, maxRows: 16 }} 
                            name = "body"
                            value = {this.state.body.text}
                            onChange = {this.handleBodyChange} />
                        </FormItem>
                        
                        <FormItem className="post-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-post-form-button">Create Post</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}

export default NewPost;