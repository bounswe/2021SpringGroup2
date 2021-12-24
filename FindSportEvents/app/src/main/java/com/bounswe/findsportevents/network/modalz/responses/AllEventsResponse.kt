package com.bounswe.findsportevents.network.modalz.responses

data class AllEventsResponse(
    val count: Int,
    val next : String,
    val previous : String,
    val results : List<EventResponse>

    )



