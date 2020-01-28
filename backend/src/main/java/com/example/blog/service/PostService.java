package com.example.blog.service;

import com.example.blog.exception.BadRequestException;
import com.example.blog.exception.ResourceNotFoundException;
import com.example.blog.model.*;
import com.example.blog.payload.PagedResponse;
import com.example.blog.payload.PostRequest;
import com.example.blog.payload.PostResponse;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import com.example.blog.security.UserPrincipal;
import com.example.blog.util.AppConstants;
import com.example.blog.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public PagedResponse<PostResponse> getAllPosts(int page, int size, String search, boolean accepted) {
        validatePageNumberAndSize(page, size);

        // Retrieve Posts
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Post> posts;
        if (accepted)
            if(search != "") {
                posts = postRepository.findByTitleContainingAndAcceptedTrue(search, pageable);
            } else {
                posts = postRepository.findByAcceptedTrue(pageable);
            }
        else
            posts = postRepository.findByAcceptedFalse(pageable);

        if(posts.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), posts.getNumber(),
                    posts.getSize(), posts.getTotalElements(), posts.getTotalPages(), posts.isLast());
        }

        // Map Posts to PostResponses
        Map<Long, User> creatorMap = getPostCreatorMap(posts.getContent());

        List<PostResponse> postResponses = posts.map(post -> {
            return ModelMapper.mapPostToPostResponse(post,
                    creatorMap.get(post.getCreatedBy()));
        }).getContent();

        return new PagedResponse<>(postResponses, posts.getNumber(),
                posts.getSize(), posts.getTotalElements(), posts.getTotalPages(), posts.isLast());
    }

    public PagedResponse<PostResponse> getPostsCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all posts created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Post> posts;
        if (currentUser.getUsername().equals(username)) {
            posts = postRepository.findByCreatedBy(user.getId(), pageable);
        } else {
            posts = postRepository.findByCreatedByAndAcceptedTrue(user.getId(), pageable);
        }

        if (posts.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), posts.getNumber(),
                    posts.getSize(), posts.getTotalElements(), posts.getTotalPages(), posts.isLast());
        }

        // Map Posts to PostResponses
        List<PostResponse> postResponses = posts.map(post -> {
            return ModelMapper.mapPostToPostResponse(post, user);
        }).getContent();

        return new PagedResponse<>(postResponses, posts.getNumber(),
                posts.getSize(), posts.getTotalElements(), posts.getTotalPages(), posts.isLast());
    }

    public Post createPost(PostRequest postRequest) {
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setBody(postRequest.getBody());
        post.setAccepted(false);
        
        return postRepository.save(post);
    }

    public Post updatePost(PostRequest postRequest) {
        Post post = postRepository.findById(postRequest.getId()).orElseThrow(
                () -> new ResourceNotFoundException("Post", "id", postRequest.getId()));
        post.setTitle(postRequest.getTitle());
        post.setBody(postRequest.getBody());
        
        return postRepository.save(post);
    }

    public Post acceptPost(long id) {
        Post post = postRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Post", "id", id));
        post.setAccepted(true);        
        return postRepository.save(post);
    }

    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("Post", "id", postId));

        // Retrieve post creator details
        User creator = userRepository.findById(post.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", post.getCreatedBy()));

        return ModelMapper.mapPostToPostResponse(post, creator);
    }

    public Boolean deletePostById(Long postId) { 
        try {
            postRepository.deleteById(postId);
        } catch( Exception e) {
            return false;
        }
        return true;
    }

    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    Map<Long, User> getPostCreatorMap(List<Post> posts) {
        // Get Post Creator details of the given list of posts
        List<Long> creatorIds = posts.stream()
                .map(Post::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<Long, User> creatorMap = creators.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return creatorMap;
    }
}