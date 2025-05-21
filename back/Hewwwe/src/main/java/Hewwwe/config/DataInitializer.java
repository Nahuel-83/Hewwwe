package Hewwwe.config;

import Hewwwe.entity.*;
import Hewwwe.entity.enums.Rol;
import Hewwwe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
/**
 * Initializes demo data for the Hewwwe application at startup.
 * <p>
 * This class implements {@link CommandLineRunner} to populate the database
 * with users, addresses, categories, carts, and products if the respective tables are empty.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CategoryRepository categoryRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final InvoiceRepository invoiceRepository;
    private final ExchangeRepository exchangeRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Entry point that executes after application startup.
     * <p>
     * This method checks whether data already exists and populates
     * the database with sample users, addresses, categories, carts, and products.
     *
     * @param args command-line arguments passed to the application
     */
    @Override
    public void run(String... args) {
        // USUARIOS
        User alice = null, bob = null, carla = null, daniel = null, eva = null, fran = null, gema = null, hector = null, irene = null, juan = null;
        if (userRepository.count() == 0) {
            alice = createUser("Alice", "alice123", "user123", "alice@example.com", "600111111", Rol.USER);
            bob = createUser("Bob", "bob456", "admin123", "bob@example.com", "600222222", Rol.ADMIN);
            carla = createUser("Carla", "carla789", "user123", "carla@example.com", "600333333", Rol.USER);
            daniel = createUser("Daniel", "daniel012", "user123", "daniel@example.com", "600444444", Rol.USER);
            eva = createUser("Eva", "eva345", "user123", "eva@example.com", "600555555", Rol.USER);
            fran = createUser("Fran", "fran678", "user123", "fran@example.com", "600666666", Rol.USER);
            gema = createUser("Gema", "gema901", "user123", "gema@example.com", "600777777", Rol.USER);
            hector = createUser("Hector", "hector234", "user123", "hector@example.com", "600888888", Rol.USER);
            irene = createUser("Irene", "irene567", "user123", "irene@example.com", "600999999", Rol.USER);
            juan = createUser("Juan", "juan890", "user123", "juan@example.com", "600000000", Rol.USER);
        } else {
            alice = userRepository.findByUsername("alice123").orElse(null);
            bob = userRepository.findByUsername("bob456").orElse(null);
            carla = userRepository.findByUsername("carla789").orElse(null);
            daniel = userRepository.findByUsername("daniel012").orElse(null);
            eva = userRepository.findByUsername("eva345").orElse(null);
            fran = userRepository.findByUsername("fran678").orElse(null);
            gema = userRepository.findByUsername("gema901").orElse(null);
            hector = userRepository.findByUsername("hector234").orElse(null);
            irene = userRepository.findByUsername("irene567").orElse(null);
            juan = userRepository.findByUsername("juan890").orElse(null);
        }

        // DIRECCIONES
        if (addressRepository.count() == 0) {
            createAddress(alice, "Madrid", "España", "10", "28001", "Gran Via");
            createAddress(alice, "Madrid", "España", "15", "28002", "Serrano");
            createAddress(bob, "Barcelona", "España", "20", "08001", "Diagonal");
            createAddress(bob, "Barcelona", "España", "25", "08002", "Passeig de Gràcia");
            createAddress(carla, "Sevilla", "España", "30", "41001", "Alameda");
            createAddress(daniel, "Valencia", "España", "40", "46001", "Colon");
            createAddress(daniel, "Valencia", "España", "45", "46002", "Ruzafa");
            createAddress(eva, "Bilbao", "España", "50", "48001", "Indautxu");
            createAddress(fran, "Málaga", "España", "60", "29001", "Larios");
            createAddress(gema, "Zaragoza", "España", "70", "50001", "Paseo Independencia");
            createAddress(hector, "Alicante", "España", "80", "03001", "Explanada");
            createAddress(irene, "Murcia", "España", "90", "30001", "Gran Via");
            createAddress(juan, "Vigo", "España", "100", "36201", "Urzaiz");
        }

        // CATEGORÍAS
        Category camisetas = null, sudaderas = null, pantalones = null, chaquetas = null, zapatillas = null, vestidos = null, accesorios = null, bolsos = null;
        if (categoryRepository.count() == 0) {
            camisetas = createCategory("Camisetas", "Camisetas y tops");
            sudaderas = createCategory("Sudaderas", "Sudaderas y hoodies");
            pantalones = createCategory("Pantalones", "Pantalones y jeans");
            chaquetas = createCategory("Chaquetas", "Chaquetas y abrigos");
            zapatillas = createCategory("Zapatillas", "Zapatillas deportivas y casuales");
            vestidos = createCategory("Vestidos", "Vestidos y faldas");
            accesorios = createCategory("Accesorios", "Complementos y accesorios");
            bolsos = createCategory("Bolsos", "Bolsos y mochilas");
        } else {
            camisetas = categoryRepository.findByName("Camisetas").orElse(null);
            sudaderas = categoryRepository.findByName("Sudaderas").orElse(null);
            pantalones = categoryRepository.findByName("Pantalones").orElse(null);
            chaquetas = categoryRepository.findByName("Chaquetas").orElse(null);
            zapatillas = categoryRepository.findByName("Zapatillas").orElse(null);
            vestidos = categoryRepository.findByName("Vestidos").orElse(null);
            accesorios = categoryRepository.findByName("Accesorios").orElse(null);
            bolsos = categoryRepository.findByName("Bolsos").orElse(null);
        }

        // CARRITOS
        if (cartRepository.count() == 0) {
            createCart(alice);
            createCart(bob);
            createCart(carla);
            createCart(daniel);
            createCart(eva);
            createCart(fran);
            createCart(gema);
            createCart(hector);
            createCart(irene);
            createCart(juan);
        }

        // PRODUCTOS
        if (productRepository.count() == 0) {
            createProduct("Camiseta Básica", "Camiseta algodón 100%", 19.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747643687/camsietaalgoon_gtlhlr.jpg", "AVAILABLE", null, camisetas, null, null, alice);
            createProduct("Camiseta Oversize", "Camiseta oversize negra", 24.99, "L", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747644518/camisetanegra_qtq6uv.jpg", "AVAILABLE", null, camisetas, null, null, bob);
            createProduct("Camiseta Estampada", "Camiseta con estampado floral", 29.99, "S", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747647536/Camisetafloral_bexvwo.jpg", "AVAILABLE", null, camisetas, null, null, carla);
            createProduct("Camiseta Rayas", "Camiseta rayas marineras", 22.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747647591/Camisetarayas_bbbddg.jpg", "AVAILABLE", null, camisetas, null, null, daniel);
            createProduct("Camiseta Crop", "Camiseta crop top", 21.99, "S", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747647689/Camisetacroptop_byyczb.jpg", "AVAILABLE", null, camisetas, null, null, eva);
            createProduct("Sudadera Capucha", "Sudadera con capucha gris", 39.99, "L", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747647859/Sudaderacapuchagris_iyqtv3.jpg", "AVAILABLE", null, sudaderas, null, null, fran);
            createProduct("Sudadera Oversize", "Sudadera oversize negra", 44.99, "XL", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747647960/Sudaderaoversizenegra_vjzswr.jpg", "AVAILABLE", null, sudaderas, null, null, gema);
            createProduct("Sudadera Estampada", "Sudadera con logo", 49.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747648682/Sudaderalogo_nvapvj.jpg", "AVAILABLE", null, sudaderas, null, null, hector);
            createProduct("Sudadera Básica", "Sudadera básica gris", 34.99, "S", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747648787/Sudaderab%C3%A1sicagris_qlqyze.jpg", "AVAILABLE", null, sudaderas, null, null, irene);
            createProduct("Sudadera Canguro", "Sudadera con bolsillo", 42.99, "L", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747648841/Sudadera_con_bolsillo_oafvqo.jpg", "AVAILABLE", null, sudaderas, null, null, juan);
            createProduct("Jeans Slim", "Vaqueros ajustados", 49.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747648922/Vaquerosajustados_w8u69x.jpg", "AVAILABLE", null, pantalones, null, null, alice);
            createProduct("Pantalón Cargo", "Pantalón cargo verde", 54.99, "L", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747649034/Pantal%C3%B3n_cargo_verde_mzrdif.jpg", "AVAILABLE", null, pantalones, null, null, bob);
            createProduct("Pantalón Chino", "Pantalón chino beige", 39.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747649155/Pantal%C3%B3n_chino_beige_x1oedk.jpg", "AVAILABLE", null, pantalones, null, null, carla);
            createProduct("Pantalón Deportivo", "Pantalón deportivo negro", 29.99, "S", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747649157/Pantal%C3%B3n_deportivo_negro_nmbll0.jpg", "AVAILABLE", null, pantalones, null, null, daniel);
            createProduct("Pantalón Palazzo", "Pantalón palazzo negro", 44.99, "L", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747649158/Pantal%C3%B3n_palazzo_negro_ezt2fd.jpg", "AVAILABLE", null, pantalones, null, null, eva);
            createProduct("Chaqueta Cuero", "Chaqueta de cuero negra", 129.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747656234/Chaqueta_de_cuero_negra_ovetvx.jpg", "AVAILABLE", null, chaquetas, null, null, fran);
            createProduct("Chaqueta Denim", "Chaqueta vaquera azul", 79.99, "L", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747656364/Chaqueta_vaquera_azul_qyzrb5.jpg", "AVAILABLE", null, chaquetas, null, null, gema);
            createProduct("Chaqueta Bomber", "Chaqueta bomber negra", 89.99, "S", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747656471/Chaqueta_bomber_negra_psg8oj.jpg", "AVAILABLE", null, chaquetas, null, null, hector);
            createProduct("Chaqueta Piel", "Chaqueta de piel marrón", 149.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747656722/Chaqueta_de_piel_marr%C3%B3n_f4j14x.jpg", "AVAILABLE", null, chaquetas, null, null, irene);
            createProduct("Chaqueta Plumas", "Chaqueta de plumas", 199.99, "L", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747656867/Chaqueta_de_plumas_uvw1ko.jpg", "AVAILABLE", null, chaquetas, null, null, juan);
            createProduct("Nike Air Max", "Zapatillas Nike Air Max", 129.99, "42", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747656973/Zapatillas_Nike_Air_Max_nxhk7b.jpg", "AVAILABLE", null, zapatillas, null, null, alice);
            createProduct("Adidas Ultraboost", "Zapatillas Adidas Ultraboost", 159.99, "43", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657171/Zapatillas_Adidas_Ultraboost_vggzrq.jpg", "AVAILABLE", null, zapatillas, null, null, bob);
            createProduct("New Balance 574", "Zapatillas New Balance", 99.99, "41", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657225/New_Balance_574_mx22dq.jpg", "AVAILABLE", null, zapatillas, null, null, carla);
            createProduct("Puma RS-X", "Zapatillas Puma RS-X", 89.99, "44", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657267/Puma_RS-X_ryhumr.jpg", "AVAILABLE", null, zapatillas, null, null, daniel);
            createProduct("Converse Chuck", "Converse Chuck Taylor", 69.99, "42", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657530/Converse_Chuck_w6yrmg.jpg", "AVAILABLE", null, zapatillas, null, null, eva);
            createProduct("Vestido Floral", "Vestido floral verano", 59.99, "S", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657724/Vestido_Floral_bvda0j.jpg", "AVAILABLE", null, vestidos, null, null, fran);
            createProduct("Vestido Negro", "Vestido negro básico", 49.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657816/Vestido_negro_b%C3%A1sico_g9xvln.jpg", "AVAILABLE", null, vestidos, null, null, gema);
            createProduct("Vestido Estampado", "Vestido estampado", 69.99, "M", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657901/Vestido_Estampado_ic7pja.jpg", "AVAILABLE", null, vestidos, null, null, juan);
            createProduct("Gafas de Sol", "Gafas de sol Ray-Ban", 129.99, "U", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657943/Gafas_de_sol_Ray-Ban_il7ru3.jpg", "AVAILABLE", null, accesorios, null, null, alice);
            createProduct("Reloj Casio", "Reloj Casio digital", 89.99, "U", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747657989/Reloj_Casio_digital_rmmoan.jpg", "AVAILABLE", null, accesorios, null, null, bob);
            createProduct("Gorra", "Gorra New Era", 24.99, "U", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747658060/Gorra_New_Era_dbuua1.jpg", "AVAILABLE", null, accesorios, null, null, daniel);
            createProduct("Bolso Tote", "Bolso tote grande", 79.99, "U", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747658119/Bolso_tote_grande_vnw1y6.jpg", "AVAILABLE", null, bolsos, null, null, fran);
            createProduct("Bolso Crossbody", "Bolso crossbody", 54.99, "U", "https://res.cloudinary.com/dhzmaksfd/image/upload/v1747658154/Bolso_crossbody_bpknvj.jpg", "AVAILABLE", null, bolsos, null, null, juan);
        }
    }

    private User createUser(String name, String username, String password, String email, String phone, Rol role) {
        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(role);
        user.setActive(true);
        user.setRegistrationDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        return userRepository.save(user);
    }

    private Address createAddress(User user, String city, String country, String number, String postalCode, String street) {
        Address address = new Address();        
        address.setCity(city);
        address.setCountry(country);
        address.setNumber(number);
        address.setPostalCode(postalCode);
        address.setStreet(street);
        address.setUser(user);
        return addressRepository.save(address);
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        return categoryRepository.save(category);
    }

    private Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setCartDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    private Invoice createInvoice(User user, Address address, double totalAmount) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        invoice.setTotalAmount(totalAmount);
        invoice.setUser(user);
        invoice.setAddress(address);
        return invoiceRepository.save(invoice);
    }

    private Exchange createExchange(User owner, User requester, String status, List<Product> products) {
        Exchange exchange = new Exchange();
        exchange.setExchangeDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        exchange.setStatus(status);
        exchange.setOwner(owner);
        exchange.setRequester(requester);
        if (status.equals("COMPLETED")) {
            exchange.setCompletionDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        }
        
        // Save the exchange first so it has an ID
        Exchange savedExchange = exchangeRepository.save(exchange);
        
        // Now assign products to exchange
        if (products != null && !products.isEmpty()) {
            savedExchange.setProducts(new ArrayList<>(products));
            
            // Update the bidirectional relationship
            for (Product product : products) {
                if (product.getExchanges() == null) {
                    product.setExchanges(new ArrayList<>());
                }
                product.getExchanges().add(savedExchange);
                productRepository.save(product);
            }
            
            // Save the exchange with the products
            savedExchange = exchangeRepository.save(savedExchange);
        }
        
        return savedExchange;
    }

    private Product createProduct(String name, String description, double price, String size, 
            String image, String status, Cart cart, Category category, Exchange exchange, 
            Invoice invoice, User user) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setSize(size);
        product.setImage(image);
        product.setStatus(status);
        product.setPublicationDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        product.setCart(cart);
        product.setCategory(category);
        product.setInvoice(invoice);
        product.setUser(user);
        product.setExchanges(new ArrayList<>());
        
        return productRepository.save(product);
    }
}
