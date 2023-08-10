package com.hostelreservation.repositories;

import com.hostelreservation.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);
    UserEntity findByUserId(String userId);

    @Query("SELECT u FROM UserEntity u JOIN u.offers p WHERE p.offerId = :offerId AND u.role = :role")
    UserEntity findByOfferIdAndRole(@Param("offerId") String pfeId, @Param("role") String role);

}
