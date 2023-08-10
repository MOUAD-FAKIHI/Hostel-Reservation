package com.hostelreservation.shared.dto;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class OfferDto implements Serializable {

    private Long id;
    private String offerId;
    private String city;
    private String adress;
    private String description;
    private Boolean isDisponible;
    private UserDto user;
    private List<UserDto> users;
}
