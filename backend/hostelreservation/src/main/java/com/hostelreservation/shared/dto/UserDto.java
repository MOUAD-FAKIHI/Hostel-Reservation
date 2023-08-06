package com.hostelreservation.shared.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class UserDto implements Serializable {
    @JsonIgnore
    private long id;
    private String userId;
    private String email;
    @JsonIgnore
    private String password;
    @JsonIgnore
    private String encryptedPassword;
    private String name;
    private String role;
    private List<OfferDto> offers;
}
