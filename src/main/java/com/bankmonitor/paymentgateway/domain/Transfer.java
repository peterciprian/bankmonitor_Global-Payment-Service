package com.bankmonitor.paymentgateway.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Objects;

@Entity
@Table(name = "transfers")
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_account_id", nullable = false)
    private Account fromAccount;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_account_id", nullable = false)
    private Account toAccount;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransferStatus status;

    @NotNull
    @Column(nullable = false)
    private OffsetDateTime createdAt;

    protected Transfer() {
        // JPA constructor
    }

    public Transfer(Account fromAccount, Account toAccount, BigDecimal amount, Currency currency) {
        this.fromAccount = Objects.requireNonNull(fromAccount, "fromAccount must not be null");
        this.toAccount = Objects.requireNonNull(toAccount, "toAccount must not be null");
        this.amount = requirePositiveAmount(amount, "Transfer amount");
        this.currency = Objects.requireNonNull(currency, "currency must not be null");
        this.status = TransferStatus.PENDING;
        this.createdAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Account getFromAccount() {
        return fromAccount;
    }

    public Account getToAccount() {
        return toAccount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Currency getCurrency() {
        return currency;
    }

    public TransferStatus getStatus() {
        return status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void markCompleted() {
        this.status = TransferStatus.COMPLETED;
    }

    public void markFailed() {
        this.status = TransferStatus.FAILED;
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
        if (!(o instanceof Transfer transfer)) {
            return false;
        }
        return Objects.equals(id, transfer.id)
                && Objects.equals(fromAccount, transfer.fromAccount)
                && Objects.equals(toAccount, transfer.toAccount)
                && Objects.equals(amount, transfer.amount)
                && currency == transfer.currency
                && status == transfer.status
                && Objects.equals(createdAt, transfer.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fromAccount, toAccount, amount, currency, status, createdAt);
    }
}
