package com.bounswe.findsportevents.network.modalz.responses

data class UserResponse(
    val id: Long,
    val first_name: String?,
    val last_name: String?,
    val bio: String?,
    val fav_sport_1: String?,
    val fav_sport_2: String?,
    val fav_sport_3: String?,
    val location: String?,
    val badges: List<String>
)
