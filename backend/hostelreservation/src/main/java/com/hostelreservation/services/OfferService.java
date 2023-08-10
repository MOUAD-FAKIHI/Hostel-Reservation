package com.hostelreservation.services;

import com.hostelreservation.shared.dto.OfferDto;

import java.util.List;

public interface OfferService {

    OfferDto addOffer(String userId,OfferDto offerDto);
    List<OfferDto> getOffersByUserId(String userId);

    List<OfferDto> getAllOffers();
    List<OfferDto> getAllOffersWithUsers();

    OfferDto affectOfferToClient(String offerId, String userId);

    List<OfferDto> getAllOffersWithUsersByUserId(String userId);
}
