package com.indoorfarming.service;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.*;
import com.indoorfarming.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final MarketplaceCropRepository marketplaceCropRepository;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public CartResponseDto addToCart(AddToCartDto dto, User user) {
        
        Cart cart = cartRepository.findByUserAndIsActiveTrue(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setQuantity(dto.getQuantity());

        if ("PRODUCT".equalsIgnoreCase(dto.getItemType()) && dto.getProductId() != null) {
            
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStockQuantity() < dto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            cartItem.setProduct(product);
            cartItem.setItemType(ItemType.PRODUCT);
            cartItem.setPricePerUnit(product.getPrice());
            
        } else if ("CROP".equalsIgnoreCase(dto.getItemType()) && dto.getMarketplaceCropId() != null) {
            
            MarketplaceCrop crop = marketplaceCropRepository.findById(dto.getMarketplaceCropId())
                    .orElseThrow(() -> new RuntimeException("Crop not found"));

            if (crop.getStatus() != ListingStatus.ACTIVE) {
                throw new RuntimeException("Crop is not available");
            }

            if (crop.getAvailableQuantityKg() < dto.getQuantity()) {
                throw new RuntimeException("Insufficient quantity for crop: " + crop.getCropName());
            }

            cartItem.setMarketplaceCrop(crop);
            cartItem.setItemType(ItemType.CROP);
            cartItem.setPricePerUnit(crop.getPricePerKg());
            
        } else {
            throw new RuntimeException("Invalid item type or missing item ID");
        }

        cartItemRepository.save(cartItem);
        
        return getCart(user);
    }

    @Override
    public CartResponseDto getCart(User user) {
        
        Cart cart = cartRepository.findByUserAndIsActiveTrue(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        CartResponseDto response = new CartResponseDto();
        response.setCartId(cart.getId());

        List<CartItemResponseDto> itemDtos = new ArrayList<>();
        double totalAmount = 0;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {
            CartItemResponseDto itemDto = mapper.map(item, CartItemResponseDto.class);
            itemDto.setCartItemId(item.getId());
            itemDto.setPricePerUnit(item.getPricePerUnit());
            itemDto.setTotalPrice(item.getPricePerUnit() * item.getQuantity());

            if (item.getItemType() == ItemType.PRODUCT && item.getProduct() != null) {
                itemDto.setItemType("PRODUCT");
                itemDto.setItemName(item.getProduct().getName());
            } else if (item.getItemType() == ItemType.CROP && item.getMarketplaceCrop() != null) {
                itemDto.setItemType("CROP");
                itemDto.setItemName(item.getMarketplaceCrop().getCropName());
            }

            itemDtos.add(itemDto);
            totalAmount += itemDto.getTotalPrice();
            totalItems += item.getQuantity();
        }

        response.setItems(itemDtos);
        response.setTotalAmount(totalAmount);
        response.setTotalItems(totalItems);

        return response;
    }

    @Override
    @Transactional
    public CartResponseDto updateCartItemQuantity(Long cartItemId, int quantity, User user) {
        
        Cart cart = cartRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (cartItem.getItemType() == ItemType.PRODUCT && cartItem.getProduct() != null) {
            if (cartItem.getProduct().getStockQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock");
            }
        } else if (cartItem.getItemType() == ItemType.CROP && cartItem.getMarketplaceCrop() != null) {
            if (cartItem.getMarketplaceCrop().getAvailableQuantityKg() < quantity) {
                throw new RuntimeException("Insufficient quantity");
            }
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return getCart(user);
    }

    @Override
    @Transactional
    public void removeCartItem(Long cartItemId, User user) {
        
        Cart cart = cartRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(User user) {
        
        Cart cart = cartRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
