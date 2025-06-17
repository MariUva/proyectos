package com.gestionp.backend.service;

import com.gestionp.backend.model.Role;
import com.gestionp.backend.model.User;
import com.gestionp.backend.repository.UserRepository;
import com.gestionp.backend.security.JwtUtil;
import com.gestionp.backend.dto.AuthRequest;
import com.gestionp.backend.dto.AuthResponse;
import com.gestionp.backend.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        var user = userRepo.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Contraseña inválida");
        }

        var token = jwtUtil.generateToken(user);
        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .role(Role.USER)
                .build();

        userRepo.save(user);
        var token = jwtUtil.generateToken(user);
        return new AuthResponse(token);
    }
}
