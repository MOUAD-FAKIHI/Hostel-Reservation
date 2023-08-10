package com.hostelreservation.services.impl;

import com.hostelreservation.entities.OfferEntity;
import com.hostelreservation.entities.UserEntity;
import com.hostelreservation.repositories.ConfirmationTokenRepository;
import com.hostelreservation.repositories.OfferRepository;
import com.hostelreservation.repositories.UserRepository;
import com.hostelreservation.services.UserService;
import com.hostelreservation.shared.Utils;
import com.hostelreservation.shared.dto.OfferDto;
import com.hostelreservation.shared.dto.UserDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    OfferRepository offerRepository;
    @Autowired
    ConfirmationTokenRepository confirmationTokenRepository;
    @Autowired
    Utils utils;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDto getUserByEmailAndPassword(String email, String password) {
        UserEntity userEntity = userRepository.findByEmail(email);

        if(userEntity == null) return null;

        // Check if the entered password matches the password in the database
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        if(!bCryptPasswordEncoder.matches(password, userEntity.getHashPassword())) {
            return null;
        }

        UserDto userDto = new UserDto();

        BeanUtils.copyProperties(userEntity, userDto);

        return userDto;

    }

    @Override
    public UserDto getUser(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);

        if(userEntity == null) throw new UsernameNotFoundException(email);

        UserDto userDto = new UserDto();

        BeanUtils.copyProperties(userEntity, userDto);

        return userDto;

    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserEntity userEntity = userRepository.findByEmail(email);

        if(userEntity == null) throw new UsernameNotFoundException(email);

        return new User(userEntity.getEmail() , userEntity.getHashPassword() , new ArrayList<>());
    }

    @Override
    public UserDto addUser(UserDto user) {

        UserEntity checkUser = userRepository.findByEmail(user.getEmail());
        if(checkUser != null) throw new RuntimeException("L'utilisateur existe déjà.");

        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(user,userEntity);

        user.setOffers(null);
        userEntity.setUserId(utils.generateStringId(32));
        userEntity.setHashPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        UserEntity newUser = userRepository.save(userEntity);

        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(newUser,userDto);

        return userDto;
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<UserDto> userDtoList = new ArrayList<>();
        List<UserEntity> userEntityList =new ArrayList<>();
        userRepository.findAll().forEach(userEntityList::add);


        for(UserEntity userEntity: userEntityList){
            UserDto userDto = new UserDto();
            BeanUtils.copyProperties(userEntity,userDto);

            /*userEntity.setOffers(null);
            UserDto userWithoutOffer = new UserDto();
            BeanUtils.copyProperties(userEntity,userWithoutOffer);

            List<OfferDto> offerDtoList = userDto.getOffers();
            for(int i = 0; i < offerDtoList.size(); i++){
                offerDtoList.get(i).setUsers(null);
                offerDtoList.get(i).setUser(userWithoutOffer);
            }

            userDto.setOffers(offerDtoList);*/

            userDtoList.add(userDto);
        }

        return userDtoList;
    }

    @Override
    public void deleteUser(String userId) {
        UserEntity userEntity = userRepository.findByUserId(userId);

        if (userEntity == null) throw new UsernameNotFoundException(userId);

        userRepository.delete(userEntity);
    }

    @Override
    public void reserveDemandeOffer(String userId, String offerId) {
        UserEntity userEntity = userRepository.findByUserId(userId);
        if(userEntity == null) throw new UsernameNotFoundException(userId);

        OfferEntity offerEntity = offerRepository.findByOfferId(offerId);
        if (offerEntity == null) throw new UsernameNotFoundException(offerId);

        if(offerEntity.getIsDisponible()==true){
            List<OfferEntity> offerEntities = new ArrayList<>();
            offerEntities.add(offerEntity);
            userEntity.setOffers(offerEntities);
        }

        userRepository.save(userEntity);

    }
}
