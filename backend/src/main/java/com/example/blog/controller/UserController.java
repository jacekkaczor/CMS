package com.example.blog.controller;

import com.example.blog.exception.ResourceNotFoundException;
import com.example.blog.model.RoleName;
import com.example.blog.model.User;
import com.example.blog.payload.*;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import com.example.blog.security.UserPrincipal;
import com.example.blog.service.PostService;
import com.example.blog.security.CurrentUser;
import com.example.blog.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostService postService;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        var ordinal = new Object() { boolean admin = false; };
        currentUser.getAuthorities().forEach(role -> {
            if (role.getAuthority() == RoleName.ROLE_ADMIN.toString())
                ordinal.admin = true;
        });
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName(), ordinal.admin);
        return userSummary;
    }

    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        long postCount = postRepository.countByCreatedBy(user.getId());

        UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), postCount);

        return userProfile;
    }

    @GetMapping("/users/{username}/posts")
    public PagedResponse<PostResponse> getPostsCreatedBy(@PathVariable(value = "username") String username,
                                                         @CurrentUser UserPrincipal currentUser,
                                                         @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                         @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return postService.getPostsCreatedBy(username, currentUser, page, size);
    }
}