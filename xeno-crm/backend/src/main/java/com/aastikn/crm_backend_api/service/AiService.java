package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.gemini.Content;
import com.aastikn.crm_backend_api.dto.gemini.GeminiRequest;
import com.aastikn.crm_backend_api.dto.gemini.GeminiResponse;
import com.aastikn.crm_backend_api.dto.gemini.Part;
import com.aastikn.crm_backend_api.dto.MessageSuggestion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public String generateQuery(String userPrompt) {
        log.info("Generating query for prompt: {}", userPrompt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-goog-api-key", geminiApiKey);

        String fullPrompt = "You are an expert at converting natural language to a SQL-like WHERE clause.\n" +
                "The user will provide a prompt to filter customers. You must return a query string that can be used to filter customers based on the following fields:\n" +
                "- total_spending (numeric)\n" +
                "- visit_count (numeric)\n" +
                "- last_visit_days_ago (numeric)\n\n" +
                "The query should only contain conditions and be combined with AND/OR, and parentheses for grouping.\n" +
                "Do not include \"WHERE\" or any other SQL keywords.\n" +
                "For example, if the prompt is \"Customers who have spent more than 500 and have visited more than 5 times\", you should return \"(total_spending > 500) AND (visit_count > 5)\".\n" +
                "If the prompt is \"customers who visited in the last 30 days\", you should return \"(last_visit_days_ago < 30)\".\n\n" +
                "Prompt: \"" + userPrompt + "\"\n";
        
        log.debug("Full prompt for Gemini: {}", fullPrompt);

        Part part = new Part(fullPrompt);
        Content content = new Content(Collections.singletonList(part));
        GeminiRequest request = new GeminiRequest(Collections.singletonList(content));

        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

        try {
            GeminiResponse response = restTemplate.postForObject(GEMINI_API_URL, entity, GeminiResponse.class);

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty() &&
                response.getCandidates().get(0).getContent() != null && response.getCandidates().get(0).getContent().getParts() != null &&
                !response.getCandidates().get(0).getContent().getParts().isEmpty()) {
                
                String generatedQuery = response.getCandidates().get(0).getContent().getParts().get(0).getText().trim();
                log.info("Successfully generated query: {}", generatedQuery);
                return generatedQuery;
            } else {
                log.error("Invalid response structure from Gemini API. Response: {}", response);
                throw new RuntimeException("Failed to generate query from Gemini API: Invalid response structure.");
            }
        } catch (RestClientException e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to call Gemini API.", e);
        }
    }

    public List<MessageSuggestion> generateMessages(String campaignObjective) {
        log.info("Generating messages for objective: {}", campaignObjective);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-goog-api-key", geminiApiKey);

        String fullPrompt = "You are a marketing expert. Given a campaign objective, generate 3 distinct message variants for a marketing campaign. The messages should be concise, engaging, and tailored to the objective. After each message, suggest a relevant product or offer image theme on a new line, prefixed with 'Image suggestion:'. Each message and its suggestion should be separated by a blank line.\n\n" +
                "Example:\n" +
                "Campaign Objective: \"Promote a summer sale on shoes\"\n\n" +
                "Messages:\n" +
                "Step into summer with 50% off all sandals! ☀️\n" +
                "Image suggestion: A vibrant picture of sandals on a sunny beach.\n\n" +
                "Don't let summer catch you off guard. Get the best deals on our new collection.\n" +
                "Image suggestion: A person happily walking in new shoes in a park.\n\n" +
                "Your feet deserve a vacation too. Treat them with our comfortable and stylish summer shoes.\n" +
                "Image suggestion: A close-up shot of a person's feet in stylish sandals, relaxing by a pool.\n\n" +
                "Campaign Objective: \"" + campaignObjective + "\"\n\n" +
                "Messages:\n";

        log.debug("Full prompt for Gemini: {}", fullPrompt);

        Part part = new Part(fullPrompt);
        Content content = new Content(Collections.singletonList(part));
        GeminiRequest request = new GeminiRequest(Collections.singletonList(content));

        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

        try {
            GeminiResponse response = restTemplate.postForObject(GEMINI_API_URL, entity, GeminiResponse.class);

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty() &&
                response.getCandidates().get(0).getContent() != null && response.getCandidates().get(0).getContent().getParts() != null &&
                !response.getCandidates().get(0).getContent().getParts().isEmpty()) {
                
                String text = response.getCandidates().get(0).getContent().getParts().get(0).getText().trim();
                String[] blocks = text.split("\n\n");
                List<MessageSuggestion> suggestions = new ArrayList<>();
                for (String block : blocks) {
                    String[] lines = block.split("\n");
                    if (lines.length >= 2) {
                        String message = lines[0];
                        String imageSuggestion = lines[1].replace("Image suggestion:", "").trim();
                        suggestions.add(new MessageSuggestion(message, imageSuggestion));
                    } else if (lines.length == 1) {
                        suggestions.add(new MessageSuggestion(lines[0], null));
                    }
                }
                log.info("Successfully generated message suggestions.");
                return suggestions;
            }
        } catch (RestClientException e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to call Gemini API.", e);
        }
        return Collections.emptyList();
    }
}