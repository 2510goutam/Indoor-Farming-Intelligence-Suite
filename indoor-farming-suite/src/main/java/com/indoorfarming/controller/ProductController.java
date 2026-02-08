package com.indoorfarming.controller;

import com.indoorfarming.dto.ProductRequestDto;
import com.indoorfarming.dto.ProductResponseDto;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/vendor")
    public ProductResponseDto create(@RequestBody ProductRequestDto dto,
                                     @AuthenticationPrincipal User user) {
        return productService.create(dto, user);
    }

    @PutMapping("/vendor/{id}")
    public ProductResponseDto update(@PathVariable Long id,
                                     @RequestBody ProductRequestDto dto,
                                     @AuthenticationPrincipal User user) {
        return productService.update(id, dto, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       @AuthenticationPrincipal User user) {
        productService.delete(id, user);
    }

    @GetMapping("/vendor")
    public List<ProductResponseDto> vendorProducts(
            @AuthenticationPrincipal User user) {
        return productService.getVendorProducts(user);
    }

    @GetMapping
    public List<ProductResponseDto> allProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductResponseDto getById(@PathVariable Long id) {
        return productService.getById(id);
    }
}
