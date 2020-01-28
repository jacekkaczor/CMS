import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ProfileDropdownMenu from './ProfileDropdownMenu';
import  { handleLogout } from '../util/AppUtils';
import { connect } from "react-redux";
import { Layout, Menu, Icon, Input } from 'antd';
import { APP_NAME } from '../constants';
import { setSearch } from '../actions/posts';
const Header = Layout.Header;
const { Search } = Input;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);  
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }

    handleMenuClick({ key }) {
        if(key === "logout") {
            handleLogout(this.props.dispatch, this.props.history);
        }
    }

    handleSearchClick(searchText) {
        this.props.dispatch(setSearch(searchText));
        this.props.history.push("/");
    }

    render() {
        let menuItems;
        const search = (
            <Search
                placeholder="Input search title"
                onSearch={this.handleSearchClick}
                style={{ width: 200 }}
            />
        );
        if(this.props.user) {
            menuItems = [
                <Menu.Item key="search">
                    {search}
                </Menu.Item>,
                <Menu.Item key="/">
                    <Link to="/">
                        <Icon type="home" className="nav-icon" />
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/post/new">
                    <Link to="/post/new">
                        New
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/profile" className="profile-menu">
                    <ProfileDropdownMenu
                        user={this.props.user} 
                        handleMenuClick={this.handleMenuClick}/>
                </Menu.Item>
            ]; 
        } else {
            menuItems = [
                <Menu.Item key="search">
                    {search}
                </Menu.Item>,
                <Menu.Item key="/">
                    <Link to="/">
                        <Icon type="home" className="nav-icon" />
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/login">
                    <Link to="/login">Login</Link>
                </Menu.Item>,
                <Menu.Item key="/signup">
                    <Link to="/signup">Sign up</Link>
                </Menu.Item>                 
            ];
        }

        return (
            <Header className="app-header">
                <div className="container">
                    <div className="app-title" >
                        <Link to="/">{APP_NAME}</Link>
                    </div>
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[this.props.location.pathname]}
                        style={{ lineHeight: '64px' }} 
                        theme='dark'>
                        {menuItems}
                    </Menu>
                </div>
            </Header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
};

export default connect(mapStateToProps)(withRouter(AppHeader));