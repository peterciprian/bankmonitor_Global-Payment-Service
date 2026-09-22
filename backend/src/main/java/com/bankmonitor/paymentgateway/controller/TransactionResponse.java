package com.bankmonitor.paymentgateway.controller;

import com.bankmonitor.paymentgateway.domain.Currency;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record TransactionResponse(
        String id,
        Long fromAccountId,
        Long toAccountId,
        BigDecimal amount,
        BigDecimal convertedAmount,
        Currency currency,
        Currency targetCurrency,
        BigDecimal exchangeRate,
        OffsetDateTime createdAt) {
}