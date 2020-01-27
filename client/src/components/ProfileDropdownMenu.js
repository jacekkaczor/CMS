import React from 'react';
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