package com.bounswe.findsportevents.network.modalz.responses

data class GiveBadgeResponse(
    val summary:String,
    val type : String,
    val actor: BadgeActorResponse,
    val `object`: ObjectResponse
)

data class BadgeActorResponse(
    val type: String,
    val name: String,
    val id: String
)

data class BadgeObjectResponse(
    val type : String,
    val name : String
)
