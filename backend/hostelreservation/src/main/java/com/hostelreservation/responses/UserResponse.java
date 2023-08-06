package com.hostelreservation.responses;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserResponse {
    private String userId;
    private String email;
    private String name;
    private String role;
    private List<OfferResponse> offers;
}
