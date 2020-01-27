export const SET_POSTS = 'SET_POST';
export const SET_SEARCH = 'SET_SEARCH';

export const setPosts = (posts, page, size, totalElements, totalPages, last) => ({
    type: SET_POSTS,
    posts,
    page,
    size,
    totalElements,
    totalPages,
    last
});

export const setSearch = (searchText) => ({
    type: SET_SEARCH,
    searchText
});