package com.hostelreservation.repositories;

import com.hostelreservation.entities.OfferEntity;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfferRepository extends PagingAndSortingRepository<OfferEntity,Long> {

}
