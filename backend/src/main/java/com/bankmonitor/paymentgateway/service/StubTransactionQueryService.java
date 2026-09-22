package com.bankmonitor.paymentgateway.service;

import com.bankmonitor.paymentgateway.controller.TransactionResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StubTransactionQueryService implements TransactionQueryService {

    @Override
    public List<TransactionResponse> findPage(int page, int limit) {
        return List.of();
    }
}