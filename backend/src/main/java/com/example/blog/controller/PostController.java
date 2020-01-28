package com.example.blog.controller;

import com.example.blog.model.*;
import com.example.blog.payload.*;
import com.example.blog.service.PostService;
import com.example.blog.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping
    public PagedResponse<PostResponse> getPosts(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size, 
                                                @RequestParam(value = "search",  defaultValue = "") String search) {
        return postService.getAllPosts(page, size, search, true);
    }

    @GetMapping("/toAccept")
    @PreAuthorize("hasRole('ADMIN')")
    public PagedResponse<PostResponse> getPostsAcceptedFalse(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return postService.getAllPosts(page, size, "", false);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest postRequest) {
        Post post = postService.createPost(postRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{postId}")
                .buildAndExpand(post.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Post Created Successfully", post.getId()));
    }

    @GetMapping("/{postId}")
    public PostResponse getPostById(@PathVariable Long postId) {
        return postService.getPostById(postId);
    }

    @DeleteMapping("/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deletePostById(@PathVariable Long postId) {
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{postId}")
                .buildAndExpand(postId).toUri();

        return ResponseEntity.created(location)
            .body(new ApiResponse(postService.deletePostById(postId), "Post Created Successfully", postId));
    }

    @PutMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updatePost(@Valid @RequestBody PostRequest postRequest) {
        Post post = postService.updatePost(postRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{postId}")
                .buildAndExpand(post.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Post Updated Successfully", post.getId()));
    }

    @PutMapping("/accept")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> acceptPost(@Valid @RequestBody long postId) {
        Post post = postService.acceptPost(postId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{postId}")
                .buildAndExpand(post.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Post Accepted Successfully", post.getId()));
    }
}