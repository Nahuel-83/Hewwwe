package Hewwwe.repository;

import Hewwwe.entity.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {
    List<Exchange> findByRequester_UserId(Long requesterId);
    List<Exchange> findByOwner_UserId(Long ownerId);
}
