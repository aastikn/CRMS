// Create a new file CampaignCountsDto.java in the 'dto' package
package com.aastikn.crm_backend_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Important for the JPA constructor expression
public class CampaignCountsDto {
    private Long campaignId;
    private Long sentCount;
    private Long failedCount;
}