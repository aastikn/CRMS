package com.aastikn.crm_backend_api.dto.audience;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RuleDto {
    private String field;
    private String operator;
    private Object value;
}
