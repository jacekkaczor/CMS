import { 
  SET_LOADING
} from '../actions/common';

const initialState = {
  isLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading || false,
      }
    default:
      return state;
  }
}

export default reducer;
    