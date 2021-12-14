package com.bounswe.findsportevents.network.modalz.responses

data class AllEventsResponse(
    val count: Int,
    val next : Int,
    val previous : Int,
    val results : List<EventResponse>

    )



