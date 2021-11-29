package com.bounswe.findsportevents.network.modalz.responses



data class EventResponse (
    val summary: String,
    val type : String,
    val actor : ActorResponse,
    val Object : ObjectResponse,

    )

