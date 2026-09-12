package com.blog.platform.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequest {

    @NotBlank(message = "Google ID token / credential is required")
    private String idToken;

    public GoogleAuthRequest() {}

    public GoogleAuthRequest(String idToken) {
        this.idToken = idToken;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    // Support 'credential' alias from Google Identity Services
    public String getCredential() {
        return idToken;
    }

    public void setCredential(String credential) {
        this.idToken = credential;
    }
}
