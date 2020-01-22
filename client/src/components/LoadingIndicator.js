import React from 'react';
import { Spin, Icon } from 'antd';

export default function LoadingIndicator() {
    const antIcon = <Icon type="loading-3-quarters" className="loading-icon" spin />;
    return (
        <Spin indicator={antIcon} className="loading-spin" />
    );
}