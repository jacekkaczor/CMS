package com.example.blog.util;

import com.example.blog.model.Post;
import com.example.blog.model.User;
import com.example.blog.payload.PostResponse;
import com.example.blog.payload.UserSummary;

public class ModelMapper {

    public static PostResponse mapPostToPostResponse(Post post, User creator) {
        PostResponse postResponse = new PostResponse();
        postResponse.setId(post.getId());
        postResponse.setTitle(post.getTitle());
        postResponse.setBody(post.getBody());
        postResponse.setCreationDateTime(post.getCreatedAt());
        postResponse.setUpdatedDateTime(post.getUpdatedAt());
        postResponse.setAccepted(post.isAccepted());
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        postResponse.setCreatedBy(creatorSummary);

        return postResponse;
    }
}