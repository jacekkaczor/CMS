import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ProfileDropdownMenu from './ProfileDropdownMenu';
import  { handleLogout } from '../util/AppUtils';
import { connect } from "react-redux";
import { Layout, Menu, Icon } from 'antd';
import { APP_NAME } from '../constants';
const Header = Layout.Header;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
        if(key === "logout") {
            handleLogout(this.props.dispatch, this.props.history);
        }
    }

    render() {
        let menuItems;
        if(this.props.user) {
            menuItems = [
                <Menu.Item key="/">
                    <Link to="/">
                        <Icon type="home" className="nav-icon" />
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
                <Menu.Item key="/">
                    <Link to="/">
                        <Icon type="home" className="nav-icon" />
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/login">
                    <Link to="/login">Login</Link>
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
                        style={{ lineHeight: '64px' }} >
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