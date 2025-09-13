package com.aastikn.crm_backend_api.dto.audience;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RuleGroupDto {
    private List<String> conjunctions;
    private List<RuleDto> rules;
}
