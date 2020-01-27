package com.example.blog.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class PostRequest {
    private long id;

    @NotBlank
    @Size(max = 140)
    private String title;

    @NotBlank
    private String body;

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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}