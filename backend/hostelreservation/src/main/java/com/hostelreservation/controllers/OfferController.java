package com.hostelreservation.controllers;

import com.hostelreservation.requests.OfferRequest;
import com.hostelreservation.responses.OfferResponse;
import com.hostelreservation.services.OfferService;
import com.hostelreservation.shared.dto.OfferDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
