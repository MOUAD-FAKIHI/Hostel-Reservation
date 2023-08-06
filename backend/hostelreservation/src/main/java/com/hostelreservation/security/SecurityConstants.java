package com.hostelreservation.security;

public class SecurityConstants {
    public static final long EXPIRATION_TIME = 864000000; // 10 Days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String TOKEN_SECRET = "36el-fakihi01*@/+forhostelreservation";

    public static final String USER_URL = "/user";
    public static final String OFFER_URL = "/offer";
}
