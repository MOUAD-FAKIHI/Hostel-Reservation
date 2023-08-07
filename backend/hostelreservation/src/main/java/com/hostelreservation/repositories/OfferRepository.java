package com.hostelreservation.repositories;

import com.hostelreservation.entities.OfferEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends PagingAndSortingRepository<OfferEntity,Long> {

    @Query("SELECT o FROM OfferEntity o JOIN o.users u WHERE u.userId = :userId")
    List<OfferEntity> findByUserId(@Param("userId") String userId);
}
