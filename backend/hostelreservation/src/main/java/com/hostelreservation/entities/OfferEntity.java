package com.hostelreservation.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
public class OfferEntity  implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false , unique = true , length = 40)
    private String offerId;
    private String city;
    private String adress;
    @Column(nullable = false, length = 500)
    private String description;
    private Boolean isDisponible = true;

    @ManyToMany(fetch = FetchType.EAGER , cascade = CascadeType.ALL)
    @JoinTable(name="offer_users" , joinColumns = @JoinColumn(name="offerId") ,
            inverseJoinColumns = @JoinColumn(name="userId"))
    private List<UserEntity> users;


}
