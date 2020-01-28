package com.example.blog.payload;

import java.time.Instant;

public class PostResponse {
    private Long id;
    private String title;
    private String body;
    private UserSummary createdBy;
    private boolean accepted;
    private Instant creationDateTime;
    private Instant updatedDateTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public UserSummary getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserSummary createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Instant creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public Instant getUpdatedDateTime() {
        return updatedDateTime;
    }

    public void setUpdatedDateTime(Instant updatedDateTime) {
        this.updatedDateTime = updatedDateTime;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
}