package Hewwwe.services;

import Hewwwe.entity.Cart;

import java.util.List;

public interface CartService {
    void checkoutCart(Long cartId, Object addressData);
    Cart findById(Long id);
    List<Cart> findAll();
    Cart save(Cart cart);
    Cart update(Long id, Cart cart);
    void delete(Long id);
    void deleteCart(Long cartId);
    void addProduct(Long cartId, Long productId);
    void removeProduct(Long cartId, Long productId);
    void clearCart(Long cartId);
    Double calculateTotal(Long cartId);
}
