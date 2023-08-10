package com.hostelreservation.controllers;

import com.hostelreservation.requests.OfferRequest;
import com.hostelreservation.responses.OfferResponse;
import com.hostelreservation.responses.OfferResponseWithoutUser;
import com.hostelreservation.responses.UserResponseWithoutOffer;
import com.hostelreservation.services.OfferService;
import com.hostelreservation.shared.dto.OfferDto;
import com.hostelreservation.shared.dto.UserDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/offer")
public class OfferController {

    @Autowired
    OfferService offerService;

    @PostMapping("/{userId}")
    public ResponseEntity<OfferResponse> addOffer(@PathVariable String userId, @RequestBody OfferRequest offerRequest){

        OfferDto offerDto = new OfferDto();
        BeanUtils.copyProperties(offerRequest, offerDto);

        OfferDto addedOffer = offerService.addOffer(userId, offerDto);

        OfferResponse offerResponse = new OfferResponse();
        BeanUtils.copyProperties(addedOffer,offerResponse);

        return new ResponseEntity<OfferResponse>(offerResponse, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<OfferResponseWithoutUser>> getAllOffers(){

        List<OfferResponseWithoutUser> offerResponses = new ArrayList<>();
        List<OfferDto> offers = offerService.getAllOffers();

        for(OfferDto offerDto: offers){
            OfferResponseWithoutUser offerResponse = new OfferResponseWithoutUser();

            BeanUtils.copyProperties(offerDto,offerResponse);

            offerResponses.add(offerResponse);
        }

        return new ResponseEntity<List<OfferResponseWithoutUser>>(offerResponses, HttpStatus.OK);
    }

    @GetMapping("/withUsers")
    public ResponseEntity<List<OfferResponseWithoutUser>> getAllOffersWithUsers(){

        List<OfferResponseWithoutUser> offerResponses = new ArrayList<>();
        List<OfferDto> offers = offerService.getAllOffersWithUsers();

        for(OfferDto offerDto: offers){
            OfferResponseWithoutUser offerResponse = new OfferResponseWithoutUser();

            BeanUtils.copyProperties(offerDto,offerResponse);

            // Manually map the UserDto list to UserResponseWithoutUser list
            List<UserResponseWithoutOffer> userResponses = new ArrayList<>();
            for (UserDto userDto : offerDto.getUsers()) {
                UserResponseWithoutOffer userResponse = new UserResponseWithoutOffer();
                BeanUtils.copyProperties(userDto, userResponse);
                userResponses.add(userResponse);
            }
            offerResponse.setUsers(userResponses);

            offerResponses.add(offerResponse);
        }

        return new ResponseEntity<List<OfferResponseWithoutUser>>(offerResponses, HttpStatus.OK);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<List<OfferResponseWithoutUser>> getOffersByUserId(@PathVariable String userId){

        List<OfferResponseWithoutUser> offerResponses = new ArrayList<>();
        List<OfferDto> offers = offerService.getOffersByUserId(userId);

        for(OfferDto offerDto: offers){
            OfferResponseWithoutUser offerResponse = new OfferResponseWithoutUser();

            BeanUtils.copyProperties(offerDto,offerResponse);

            offerResponses.add(offerResponse);
        }

        return new ResponseEntity<List<OfferResponseWithoutUser>>(offerResponses, HttpStatus.OK);
    }

    @GetMapping("/withUsers/{userId}")
    public ResponseEntity<List<OfferResponseWithoutUser>> getAllOffersWithUsersByUserId(@PathVariable String userId){

        List<OfferResponseWithoutUser> offerResponses = new ArrayList<>();
        List<OfferDto> offers = offerService.getAllOffersWithUsersByUserId(userId);

        for(OfferDto offerDto: offers){
            OfferResponseWithoutUser offerResponse = new OfferResponseWithoutUser();

            BeanUtils.copyProperties(offerDto,offerResponse);

            // Manually map the UserDto list to UserResponseWithoutUser list
            List<UserResponseWithoutOffer> userResponses = new ArrayList<>();
            for (UserDto userDto : offerDto.getUsers()) {
                UserResponseWithoutOffer userResponse = new UserResponseWithoutOffer();
                BeanUtils.copyProperties(userDto, userResponse);
                userResponses.add(userResponse);
            }
            offerResponse.setUsers(userResponses);

            offerResponses.add(offerResponse);
        }

        return new ResponseEntity<List<OfferResponseWithoutUser>>(offerResponses, HttpStatus.OK);
    }

    @PutMapping("/affect/{offerId}/{userId}")
    public ResponseEntity<OfferResponse> affectOfferToClient(@PathVariable String offerId,@PathVariable String userId){

        OfferDto affectedOffer = offerService.affectOfferToClient(offerId,userId);

        OfferResponse offerResponse = new OfferResponse();
        BeanUtils.copyProperties(affectedOffer,offerResponse);


        return new ResponseEntity<OfferResponse>(offerResponse,HttpStatus.ACCEPTED);
    }
}
