package com.indoorfarming.service;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.*;
import com.indoorfarming.repository.OrderRepository;
import com.indoorfarming.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final com.indoorfarming.repository.MarketplaceCropRepository marketplaceCropRepository;
    private final com.indoorfarming.repository.CartRepository cartRepository;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public OrderResponseDto placeOrder(OrderRequestDto dto, User user) {
        Order order = Order.builder()
                .buyer(user)
                .orderStatus(OrderStatus.PENDING_PAYMENT)
                .orderDate(LocalDateTime.now())
                .isPaid(false)
                .items(new ArrayList<>())
                .build();

        List<OrderItem> items = new ArrayList<>();
        double totalAmount = 0;
        
        boolean hasProducts = false;
        boolean hasCrops = false;

        for (OrderItemRequestDto itemDto : dto.getItems()) {
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .quantity(itemDto.getQuantity())
                    .build();

            if ("PRODUCT".equalsIgnoreCase(itemDto.getItemType()) && itemDto.getProductId() != null) {
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                
                if (product.getStockQuantity() < itemDto.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }

                item.setProduct(product);
                item.setPricePerUnit(product.getPrice());
                item.setTotalPrice(product.getPrice() * itemDto.getQuantity());
                hasProducts = true;
                totalAmount += item.getTotalPrice();
            }
            else if ("CROP".equalsIgnoreCase(itemDto.getItemType()) && itemDto.getMarketplaceCropId() != null) {
                com.indoorfarming.entity.MarketplaceCrop crop = marketplaceCropRepository
                        .findById(itemDto.getMarketplaceCropId())
                        .orElseThrow(() -> new RuntimeException("Crop not found"));

                if (crop.getStatus() != com.indoorfarming.entity.ListingStatus.ACTIVE) {
                    throw new RuntimeException("Crop is not available for purchase");
                }

                if (crop.getAvailableQuantityKg() < itemDto.getQuantity()) {
                    throw new RuntimeException("Insufficient quantity for crop: " + crop.getCropName());
                }

                item.setMarketplaceCrop(crop);
                item.setPricePerUnit(crop.getPricePerKg());
                item.setTotalPrice(crop.getPricePerKg() * itemDto.getQuantity());
                hasCrops = true;
                totalAmount += item.getTotalPrice();
            }
            items.add(item);
        }

        if (hasProducts && hasCrops) order.setOrderType(OrderType.MIXED);
        else if (hasProducts) order.setOrderType(OrderType.VENDOR_PRODUCT);
        else order.setOrderType(OrderType.FARMER_CROP);

        order.setItems(items);
        order.setTotalAmount(totalAmount);
        return toOrderResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponseDto checkoutFromCart(User user) {
        Cart cart = cartRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Active cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = Order.builder()
                .buyer(user)
                .orderStatus(OrderStatus.PENDING_PAYMENT)
                .orderDate(LocalDateTime.now())
                .isPaid(false)
                .items(new ArrayList<>())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0;
        boolean hasProducts = false;
        boolean hasCrops = false;

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .quantity(cartItem.getQuantity())
                    .pricePerUnit(cartItem.getPricePerUnit())
                    .totalPrice(cartItem.getPricePerUnit() * cartItem.getQuantity())
                    .build();

            if (cartItem.getItemType() == ItemType.PRODUCT) {
                if (cartItem.getProduct().getStockQuantity() < cartItem.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for: " + cartItem.getProduct().getName());
                }
                orderItem.setProduct(cartItem.getProduct());
                hasProducts = true;
            } else {
                if (cartItem.getMarketplaceCrop().getAvailableQuantityKg() < cartItem.getQuantity()) {
                    throw new RuntimeException("Insufficient quantity for: " + cartItem.getMarketplaceCrop().getCropName());
                }
                orderItem.setMarketplaceCrop(cartItem.getMarketplaceCrop());
                hasCrops = true;
            }
            orderItems.add(orderItem);
            totalAmount += orderItem.getTotalPrice();
        }

        if (hasProducts && hasCrops) order.setOrderType(OrderType.MIXED);
        else if (hasProducts) order.setOrderType(OrderType.VENDOR_PRODUCT);
        else order.setOrderType(OrderType.FARMER_CROP);

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);
        return toOrderResponse(savedOrder);
    }

    @Override
    @Transactional
    public void confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.isPaid()) {
            return;
        }

        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                productRepository.save(product);
            } else if (item.getMarketplaceCrop() != null) {
                MarketplaceCrop crop = item.getMarketplaceCrop();
                crop.setAvailableQuantityKg(crop.getAvailableQuantityKg() - item.getQuantity());
                marketplaceCropRepository.save(crop);
            }
        }

        order.setPaid(true);
        order.setOrderStatus(OrderStatus.PAID);
        orderRepository.save(order);
        
        cartRepository.findByUserAndIsActiveTrue(order.getBuyer())
            .ifPresent(cart -> {
                cart.getItems().clear();
                cartRepository.save(cart);
            });
    }

    @Override
    public List<OrderResponseDto> getUserOrders(User user) {
        return orderRepository.findByBuyer(user)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    private OrderResponseDto toOrderResponse(Order order) {
        OrderResponseDto resp = mapper.map(order, OrderResponseDto.class);
        resp.setOrderId(order.getId());
        resp.setStatus(order.getOrderStatus().name());
        resp.setOrderDate(order.getOrderDate());
        resp.setItems(order.getItems().stream().map(item -> {
            OrderItemResponseDto itemDto = mapper.map(item, OrderItemResponseDto.class);
            itemDto.setPrice(item.getPricePerUnit());
            if (item.getProduct() != null) {
                itemDto.setItemType("PRODUCT");
                itemDto.setItemName(item.getProduct().getName());
            } else if (item.getMarketplaceCrop() != null) {
                itemDto.setItemType("CROP");
                itemDto.setItemName(item.getMarketplaceCrop().getCropName());
            }
            return itemDto;
        }).toList());
        return resp;
    }
}
