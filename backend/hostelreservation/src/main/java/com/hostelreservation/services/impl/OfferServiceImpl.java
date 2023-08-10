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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    @Override
    public List<OfferDto> getOffersByUserId(String userId) {
        List<OfferDto> offerDtos = new ArrayList<>();

        List<OfferEntity> offers = offerRepository.findByUserId(userId);

        for(OfferEntity offerEntity : offers){
            OfferDto offer = new OfferDto();
            BeanUtils.copyProperties(offerEntity, offer);

            UserDto userDto = new UserDto();
            BeanUtils.copyProperties(offerEntity.getUsers().get(0),userDto);

            offer.setUser(userDto);

            offerDtos.add(offer);
        }

        return offerDtos;
    }

    @Override
    public List<OfferDto> getAllOffers() {
        List<OfferDto> offerDtos = new ArrayList<>();
        List<OfferEntity> offers = new ArrayList<>();
        offerRepository.findAll().forEach(offers::add);

        for(OfferEntity offerEntity : offers){
            OfferDto offer = new OfferDto();
            BeanUtils.copyProperties(offerEntity, offer);

            offerDtos.add(offer);
        }

        return offerDtos;
    }

    @Override
    public List<OfferDto> getAllOffersWithUsers() {
        List<OfferDto> offerDtos = new ArrayList<>();
        List<OfferEntity> offers = new ArrayList<>();
        offerRepository.findAllWithUsers().forEach(offers::add);

        for(OfferEntity offerEntity : offers){
            OfferDto offer = new OfferDto();
            BeanUtils.copyProperties(offerEntity, offer);


            // Manually map the UserEntity list to UserDto list
            List<UserDto> userDtos = new ArrayList<>();
            for (UserEntity userEntity : offerEntity.getUsers()) {
                UserDto userDto = new UserDto();
                BeanUtils.copyProperties(userEntity, userDto);
                userDtos.add(userDto);
            }
            offer.setUsers(userDtos);

            offerDtos.add(offer);
        }

        return offerDtos;
    }

    @Override
    public List<OfferDto> getAllOffersWithUsersByUserId(String userId) {
        List<OfferDto> offerDtos = new ArrayList<>();
        List<OfferEntity> offers = new ArrayList<>();
        offerRepository.findAllWithUsersByUserId(userId).forEach(offers::add);

        for(OfferEntity offerEntity : offers){
            OfferDto offer = new OfferDto();
            BeanUtils.copyProperties(offerEntity, offer);


            // Manually map the UserEntity list to UserDto list
            List<UserDto> userDtos = new ArrayList<>();
            for (UserEntity userEntity : offerEntity.getUsers()) {
                UserDto userDto = new UserDto();
                BeanUtils.copyProperties(userEntity, userDto);
                userDtos.add(userDto);
            }
            offer.setUsers(userDtos);

            offerDtos.add(offer);
        }

        return offerDtos;
    }

    @Override
    public OfferDto affectOfferToClient(String offerId, String userId) {

        OfferEntity offerEntity = offerRepository.findByOfferId(offerId);
        if(offerEntity == null) throw new UsernameNotFoundException(offerId);

        UserEntity offerOwner = userRepository.findByOfferIdAndRole(offerId,"PROVIDER");
        if(offerOwner == null) throw new UsernameNotFoundException(offerId);


        offerEntity.setUsers(null);

        offerEntity.setUsers(new ArrayList<>());
        offerEntity.getUsers().add(offerOwner);

        UserEntity userEntity = userRepository.findByUserId(userId);
        if(!userEntity.getRole().equals("CLIENT")) throw new RuntimeException("Autorisé seulement pour les utilisateurs Client.");
        offerEntity.getUsers().add(userEntity);

        offerEntity.setIsDisponible(false);

        OfferEntity affectedOffer = offerRepository.save(offerEntity);

        OfferDto offerDto = new OfferDto();
        BeanUtils.copyProperties(affectedOffer,offerDto);

        return offerDto;
    }



}
