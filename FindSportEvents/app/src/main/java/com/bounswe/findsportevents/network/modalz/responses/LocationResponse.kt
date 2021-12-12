package com.bounswe.findsportevents.network.modalz.responses

data class LocationResponse(
    val name : String,
    val type : String,
    val longitude : Float,
    val latitude : Float,
    val altitude : Float,
    val units : String,

    )