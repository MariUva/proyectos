package com.gestionp.backend.service;

import com.gestionp.backend.dto.TaskDTO;
import com.gestionp.backend.model.Project;
import com.gestionp.backend.model.State;
import com.gestionp.backend.model.Task;
import com.gestionp.backend.model.User;
import com.gestionp.backend.repository.ProjectRepository;
import com.gestionp.backend.repository.TaskRepository;
import com.gestionp.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    public List<TaskDTO> getTasksByProject(Long projectId) {
        Project project = getUserProject(projectId);
        return taskRepository.findByProjectId(project.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO createTask(TaskDTO dto) {
        Project project = getUserProject(dto.getProjectId());

        if (project.getState() == State.CANCELADO || project.getState() == State.TERMINADO) {
            throw new IllegalStateException("No se pueden crear tareas en un proyecto cancelado o terminado");
        }

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.isCompleted());
        task.setProject(project);
        return mapToDTO(taskRepository.save(task));
    }

    public TaskDTO updateTask(Long id, TaskDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tarea no encontrada"));

        Project project = getUserProject(dto.getProjectId());

        if (!task.getProject().getId().equals(project.getId())) {
            throw new EntityNotFoundException("No autorizado para editar esta tarea");
        }

        if (project.getState() == State.CANCELADO || project.getState() == State.TERMINADO) {
            throw new IllegalStateException("No se pueden modificar tareas en un proyecto cancelado o terminado");
        }

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.isCompleted());

        return mapToDTO(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tarea no encontrada"));
        Project project = getUserProject(task.getProject().getId());

        if (!task.getProject().getId().equals(project.getId())) {
            throw new EntityNotFoundException("No autorizado para eliminar esta tarea");
        }

        // Validación de estado del proyecto
        if (project.getState() == State.CANCELADO || project.getState() == State.TERMINADO) {
            throw new IllegalStateException("No se pueden eliminar tareas de un proyecto cancelado o terminado");
        }

        taskRepository.delete(task);
    }

    private Project getUserProject(Long projectId) {
        User user = getAuthenticatedUser();
        return projectRepository.findById(projectId)
                .filter(p -> p.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Proyecto no encontrado o no autorizado"));
    }

    private TaskDTO mapToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCompleted(task.isCompleted());
        dto.setProjectId(task.getProject().getId());
        return dto;
    }
}
