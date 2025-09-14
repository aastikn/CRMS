package com.aastikn.crm_backend_api.dto;

import com.aastikn.crm_backend_api.entity.CommunicationLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationLogDto {
    private Long id;
    private CustomerDto customer;
    private CampaignDto campaign;
    private String message;
    private CommunicationLog.Status status;
    private LocalDateTime sent_at;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDto {
        private Long id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CampaignDto {
        private String name;
    }

    public static CommunicationLogDto fromEntity(CommunicationLog log) {
        return new CommunicationLogDto(
                log.getId(),
                new CustomerDto(log.getCustomer().getId(), log.getCustomer().getName()),
                new CampaignDto(log.getCampaign().getName()),
                log.getCampaign().getMessage(),
                log.getStatus(),
                log.getCreatedAt()
        );
    }
}