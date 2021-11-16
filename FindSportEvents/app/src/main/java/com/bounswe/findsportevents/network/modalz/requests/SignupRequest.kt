package com.bounswe.findsportevents.network.modalz.requests

data class SignupRequest(
    val username: String,
    val email: String,
    val password: String,
    val first_name: String?,
    val last_name: String?,
    val bio: String?,
    val fav_sport1: String?,
    val location: String?
)