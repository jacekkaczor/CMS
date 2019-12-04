package com.example.blog.util;

import com.example.blog.model.Post;
import com.example.blog.model.User;
import com.example.blog.payload.PostResponse;
import com.example.blog.payload.UserSummary;

public class ModelMapper {

    public static PostResponse mapPostToPostResponse(Post post, User creator) {
        PostResponse PostResponse = new PostResponse();
        PostResponse.setId(post.getId());
        PostResponse.setTitle(post.getTitle());
        PostResponse.setBody(post.getBody());
        PostResponse.setCreationDateTime(post.getCreatedAt());
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        PostResponse.setCreatedBy(creatorSummary);

        return PostResponse;
    }
}