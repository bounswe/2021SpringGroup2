package com.bounswe.findsportevents.network.modalz.responses

import java.util.*

data class EventResponse (
    val id: Int,
    val content: String,
    val title : String,
    val creation_date : Date,
    val location: String,
    val date : Date,
    val duration: Int,
    val sport : String,
    val min_age : Int,
    val max_age : Int,
    val player_capacity : Int,
    val spec_capacity : Int,
    val players : List<Int>,
    val applicants : List<Int>,
    val spectators : List<Int>,
    val min_skill_level : Int,
    val max_skill_level : Int,
    val latitude : Float,
    val longitude: Float,
    val owner : Int
    )

