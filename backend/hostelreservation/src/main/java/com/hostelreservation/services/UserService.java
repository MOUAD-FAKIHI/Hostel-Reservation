package com.hostelreservation.services;

import com.hostelreservation.shared.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;


public interface UserService extends UserDetailsService {
    UserDto addUser(UserDto userDto);
    List<UserDto> getAllUsers();
    UserDto getUser(String email);
    UserDto getUserByEmailAndPassword(String email, String password);
    void deleteUser(String userId);
}
