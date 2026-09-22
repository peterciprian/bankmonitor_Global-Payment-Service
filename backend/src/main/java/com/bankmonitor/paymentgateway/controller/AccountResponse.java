package com.bankmonitor.paymentgateway.controller;

import com.bankmonitor.paymentgateway.domain.Account;
import com.bankmonitor.paymentgateway.domain.Currency;
import java.math.BigDecimal;

public record AccountResponse(Long id, String userId, Currency currency, BigDecimal balance) {

    public static AccountResponse from(Account account) {
        return new AccountResponse(
                account.getId(), account.getUserId(), account.getCurrency(), account.getBalance());
    }
}