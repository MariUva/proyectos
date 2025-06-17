package com.gestionp.backend.dto;

import lombok.Data;

@Data
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private Long projectId;
}
