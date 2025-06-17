package com.gestionp.backend.service;

import com.gestionp.backend.dto.ProjectDTO;
import com.gestionp.backend.model.Project;
import com.gestionp.backend.model.User;
import com.gestionp.backend.repository.ProjectRepository;
import com.gestionp.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    public List<ProjectDTO> getAllProjectsForUser() {
        User user = getAuthenticatedUser();
        return projectRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO createProject(ProjectDTO dto) {
        User user = getAuthenticatedUser();
        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setUser(user);
        return mapToDTO(projectRepository.save(project));
    }

    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        User user = getAuthenticatedUser();
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Proyecto no encontrado o no autorizado"));
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        return mapToDTO(projectRepository.save(project));
    }

    public void deleteProject(Long id) {
        User user = getAuthenticatedUser();
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Proyecto no encontrado o no autorizado"));
        projectRepository.delete(project);
    }

    private ProjectDTO mapToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        return dto;
    }
}
