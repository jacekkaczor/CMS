import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';

export default function ProfileDropdownMenu(props) {
    const dropdownMenu = (
        <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
            <Menu.Item key="user-info" className="dropdown-item" disabled>
                <div className="user-full-name-info">
                    {props.user.name}
                </div>
                <div className="username-info">
                    @{props.user.username}
                </div>
            </Menu.Item>
            <Menu.Item key="profile" className="dropdown-item">
                <Link to={`/users/${props.user.username}`}>Profile</Link>
            </Menu.Item>
            {props.user.admin ? <Menu.Item key="waiting" className="dropdown-item">
                <Link to={"/waitingPosts"}>Waiting Posts</Link>
            </Menu.Item> : null }
            <Menu.Divider />
            <Menu.Item key="logout" className="dropdown-item">
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown 
            overlay={dropdownMenu} 
            trigger={['click']}
            getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
        <a className="ant-dropdown-link" href="!#">
            <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
        </a>
        </Dropdown>
    );
}