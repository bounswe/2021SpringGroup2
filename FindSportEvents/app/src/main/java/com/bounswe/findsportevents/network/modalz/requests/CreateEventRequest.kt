package com.bounswe.findsportevents.network.modalz.requests

data class CreateEventRequest(
    val title: String,
    val content: String?,
    val sport: String,
    val location: String?,
    val latitude: Float,
    val longitude: Float,
    val duration: Long,
    val min_skill_level: Int,
    val max_skill_level: Int,
    val min_age: Int,
    val max_age: Int,
    val player_capacity: Int,
    val spec_capacity: Int,
    val owner: Int,
    val date: String
)
