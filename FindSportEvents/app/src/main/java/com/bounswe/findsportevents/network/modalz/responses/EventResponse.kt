package com.bounswe.findsportevents.network.modalz.responses

data class EventResponse (
    val type : String,
    val actor : ActorResponse,
    val `object` : ObjectResponse,
    )

