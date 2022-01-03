package com.bounswe.findsportevents.network.modalz.responses

data class PlayedEventsResponse(
    val count : Int,
    val previous : String,
    val next :String,
    val results : List<PlayedEventResponse>
)
data class PlayedEventResponse(
    val id : Int,

)
