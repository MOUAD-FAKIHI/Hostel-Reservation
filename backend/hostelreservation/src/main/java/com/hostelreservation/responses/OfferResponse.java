package com.hostelreservation.responses;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.util.List;

@Getter
@Setter
public class OfferResponse {

    private String offerId;
    private String city;
    private String adress;
    private String description;
    private Boolean isDisponible;
    private List<UserResponse> user;
    private List<UserResponseWithoutOffer> users;
}
