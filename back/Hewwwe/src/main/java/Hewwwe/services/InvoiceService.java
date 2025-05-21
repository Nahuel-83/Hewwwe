package Hewwwe.services;

import Hewwwe.entity.Invoice;
import java.util.List;

public interface InvoiceService {
    Invoice findById(Long id);
    List<Invoice> findAll();
    Invoice save(Invoice invoice);
    Invoice update(Long id, Invoice invoice);
    void delete(Long id);
    List<Invoice> findByUserId(Long userId);
}
