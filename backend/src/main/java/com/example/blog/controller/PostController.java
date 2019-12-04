package com.example.blog.controller;

import com.example.blog.model.*;
import com.example.blog.payload.*;
import com.example.blog.security.CurrentUser;
import com.example.blog.security.UserPrincipal;
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
    public PagedResponse<PostResponse> getPosts(@CurrentUser UserPrincipal currentUser,
                                                @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return postService.getAllPosts(currentUser, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest postRequest) {
        Post post = postService.createPost(postRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{postId}")
                .buildAndExpand(post.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Post Created Successfully"));
    }

    @GetMapping("/{postId}")
    public PostResponse getPostById(@CurrentUser UserPrincipal currentUser,
                                    @PathVariable Long postId) {
        return postService.getPostById(postId, currentUser);
    }
}