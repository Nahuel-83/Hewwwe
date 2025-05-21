package Hewwwe.services;

import Hewwwe.entity.Address;
import Hewwwe.entity.Invoice;
import Hewwwe.entity.User;
import Hewwwe.repository.AddressRepository;
import Hewwwe.repository.InvoiceRepository;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements  AddressService{
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;


    @Override
    public Address createAddress(Address address, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        address.setUser(user);

        return addressRepository.save(address);
    }

    @Override
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    @Override
    public Address getAddressById(Long id) {
        return addressRepository.findById(id).orElse(null);
    }

    @Override
    public Address updateAddress(Address address) {
        return addressRepository.save(address);

    }

    public void deleteAddress(Long id) {
        Optional<Address> address = addressRepository.findById(id);
        if (address.isPresent()) {
            // Aquí puedes desvincular las facturas de la dirección si quieres
            List<Invoice> invoices = invoiceRepository.findByAddress(address.get());
            for (Invoice invoice : invoices) {
                // Opcionalmente, puedes poner una nueva dirección o null en la factura
                invoice.setAddress(null); // o asignar una dirección por defecto
                invoiceRepository.save(invoice);
            }

            // Ahora eliminamos la dirección
            addressRepository.delete(address.get());
        }
    }



}
