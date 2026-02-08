package com.indoorfarming.repository;

import com.indoorfarming.entity.MarketplaceCrop;
import com.indoorfarming.entity.ListingStatus;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface MarketplaceCropRepository extends JpaRepository<MarketplaceCrop, Long> {

    List<MarketplaceCrop> findByFarmer(User farmer);

    List<MarketplaceCrop> findByFarmerAndStatus(User farmer, ListingStatus status);

    Optional<MarketplaceCrop> findByIdAndFarmer(Long id, User farmer);

    List<MarketplaceCrop> findByStatus(ListingStatus status);

    List<MarketplaceCrop> findByCropNameContainingIgnoreCaseAndStatus(
            String cropName, 
            ListingStatus status
    );
}