package com.hostelreservation.services;

import com.hostelreservation.shared.dto.OfferDto;

public interface OfferService {

    OfferDto addOffer(String userId,OfferDto offerDto);
}
