package com.hostelreservation.responses;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public class UserResponseWithoutOffer extends UserResponse{
    @Override
    @JsonIgnore
    public List<OfferResponse> getOffers() {
        return super.getOffers();
    }
}
