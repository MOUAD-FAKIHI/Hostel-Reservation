package com.hostelreservation.services.impl;

import com.hostelreservation.entities.OfferEntity;
import com.hostelreservation.entities.UserEntity;
import com.hostelreservation.repositories.OfferRepository;
import com.hostelreservation.repositories.UserRepository;
import com.hostelreservation.services.OfferService;
import com.hostelreservation.shared.Utils;
import com.hostelreservation.shared.dto.OfferDto;
import com.hostelreservation.shared.dto.UserDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OfferServiceImpl implements OfferService {

    @Autowired
    OfferRepository offerRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    Utils utils;


    @Override
    public OfferDto addOffer(String userId, OfferDto offer) {

        UserEntity user = userRepository.findByUserId(userId);

        OfferEntity offerEntity = new OfferEntity();
        BeanUtils.copyProperties(offer,offerEntity);

        List<UserEntity> users = new ArrayList<>();
        users.add(user);
        offerEntity.setUsers(users);
        offerEntity.setOfferId(utils.generateStringId(32));
        offerEntity.setIsDisponible(true);

        OfferEntity newOffer = offerRepository.save(offerEntity);

        OfferDto offerDto = new OfferDto();
        BeanUtils.copyProperties(newOffer,offerDto);


        return offerDto;
    }
}
