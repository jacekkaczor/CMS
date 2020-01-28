import { 
    SET_POSTS,
    SET_SEARCH
} from '../actions/posts';

const initialState = {
    post: null,
    posts: [],
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
    last: true,
    searchText: ""
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POSTS:
            return {
            ...state,
            posts: action.posts,
            page: action.page,
            size: action.size,
            totalElements: action.totalElements,
            totalPages: action.totalPages,
            last: action.last,
            }
        case SET_SEARCH:
            return {
                ...state,
                searchText: action.searchText
            }
        default:
            return state;
    }
}

export default reducer;
    
    