import { 
  SET_USER
} from '../actions/auth';
  
const initialState = {
  isAuth: false,
  user: undefined
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
            ...state,
            isAuth: action.user === undefined,
            user: action.user
            }
        default:
            return state;
    }
}

export default reducer;
  
  