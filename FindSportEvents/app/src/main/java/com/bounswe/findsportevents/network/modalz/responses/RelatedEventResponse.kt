package com.bounswe.findsportevents.network.modalz.responses

data class RelatedEventResponse(
    val summary: String,
    val type: String,
    val totalItems: Int,
    val items: List<BadgeItemsResponse>
)

data class BadgeItemsResponse(
    val `object`: RelatedObjectResponse
)

data class RelatedObjectResponse(
    val type : String,
    val postId : Int,
    val title : String,
    val eventSport: String,
    val eventDate: String
)
