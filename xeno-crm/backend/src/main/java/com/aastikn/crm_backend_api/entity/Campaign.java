package com.aastikn.crm_backend_api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Data
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "segment_id", referencedColumnName = "id")
    private Segment segment;

    @Lob
    private String message;

    @Enumerated(EnumType.STRING)
    private CampaignStatus status = CampaignStatus.PENDING;

    private Integer audienceSize = 0;
    private Integer sentCount = 0;
    private Integer failedCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum CampaignStatus {
        PENDING, IN_PROGRESS, COMPLETED, FAILED
    }
}
