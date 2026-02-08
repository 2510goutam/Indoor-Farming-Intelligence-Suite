package com.indoorfarming.controller;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final MarketplaceService marketplaceService;
 
    @PostMapping("/farmer/list-crop")
    public MarketplaceCropResponseDto listCrop(
            @RequestBody MarketplaceCropRequestDto dto,
            @AuthenticationPrincipal User farmer) {
        return marketplaceService.listCropForSale(dto, farmer);
    }

    @PutMapping("/farmer/crop/{cropId}")
    public MarketplaceCropResponseDto updateCrop(
            @PathVariable Long cropId,
            @RequestBody MarketplaceCropRequestDto dto,
            @AuthenticationPrincipal User farmer) {
        return marketplaceService.updateCropListing(cropId, dto, farmer);
    }

    @DeleteMapping("/farmer/crop/{cropId}")
    public void removeCrop(
            @PathVariable Long cropId,
            @AuthenticationPrincipal User farmer) {
        marketplaceService.removeCropListing(cropId, farmer);
    }

    @GetMapping("/farmer/my-listings")
    public List<MarketplaceCropResponseDto> myListings(
            @AuthenticationPrincipal User farmer) {
        return marketplaceService.getFarmerListings(farmer);
    }

    @GetMapping("/crops")
    public List<MarketplaceCropResponseDto> getAllCrops() {
        return marketplaceService.getAllAvailableCrops();
    }

    @GetMapping("/products")
    public List<ProductResponseDto> getAllProducts() {
        return marketplaceService.getAllVendorProducts();
    }

    @GetMapping("/crops/search")
    public List<MarketplaceCropResponseDto> searchCrops(
            @RequestParam String cropName) {
        return marketplaceService.searchCrops(cropName);
    }

    @GetMapping("/products/search")
    public List<ProductResponseDto> searchProducts(
            @RequestParam String name) {
        return marketplaceService.searchProductsByName(name);
    }

    @DeleteMapping("/admin/crop/{cropId}")
    public void adminRemoveCrop(
            @PathVariable Long cropId,
            @AuthenticationPrincipal User admin) {
        marketplaceService.adminRemoveCropListing(cropId, admin);
    }

    @GetMapping("/admin/all-crops")
    public List<MarketplaceCropResponseDto> adminGetAllCrops(
            @AuthenticationPrincipal User admin) {
        return marketplaceService.getAllCropsForAdmin(admin);
    }
}