package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.dto.CommunicationLogDto;
import com.aastikn.crm_backend_api.repository.CommunicationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommunicationLogService {

    private final CommunicationLogRepository communicationLogRepository;

    @Transactional(readOnly = true)
    public Page<CommunicationLogDto> getAllLogs(Pageable pageable) {
        return communicationLogRepository.findAll(pageable).map(CommunicationLogDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public java.util.List<CommunicationLogDto> getAllLogs() {
        return communicationLogRepository.findAll().stream().map(CommunicationLogDto::fromEntity).collect(java.util.stream.Collectors.toList());
    }
}
