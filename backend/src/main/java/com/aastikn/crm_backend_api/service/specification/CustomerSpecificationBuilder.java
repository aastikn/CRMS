package com.aastikn.crm_backend_api.service.specification;

import com.aastikn.crm_backend_api.dto.audience.AudienceDto;
import com.aastikn.crm_backend_api.dto.audience.RuleDto;
import com.aastikn.crm_backend_api.dto.audience.RuleGroupDto;
import com.aastikn.crm_backend_api.entity.Customer;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CustomerSpecificationBuilder {

    public Specification<Customer> build(AudienceDto audienceDto) {
        if (audienceDto == null || audienceDto.getGroups() == null || audienceDto.getGroups().isEmpty()) {
            return null;
        }

        Specification<Customer> finalSpec = null;
        String mainConjunction = audienceDto.getConjunction();

        for (RuleGroupDto group : audienceDto.getGroups()) {
            Specification<Customer> groupSpec = buildGroupSpecification(group);
            if (finalSpec == null) {
                finalSpec = groupSpec;
            } else {
                if ("AND".equalsIgnoreCase(mainConjunction)) {
                    finalSpec = finalSpec.and(groupSpec);
                } else {
                    finalSpec = finalSpec.or(groupSpec);
                }
            }
        }
        return finalSpec;
    }

    private Specification<Customer> buildGroupSpecification(RuleGroupDto group) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            for (RuleDto rule : group.getRules()) {
                predicates.add(createPredicate(rule, root, cb));
            }

            if (predicates.isEmpty()){
                return cb.conjunction(); // Always true
            }
            if (predicates.size() == 1) {
                return predicates.get(0);
            }

            Predicate combined = predicates.get(0);
            for (int i = 0; i < group.getConjunctions().size(); i++) {
                if ("AND".equalsIgnoreCase(group.getConjunctions().get(i))) {
                    combined = cb.and(combined, predicates.get(i + 1));
                } else {
                    combined = cb.or(combined, predicates.get(i + 1));
                }
            }
            return combined;
        };
    }

    private Predicate createPredicate(RuleDto rule, Root<Customer> root, CriteriaBuilder cb) {
        String field = rule.getField();
        String operator = rule.getOperator();
        Object value = rule.getValue();

        switch (field) {
            case "total_spending":
                return createNumericPredicate(root, cb, "totalSpending", operator, value);
            case "visit_count":
                return createNumericPredicate(root, cb, "visitCount", operator, value);
            case "last_visit_days_ago":
                return createDatePredicate(root, cb, "lastVisit", operator, value);
            default:
                throw new IllegalArgumentException("Unknown field: " + field);
        }
    }

    private Predicate createNumericPredicate(Root<Customer> root, CriteriaBuilder cb, String fieldName, String operator, Object value) {
        Number numValue = (Number) value;
        switch (operator) {
            case "gt":
                return cb.greaterThan(root.get(fieldName), numValue.doubleValue());
            case "lt":
                return cb.lessThan(root.get(fieldName), numValue.doubleValue());
            case "eq":
                return cb.equal(root.get(fieldName), numValue.doubleValue());
            default:
                throw new IllegalArgumentException("Unknown operator for numeric field: " + operator);
        }
    }

    private Predicate createDatePredicate(Root<Customer> root, CriteriaBuilder cb, String fieldName, String operator, Object value) {
        Integer days = (Integer) value;
        LocalDateTime date = LocalDateTime.now().minusDays(days);
        switch (operator) {
            case "within_last_days":
                return cb.greaterThanOrEqualTo(root.get(fieldName), date);
            case "gt": // more than X days ago -> last visit is before that date
                return cb.lessThan(root.get(fieldName), date);
            case "lt": // less than X days ago -> last visit is after that date
                return cb.greaterThan(root.get(fieldName), date);
            default:
                throw new IllegalArgumentException("Unknown operator for date field: " + operator);
        }
    }
}
