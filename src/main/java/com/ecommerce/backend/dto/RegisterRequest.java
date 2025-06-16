package com.ecommerce.backend.dto;

public record RegisterRequest(
        String password,
        String role,
        String email
) {}
