package com.bankmonitor.paymentgateway.service;

import com.bankmonitor.paymentgateway.domain.Account;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StubAccountQueryService implements AccountQueryService {

    @Override
    public List<Account> findAll() {
        return List.of();
    }
}