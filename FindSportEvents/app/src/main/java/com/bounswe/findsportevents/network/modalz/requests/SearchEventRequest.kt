package com.bounswe.findsportevents.network.modalz.requests

import retrofit2.http.Body
import java.time.LocalDateTime

data class SearchEventRequest
    (
    val sport : String,
    val min_skill : Int,
    val max_skill : Int,
    val min_age : Int,
    val max_age : Int,
    val min_duration : Int,
    val max_duration : Int,
    val min_date : String,
    val max_date : String,
    val min_latitude: Float,
    val max_latitude: Float,
    val min_longitude: Float,
    val max_longitude: Float,
            )