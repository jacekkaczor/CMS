package com.example.blog.repository;

import com.example.blog.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findById(Long postId);

    Page<Post> findByAcceptedTrue(Pageable pageable);

    Page<Post> findByAcceptedFalse(Pageable pageable);

    Page<Post> findByCreatedByAndAcceptedTrue(Long userId, Pageable pageable);

    Page<Post> findByCreatedBy(Long userId, Pageable pageable);

    Page<Post> findByTitleContainingAndAcceptedTrue(String search, Pageable pageable);

    long countByCreatedBy(Long userId);

    List<Post> findByIdIn(List<Long> postIds);

    List<Post> findByIdIn(List<Long> postIds, Sort sort);
}