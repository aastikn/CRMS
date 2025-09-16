package com.aastikn.crm_backend_api.service;

import com.aastikn.crm_backend_api.entity.Customer;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Root;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RawQueryParser {

    private List<String> tokens;
    private int pos;

    public Specification<Customer> parse(String rawQuery) {
        this.tokens = tokenize(rawQuery);
        this.pos = 0;
        if (this.tokens.isEmpty()) {
            return null;
        }
        Specification<Customer> result = parseExpression();
        if (pos != tokens.size()) {
            throw new IllegalArgumentException("Unexpected tokens at the end of the query");
        }
        return result;
    }

    private List<String> tokenize(String query) {
        List<String> tokens = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\(\\|\\)|[\\w_]+|[<>=]|\\d*\\.?\\d+");
        Matcher matcher = pattern.matcher(query);
        while (matcher.find()) {
            tokens.add(matcher.group());
        }
        return tokens;
    }

    private Specification<Customer> parseExpression() {
        Specification<Customer> left = parseTerm();
        while (pos < tokens.size() && tokens.get(pos).equalsIgnoreCase("OR")) {
            pos++; // Consume "OR"
            Specification<Customer> right = parseTerm();
            left = left.or(right);
        }
        return left;
    }

    private Specification<Customer> parseTerm() {
        Specification<Customer> left = parseFactor();
        while (pos < tokens.size() && tokens.get(pos).equalsIgnoreCase("AND")) {
            pos++; // Consume "AND"
            Specification<Customer> right = parseFactor();
            left = left.and(right);
        }
        return left;
    }

    private Specification<Customer> parseFactor() {
        if (tokens.get(pos).equals("(")) {
            pos++; // Consume "("
            Specification<Customer> spec = parseExpression();
            if (pos >= tokens.size() || !tokens.get(pos).equals(")")) {
                throw new IllegalArgumentException("Mismatched parentheses");
            }
            pos++; // Consume ")"
            return spec;
        } else {
            return parseCondition();
        }
    }

    private Specification<Customer> parseCondition() {
        if (pos + 2 >= tokens.size()) {
            throw new IllegalArgumentException("Incomplete condition");
        }
        String field = tokens.get(pos++);
        String operator = tokens.get(pos++);
        String valueStr = tokens.get(pos++);

        return (root, query, cb) -> {
            String dbField = mapField(field);
            
            if ("last_visit_days_ago".equals(field)) {
                long days = Long.parseLong(valueStr);
                LocalDateTime date = LocalDateTime.now().minusDays(days);
                switch (operator) {
                    case ">": return cb.lessThan(root.get(dbField), date);
                    case "<": return cb.greaterThan(root.get(dbField), date);
                    case "=": 
                        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
                        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
                        return cb.between(root.get(dbField), startOfDay, endOfDay);
                    default: throw new IllegalArgumentException("Unsupported operator for date field: " + operator);
                }
            } else {
                Number value = Double.parseDouble(valueStr);
                switch (operator) {
                    case ">": return cb.greaterThan(root.get(dbField).as(Double.class), value.doubleValue());
                    case "<": return cb.lessThan(root.get(dbField).as(Double.class), value.doubleValue());
                    case "=": return cb.equal(root.get(dbField), value.doubleValue());
                    default: throw new IllegalArgumentException("Unsupported operator for numeric field: " + operator);
                }
            }
        };
    }

    private String mapField(String field) {
        switch (field) {
            case "total_spending":
                return "totalSpending";
            case "visit_count":
                return "visitCount";
            case "last_visit_days_ago":
                return "lastVisit";
            default:
                throw new IllegalArgumentException("Unknown field: " + field);
        }
    }
}
