package com.hostelreservation.controllers;

import com.hostelreservation.entities.UserEntity;
import com.hostelreservation.requests.UserRequest;
import com.hostelreservation.responses.UserResponse;
import com.hostelreservation.services.UserService;
import com.hostelreservation.shared.dto.UserDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> addUser(@RequestBody UserRequest userRequest){

        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(userRequest , userDto);

        UserDto addedUser = userService.addUser(userDto);

        UserResponse userResponse = new UserResponse();
        BeanUtils.copyProperties(addedUser,userResponse);

        return new ResponseEntity<UserResponse>(userResponse, HttpStatus.CREATED);    }

    @GetMapping("/allUsers")
    public ResponseEntity<List<UserResponse>> getAllUsers(){

        List<UserResponse> userResponses = new ArrayList<>();
        List<UserDto> users = userService.getAllUsers();

        for(UserDto userDto : users){
            UserResponse userResponse = new UserResponse();
            BeanUtils.copyProperties(userDto,userResponse);
            userResponses.add(userResponse);
        }

        return new ResponseEntity<List<UserResponse>>(userResponses, HttpStatus.OK);
    }


    @PutMapping
    public String updateUser() {
        return "update user works!";
    }

    @DeleteMapping(path="/{userId}")
    public ResponseEntity<Object> deleteUser(@PathVariable String userId){
        userService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
