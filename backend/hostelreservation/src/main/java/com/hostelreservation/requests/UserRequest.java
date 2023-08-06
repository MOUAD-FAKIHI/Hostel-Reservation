package com.hostelreservation.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {

    private String email;
    private String password;
    private String name;

    private String role;

}
