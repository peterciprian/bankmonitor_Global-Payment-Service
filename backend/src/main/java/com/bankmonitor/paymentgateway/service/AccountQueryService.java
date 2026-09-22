package com.bankmonitor.paymentgateway.service;

import com.bankmonitor.paymentgateway.domain.Account;
import java.util.List;

public interface AccountQueryService {

    List<Account> findAll();
}