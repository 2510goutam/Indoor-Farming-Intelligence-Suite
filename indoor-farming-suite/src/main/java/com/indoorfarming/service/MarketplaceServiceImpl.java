package com.indoorfarming.service;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.*;
import com.indoorfarming.repository.*;
import com.indoorfarming.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketplaceServiceImpl implements MarketplaceService {

    private final MarketplaceCropRepository marketplaceCropRepository;
    private final ProductRepository productRepository;
    private final ModelMapper mapper;

    @Override
    public MarketplaceCropResponseDto listCropForSale(MarketplaceCropRequestDto dto, User farmer) {
        
        if (farmer.getRole() != Role.SUBSCRIBED_USER && 
            farmer.getRole() != Role.SUBSCRIBED_VENDOR) {
            throw new RuntimeException("Only farmers and subscribed users can list crops for sale");
        }

        MarketplaceCrop crop = mapper.map(dto, MarketplaceCrop.class);
        crop.setFarmer(farmer);
        MarketplaceCrop saved = marketplaceCropRepository.save(crop);
        return toMarketplaceCropResponse(saved);
    }

    @Override
    public MarketplaceCropResponseDto updateCropListing(Long cropId, 
                                                        MarketplaceCropRequestDto dto, 
                                                        User farmer) {
        
        MarketplaceCrop crop = marketplaceCropRepository
                .findByIdAndFarmer(cropId, farmer)
                .orElseThrow(() -> new RuntimeException("Crop listing not found or unauthorized"));

        crop.setCropName(dto.getCropName());
        crop.setDescription(dto.getDescription());
        crop.setPricePerKg(dto.getPricePerKg());
        crop.setAvailableQuantityKg(dto.getAvailableQuantityKg());
        crop.setQuality(dto.getQuality());

        return toMarketplaceCropResponse(marketplaceCropRepository.save(crop));
    }

    @Override
    public void removeCropListing(Long cropId, User farmer) {
        MarketplaceCrop crop = marketplaceCropRepository
                .findByIdAndFarmer(cropId, farmer)
                .orElseThrow(() -> new RuntimeException("Unauthorized"));
        
        marketplaceCropRepository.delete(crop);
    }

    @Override
    public List<MarketplaceCropResponseDto> getFarmerListings(User farmer) {
        return marketplaceCropRepository.findByFarmerAndStatus(farmer, ListingStatus.ACTIVE)
                .stream()
                .map(this::toMarketplaceCropResponse)
                .toList();
    }

    @Override
    public List<MarketplaceCropResponseDto> getAllAvailableCrops() {
        return marketplaceCropRepository.findByStatus(ListingStatus.ACTIVE)
                .stream()
                .map(this::toMarketplaceCropResponse)
                .toList();
    }

    @Override
    public List<ProductResponseDto> getAllVendorProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @Override
    public List<MarketplaceCropResponseDto> searchCrops(String cropName) {
        return marketplaceCropRepository.findByCropNameContainingIgnoreCaseAndStatus(
                cropName, ListingStatus.ACTIVE)
                .stream()
                .map(this::toMarketplaceCropResponse)
                .toList();
    }

    @Override
    public List<ProductResponseDto> searchProductsByCategory(String category) {
        return productRepository.findByCategory(ProductCategory.valueOf(category.toUpperCase()))
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @Override
    public List<ProductResponseDto> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @Override
    public void adminRemoveCropListing(Long cropId, User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized: Admin access required");
        }
        MarketplaceCrop crop = marketplaceCropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop listing not found"));
        
        marketplaceCropRepository.delete(crop);
    }

    @Override
    public List<MarketplaceCropResponseDto> getAllCropsForAdmin(User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized: Admin access required");
        }
        return marketplaceCropRepository.findAll()
                .stream()
                .map(this::toMarketplaceCropResponse)
                .toList();
    }

    private MarketplaceCropResponseDto toMarketplaceCropResponse(MarketplaceCrop crop) {
        MarketplaceCropResponseDto dto = mapper.map(crop, MarketplaceCropResponseDto.class);
        dto.setFarmerName(crop.getFarmer().getName());
        return dto;
    }
 
    private ProductResponseDto toProductResponse(Product product) {
        ProductResponseDto dto = mapper.map(product, ProductResponseDto.class);
        dto.setProductId(product.getId());
        dto.setCategory(product.getCategory().name());
        dto.setVendorName(product.getVendor().getName());
        return dto;
    }
}