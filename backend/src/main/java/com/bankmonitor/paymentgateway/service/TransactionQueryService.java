package com.bankmonitor.paymentgateway.service;

import com.bankmonitor.paymentgateway.controller.TransactionResponse;
import java.util.List;

public interface TransactionQueryService {

    List<TransactionResponse> findPage(int page, int limit);
}