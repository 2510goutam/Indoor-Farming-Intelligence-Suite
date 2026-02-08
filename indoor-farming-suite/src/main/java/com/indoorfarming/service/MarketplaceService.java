package com.indoorfarming.service;

import com.indoorfarming.dto.MarketplaceCropRequestDto;
import com.indoorfarming.dto.MarketplaceCropResponseDto;
import com.indoorfarming.dto.ProductResponseDto;
import com.indoorfarming.entity.User;
import java.util.List;

public interface MarketplaceService {
    MarketplaceCropResponseDto listCropForSale(MarketplaceCropRequestDto dto, User farmer);
    MarketplaceCropResponseDto updateCropListing(Long cropId, MarketplaceCropRequestDto dto, User farmer);
    void removeCropListing(Long cropId, User farmer);
    List<MarketplaceCropResponseDto> getFarmerListings(User farmer);
    List<MarketplaceCropResponseDto> getAllAvailableCrops();
    List<ProductResponseDto> getAllVendorProducts();
    List<MarketplaceCropResponseDto> searchCrops(String cropName);
    List<ProductResponseDto> searchProductsByCategory(String category);
    List<ProductResponseDto> searchProductsByName(String name);
    void adminRemoveCropListing(Long cropId, User admin);
    List<MarketplaceCropResponseDto> getAllCropsForAdmin(User admin);
}