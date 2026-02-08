package com.indoorfarming.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marketplace_crops")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketplaceCrop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    private String cropName;
    private String description;
    
    private double pricePerKg;
    private double availableQuantityKg;
    
    private String quality; 
    private String harvestDate;
    
    @Enumerated(EnumType.STRING)
    private ListingStatus status;  
    
    private LocalDateTime listedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        listedAt = LocalDateTime.now();
        status = ListingStatus.ACTIVE;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

