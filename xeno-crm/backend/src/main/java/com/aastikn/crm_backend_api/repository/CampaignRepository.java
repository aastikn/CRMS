package com.aastikn.crm_backend_api.repository;

import com.aastikn.crm_backend_api.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
}
