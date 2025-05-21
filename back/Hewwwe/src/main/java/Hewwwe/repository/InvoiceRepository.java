package Hewwwe.repository;

import Hewwwe.entity.Invoice;
import Hewwwe.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUser_UserId(Long userId);  // Changed from findByUserId
    List<Invoice> findByAddress(Address address);
}
