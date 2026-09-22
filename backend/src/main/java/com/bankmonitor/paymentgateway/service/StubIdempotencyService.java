package com.bankmonitor.paymentgateway.service;

import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class StubIdempotencyService implements IdempotencyService {

    @Override
    public Optional<IdempotencyRecord> find(String key) {
        return Optional.empty();
    }

    @Override
    public void markProcessing(String key) {
        // Replaced by the Task 2 idempotency engine.
    }
}