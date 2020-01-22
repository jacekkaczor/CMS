import { ACCESS_TOKEN } from '../constants';
import { setLoading } from '../actions/common';
import { setUser } from '../actions/auth';
import { getCurrentUser } from './APIUtils';
import { notification } from 'antd';
import { APP_NAME } from '../constants';


export function loadCurrentUser(dispatch) {
    dispatch(setLoading(true));
    getCurrentUser()
        .then(response => {
            dispatch(setUser(response));
            dispatch(setLoading(false));
        }).catch(error => {
            dispatch(setLoading(false));
        });
};

export function handleLogout(dispatch, history, redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    dispatch(setLoading(true));
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch(setUser());
    history.push(redirectTo);    

    notification[notificationType]({
        message: APP_NAME,
        description: description,
    });
    dispatch(setLoading(false));
}