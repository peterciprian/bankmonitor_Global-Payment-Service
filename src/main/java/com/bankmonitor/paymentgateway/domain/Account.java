package com.bankmonitor.paymentgateway.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String userId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balance;

    protected Account() {
        // JPA constructor
    }

    public Account(Long id, String userId, Currency currency, BigDecimal balance) {
        this.id = id;
        this.userId = userId;
        this.currency = currency;
        this.balance = requirePositiveAmount(balance, "Initial balance");
    }

    public Account(String userId, Currency currency, BigDecimal initialBalance) {
        this(null, userId, currency, initialBalance);
    }

    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public Currency getCurrency() {
        return currency;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void credit(BigDecimal amount) {
        BigDecimal validated = requirePositiveAmount(amount, "Credit amount");
        this.balance = this.balance.add(validated);
    }

    public void debit(BigDecimal amount) {
        BigDecimal validated = requirePositiveAmount(amount, "Debit amount");
        if (this.balance.compareTo(validated) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient funds for debit operation on account " + id);
        }
        this.balance = this.balance.subtract(validated);
    }

    private static BigDecimal requirePositiveAmount(BigDecimal amount, String fieldName) {
        if (amount == null) {
            throw new IllegalArgumentException(fieldName + " must not be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(fieldName + " must be greater than zero");
        }
        return amount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Account account)) {
            return false;
        }
        return Objects.equals(id, account.id)
                && Objects.equals(userId, account.userId)
                && currency == account.currency
                && Objects.equals(balance, account.balance);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, currency, balance);
    }
}
