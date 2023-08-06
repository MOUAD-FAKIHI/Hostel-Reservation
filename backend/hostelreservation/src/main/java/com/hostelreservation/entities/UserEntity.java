package com.hostelreservation.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
public class UserEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false , unique = true , length = 40)
    private String userId;
    private String email;
    private String name;
    private String hashPassword;
    private String role;

    @ManyToMany(fetch = FetchType.EAGER , cascade = CascadeType.ALL)
    @JoinTable(name="offer_users" , joinColumns = @JoinColumn(name="userId") ,
            inverseJoinColumns = @JoinColumn(name="offerId"))
    private List<OfferEntity> offers;

}
