package com.indoorfarming.service;

import com.indoorfarming.dto.DashboardSalesDto;
import com.indoorfarming.dto.DashboardStatsDto;
import com.indoorfarming.entity.ListingStatus;
import com.indoorfarming.entity.OrderStatus;
import com.indoorfarming.entity.Role;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.MarketplaceCropRepository;
import com.indoorfarming.repository.OrderItemRepository;
import com.indoorfarming.repository.OrderRepository;
import com.indoorfarming.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final MarketplaceCropRepository cropRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public DashboardStatsDto getUserStats(User user) {
        DashboardStatsDto stats = new DashboardStatsDto();

        if (user.getRole() == Role.SUBSCRIBED_VENDOR) {
            int totalProducts = productRepository.findByVendor(user).size();
            int activeCrops = cropRepository.findByFarmerAndStatus(user, ListingStatus.ACTIVE).size();
            stats.setTotalProductsCount(totalProducts);
            stats.setActiveCropsCount(activeCrops);
        }
        else if (user.getRole() == Role.SUBSCRIBED_USER ||
            user.getRole() == Role.REGISTERED_USER) {
            int activeCrops = cropRepository.findByFarmerAndStatus(user, ListingStatus.ACTIVE).size();
            stats.setActiveCropsCount(activeCrops);
            stats.setTotalProductsCount(0);
        }
        else if (user.getRole() == Role.VENDOR) {
            int totalProducts = productRepository.findByVendor(user).size();
            stats.setActiveCropsCount(0);
            stats.setTotalProductsCount(totalProducts);
        }
        else {
            stats.setActiveCropsCount(0);
            stats.setTotalProductsCount(0);
        }

        return stats;
    }

    @Override
    public List<DashboardSalesDto> getUserSalesLast30Days(User user) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        List<com.indoorfarming.entity.OrderItem> items = orderItemRepository
                .findSalesByVendorAndDateAfter(user, thirtyDaysAgo, OrderStatus.PAID);

        Map<LocalDate, Double> amountByDate = new java.util.HashMap<>();
        Map<LocalDate, Integer> quantityByDate = new java.util.HashMap<>();

        for (com.indoorfarming.entity.OrderItem item : items) {
            LocalDate date = item.getOrder().getOrderDate().toLocalDate();
            amountByDate.merge(date, item.getTotalPrice(), Double::sum);
            quantityByDate.merge(date, item.getQuantity(), (a, b) -> a + b);
        }

        List<DashboardSalesDto> salesData = new ArrayList<>();
        for (LocalDate date : amountByDate.keySet()) {
            DashboardSalesDto dto = new DashboardSalesDto();
            dto.setDate(date);
            dto.setTotalAmount(amountByDate.get(date));
            dto.setTotalQuantity(quantityByDate.get(date));
            salesData.add(dto);
        }

        salesData.sort((a, b) -> a.getDate().compareTo(b.getDate()));
        
        return salesData;
    }
}
