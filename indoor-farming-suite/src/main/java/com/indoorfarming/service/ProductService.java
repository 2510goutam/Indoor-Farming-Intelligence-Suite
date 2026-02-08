package com.indoorfarming.service;

import com.indoorfarming.dto.ProductRequestDto;
import com.indoorfarming.dto.ProductResponseDto;
import com.indoorfarming.entity.User;

import java.util.List;

public interface ProductService {

    ProductResponseDto create(ProductRequestDto dto, User vendor);

    ProductResponseDto update(Long productId, ProductRequestDto dto, User vendor);

    void delete(Long productId, User currentUser);

    List<ProductResponseDto> getVendorProducts(User vendor);

    List<ProductResponseDto> getAllProducts();

    ProductResponseDto getById(Long productId);
}
