package com.bounswe.findsportevents.network.modalz.responses

data class AllEventsResponse(
    val summary : String,
    val type : String,
    val totalItems : Int,
    val totalPages : Int,
    val orderedItems : List<EventResponse>

    )



