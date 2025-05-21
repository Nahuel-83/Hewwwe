package Hewwwe.services;

import Hewwwe.entity.Address;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AddressService {
    Address createAddress(Address address, Long userId);

    List<Address> getAllAddresses();

    Address getAddressById(Long id);

    Address updateAddress(Address address);

    void deleteAddress(Long id);
}
