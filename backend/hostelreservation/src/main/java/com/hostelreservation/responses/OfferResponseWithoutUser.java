package com.hostelreservation.responses;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public class OfferResponseWithoutUser extends OfferResponse{
    @Override
    @JsonIgnore
    public List<UserResponse> getUsers() {
        return super.getUsers();
    }
}
