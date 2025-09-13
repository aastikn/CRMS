package com.aastikn.crm_backend_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageSuggestion {
    private String message;
    private String imageSuggestion;
}
