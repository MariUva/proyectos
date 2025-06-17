package com.gestionp.backend.dto;

public record RegisterRequest(
        String password,
        String role,
        String email
) {}
