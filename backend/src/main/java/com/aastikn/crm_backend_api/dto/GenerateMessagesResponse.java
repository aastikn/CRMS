package com.aastikn.crm_backend_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateMessagesResponse {
    private List<MessageSuggestion> messages;
}
