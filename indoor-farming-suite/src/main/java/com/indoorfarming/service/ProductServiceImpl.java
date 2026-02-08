package com.indoorfarming.service;

import com.indoorfarming.dto.ProductRequestDto;
import com.indoorfarming.dto.ProductResponseDto;
import com.indoorfarming.entity.Product;
import com.indoorfarming.entity.ProductCategory;
import com.indoorfarming.entity.Role;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper mapper;

    @Override
    public ProductResponseDto create(ProductRequestDto dto, User vendor) {

        if (vendor.getRole() != Role.VENDOR && vendor.getRole() != Role.SUBSCRIBED_VENDOR) {
            throw new RuntimeException("Only vendors can create products");
        }


        Product product = mapper.map(dto, Product.class);
        product.setCategory(ProductCategory.valueOf(dto.getCategory().toUpperCase()));
        product.setVendor(vendor);

        return toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponseDto update(Long productId,
                                     ProductRequestDto dto,
                                     User vendor) {

        Product product = productRepository
                .findByIdAndVendor(productId, vendor)
                .orElseThrow(() -> new RuntimeException("Unauthorized or product not found"));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(
        	    ProductCategory.valueOf(dto.getCategory().toUpperCase())
        	);

        return toResponse(productRepository.save(product));
    }

    @Override
    public void delete(Long productId, User currentUser) {

        if (currentUser.getRole() == Role.ADMIN) {
            productRepository.deleteById(productId);
            return;
        }

        Product product = productRepository
                .findByIdAndVendor(productId, currentUser)
                .orElseThrow(() -> new RuntimeException("Unauthorized delete"));

        productRepository.delete(product);
    }

    @Override
    public List<ProductResponseDto> getVendorProducts(User vendor) {
        return productRepository.findByVendor(vendor)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ProductResponseDto getById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return toResponse(product);
    }

    private ProductResponseDto toResponse(Product product) {
        ProductResponseDto resp = mapper.map(product, ProductResponseDto.class);
        resp.setCategory(product.getCategory().name());
        resp.setVendorName(product.getVendor().getName());
        resp.setProductId(product.getId());
        return resp;
    }
}
