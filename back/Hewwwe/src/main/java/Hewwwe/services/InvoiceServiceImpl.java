package Hewwwe.services;

import Hewwwe.entity.Invoice;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {
    private final InvoiceRepository invoiceRepository;

    @Override
    public Invoice findById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
    }

    @Override
    public List<Invoice> findAll() {
        return invoiceRepository.findAll();
    }

    @Override
    public Invoice save(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice update(Long id, Invoice invoice) {
        Invoice existingInvoice = findById(id);
        existingInvoice.setInvoiceDate(invoice.getInvoiceDate());
        existingInvoice.setTotalAmount(invoice.getTotalAmount());
        existingInvoice.setAddress(invoice.getAddress());
        existingInvoice.setUser(invoice.getUser());
        existingInvoice.setProducts(invoice.getProducts());
        return invoiceRepository.save(existingInvoice);
    }

    @Override
    public void delete(Long id) {
        invoiceRepository.deleteById(id);
    }

    @Override
    public List<Invoice> findByUserId(Long userId) {
        return invoiceRepository.findByUser_UserId(userId);  // Updated to match repository method
    }
}
